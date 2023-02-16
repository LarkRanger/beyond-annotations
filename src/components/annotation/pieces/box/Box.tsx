import { useStore } from 'hooks';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { UserAnnotation } from 'stores';
import './styles.css';
import { ContextMenu } from 'components/contextMenu';

interface BoxProps {
  annotation: UserAnnotation;
}

function BoxInner({ annotation }: BoxProps) {
  const { elementIds } = useStore();

  useEffect(() => {
    const getWrapper = () => document.getElementById(elementIds.imageWrapper)!;
    const getWrapperBounds = () => getWrapper().getBoundingClientRect();
    const getBox = () =>
      document.getElementById(elementIds.getRectId(annotation.id))!;
    const getBoxBounds = () => getBox().getBoundingClientRect();

    const draggable = new Draggable(
      `#${elementIds.getGroupId(annotation.id)}`,
      {
        trigger: `#${elementIds.getRectId(annotation.id)}`,
        cursor: 'move',
        bounds: {
          top: -2,
          left: -2,
          width: (getWrapperBounds().width + 4) / annotation.scale,
          height: (getWrapperBounds().height + 4) / annotation.scale,
        },
        type: 'x,y',
        allowContextMenu: true,
        onDrag() {
          const scale = annotation.scale;
          const position = getBoxBounds();
          const wrapperBounds = getWrapperBounds();

          // In order to lock the box in the display instead of the image:
          // const {x, y} = max([display, position])
          // const diff = {x, y} - wrapperBounds / scale
          // measure for all sides
          const left = (position.x - wrapperBounds.x) / scale;
          const top = (position.y - wrapperBounds.y) / scale;

          annotation.box = { x: left, y: top };
        },
        onPress() {
          annotation.select();
          annotation.closeContext();
        },
      },
    );

    !annotation.isDraggable && draggable.disable();
    reaction(
      () => annotation.isDraggable,
      isDraggable => (isDraggable ? draggable.enable() : draggable.disable()),
    );

    annotation.registerDraggable(draggable);

    return () => {
      draggable.kill();
    };
  }, []);

  return (
    <g id={elementIds.getBoxId(annotation.id)}>
      <ContextMenu annotation={annotation}>
        <rect
          id={elementIds.getRectId(annotation.id)}
          stroke={annotation.color}
          width={annotation.box.width}
          height={annotation.box.height}
          strokeWidth={1 / annotation.scale}
          fill={annotation.color}
          fillOpacity={annotation.isSelected ? 0.5 : 0.3}
        />
      </ContextMenu>
    </g>
  );
}

export const Box = observer(BoxInner);
