import type { Patp } from './noun';
import { topology } from 'topojson';

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
  lockup?: number;
}

export interface StrokeProps {
  id: number;
  color: string;
  who?: Patp;
  when?: number;
}

export interface CanvasStroke extends TopoJSON.Polygon {
  id: number;
  properties?: StrokeProps;
}

export interface CanvasTopology extends TopoJSON.Topology {
  objects: {
    pixels: {
      type: 'GeometryCollection';
      geometries: Array<CanvasStroke>;
    };
  };
  transform: TopoJSON.Transform;
}

export interface Strokes {
  [id: number]: {
    // fill: boolean;
    color: string;
    who?: Patp;
    when?: number;
    // del: boolean;
  };
}

export interface Canvas {
  [location: string]: {
    metadata: Metadata;
    //data: Strokes;
    data: CanvasTopology;
  };
}

export interface CanvasLoad {
  [location: string]: {
    metadata: Metadata;
    data: Array<StrokeProps>;
  };
}

export interface CanvasData {
  metadata: Metadata;
  data: CanvasTopology;
}

export type LoadCanvas = Metadata & {
  data: CanvasTopology;
};

export interface CanvasForm {
  name: string;
  private: boolean;
  template: string;
  width: number;
  height: number;
  radius: number;
  mesh?: string;
};

export enum Tool {
  Brush = 'BRUSH',
  Eraser = 'ERASER',
  Eyedropper = 'EYEDROPPER',
  Fill = 'FILL',
};
