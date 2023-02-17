import { Button, Card, Flex, Text } from '@mantine/core';
import { useStore } from 'hooks';
import { observer } from 'mobx-react-lite';
import { LabelCard } from './LabelCard';
import { LabelEditMenu } from 'components';

function LabelListInner() {
  const { labels } = useStore();

  return (
    <Flex direction='column' p={10} gap={3}>
      <LabelEditMenu>
        <Button>Add label</Button>
      </LabelEditMenu>
      {labels.length === 0 && 'No labels yet - why not add some?'}
      {labels.map(l => (
        <LabelCard key={l.id} label={l} />
      ))}
    </Flex>
  );
}

export const LabelList = observer(LabelListInner);
