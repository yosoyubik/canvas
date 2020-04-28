import _ from 'lodash';

import { reparseDrawForms } from '/lib/form-reparser';

export class UpdateReducer {
    reduce(json, state) {
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
                location: data.location
              },
              data: data.data
            };
        }
    }
}
