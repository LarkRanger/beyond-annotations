import { UserAnnotation } from 'stores';
import { Handle } from './Handle';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from 'hooks';
import { gsap } from 'gsap/gsap-core';
import { Draggable } from 'gsap/Draggable';
import './styles.css';

interface ResizeProps {
  annotation: UserAnnotation;
}

function ResizeInner({ annotation }: ResizeProps) {
  const { elementIds, areAnnotationsShown } = useStore();

  useEffect(() => {
    const gId = `#${elementIds.getGroupId(annotation.id)}`;
    const getDisplay = () =>
      document.getElementsByClassName(elementIds.transformWrapper)[0]!;
    const getDisplayBounds = () => getDisplay().getBoundingClientRect();
    const getBox = () =>
      document.getElementById(elementIds.getRectId(annotation.id))!;
    const getBoxBounds = () => getBox().getBoundingClientRect();
    const getWrapper = () => document.getElementById(elementIds.imageWrapper)!;
    const getWrapperBounds = () => getWrapper().getBoundingClientRect();
    const updateBox = () =>
      gsap.set(`${gId}`, {
        x: annotation.box.x,
        y: annotation.box.y,
      });

    const $right = document.createElement('div');
    const $top = document.createElement('div');
    const $bottom = document.createElement('div');
    const $left = document.createElement('div');

    const topDraggable = new Draggable($top, {
      trigger: `${gId} .top, ${gId} .topRight, ${gId} .topLeft`,
      onDrag(event) {
        const scale = annotation.scale;
        const { top, bottom, height } = getBoxBounds();
        const { top: wTop } = getWrapperBounds();
        const { top: dTop } = getDisplayBounds();
        const mouse = Math.max(event.clientY, dTop, wTop);

        if (mouse >= bottom) {
          const diff = (mouse - bottom) / scale;
          const relativeBottom = annotation.box.y + annotation.box.height;
          annotation.box = { y: relativeBottom, height: diff };
          topDraggable.endDrag(event);
          bottomDraggable.startDrag(event);
        } else {
          const diff = (top - mouse) / scale;
          const relativeTop = annotation.box.y;
          annotation.box = {
            height: height / scale + diff,
            y: relativeTop - diff,
          };
        }
      },
      onPress() {
        annotation.draggable.disable();
      },
      onRelease() {
        annotation.draggable.enable();
        updateBox();
        annotation.draggable.update();
      },
    });

    const bottomDraggable = new Draggable($bottom, {
      trigger: `${gId} .bottom, ${gId} .bottomRight, ${gId} .bottomLeft`,
      onDrag(event) {
        const scale = annotation.scale;
        const { top, bottom, height } = getBoxBounds();
        const { top: wTop, height: wHeight } = getWrapperBounds();
        const { top: dTop, height: dHeight } = getDisplayBounds();
        const mouse = Math.min(event.clientY, dTop + dHeight, wTop + wHeight);

        if (mouse <= top) {
          const diff = (top - mouse) / scale;
          const relativeTop = annotation.box.y;
          annotation.box = { y: relativeTop - diff, height: diff };
          bottomDraggable.endDrag(event);
          topDraggable.startDrag(event);
        } else {
          const diff = (mouse - bottom) / scale;
          annotation.box = { height: height / scale + diff };
        }
      },
      onPress() {
        annotation.draggable.disable();
      },
      onRelease() {
        annotation.draggable.enable();
        updateBox();
        annotation.draggable.update();
      },
    });

    const rightDraggable = new Draggable($right, {
      trigger: `${gId} .right, ${gId} .topRight, ${gId} .bottomRight`,
      onDrag(event: PointerEvent) {
        const scale = annotation.scale;
        const { left, right, width } = getBoxBounds();
        const { left: wLeft, width: wWidth } = getWrapperBounds();
        const { left: dLeft, width: dWidth } = getDisplayBounds();
        const mouse = Math.min(event.clientX, dWidth + dLeft, wWidth + wLeft);

        if (mouse <= left) {
          const diff = (left - mouse) / scale;
          const relativeLeft = annotation.box.x;
          annotation.box = { x: relativeLeft - diff, width: diff };
          rightDraggable.endDrag(event);
          leftDraggable.startDrag(event);
        } else {
          const diff = (mouse - right) / scale;
          annotation.box = { width: width / scale + diff };
        }
      },
      onPress() {
        annotation.draggable.disable();
      },
      onRelease() {
        annotation.draggable.enable();
        updateBox();
        annotation.draggable.update();
      },
    });

    const leftDraggable = new Draggable($left, {
      trigger: `${gId} .left, ${gId} .bottomLeft, ${gId} .topLeft`,
      onDrag(event: PointerEvent) {
        const scale = annotation.scale;
        const { left, right, width } = getBoxBounds();
        const { left: wLeft } = getWrapperBounds();
        const { left: dLeft } = getDisplayBounds();
        const mouse = Math.max(event.clientX, dLeft, wLeft);

        if (mouse >= right) {
          const diff = (mouse - right) / scale;
          const relativeRight = annotation.box.x + annotation.box.width;
          annotation.box = { x: relativeRight, width: diff };
          leftDraggable.endDrag(event);
          rightDraggable.startDrag(event);
        } else {
          const diff = (mouse - left) / scale;
          const relativeLeft = annotation.box.x;
          annotation.box = {
            width: width / scale - diff,
            x: relativeLeft + diff,
          };
        }
      },
      onPress() {
        annotation.draggable.disable();
      },
      onRelease() {
        annotation.draggable.enable();
        updateBox();
        annotation.draggable.update();
      },
    });

    reaction(
      () => annotation.creationEvent,
      creationEvent => {
        if (creationEvent) {
          annotation.select();
          topDraggable.startDrag(creationEvent);
          leftDraggable.startDrag(creationEvent);
          annotation.setCreationEvent();
        }
      },
    );

    return () => {
      rightDraggable.kill();
      topDraggable.kill();
      bottomDraggable.kill();
      leftDraggable.kill();
    };
  }, []);

  return (
    <g
      id={elementIds.getResizeId(annotation.id)}
      visibility={
        annotation.isSelected && annotation.isDraggable && areAnnotationsShown
          ? 'visible'
          : 'hidden'
      }>
      <Handle
        className='topLeft !important'
        x={0}
        y={0}
        annotation={annotation}
      />
      <Handle
        className='top !important'
        x={annotation.box.width / 2}
        y={0}
        annotation={annotation}
      />
      <Handle
        className='topRight !important'
        x={annotation.box.width}
        y={0}
        annotation={annotation}
      />
      <Handle
        className='left !important'
        x={0}
        y={annotation.box.height / 2}
        annotation={annotation}
      />
      <Handle
        className='right !important'
        x={annotation.box.width}
        y={annotation.box.height / 2}
        annotation={annotation}
      />
      <Handle
        className='bottomLeft !important'
        x={0}
        y={annotation.box.height}
        annotation={annotation}
      />
      <Handle
        className='bottom !important'
        x={annotation.box.width / 2}
        y={annotation.box.height}
        annotation={annotation}
      />
      <Handle
        className='bottomRight !important'
        x={annotation.box.width}
        y={annotation.box.height}
        annotation={annotation}
      />
    </g>
  );
}

export const Resize = observer(ResizeInner);
