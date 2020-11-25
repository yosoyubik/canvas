import { InitialReducer } from './reducers/initial';
import { UpdateReducer } from './reducers/update';

class Store {

  /*
  The store holds all state for the front-end. We initialise a subscription to the back-end through
  subscription.js and then let the store class handle all incoming diffs, including the initial one
  we get from subscribing to the back-end.

  It's important that state be mutated and set in one place, so pipe changes through the handleEvent method.
  */
    constructor() {
        this.state = {};

        this.initialReducer = new InitialReducer();
        this.updateReducer = new UpdateReducer();
        this.setState = () => { };
    }

    setStateHandler(setState) {
        this.setState = setState;
    }

    handleEvent(data) {
        let json = data.data;

        console.log(json);
        this.initialReducer.reduce(json, this.state);
        this.updateReducer.reduce(json, this.state);

        this.setState(this.state);
    }
}

export let store = new Store();
window.store = store;