import App from './App.svelte';
import type { Patp } from './types/noun';

declare global {
  interface Window {
    channel: () => void;
    ship: Patp;
  }
}

const app = new App({
	target: document.body,
});

export default app;