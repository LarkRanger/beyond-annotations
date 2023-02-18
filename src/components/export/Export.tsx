import { Button, Code, Modal } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useStore } from 'hooks';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

function ExportInner() {
  const { toJSON, listedUserAnnotations } = useStore();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title='Annotation List'>
        {listedUserAnnotations.length ? (
          <Prism language='json'>{JSON.stringify(toJSON(), null, 2)}</Prism>
        ) : (
          'No annotations yet - why not add some?'
        )}
      </Modal>

      <Button onClick={() => setOpen(true)}>Export annotations</Button>
    </>
  );
}

export const Export = observer(ExportInner);
