import type { Patp } from './noun';

export type Create = (
  name: string,
  ship: Patp,
  template: string,
  access: boolean,
  width: number,
  height: number
) => Promise<unknown>;

export type Send = (location: string, name: string, strokes) => Promise<unknown>;

export default interface Api {
  create: Create;
  send: Send;
}