import {
  Button,
  ColorInput,
  Flex,
  Menu,
  Radio,
  TextInput,
} from '@mantine/core';
import { DEFAULT_LABEL_COLOR } from 'consts';
import { useStore } from 'hooks';
import { observer } from 'mobx-react-lite';
import { FormEvent, PropsWithChildren, useState } from 'react';
import { Label } from 'stores';

interface LabelMenuProps extends PropsWithChildren {
  label?: Label;
}

function LabelMenuInner({ label, children }: LabelMenuProps) {
  const { addLabel, removeLabel } = useStore();
  const [open, setOpen] = useState<boolean>(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    //@ts-ignore
    const [name, color] = [event.target.name.value, event.target.color.value];
    if (label) {
      label.name = name;
      label.color = color;
    } else addLabel(name, color);
    setOpen(false);
  }

  function onDelete() {
    if (label) removeLabel(label?.id);
  }

  return (
    <Menu
      shadow='md'
      width={200}
      opened={open}
      onChange={setOpen}
      withinPortal={!!label}
      closeOnItemClick={false}
      closeOnClickOutside={false}
      position='right'>
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{label ? 'Edit' : 'Add'} label</Menu.Label>
        <form onSubmit={onSubmit}>
          <Flex direction='column' gap={3}>
            <TextInput
              name='name'
              label='Name'
              defaultValue={label?.name}
              withAsterisk
              required
            />
            <ColorInput
              name='color'
              label='Color'
              defaultValue={label?.color ?? DEFAULT_LABEL_COLOR}
              withAsterisk
              required
            />
            <Button type='submit'>Save</Button>
          </Flex>
        </form>
        {label && (
          <>
            <Menu.Divider />
            <Button color='red' onClick={onDelete} fullWidth>
              Delete
            </Button>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

export const LabelMenu = observer(LabelMenuInner);
