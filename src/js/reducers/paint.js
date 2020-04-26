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
        data.forEach((stroke, i) => {
          if (stroke.name in state.canvasList) {
            store.state.canvasList[stroke.name].data[stroke.id] = stroke.fill;
            console.log(state.canvasList[stroke.name]);
            console.log(stroke.id);
            updateCanvas(stroke);
          }
        });
      }
    }
}
