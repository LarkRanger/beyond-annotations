import { useMemo } from 'react';
import { UserAnnotation } from 'stores';
import { Dimensions } from 'types';
import { useStore } from './useStore';

/**
 * Calculates the dimensions of the annotation's label text element.
 * Default values are 0.
 * @param annotation the annotation to track the label of
 */
export function useLabelDimensions(annotation: UserAnnotation): Dimensions {
  const { elementIds } = useStore();
  const text = document.getElementById(elementIds.getTextId(annotation.id));
  return useMemo(() => {
    if (!annotation.isVisible) return { width: 0, height: 0 };
    if (!text) return { width: 0, height: 0 };
    const { width, height } = text.getBoundingClientRect();
    return { width, height };
  }, [
    annotation,
    annotation.isVisible,
    annotation.id,
    annotation.label,
    annotation.scale,
    !!text,
  ]);
}
