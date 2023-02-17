import { useStore } from './useStore';

export function useTools() {
  const {
    isDragDisabled,
    isPanDisabled,
    enableDrag,
    enablePan,
    imageSrc,
    disableDrag,
    disablePan,
    tool,
    toggleShowLabels,
    toggleShowAnnotations: toggleShowPredictions,
  } = useStore();

  return {
    isDragDisabled,
    isPanDisabled,
    enableDrag,
    enablePan,
    imageSrc,
    disableDrag,
    disablePan,
    tool,
    toggleShowLabels,
    toggleShowPredictions,
  };
}
