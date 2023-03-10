import { Button, Menu } from '@mantine/core';
import { useStore } from 'hooks';
import { observer } from 'mobx-react-lite';
import { PropsWithChildren, useState } from 'react';
import { Label, UserAnnotation } from 'stores';
import { LabelEditMenu } from './LabelEditMenu';

interface AnnotationEditMenuProps extends PropsWithChildren {
  annotation: UserAnnotation;
}

function AnnotationEditMenuInner({
  annotation,
  children,
}: AnnotationEditMenuProps) {
  const { labels } = useStore();
  const [open, setOpen] = useState<boolean>(false);

  function handleRelabel(label: Label) {
    return function onRelabel() {
      annotation.label = label.id;
      setOpen(false);
    };
  }

  return (
    <Menu
      shadow='md'
      width={200}
      opened={open}
      onChange={setOpen}
      closeOnItemClick={false}
      closeOnClickOutside={false}
      position='right'
      withinPortal>
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Pick label</Menu.Label>
        {!labels.length && (
          <LabelEditMenu>
            <Menu.Item>Add label</Menu.Item>
          </LabelEditMenu>
        )}
        {labels.map(l => (
          <Menu.Item
            key={l.id}
            onClick={handleRelabel(l)}
            icon={
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: l.color,
                  borderRadius: '50%',
                }}></div>
            }>
            {l.name}
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Button color='red' onClick={annotation.remove} fullWidth>
          Delete
        </Button>
      </Menu.Dropdown>
    </Menu>
  );
}

export const AnnotationEditMenu = observer(AnnotationEditMenuInner);
