import { writable } from 'svelte/store';
import type { StoreState}  from './types/store';

import Subscription from './lib/canvasSubscription';
import Api from './lib/canvasApi';
const appChannel = new window.channel();
const api = new Api(window.ship, appChannel);
const subscription = new Subscription(api, appChannel);

subscription.start();

const initStore: StoreState = {
  chats: [],
  connection: 'disconnected',
  canvasList: [],
  ship: window.ship,
  api,
  subscription,
  width: 1500,
  height: 1000,
};

const { subscribe, set, update } = writable(initStore);

export function wipeStore() {

};

export function createCanvasStore(canvas) {
  console.log('[createCanvasStore]', canvas);
  update(
    ($store): StoreState => {
      return {
        ...$store,
        canvas,
        canvasList: Object.keys(canvas),
      };
    },
  );
};

export function loadCanvas(canvas) {
  console.log('[loadCanvas]', canvas);
  update(
    ($store): StoreState => {
      return {
        ...$store,
        canvas: {
          [canvas.name]: {
            metadata: {
              name: canvas.name,
              template: canvas.template,
              location: canvas.location,
              saved: false,
              private: canvas.private,
            },
          data: canvas.data,
          },
          ...$store.canvas,
        },
        canvasList: [
          canvas.name,
          ...$store.canvasList,
        ],
      };
    },
  );
}

export function updateCanvasStore(canvas) {
  update(
    ($store): StoreState => {
      return {
        ...$store,
        canvas: {
          ...$store.canvas,
        },
      };
    },
  );
};

export function updateConnection(connection) {
  update(
    ($store): StoreState => {
      return {
        ...$store,
        connection: connection,
      };
    },
  );
};

export default { subscribe };
