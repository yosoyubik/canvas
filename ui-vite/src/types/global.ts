import type { PatpNoSig } from './noun';

declare global {
  interface Window {
    channel: () => void;
    ship: PatpNoSig;
  }
}
