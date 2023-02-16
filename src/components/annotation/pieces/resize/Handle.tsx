import { UserAnnotation } from 'stores';
import { observer } from 'mobx-react-lite';

interface HandleProps {
  annotation: UserAnnotation;
  className?: string;
  x: number;
  y: number;
  size?: number;
}

function HandleInner({ annotation, className, x, y, size = 5 }: HandleProps) {
  return (
    <rect
      className={className}
      x={x}
      y={y}
      width={size / annotation.scale}
      height={size / annotation.scale}
      transform={`translate(${-size / 2 / annotation.scale}, ${
        -size / 2 / annotation.scale
      })`}
      fill='white'
      stroke={annotation.color}
      strokeWidth={1 / annotation.scale}
    />
  );
}

export const Handle = observer(HandleInner);
