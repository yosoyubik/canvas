import { InitialReducer } from '/reducers/initial';
import { UpdateReducer } from '/reducers/update';
import { PaintReducer } from '/reducers/paint';


class Store {
    constructor() {
        this.state = {
            canvasList: {},
            chats: []
        };

        this.initialReducer = new InitialReducer();
        this.updateReducer = new UpdateReducer();
        this.paintReducer = new PaintReducer();
        this.setState = () => { };
    }

    setStateHandler(setState) {
        this.setState = setState;
    }

    handleEvent(data) {
        let json = data.data;

        this.initialReducer.reduce(json, this.state);
        this.updateReducer.reduce(json, this.state);
        this.paintReducer.reduce(json, this.state);
        if (!('paint' in json)) {
          this.setState(this.state);
        }
    }
}

export let store = new Store();
window.store = store;
