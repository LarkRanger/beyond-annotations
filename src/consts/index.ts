export const Tools = {
  PAN: 'pan',
  DRAG: 'drag',
  ANNOTATE: 'annotate',
} as const;

export type Tool = typeof Tools[keyof typeof Tools];

export const DEFAULT_LABEL = 'Unlabeled';
export const DEFAULT_LABEL_COLOR = '#afafaf';
