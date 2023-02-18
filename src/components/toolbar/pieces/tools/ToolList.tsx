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
      <Button
        color={store.tool === Tools.PAN ? 'teal' : 'blue'}
        onClick={() => (store.tool = Tools.PAN)}
        disabled={disabled}>
        🔎 Pan
      </Button>
      <Button
        color={store.tool === Tools.DRAG ? 'teal' : 'blue'}
        onClick={() => (store.tool = Tools.DRAG)}
        disabled={disabled}>
        ✋ Drag
      </Button>
      <Button
        color={store.tool === Tools.ANNOTATE ? 'teal' : 'blue'}
        onClick={() => (store.tool = Tools.ANNOTATE)}
        disabled={disabled}>
        ✏ Annotate
      </Button>
      <Button
        color={!store.areLabelsShown ? 'teal' : 'blue'}
        onClick={store.toggleShowLabels}
        disabled={disabled}>
        👁 {store.areLabelsShown ? 'Hide' : 'Show'} labels
      </Button>
      <Button
        color={!store.areAnnotationsShown ? 'teal' : 'blue'}
        onClick={store.toggleShowAnnotations}
        disabled={disabled}>
        👁 {store.areAnnotationsShown ? 'Hide' : 'Show'} annotations
      </Button>
    </Flex>
  );
}

export const ToolList = observer(ToolListInner);
