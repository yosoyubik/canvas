import type { GcpToken } from './gcp-state';
import type { Canvas } from './canvas';
import type { ConnectionStatus } from './connection';
import type { Patp } from './noun';
import type Api from './api';

export interface StoreState {
  // local state

  // Canvas state
  canvas?: Canvas;
  width: number;
  height: number;
  name: string;
  // Urbit
  chats: [];
  connection: ConnectionStatus;
  canvasList: string[];
  api?: Api;
  subscription?: unknown;
  ship: Patp;
  gcp: { gcpToken?: GcpToken };
  s3: {
    configuration: {
      buckets: Set<string>;
      currentBucket: string;
    };
    credentials: any | null; // TODO better type
  };
}
