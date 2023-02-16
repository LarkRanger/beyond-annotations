import { UserAnnotation } from 'stores';
import { observer } from 'mobx-react-lite';
import { Box, Label, Resize } from './pieces';
import { useStore } from 'hooks';

interface AnnotationProps {
  annotation: UserAnnotation;
}

function AnnotationInner({ annotation }: AnnotationProps) {
  const { elementIds } = useStore();

  return (
    <g
      id={elementIds.getGroupId(annotation.id)}
      transform={`translate(${annotation.box.x}, ${annotation.box.y})`}
      visibility={annotation.isCreating ? 'hidden' : 'visible'}>
      <Box annotation={annotation} />
      <Label annotation={annotation} />
      <Resize annotation={annotation} />
    </g>
  );
}

export const Annotation = observer(AnnotationInner);
