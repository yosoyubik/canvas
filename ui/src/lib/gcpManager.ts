// Singleton that manages GCP token state.
//
// To use:
//
// 1. call configure with a GlobalApi and GlobalStore.
// 2. call start() to start the token refresh loop.
//
// If the ship does not have GCP storage configured, we don't try to
// get a token. If GCP storage is configured, we try to invoke the GCP
// get-token thread on the ship until it gives us an access token. Once
// we have a token, we refresh it every hour or so according to its
// intrinsic expiry.
//
//
// import GlobalApi from '../api/global';
import type Api from './gcp';
// import useStorageState from '../state/storage';
import store from '../store';
import { get } from 'svelte/store';

class GcpManager {
  #api: Api | null = null;

  configure(api: Api) {
    this.#api = api;
  }

  #running = false;
  #timeoutId: ReturnType<typeof setTimeout> | null = null;

  start() {
    if (this.#running) {
      console.warn('GcpManager already running');
      return;
    }
    if (!this.#api) {
      console.error('GcpManager must have api set');
      return;
    }
    this.#running = true;
    this.refreshLoop();
  }

  stop() {
    if (!this.#running) {
      console.warn('GcpManager already stopped');
      console.assert(this.#timeoutId === null);
      return;
    }
    this.#running = false;
    if (this.#timeoutId !== null) {
      clearTimeout(this.#timeoutId);
      this.#timeoutId = null;
    }
  }

  restart() {
    if (this.#running) {
      this.stop();
    }
    this.start();
  }

  #consecutiveFailures = 0;
  #configured = false;

  private refreshLoop() {
    if (!this.#configured) {
      this.#api
        ?.isConfigured()
        .then(configured => {
          if (configured === undefined) {
            throw new Error("can't check whether GCP is configured?");
          }
          this.#configured = configured;
          if (this.#configured) {
            this.refreshLoop();
          } else {
            console.log('GcpManager: GCP storage not configured; stopping.');
            this.stop();
          }
        })
        .catch(reason => {
          console.error('GcpManager failure; stopping.', reason);
          this.stop();
        });
      return;
    }
    this.#api
      ?.getToken()
      .then(() => {
        const token = get(store)['gcpToken'];
        if (token) {
          this.#consecutiveFailures = 0;
          const interval = this.refreshInterval(token.expiresIn);
          console.log('GcpManager got token; refreshing after', interval);
          this.refreshAfter(interval);
        } else {
          throw new Error('thread succeeded, but returned no token?');
        }
      })
      .catch(() => {
        this.#consecutiveFailures++;
        console.warn('GcpManager token refresh failed; retrying with backoff');
        this.refreshAfter(this.backoffInterval());
      });
  }

  private refreshAfter(durationMs) {
    if (!this.#running) {
      return;
    }
    if (this.#timeoutId !== null) {
      console.warn('GcpManager already has a timeout set');
      return;
    }
    this.#timeoutId = setTimeout(() => {
      this.#timeoutId = null;
      this.refreshLoop();
    }, durationMs);
  }

  private refreshInterval(expiresIn: number) {
    // Give ourselves a minute for processing delays, but never refresh sooner
    // than 30 minutes from now. (The expiry window should be about an hour.)
    return Math.max(30 * 60_000, expiresIn - 60_000);
  }

  private backoffInterval() {
    // exponential backoff.
    const slotMs = 5_000;
    const maxSlot = 60; // 5 minutes
    const backoffSlots = Math.floor(
      Math.random() * Math.min(maxSlot, this.#consecutiveFailures)
    );
    return slotMs * backoffSlots;
  }
}

const instance = new GcpManager();
Object.freeze(instance);

export default instance;
