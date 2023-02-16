import { Card, Flex } from '@mantine/core';
import { useStore } from 'hooks';
import { observer } from 'mobx-react-lite';

function AnnotationListInner() {
  const store = useStore();

  return (
    <Flex direction='column' p={10} gap={3}>
      {store.visibleUserAnnotations.length === 0 &&
        'No annotations yet - why not add some?'}
      {store.visibleUserAnnotations.map(a => (
        <Card key={a.id} style={{ backgroundColor: a.color, color: 'black' }}>
          {a.label}
        </Card>
      ))}
    </Flex>
  );
}

export const AnnotationList = observer(AnnotationListInner);
