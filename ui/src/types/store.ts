import type { GcpToken } from './gcp-state';
import type { Canvas } from './canvas';
import type { ConnectionStatus } from './connection';
import type Api from '../lib/canvasApi';
import type { S3Credentials, S3Configuration } from './s3';
import type { Patp, Group } from '@urbit/api';

export interface StoreState {
  // local state
  notification?: string;
  // Canvas state
  canvas?: Canvas;
  radius: number;
  name: string;
  publicCanvas?: string[];
  privateCanvas?: string[];
  leaving: boolean;
  // Urbit
  groups: {
    [group: string]: Group;
  };
  chats: [];
  connection: ConnectionStatus;
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
