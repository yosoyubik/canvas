import { InitialReducer } from '/reducers/initial';
import { UpdateReducer } from '/reducers/update';
import { PaintReducer } from '/reducers/paint';


class Store {
    constructor() {
        this.state = {
            canvasList: {},
            chats: [],
            maps: {}
        };

        this.initialReducer = new InitialReducer();
        this.updateReducer = new UpdateReducer();
        this.paintReducer = new PaintReducer();
        this.setState = () => { };

        fetch("/~canvas/map/us.json")
          .then((response) => response.json())
          .then((json) => {
            this.state.maps.us = json;
          });
        fetch("/~canvas/map/europe.json")
          .then((response) => response.json())
          .then((json) => {
            this.state.maps.europe = json;
          });
    }

    setStateHandler(setState) {
        this.setState = setState;
    }

    handleEvent(data) {
        let json = data.data;

        this.initialReducer.reduce(json, this.state);
        this.updateReducer.canvas(json, this.state);
        this.updateReducer.file(json, this.state);
        this.paintReducer.reduce(json, this.state);
        if (!('paint' in json)) {
          this.setState(this.state);
        }
    }
}

export let store = new Store();
window.store = store;
