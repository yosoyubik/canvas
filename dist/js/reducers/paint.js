import _ from 'lodash';
import { updateHexCanvas } from "/components/lib/hex-canvas";
import { updateMapCanvas } from "/components/lib/map-canvas";


const updaters = {
  map: updateMapCanvas,
  mesh: updateHexCanvas
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
              }
              console.log(updaters[type]);
              updaters[type](stroke, data.name);
          });
        }
      }
    }
}
