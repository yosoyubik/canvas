import _ from 'lodash';
import Subscription from './urbit/subscription';
import type { Path } from '../types/noun';
import {
  createCanvasStore,
  wipeStore,
  updateConnection,
  paintCanvas,
  loadCanvas,
  expandCanvas,
  saveGCPToken,
  saveS3credentials,
  saveS3config
  // createGroups,
  // addGroup,
  // removeGroup,
  // decodeGroup
} from '../store';

/**
 * Path to subscribe on and app to subscribe to
 */
type AppSubscription = [Path, string];
type AppName = 'canvas-view';
const canvasSubscriptions: AppSubscription[] = [['/frontend', 'canvas']];
const appSubscriptions: Record<AppName, AppSubscription[]> = {
  'canvas-view': canvasSubscriptions
};

export default class CanvasSubscription extends Subscription {
  openSubscriptions: any = {};

  start(): void {
    this.subscribe('/frontend', 'canvas');
    this.subscribe('/all', 's3-store');
    this.subscribe('/groups', 'group-store');
  }

  restart(): void {
    super.restart();
    _.mapValues(this.openSubscriptions, (subs, app: AppName) => {
      if (subs.length > 0) {
        this.stopApp(app);
        this.startApp(app);
      }
    });
  }

  startApp(app: AppName): void {
    if (this.openSubscriptions[app].length > 0) {
      console.log(`${app} already started`);
      return;
    }
    this.openSubscriptions[app] = appSubscriptions[app].map(([path, agent]) =>
      this.subscribe(path, agent)
    );
  }

  stopApp(app: AppName): void {
    this.openSubscriptions[app].map(id => this.unsubscribe(id));
    this.openSubscriptions[app] = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleEvent(data: { data: any }): void {
    const json = data.data;
    if (json === null) {
      return;
    }

    // if ('groupUpdate' in json) {
    //   if ('initial' in json.groupUpdate && json.groupUpdate['initial']) {
    //     createGroups(json.groupUpdate['initial']);
    //     // updateGroups()
    //   } else if ('add-group' in json.groupUpdate) {
    //     const { resource, group } = json.groupUpdate['add-group'];
    //     addGroup(resource, decodeGroup(group));
    //   } else if ('remove-group' in json.groupUpdate) {
    //     const { resource, group } = json.groupUpdate['remove-group'];
    //     removeGroup(resource, decodeGroup(group));
    //   }
    // }

    if ('clear' in json) {
      wipeStore();
    } else if ('connection' in json) {
      updateConnection(json.connection);
    } else if ('init-frontend' in json) {
      createCanvasStore(json['init-frontend'].canvas);
    } else if ('load' in json) {
      loadCanvas(json['load']);
    } else if ('paint' in json) {
      paintCanvas(json['paint']);
    } else if ('expand' in json) {
      expandCanvas(json['expand']);
    } else if ('gcp-token' in json) {
      saveGCPToken(json['gcp-token']);
    } else if ('s3-update' in json) {
      if ('credentials' in json['s3-update']) {
        saveS3credentials(json['s3-update']['credentials']);
      } else if ('configuration' in json['s3-update']) {
        saveS3config(json['s3-update']['configuration']);
      }
    }
    return;
  }
}
