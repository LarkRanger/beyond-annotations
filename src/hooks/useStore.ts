import { AnnotationContext } from 'contexts';
import { useContext } from 'react';

export function useStore() {
  return useContext(AnnotationContext);
}
