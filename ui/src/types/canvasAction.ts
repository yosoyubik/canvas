import type { Patp } from './noun';
import type { Canvas, Strokes } from './canvas';

export type CanvasAction = Load | Paint | Join | Leave | Create;
// | Share

export interface Load {
  name: string;
  canvas: Canvas;
}

export interface Paint {
  location: Patp;
  name: string;
  strokes: {
    id: number;
    fill: boolean;
    color: string;
  }[];
}

export interface Join {
  ship: Patp;
  name: string;
}

export interface Leave {
  ship: Patp;
  name: string;
}

export interface Create {
  canvas: Canvas;
}

// interface Share {
//    name=@t =path type=image-type
// }

// interface Save {
//    =ship name=@t image=@t last=? type=image-type
// }
