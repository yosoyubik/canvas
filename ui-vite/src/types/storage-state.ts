import type { GcpState } from './gcp-state';
import type { S3State } from './s3';

export interface StorageState {
  gcp: GcpState;
  s3: S3State;
}
