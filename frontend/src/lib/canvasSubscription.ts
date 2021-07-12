import _ from 'lodash';
import Subscription from './urbit/subscription';
import type { Path } from '../types/noun';
import { createCanvasStore, wipeStore, updateConnection, loadCanvas } from '../store';

/**
 * Path to subscribe on and app to subscribe to
 */
type AppSubscription = [Path, string];
type AppName = 'canvas-view';
const canvasSubscriptions: AppSubscription[] = [
  ['/primary', 'canvas-view'],
];
const appSubscriptions: Record<AppName, AppSubscription[]> = {
  'canvas-view': canvasSubscriptions,
};

export default class CanvasSubscription extends Subscription {
  openSubscriptions: Record<AppName, number[]> = {
    'canvas-view': [],
  };

  start() {
    this.subscribe('/primary', 'canvas-view');
  }

  restart() {
    super.restart();
    _.mapValues(this.openSubscriptions, (subs, app: AppName) => {
      if (subs.length > 0) {
        this.stopApp(app);
        this.startApp(app);
      }
    });
  }

  startApp(app: AppName) {
    if (this.openSubscriptions[app].length > 0) {
      console.log(`${app} already started`);
      return;
    }
    this.openSubscriptions[app] = appSubscriptions[app].map(([path, agent]) =>
      this.subscribe(path, agent),
    );
  }

  stopApp(app: AppName) {
    this.openSubscriptions[app].map((id) => this.unsubscribe(id));
    this.openSubscriptions[app] = [];
  }

  handleEvent(data) {
    console.log(data);
    const json = data.data;
    if (json === null) {
      return;
    }

    if ('clear' in json && json.clear) {
      wipeStore();
    } else if ('connection' in json) {
      updateConnection(json.connection);
    } else if ('init-frontend' in json) {
      createCanvasStore(json['init-frontend'].canvas);
    } else if ('load' in json) {
      loadCanvas(json['load']);
    } else {
    }
    return
  }
}
