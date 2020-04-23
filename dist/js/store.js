import { InitialReducer } from '/reducers/initial';
import { ConfigReducer } from '/reducers/config';
import { UpdateReducer } from '/reducers/update';
import { PaintReducer } from '/reducers/paint';


class Store {
    constructor() {
        this.state = {
            canvasList: {}
        };

        this.initialReducer = new InitialReducer();
        this.configReducer = new ConfigReducer();
        this.updateReducer = new UpdateReducer();
        this.paintReducer = new PaintReducer();
        this.setState = () => { };
    }

    setStateHandler(setState) {
        this.setState = setState;
    }

    handleEvent(data) {
        let json = data.data;

        console.log(json);
        this.initialReducer.reduce(json, this.state);
        this.configReducer.reduce(json, this.state);
        this.updateReducer.reduce(json, this.state);
        this.paintReducer.reduce(json, this.state);
        console.log(this.state);
        this.setState(this.state);
    }
}

export let store = new Store();
window.store = store;
