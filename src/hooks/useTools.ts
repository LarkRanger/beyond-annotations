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
    toggleShowPredictions,
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
