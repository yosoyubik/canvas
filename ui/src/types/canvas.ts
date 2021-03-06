import type { Patp } from './noun';

export interface Metadata {
  name: string;
  location: Patp;
  file?: string;
  private: boolean;
  template: string;
  width: number;
  height: number;
  columns: number;
  mesh?: string;
}

export interface Strokes {
  [id: number]: {
    // fill: boolean;
    color: string;
    who?:  Patp;
    when?: number;
  };
}

export interface Canvas {
  [location: string]: {
    metadata: Metadata;
    data: Strokes;
  };
}

export interface CanvasData {
  metadata: Metadata;
  data: Strokes;
}

export type LoadCanvas = Metadata & {
  data: Strokes;
};

export interface CanvasForm {
  name: string;
  private: boolean;
  template: string;
  width: number;
  height: number;
  radius: number;
  mesh?: string;
}
