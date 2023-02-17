import { useEffect, useMemo, useState } from 'react';
import { UserAnnotation } from 'stores';
import { Dimensions } from 'types';
import { useStore } from './useStore';

const defaultDimensions: Dimensions = { width: 0, height: 0 };

/**
 * Calculates the dimensions of the annotation's label text element.
 * Default values are 0.
 * @param annotation the annotation to track the label of
 */
export function useLabelDimensions(annotation: UserAnnotation): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>(defaultDimensions);
  const { elementIds } = useStore();

  useEffect(() => {
    setTimeout(() => {
      if (!annotation.isVisible) return { width: 0, height: 0 };
      const text = document.getElementById(elementIds.getTextId(annotation.id));
      if (!text) return { width: 0, height: 0 };
      const { width, height } = text.getBoundingClientRect();
      setDimensions({ width, height });
    });
  }, [
    annotation,
    annotation.isVisible,
    annotation.id,
    annotation.label,
    annotation.scale,
  ]);

  return dimensions;
}
