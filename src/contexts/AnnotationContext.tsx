import { PropsWithChildren, createContext } from 'react';

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
gsap.registerPlugin(Draggable);

const AnnotationContext = createContext({});

export function AnnotationProvider({ children }: PropsWithChildren) {
  return (
    <AnnotationContext.Provider value={{}}>
      {children}
    </AnnotationContext.Provider>
  );
}
