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
    height: number
  ): Promise<unknown> {
    console.log(name, location, template, access, width, height);
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
          height
        }
      }
    };
    return this.sendPoke({ create });
  }

  /**
   * Send a stroke to a canvas in a location
   */
  async send(location: Patp, name: string, strokes: unknown): Promise<unknown> {
    console.log('paint', location, name);
    const paint = {
      'canvas-name': name,
      location,
      strokes
    };
    return this.sendPoke({ paint });
  }

  private async sendPoke(action: unknown): Promise<unknown> {
    return this.action('canvas-view', 'json', action);
  }
}
