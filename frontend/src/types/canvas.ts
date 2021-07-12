import type { Path } from './noun';

enum Template {
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
  Life,
}

export type Metadata = {
  name: string;
  location: Path;
  saved: boolean;
  private: boolean;
  template: Template;
  width: number;
  height: number;
};

export type Strokes = {
  [id: number]: {
    fill: boolean;
    color: string;
  };
};

export type Canvas = {
  [location: string]: {
    metadata: Metadata;
    data: Strokes;
  };
};
