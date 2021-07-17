import type { Patp } from './noun';

export type Create = (
  name: string,
  ship: Patp,
  template: string,
  access: boolean,
  width: number,
  height: number
) => Promise<unknown>;

export type Send = (
  location: string,
  name: string,
  strokes
) => Promise<unknown>;

export type Join = (location: string, name: string) => Promise<unknown>;

export type Save = (
  location: string,
  name: string,
  file: string
) => Promise<unknown>;

export type Unlock = (name: string) => Promise<unknown>;
export default interface Api {
  create: Create;
  send: Send;
  join: Join;
  save: Save;
  unlock: Unlock;
}
