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
    mesh?: string,
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
  async send(location: Patp, name: string, strokes: unknown): Promise<unknown> {
    const paint = {
      'canvas-name': name,
      location,
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

  private async sendPoke(action: unknown): Promise<unknown> {
    return this.action('canvas-view', 'json', action);
  }
}
