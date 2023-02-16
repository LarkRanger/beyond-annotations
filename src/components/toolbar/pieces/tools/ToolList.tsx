import { Button, FileInput, Flex, Input } from '@mantine/core';
import { Tools } from 'consts';
import { useStore } from 'hooks';
import { observer } from 'mobx-react-lite';

function ToolListInner() {
  const store = useStore();
  const disabled =
    store.imageDimensions.height === 0 || store.imageDimensions.height === 0;

  function onUpload(payload: File | null) {
    if (!payload) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') store.imageSrc = reader.result;
    };
    reader.readAsDataURL(payload);
  }

  return (
    <Flex direction='column' gap={3} p={10}>
      <FileInput
        label='Upload image'
        accept='image/png,image/jpeg'
        onChange={onUpload}
      />
      <Button onClick={() => (store.tool = Tools.PAN)} disabled={disabled}>
        🔎 Pan
      </Button>
      <Button onClick={() => (store.tool = Tools.DRAG)} disabled={disabled}>
        ✋ Drag
      </Button>
      <Button onClick={() => (store.tool = Tools.ANNOTATE)} disabled={disabled}>
        ✏ Annotate
      </Button>
    </Flex>
  );
}

export const ToolList = observer(ToolListInner);
