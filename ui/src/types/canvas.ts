import type { Path } from './noun';

export enum Template {
  Empty,
  Welcome,
  Martian,
  Bitcoin,
  Hashtag,
  Sigil,
  TMDW,
  Tile,
  YCHN,
  Crypto,
  Guy,
  Public,
  Life
}

export interface Metadata {
  name: string;
  location: Path;
  saved: boolean;
  private: boolean;
  template: string;
  width: number;
  height: number;
}

export interface Strokes {
  [id: number]: {
    fill: boolean;
    color: string;
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
}
