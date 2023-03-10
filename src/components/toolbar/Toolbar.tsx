import { Accordion } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { AnnotationList, LabelList, ToolList } from './pieces';

function ToolbarInner() {
  return (
    <Accordion
      multiple
      style={{ width: '100%', height: '100%' }}
      defaultValue={['tools', 'annotations']}>
      <Accordion.Item value='tools'>
        <Accordion.Control>Editor Tools</Accordion.Control>
        <Accordion.Panel>
          <ToolList />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value='annotations'>
        <Accordion.Control>Annotations</Accordion.Control>
        <Accordion.Panel>
          <AnnotationList />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value='labels'>
        <Accordion.Control>Labels</Accordion.Control>
        <Accordion.Panel>
          <LabelList />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export const Toolbar = observer(ToolbarInner);
