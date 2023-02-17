import { Button, Card, Flex, Text } from '@mantine/core';
import { useStore } from 'hooks';
import { observer } from 'mobx-react-lite';
import { LabelCard } from './LabelCard';
import { LabelMenu } from 'components';

function LabelListInner() {
  const store = useStore();

  return (
    <Flex direction='column' p={10} gap={3}>
      <LabelMenu>
        <Button>Add label</Button>
      </LabelMenu>
      {store.labels.length === 0 && 'No labels yet! Why not create some?'}
      {store.labels.map(l => (
        <LabelCard key={l.id} label={l} />
      ))}
    </Flex>
  );
}

export const LabelList = observer(LabelListInner);
