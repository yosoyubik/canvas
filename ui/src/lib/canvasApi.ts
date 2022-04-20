import Api from './urbit/api';
import type { Patp } from '../types/noun';

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
    return this.scry('canvas', `/subscribed/${location}`);
  }

  private async sendPoke(action: unknown): Promise<unknown> {
    return this.action('canvas', 'json', action);
  }
}
