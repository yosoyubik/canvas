import _ from 'lodash';


export class UpdateReducer {
    reduce(json, state) {
        let data = _.get(json, 'load', false);
        if (data) {
            state.canvasList[data.name] = {
              "type": data.type,
              "metadata": data.metadata,
              "data": data.data
            };
        }
    }
}
