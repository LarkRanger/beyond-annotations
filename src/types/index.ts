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
  transformWrapper: string;
  getGroupId(id: string): string;
  getRectId(id: string): string;
  getBoxId(id: string): string;
  getResizeId(id: string): string;
  getLabelId(id: string): string;
  getTextId(id: string): string;
}

export interface Dimensions {
  width: number;
  height: number;
}
