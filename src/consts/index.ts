export const LabelColors = {
  DEFAULT: '#afafaf',
  BLUE: '#39B5E0',
  PURPLE: '#A31ACB',
  PINK: '#FF78F0',
  YELLOW: '#F5EA5A',
} as const;

export const Tools = {
  PAN: 'pan',
  DRAG: 'drag',
  ANNOTATE: 'annotate',
} as const;

export type Tool = typeof Tools[keyof typeof Tools];

export const DEFAULT_LABEL = 'Name me...';
