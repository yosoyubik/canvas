import _ from 'lodash';
import { reparseDrawForms } from '/lib/form-reparser';


export class InitialReducer {
    reduce(json, state) {
        console.log("initial", json);
        let data = _.get(json, 'init-frontend', false);
        if (data) {
          state.chats = data.chats;
          for (let canvas in data.canvas) {
            console.log(canvas)
            if (data.canvas[canvas].metadata.type === 'draw') {
              data.canvas[canvas].data = reparseDrawForms(data[canvas].data);
            }
            console.log(data.canvas[canvas]);
            state.canvasList[canvas] = data.canvas[canvas];
          }
        }
    }
}
