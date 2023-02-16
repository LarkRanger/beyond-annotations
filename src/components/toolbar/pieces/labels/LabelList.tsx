import { Card, Flex } from '@mantine/core';
import { useStore } from 'hooks';
import { observer } from 'mobx-react-lite';

function LabelListInner() {
  const store = useStore();

  return (
    <Flex direction='column' p={10} gap={3}>
      {store.labels.map(l => (
        <Card key={l.id} style={{ backgroundColor: l.color, color: 'black' }}>
          {l.name}
        </Card>
      ))}
    </Flex>
  );
}

export const LabelList = observer(LabelListInner);
