import Api from '@urbit/http-api';
import type { Patp } from '../types/noun';
import { updateConnection,
         wipeStore,
         createCanvasStore,
         loadCanvas,
         paintCanvas, expandCanvas
} from '../store';

export default class CanvasApi extends Api {
  /**
   * Create a canvas
   */
  async create(
    name: string,
    location: Patp,
    template: string,
    access: boolean,
    width: number,
    height: number,
    columns: number,
    mesh?: string
  ): Promise<unknown> {
    const create = {
      mesh: {
        canvas: null,
        metadata: {
          name,
          location,
          saved: false,
          private: access,
          template,
          width,
          height,
          columns,
          mesh
        }
      }
    };
    return this.sendPoke({ create });
  }

  /**
   * Send a stroke to a canvas in a location
   */
  async send(host: Patp, name: string, strokes: unknown): Promise<unknown> {
    const paint = {
      location: { host, name },
      strokes
    };
    return this.sendPoke({ paint });
  }

  /**
   * Saves the exported Canvas URl
   */
  async save(location: Patp, name: string, file: string): Promise<unknown> {
    const save = {
      'canvas-name': name,
      location,
      file
    };
    return this.sendPoke({ save });
  }

  /**
   * Join a remote canvas
   */
  async join(location: Patp, name: string): Promise<unknown> {
    const join = {
      'canvas-name': name,
      ship: location
    };
    return this.sendPoke({ join });
  }

  /**
   * Unsubscribes from remote canvas and makes it local
   */
  async leave(location: Patp, name: string): Promise<unknown> {
    const leave = {
      'canvas-name': name,
      ship: location
    };
    return this.sendPoke({ leave });
  }

  /**
   * Revmoves a private canvas from the gallery
   */
  async deletePrivate(location: Patp, name: string): Promise<unknown> {
    const remove = {
      'canvas-name': name,
      ship: location
    };
    return this.sendPoke({ remove });
  }

  /**
   * Expands the dimensions of the canvas
   */
  async expand(location: Patp, name: string, rows: number): Promise<unknown> {
    const expand = {
      'canvas-name': name,
      ship: location,
      dimensions: { rows, cols: 0 }
    };
    return this.sendPoke({ expand });
  }

  /**
   * Makes a private canvas public:
   *
   *    [Currently not exposed to the UI. see OptionsMenu.svelte]
   */
  async makePublic(name: string): Promise<unknown> {
    const unlock = {
      'canvas-name': name
    };
    return this.sendPoke({ unlock });
  }

  async isSubscribed(location: string): Promise<unknown> {
    return this.scry({app: 'canvas', path: `/subscribed/${location}`});
  }

  private async sendPoke(action: unknown): Promise<unknown> {
    return this.poke({app: 'canvas', mark: 'json', json: action});
  }

  start(): void {
    console.log('subscribing');
    updateConnection('reconnecting');
    this.subscribe({
      app: 'canvas',
      path: '/frontend',
      event: this.handleEvent.bind(this),
      quit: this.start.bind(this),
      err: this.handleError.bind(this)
    });
  }

  handleError(): void {
    updateConnection('disconnected');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleEvent(json: any): void {
    // const json = data.data;
    if (json === null || json === undefined) {
      return;
    }

    updateConnection('connected');

    if ('clear' in json) {
      wipeStore();
    } else if ('init-frontend' in json) {
      createCanvasStore(json['init-frontend'].canvas);
    } else if ('load' in json) {
      loadCanvas(json['load']);
    } else if ('paint' in json) {
      paintCanvas(json['paint']);
    } else if ('expand' in json) {
      expandCanvas(json['expand']);
    }
    return;
  }
}
