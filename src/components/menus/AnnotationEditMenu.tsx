import {
  Button,
  ColorInput,
  Flex,
  Menu,
  Select,
  TextInput,
} from '@mantine/core';
import { DEFAULT_LABEL_COLOR } from 'consts';
import { useStore } from 'hooks';
import { observer } from 'mobx-react-lite';
import { FormEvent, PropsWithChildren, useState } from 'react';
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
            style={{ backgroundColor: l.color, color: 'black' }}>
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
