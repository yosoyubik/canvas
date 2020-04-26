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
          data.strokes.forEach((stroke, i) => {
              store.state.canvasList[data.name].data[stroke.id] = stroke.fill;
              updateCanvas(stroke, data.name);
          });
        }
      }
    }
}
