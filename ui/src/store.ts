import _ from 'lodash';
import { writable } from 'svelte/store';
import type { StoreState } from './types/store';

import type Api from './lib/canvasApi';
import type {
  Canvas,
  LoadCanvas,
  CanvasData,
  CanvasLoad
} from './types/canvas';
import type { Paint } from './types/canvasAction';

import { topology as calculateTopology } from '$lib/topology';

// import type { Path, Patp, Enc } from '@urbit/api';
// import type { Group, Resource, Tags, GroupPolicy } from '@urbit/api/groups';

import type { ConnectionStatus } from './types/connection';
import type { GcpToken } from './types/gcp-state';
import type { S3Configuration, S3Credentials } from './types/s3';

import { S3Client } from '@aws-sdk/client-s3';

import { browser } from '$app/env';
// import type { StringChain } from 'lodash';

const initStore: StoreState = {
  chats: [],
  groups: {},
  connection: 'disconnected',
  // publicCanvas: [],
  // privateCanvas: [],
  ship: browser ? window.ship : '~zod',
  name: browser ? `~${window.ship}/welcome` : 'welcome',
  radius: 10,
  gcp: null,
  s3: {
    configuration: {
      buckets: new Set(),
      currentBucket: ''
    },
    credentials: null
  },
  leaving: false
};

const { subscribe, update } = writable(initStore);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isToken(token: any): token is GcpToken {
  return (
    typeof token.accessKey === 'string' && typeof token.expiresIn === 'number'
  );
}

// function resourceFromPath(path: Path): Resource {
//   const [, , ship, name] = path.split('/');
//   return { ship, name };
// }

// export function decodeGroup(group: Enc<Group>): Group {
//   const members = new Set(group.members);
//   const res = {
//     ...group,
//     members,
//     tags: decodeTags(group.tags),
//     policy: decodePolicy(group.policy)
//   };
//   return res;
// }

// function decodePolicy(policy: Enc<GroupPolicy>): GroupPolicy {
//   if ('invite' in policy) {
//     const { invite } = policy;
//     return { invite: { pending: new Set(invite.pending) } };
//   } else {
//     const { open } = policy;
//     return {
//       open: { banned: new Set(open.banned), banRanks: new Set(open.banRanks) }
//     };
//   }
// }

// function decodeTags(tags: Enc<Tags>): Tags {
//   return _.reduce(
//     tags,
//     (acc, ships: any, key): Tags => {
//       if (key.search(/\\/) === -1) {
//         acc.role[key] = new Set(ships);
//         return acc;
//       } else {
//         const [app, tag, resource] = key.split('\\');
//         _.set(acc, [app, resource, tag], new Set(ships));
//         return acc;
//       }
//     },
//     { role: {} }
//   );
// }

export function wipeStore(): void {
  return;
}

function groupCanvasListKeys(canvas: Canvas) {
  const priv = [],
    pub = [];
  Object.entries(canvas).map(([name, data]) => {
    if (data.metadata.private) {
      priv.push(name);
    } else {
      pub.push(name);
    }
  });
  return [priv, pub];
}

export function createCanvasStore(canvasStore: Canvas): void {
  console.log('[createCanvasStore]', canvasStore);
  const [privateCanvas, publicCanvas] = groupCanvasListKeys(canvasStore);

  update(
    ($store): StoreState => {
      let canvas: Canvas = {};
      for (let [location, { metadata, data }] of Object.entries(canvasStore)) {
        const { width, height } = metadata;
        const topology = calculateTopology(metadata.mesh)(
          metadata.name,
          $store.radius,
          width,
          height,
          data,
          metadata.columns
        );
        canvas[location] = { metadata, data: topology };
      }
      return {
        ...$store,
        canvas,
        privateCanvas,
        publicCanvas
      };
    }
  );
}

