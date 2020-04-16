import _ from 'lodash';


export class InitialReducer {
    reduce(json, state) {
        let data = _.get(json, 'init', false);
        if (data) {
          console.log(data);
            state.hexagons = data;
        }
    }
}
