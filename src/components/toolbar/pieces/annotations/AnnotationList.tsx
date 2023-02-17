import { Card, Flex } from '@mantine/core';
import { useStore } from 'hooks';
import { observer } from 'mobx-react-lite';
import { AnnotationCard } from './AnnotationCard';

function AnnotationListInner() {
  const { listedUserAnnotations } = useStore();

  return (
    <Flex direction='column' p={10} gap={3}>
      {listedUserAnnotations.length === 0 &&
        'No annotations yet - why not add some?'}
      {listedUserAnnotations.map(a => (
        <AnnotationCard key={a.id} annotation={a} />
      ))}
    </Flex>
  );
}

export const AnnotationList = observer(AnnotationListInner);