export function saveGCPToken(token: unknown): void {
  if (isToken(token)) {
    console.log('[loadGCPToken]');
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

export function saveS3credentials(credentials: S3Credentials): void {
  console.log('[loadS3Creds]');
  const endpoint =
    credentials.endpoint.search('http://') !== -1
      ? credentials.endpoint
      : `https://${credentials.endpoint}`;

  update(
    ($store): StoreState => {
      return credentials.endpoint === ''
        ? $store
        : {
            ...$store,
            s3: {
              ...$store.s3,
              credentials,
              client: new S3Client({
                credentials,
                endpoint:
                  credentials.endpoint.search('http://') !== -1
                    ? credentials.endpoint
                    : `https://${credentials.endpoint}`,
                //https://github.com/aws/aws-sdk-js-v3/issues/1845#issuecomment-754832210
                region: 'us-east-1'
              })
            }
          };
    }
  );
}

export function saveS3config(configuration: S3Configuration): void {
  console.log('[loadS3Config]');
  update(
    ($store): StoreState => {
      return {
        ...$store,
        s3: {
          ...$store.s3,
          configuration
        }
      };
    }
  );
}

export function loadCanvas(canvas: LoadCanvas): void {
  const name = `${canvas.location}/${canvas.name}`;
  console.log('[loadCanvas]', canvas, canvas.name);

  update(
    ($store): StoreState => {
      return {
        ...$store,
        canvas: {
          [name]: {
            metadata: { ...canvas },
            data: calculateTopology(canvas.mesh)(
              canvas.name,
              $store.radius,
              canvas.width,
              canvas.height,
              canvas.data,
              canvas.columns
            )
          },
          ...$store.canvas
        },
        publicCanvas: !canvas.private
          ? [name, ...$store.publicCanvas]
          : $store.publicCanvas,
        privateCanvas: canvas.private
          ? [name, ...$store.privateCanvas]
          : $store.privateCanvas,
        name,
        leaving: false
      };
    }
  );
}

export function updatePublic(name: string): void {
  update(
    ($store): StoreState => {
      return {
        ...$store,
        publicCanvas: [name, ...$store.publicCanvas]
      };
    }
  );
}

export function updatePrivate(name: string): void {
  update(
    ($store): StoreState => {
      return {
        ...$store,
        privateCanvas: [name, ...$store.privateCanvas]
      };
    }
  );
}

export function paintCanvas(paint: Paint): void {
  update(
    ($store): StoreState => {
      const name = `${paint.location}/${paint.name}`;
      paint.strokes.forEach(stroke => {
        const polygon =
          $store.canvas[name].data.objects.pixels.geometries[stroke.id];
        $store.canvas[name].data.objects.pixels.geometries[stroke.id] = {
          ...polygon,
          properties: stroke
        };
      });
      return $store;
    }
  );
}

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
  update(
    ($store): StoreState => {
      return { ...$store, name };
    }
  );
}

export function leaveCanvas(oldLocation: string, name: string): void {
  update(
    ($store): StoreState => {
      const oldCanvas = `${oldLocation}/${name}`;
      delete $store.canvas[oldCanvas];
      return {
        ...$store,
        leaving: true,
        publicCanvas: $store.publicCanvas.filter(name => name !== oldCanvas)
      };
    }
  );
}

export function makePublic(name: string): void {
  update(
    ($store): StoreState => {
      const canvas = `~${$store.ship}/${name}`;
      $store.canvas[canvas].metadata.private = false;
      return {
        ...$store,
        privateCanvas: $store.privateCanvas.filter(name => name !== canvas),
        publicCanvas: [canvas, ...$store.publicCanvas],
        name: `~${$store.ship}/welcome`
      };
    }
  );
}

export function updateImageURL(
  location: string,
  name: string,
  url: string
): void {
  update(
    ($store): StoreState => {
      const canvas = `${location}/${name}`;
      $store.canvas[canvas].metadata.file = url;
      return {
        ...$store
      };
    }
  );
}

export function setNotification(notification: string): void {
  update(
    ($store): StoreState => {
      return {
        ...$store,
        notification
      };
    }
  );
}

export function resetNotification(): void {
  update(
    ($store): StoreState => {
      return {
        ...$store,
        notification: undefined
      };
    }
  );
}

// export function createGroups(data: any): void {
//   const groups = _.mapValues(data, decodeGroup);
//   console.log(data, groups);
//   update(
//     ($store): StoreState => {
//       return {
//         ...$store,
//         groups
//       };
//     }
//   );
// }
// export function addGroup(resource: Resource, group: Group): void {}
// export function removeGroup(resource: Resource, group: Group): void {}

export default { subscribe };
