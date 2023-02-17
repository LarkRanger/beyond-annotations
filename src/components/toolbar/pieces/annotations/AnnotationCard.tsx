import { Button, Card, Flex, Text } from '@mantine/core';
import { AnnotationEditMenu } from 'components/menus';
import { useStore } from 'hooks';
import { observer } from 'mobx-react-lite';
import { UserAnnotation } from 'stores';

interface AnnotationCardProps {
  annotation: UserAnnotation;
}

function AnnotationCardInner({ annotation }: AnnotationCardProps) {
  const { select } = useStore();

  function onClick() {
    select(annotation.id);
  }

  return (
    <Card
      style={{
        backgroundColor: annotation.color,
        color: 'black',
        cursor: 'pointer',
        outlineColor: 'white',
        outlineWidth: annotation.isSelected ? 2 : 0,
        outlineStyle: 'solid',
      }}
      onClick={onClick}>
      <Flex justify='space-between' align='center'>
        <Text truncate>{annotation.label}</Text>
        <AnnotationEditMenu annotation={annotation}>
          <Button p={7} title='Edit annotation'>
            ✏
          </Button>
        </AnnotationEditMenu>
      </Flex>
    </Card>
  );
}

export const AnnotationCard = observer(AnnotationCardInner);
