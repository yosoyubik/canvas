import type { S3State } from "./s3";
import type { Canvas } from './canvas';
import type { ConnectionStatus  } from './connection';
import type { Patp } from './noun';

export interface StoreState {
  // local state

  // Canvas state
  canvas?: Canvas;
  width: number;
  height: number;
  // Urbit
  s3?: S3State;
  chats: [];
  connection: ConnectionStatus;
  canvasList: string[];
  api: any;
  subscription: any;
  ship: Patp;
}
