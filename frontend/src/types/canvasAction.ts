import type { Patp } from './noun';
import type { Canvas, Strokes } from './canvas';

export type CanvasAction =
  | Load
  | Paint
  | Join
  | Leave
  | Create
  // | Share
  ;


interface Load {
  name: string; 
  canvas: Canvas;
}

interface Paint {
  location: Patp;
  name: string;
  strokes: Strokes[];
}

interface Join  {
  ship: Patp;
  name: string;
}

interface Leave {
  ship: Patp;
  name: string;
}

interface Create {
   canvas: Canvas;
}

// interface Share {
//    name=@t =path type=image-type
// }

// interface Save {
//    =ship name=@t image=@t last=? type=image-type
// }

