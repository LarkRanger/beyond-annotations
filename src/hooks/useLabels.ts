import { useStore } from './useStore';

export function useLabels() {
  const { labels, getLabel } = useStore();
  return { labels, getLabel };
}
