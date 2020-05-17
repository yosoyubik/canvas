import _ from 'lodash';

import { reparseDrawForms } from '/lib/form-reparser';

export class UpdateReducer {
    canvas(json, state) {
        let data = _.get(json, 'load', false);
        if (data) {
            if (data.type === 'draw') {
              data.data = reparseDrawForms(data.data);
            }
            state.canvasList[data.name] = {
              type: data.type,
              metadata: {
                name: data.name,
                type: data.type,
                location: data.location,
                saved: false,
                private: data.private
              },
              data: data.data
            };
        }
    }

    file(json, state) {
        let data = _.get(json, 'file', false);
        if (data) {
            state.canvasList[data].metadata.saved = true;
        }
    }
}
