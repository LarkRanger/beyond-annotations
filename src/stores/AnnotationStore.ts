import { makeAutoObservable, reaction, runInAction } from 'mobx';

import { UserAnnotation } from './UserAnnotation';
import { Label } from './Label';
import { Tools, Tool, DEFAULT_LABEL } from 'consts';
import { Bounds, Dimensions, ElementIds } from 'types';
import { nanoid } from 'nanoid';

export class AnnotationStore {
  private _userAnnotations: UserAnnotation[];
  private _labels: Label[];
  private _imageSrc?: string;
  private _imageDimensions: Dimensions;
  private _selectedId?: string;
  private _scale: number;
  private _initialScale: number;
  private _isPanEnabled: boolean;
  private _isDragEnabled: boolean;
  private _tool: Tool;
  private _areAnnotationsShown: boolean;
  private _areLabelsShown: boolean;
  private _handleMouseDown?: (e: MouseEvent) => void;
  readonly elementIds: ElementIds;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });

    this._userAnnotations = [];
    this._labels = [new Label('Default Label')];
    this._scale = 1;
    this._initialScale = 1;
    this._isPanEnabled = true;
    this._isDragEnabled = false;
    this._tool = Tools.PAN;
    this._areAnnotationsShown = true;
    this._areLabelsShown = true;
    this._imageDimensions = { width: 0, height: 0 };

    this.elementIds = {
      imageWrapper: nanoid(),
      transformWrapper: nanoid(),
      transformComponent: nanoid(),
      displayWrapper: nanoid(),
      getGroupId: id => `annotation-g-${id}`,
      getRectId: id => `box-rect-${id}`,
      getBoxId: id => `box-g-${id}`,
      getResizeId: id => `resize-g-${id}`,
      getLabelId: id => `label-g-${id}`,
      getTextId: id => `label-text-${id}`,
    };

    // Change tool when tool changes
    reaction(
      () => this.tool,
      tool => {
        this.disableToolbarOptions();
        switch (tool) {
          case Tools.PAN: // only pan blocks control of annotations
            return this.enablePan();
          case Tools.DRAG:
            this.enablePan();
            return this.enableDrag();
          case Tools.ANNOTATE:
            return this.add();
        }
      },
    );

    reaction(
      () => this.imageSrc,
      () => this.loadImage(),
    );
  }

  get userAnnotations() {
    return this._userAnnotations;
  }

  get visibleUserAnnotations() {
    return this.userAnnotations.filter(a => a.isVisible);
  }

  get listedUserAnnotations() {
    return this.userAnnotations.filter(a => !a.isCreating);
  }

  get labels(): Label[] {
    return this._labels;
  }

  get imageSrc() {
    return this._imageSrc ?? '';
  }

  set imageSrc(src: string) {
    this._imageSrc = src;
  }

  get imageDimensions() {
    return this._imageDimensions ?? { width: 0, height: 0 };
  }

  set imageDimensions(dimensions) {
    this._imageDimensions = dimensions;
  }

  get scale(): number {
    return this._scale;
  }

  set scale(scale: number) {
    this._scale = scale;
  }

  get initialScale(): number {
    return this._initialScale;
  }

  get isPanDisabled(): boolean {
    return !this._isPanEnabled;
  }

  get isDragDisabled(): boolean {
    return !this._isDragEnabled;
  }

  get areAnnotationsShown(): boolean {
    return this._areAnnotationsShown;
  }

  get areLabelsShown(): boolean {
    return this._areLabelsShown;
  }

  get hasMissingLabels(): boolean {
    return this.userAnnotations.some(a => a.label === DEFAULT_LABEL);
  }

  get tool() {
    return this._tool;
  }

  set tool(tool: Tool) {
    if (tool !== this._tool) this._tool = tool;
  }

  get selectedId(): string | undefined {
    return this._selectedId;
  }

  enablePan() {
    this._isPanEnabled = true;
  }

  disablePan() {
    this._isPanEnabled = false;
  }

  enableDrag() {
    this._isDragEnabled = true;
  }

  disableDrag() {
    this._isDragEnabled = false;
  }

  select(id: string) {
    this._selectedId = id;
  }

  deselect() {
    this._selectedId = undefined;
  }

  toggleShowAnnotations() {
    this._areAnnotationsShown = !this._areAnnotationsShown;
  }

  toggleShowLabels() {
    this._areLabelsShown = !this._areLabelsShown;
  }

  loadImage() {
    const image = new Image();
    image.src = this.imageSrc;
    image.onload = () =>
      (this.imageDimensions = { width: image.width, height: image.height });
  }

  setInitialScale() {
    const wrapper = document.getElementById(this.elementIds.imageWrapper);
    if (!wrapper) return 1;
    const bounds = wrapper.getBoundingClientRect();
    const diff = Math.max(
      this.imageDimensions.width / bounds.width,
      this.imageDimensions.height / bounds.height,
    )!;

    const scale = diff > 1 ? 1 / diff : 1;
    this.scale = scale;
    this._initialScale = scale;
  }

  /**
   * Functions creates a new empty box and converts it into an annotation.
   * Event listeners are employed to position the new annotation when the mouse is clicked withing the display area.
   * The function cascades as follow:
   * 1. Disable panning and hide labels.
   * 2. Set up mousedown listener.
   * 3. On mousedown, create new annotation based on click event and add it to annotation array, then select it.
   * 4. Remove mousedown listener.
   * 5. Add mouseup listener.
   * 6. On mouseup, return labels.
   * 7. Remove mouseup listener.
   */
  add() {
    const wrapper = document.getElementById(this.elementIds.imageWrapper)!;
    const { left, top } = wrapper.getBoundingClientRect();
    const box: Bounds = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    const newAnnotation = new UserAnnotation(this, box, true);
    this._userAnnotations.push(newAnnotation);

    /**
     * Used as a mousedown handler to create a new annotation at the click location.
     * @param creationEvent Mouse event from which the new annotation coordinates are taken.
     */
    const addNewAnnotation = (creationEvent: MouseEvent) => {
      runInAction(() => {
        newAnnotation.box = {
          x: (creationEvent.clientX - left) / this.scale,
          y: (creationEvent.clientY - top) / this.scale,
        };
        newAnnotation.setCreationEvent(creationEvent);
        this.toggleShowLabels();
        this.enableDrag();
      });

      if (this._handleMouseDown)
        wrapper.removeEventListener('mousedown', this._handleMouseDown);
      this._handleMouseDown = undefined;

      /**
       * Used as mouseup listener, once initial annotation drawing is done.
       */
      const finishAnnotating = () => {
        this.toggleShowLabels();
        this.tool = Tools.DRAG;
        wrapper.removeEventListener('mouseup', finishAnnotating);
      };

      wrapper.addEventListener('mouseup', finishAnnotating);
    };

    this.disablePan();
    this._handleMouseDown = addNewAnnotation;
    wrapper.addEventListener('mousedown', this._handleMouseDown);
  }

  remove(id: string) {
    this._userAnnotations = this._userAnnotations.filter(a => a.id !== id);
  }

  getLabel(id: string) {
    return this._labels.find(l => l.id === id);
  }

  addLabel(name: string, color: string) {
    const label = new Label(name, color);
    this._labels.push(label);
  }

  removeLabel(id: string) {
    const label = this._labels.find(l => l.id === id);
    if (!label) return;
    this._userAnnotations.forEach(a => (a.label = undefined));
    this._labels = this.labels.filter(l => l.id !== id);
  }

  private disableToolbarOptions() {
    this.disablePan();
    this.disableDrag();
    if (this._handleMouseDown) {
      document
        .getElementById(this.elementIds.imageWrapper)
        ?.removeEventListener('mousedown', this._handleMouseDown);
      this._handleMouseDown = undefined;
      this.userAnnotations[this.userAnnotations.length - 1]?.remove();
    }
  }

  reset() {
    this._userAnnotations = [];
    this.scale = 1;
    this.tool = Tools.PAN;
    this._areAnnotationsShown = true;
  }
}
