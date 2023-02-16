import { PropsWithChildren, createContext, useMemo } from 'react';
import { AnnotationStore } from 'stores';

// register dragging plugin into gsap
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
gsap.registerPlugin(Draggable);

export const AnnotationContext = createContext<AnnotationStore>(
  new AnnotationStore(),
);

export function AnnotationProvider({ children }: PropsWithChildren) {
  const store = useMemo(() => new AnnotationStore(), []);

  return (
    <AnnotationContext.Provider value={store}>
      {children}
    </AnnotationContext.Provider>
  );
}
