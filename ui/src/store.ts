import { writable } from 'svelte/store';
import type { StoreState } from './types/store';
import type Api from './types/api';
import type { Canvas, LoadCanvas } from './types/canvas';
import type { Paint } from './types/canvasAction';
import type { ConnectionStatus } from './types/connection';
import type { GcpToken } from './types/gcp-state';

import { browser } from '$app/env';

const initStore: StoreState = {
  chats: [],
  connection: 'disconnected',
  canvasList: [],
  name: 'welcome',
  ship: browser ? window.ship : '~zod',
  width: 1500,
  height: 1000,
  gcp: null,
  s3: {
    configuration: {
      buckets: new Set(),
      currentBucket: ''
    },
    credentials: null
  }
};

const { subscribe, update } = writable(initStore);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isToken(token: any): token is GcpToken {
  return typeof token.accessKey === 'string' && typeof token.expiresIn === 'number';
}

export function wipeStore(): void {
  return;
}

export function createCanvasStore(canvas: Canvas): void {
  console.log('[createCanvasStore]', canvas);
  update(
    ($store): StoreState => {
      return {
        ...$store,
        canvas,
        canvasList: Object.keys(canvas).filter((d) => d !== 'welcome')
      };
    }
  );
}

export function saveGCPToken(token: unknown): void {
  if (isToken(token)) {
    console.log('[loadGCPToken]', token);
    update(
      ($store): StoreState => {
        return {
          ...$store,
          gcp: { gcpToken: token as GcpToken }
        };
      }
    );
  }
}

export function loadCanvas(canvas: LoadCanvas): void {
  console.log('[loadCanvas]', canvas, canvas.name);
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
              saved: canvas.saved,
              width: canvas.width,
              height: canvas.height,
              private: canvas.private
            },
            data: canvas.data
          },
          ...$store.canvas
        },
        name: canvas.name,
        canvasList: [canvas.name, ...$store.canvasList]
      };
    }
  );
}

export function paintCanvas(paint: Paint): void {
  console.log('[painting]', paint);
  update(
    ($store): StoreState => {
      paint.strokes.forEach((stroke) => {
        console.log(stroke);
        // $store.canvas[paint.name].data = {
        //   ...$store.canvas[paint.name].data,
        //   [stroke.id]: {
        //     ...stroke
        //   }
        // };
        $store.canvas[paint.name].data[stroke.id] = {
          ...stroke
        };
      });
      return $store;
    }
  );
}

// export function updateCanvasStore(canvas: Canvas): void {
//   update(
//     ($store): StoreState => {
//       return {
//         ...$store,
//         canvas: {
//           ...$store.canvas
//         }
//       };
//     }
//   );
// }

export function updateConnection(connection: ConnectionStatus): void {
  update(
    ($store): StoreState => {
      return {
        ...$store,
        connection
      };
    }
  );
}

export function addApi(api: Api): void {
  update(
    ($store): StoreState => {
      return {
        ...$store,
        api
      };
    }
  );
}

export function addSubscription(subscription: unknown): void {
  update(
    ($store): StoreState => {
      return {
        ...$store,
        subscription
      };
    }
  );
}

export function updateCurrentCanvas(name: string): void {
  console.log(name);
  update(
    ($store): StoreState => {
      return { ...$store, name };
    }
  );
}

export default { subscribe };
