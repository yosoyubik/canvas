import _ from 'lodash';


export class UpdateReducer {
    reduce(json, state) {
        let data = _.get(json, 'load', false);
        if (data) {
            state.canvasList[data.name] = {
              "type": data.type,
              "metadata": {
                "name": data.name,
                "type": data.type,
                "location": data.location
              },
              "data": data.data
            };
        }
    }
}
