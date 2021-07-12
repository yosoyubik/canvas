import Api from './urbit/api';

export default class CanvasApi extends Api {
  /**
   * Create a canvas and setup metadata
   */
  create(name, location, template, access, width, height) {
    console.log(name, location, template, access, width, height);
    let create = {
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
        },
      },
    };
    return this.viewAction({ create });
  }

  private viewAction(action: unknown): Promise<any> {
    return this.action('canvas-view', 'json', action);
  }
}