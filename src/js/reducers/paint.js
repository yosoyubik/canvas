import _ from 'lodash';
import { updateCanvas } from "/components/lib/hex-canvas";

export class PaintReducer {
    reduce(json, state) {
      let data = _.get(json, 'paint', false);
      if (data) {
        //  TODO: account for if canvas-id exists
        //  data = {name: 'name', arc-id: : filled?}
        //
        console.log(data, state.canvasList);
        if (data.name in state.canvasList) {
          store.state.canvasList[data.name].data[data.id] = data.fill;
          console.log(state.canvasList[data.name]);
          console.log(data.id);
          updateCanvas(data);
        }
      }
    }
}
