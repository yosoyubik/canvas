import _ from 'lodash';
import { reparseDrawForms } from '/lib/form-reparser';


export class InitialReducer {
    reduce(json, state) {
        let data = _.get(json, 'init-frontend', false);
        if (data) {
          state.chats = data.chats;
          for (let canvas in data.canvas) {
            if (data.canvas[canvas].metadata.type === 'draw') {
              data.canvas[canvas].data = reparseDrawForms(data.canvas[canvas].data);
            }
            if (data.canvas[canvas].metadata.type === 'mesh-welcome') {
              state.welcome = data.canvas[canvas];
            } else {
              state.canvasList[canvas] = data.canvas[canvas];
            }
          }
        }
    }
}
