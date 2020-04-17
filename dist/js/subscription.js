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
    api.bind('/primary', 'PUT', api.authTokens.ship, 'canvas',
      this.handleEvent.bind(this),
      this.handleError.bind(this));
  }

  handleEvent(diff) {
    let data = _.get(diff.data, 'paint', false);
    if (data) {
      //  TODO: account for if canvas-id exists
      //  data = {canvas-id: {arc-id: : fill}
      //
      updateCanvas(data['0']);
    }
    else{
      store.handleEvent(diff);
    }
  }

  handleError(err) {
    console.error(err);
    api.bind('/primary', 'PUT', api.authTokens.ship, 'canvas',
      this.handleEvent.bind(this),
      this.handleError.bind(this));
  }
}

export let subscription = new Subscription();
