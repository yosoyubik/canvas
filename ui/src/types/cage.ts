import type { CanvasAction } from './canvasAction';
import type { ConnectionStatus } from './connection';

interface MarksToTypes {
  readonly json: never;
  readonly canvasAction: CanvasAction;
  readonly location: string;
  readonly connection: ConnectionStatus;
}

export type Cage = Partial<MarksToTypes>;

export type Mark = keyof MarksToTypes;
