import { Button, Card, Flex, Text } from '@mantine/core';
import { LabelEditMenu } from 'components';
import { observer } from 'mobx-react-lite';
import { Label } from 'stores';

interface LabelCardProps {
  label: Label;
}

function LabelCardInner({ label }: LabelCardProps) {
  return (
    <Card style={{ backgroundColor: label.color, color: 'black' }}>
      <Flex justify='space-between' align='center'>
        <Text truncate>{label.name}</Text>
        <LabelEditMenu label={label}>
          <Button p={7} title='Edit label'>
            ✏
          </Button>
        </LabelEditMenu>
      </Flex>
    </Card>
  );
}

export const LabelCard = observer(LabelCardInner);
