import _ from 'lodash';
import { parseForm } from '/lib/form-reparser'
import { updateHexCanvas } from "/components/lib/hex-canvas";
import { updateMapCanvas } from "/components/lib/map-canvas";
import { updateDrawCanvas } from "/components/lib/draw-canvas";


const updaters = {
  map: updateMapCanvas,
  mesh: updateHexCanvas,
  draw: updateDrawCanvas
}

export class PaintReducer {
    reduce(json, state) {
      let data = _.get(json, 'paint', false);
      if (data) {
        console.log(data, state.canvasList);
        if (data.name in state.canvasList) {
          data.strokes.forEach((stroke, i) => {
              const type = state.canvasList[data.name].metadata.type.split("-")[0];
              console.log(type);
              if (type === 'map' || type === 'mesh'){
                state.canvasList[data.name].data[stroke.id] = {
                  fill: stroke.fill,
                  color: stroke.color
                };
                updaters[type](stroke, data.name);
              } else if (type === 'draw') {
                state.canvasList[data.name].data.push(parseForm(stroke));
                updateDrawCanvas();
              }
          });
        }
      }
    }
}
