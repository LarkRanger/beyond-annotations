import { useLabelDimensions, useStore } from 'hooks';
import { observer } from 'mobx-react-lite';
import { UserAnnotation } from 'stores';

interface LabelProps {
  annotation: UserAnnotation;
}

function LabelInner({ annotation }: LabelProps) {
  const { elementIds } = useStore();
  const dimensions = useLabelDimensions(annotation);

  return (
    <g id={elementIds.getLabelId(annotation.id)}>
      <path
        d={`
          M 0,0
          h ${dimensions.width + 4}
          q 4,0 4,4
          v ${dimensions.height - 8}
          q 0,4 -4,4
          h -${dimensions.width + 4}
          `}
        fill='black'
        fillOpacity={0.7}
        transform={`scale(${1 / annotation.scale})`}
      />
      <text
        id={elementIds.getTextId(annotation.id)}
        x={4}
        y={12 / annotation.scale}
        style={{ transformOrigin: 'top left' }}
        fontSize={12 / annotation.scale}
        fill='white'
        fontWeight={500}>
        {annotation.label}
      </text>
    </g>
  );
}

export const Label = observer(LabelInner);
