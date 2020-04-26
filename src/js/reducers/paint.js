import _ from 'lodash';
import { updateCanvas } from "/components/lib/hex-canvas";

export class PaintReducer {
    reduce(json, state) {
      let data = _.get(json, 'paint', false);
      if (data) {
        console.log(data, state.canvasList);
        if (data.name in state.canvasList) {
          data.strokes.forEach((stroke, i) => {
              state.canvasList[data.name].data[stroke.id] = {
                fill: stroke.fill,
                color: stroke.color
              };
              updateCanvas(stroke, data.name);
          });
        }
      }
    }
}
