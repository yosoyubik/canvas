import type { GcpToken } from './gcp-state';
import type { Canvas } from './canvas';
import type { ConnectionStatus } from './connection';
import type { Patp } from './noun';
import type Api from '../lib/canvasApi';
import type { S3Credentials, S3Configuration } from './s3';

export interface StoreState {
  // local state

  // Canvas state
  canvas?: Canvas;
  radius: number;
  name: string;
  // Urbit
  chats: [];
  connection: ConnectionStatus;
  publicCanvas?: string[]
  privateCanvas?: string[];
  api?: Api;
  subscription?: unknown;
  ship: Patp;
  gcp: { gcpToken?: GcpToken };
  s3: {
    configuration: S3Configuration;
    credentials?: S3Credentials;
    client?: any;
  };
}
