export interface Bounds {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface BoundingBox extends Bounds {
  value: string;
}

export interface ElementIds {
  imageWrapper: string;
}
