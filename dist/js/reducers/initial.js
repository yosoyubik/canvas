import _ from 'lodash';


export class InitialReducer {
    reduce(json, state) {
        console.log("initial", json);
        let data = _.get(json, 'init', false);
        for (let canvas in data) {
          state.canvasList[canvas] = data[canvas];
        }
    }
}
