import _ from 'lodash';
import { reparseDrawForms } from '/lib/form-reparser';


export class InitialReducer {
    reduce(json, state) {
        console.log("initial", json);
        let data = _.get(json, 'init', false);
        for (let canvas in data) {
          if (data[canvas].metadata.type === 'draw') {
            data[canvas].data = reparseDrawForms(data[canvas].data);
          }
          state.canvasList[canvas] = data[canvas];
        }
    }
}
