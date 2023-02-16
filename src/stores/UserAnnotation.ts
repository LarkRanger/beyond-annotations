import { DEFAULT_LABEL, LabelColors } from 'consts';
import { makeAutoObservable, reaction } from 'mobx';
import { nanoid } from 'nanoid';
import { BoundingBox, Bounds } from 'types';
import {AnnotationStore} from './AnnotationStore';

export class UserAnnotation {
  private annotationStore: AnnotationStore;

  readonly id: string;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private _labelId?: string;
  private _isSelected: boolean;
  private _isVisible: boolean;
  private _isContextMenuOpen: boolean;
  private _isCreating: boolean;
  private _creationEvent?: MouseEvent;
  private draggableInstance?: Draggable;

  constructor(
    annotationTool: AnnotationStore,
    box: Bounds,
    isCreating: boolean = false,
  ) {
    makeAutoObservable(this, undefined, { autoBind: true });

    this.annotationStore = annotationTool;

    this.id = nanoid(6);
    this.x = box.x;
    this.y = box.y;
    this.width = box.width;
    this.height = box.height;

    this._isSelected = false;
    this._isVisible = true;
    this._isContextMenuOpen = false;
    this._isCreating = isCreating;

    // When another annotation is selected, deselect this and close the context menu
    reaction(
      () => this.annotationStore.selectedId,
      selectedId => {
        this._isSelected = this.id === selectedId;
        this.closeContext();
      },
    );

    // When selected, enable deleting by hitting Delete
    reaction(
      () => this._isSelected,
      selected => {
        if (selected) document.addEventListener('keyup', this.handleDelete);
        else document.removeEventListener('keyup', this.handleDelete);
      },
    );
  }

  get label() {
    if (!this._labelId) return DEFAULT_LABEL;
    const label = this.annotationStore.getLabel(this._labelId);
    return label?.name ?? DEFAULT_LABEL;
  }

  set label(id: string) {
    this._labelId = id;
  }

  get box(): Bounds {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  set box(bounds: Partial<Bounds>) {
    this.x = bounds.x ?? this.x;
    this.y = bounds.y ?? this.y;
    this.width = bounds.width ?? this.width;
    this.height = bounds.height ?? this.height;
  }

  get color(): string {
    if (!this._labelId) return LabelColors.DEFAULT;
    const label = this.annotationStore.getLabel(this._labelId);
    return label?.color ?? LabelColors.DEFAULT;
  }

  get scale(): number {
    return this.annotationStore.scale;
  }

  get isSelected(): boolean {
    return this._isSelected;
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  get isDraggable(): boolean {
    return !this.annotationStore.isDragDisabled;
  }

  get isLabelShown(): boolean {
    return this.annotationStore.areLabelsShown;
  }

  get isContextOpen(): boolean {
    return this._isContextMenuOpen;
  }

  get isCreating(): boolean {
    return this._isCreating;
  }

  get creationEvent(): MouseEvent | undefined {
    return this._creationEvent;
  }

  get draggable(): Draggable {
    return this.draggableInstance as Draggable;
  }

  openContext() {
    this._isContextMenuOpen = true;
  }

  closeContext() {
    this._isContextMenuOpen = false;
  }

  /**
   * Set selected annotation in the store to this, translating into UI components.
   * Then, if the annotation box is visible (i.e. exists in the DOM), move it to the end of its list.
   */
  select() {
    this.annotationStore.select(this.id);
    const annotation = document.getElementById(
      `annotation-g-${this.id}`,
    ) as HTMLElement;
    if (!annotation) return;
    const wrapper = document.getElementById(
      'annotation-image-wrapper',
    ) as HTMLElement;
    wrapper.insertBefore(
      annotation,
      wrapper.lastChild && wrapper.lastChild.nextSibling,
    );
  }

  deselect() {
    this.annotationStore.deselect();
  }

  toggleVisible() {
    this._isVisible = !this._isVisible;
  }

  remove() {
    this.annotationStore.remove(this.id);
  }

  registerDraggable(instance: Draggable) {
    this.draggableInstance = instance;
  }

  setCreationEvent(event?: MouseEvent) {
    this._creationEvent = event;
    if (event) this._isCreating = false;
  }

  toJSON(): BoundingBox {
    return {
      ...this.box,
      value: this.label,
    };
  }

  private handleDelete(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.remove();
      document.removeEventListener('keyup', this.handleDelete);
    }
  }
}
