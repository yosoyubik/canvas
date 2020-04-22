import _ from 'lodash';
import { api } from '/api';
import { store } from '/store';
import urbitOb from 'urbit-ob';
import { updateCanvas } from "./components/lib/hex-canvas";


export class Subscription {
  start() {
    if (api.authTokens) {
      this.initializecanvas();
    } else {
      console.error("~~~ ERROR: Must set api.authTokens before operation ~~~");
    }
  }

  initializecanvas() {
    api.bind('/primary', 'PUT', api.authTokens.ship, 'canvas-view',
      this.handleEvent.bind(this),
      this.handleError.bind(this));
  }

  handleEvent(diff) {
    let data = _.get(diff.data, 'paint', false);
    if (data) {
      //  TODO: account for if canvas-id exists
      //  data = {name: 'name', arc-id: : filled?}
      //
      if (data.name in store.state.canvasList) {
        store.state.canvasList[data.name].data[data.id] = data.fill;
        updateCanvas(data);
      }
    }
    else{
      store.handleEvent(diff);
    }
  }

  handleError(err) {
    console.error(err);
    api.bind('/primary', 'PUT', api.authTokens.ship, 'canvas-view',
      this.handleEvent.bind(this),
      this.handleError.bind(this));
  }
}

export let subscription = new Subscription();
