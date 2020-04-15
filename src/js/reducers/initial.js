import _ from 'lodash';


export class InitialReducer {
    reduce(json, state) {
        let data = _.get(json, 'initial', false);
        if (data) {
            state.inbox = data.inbox;
        }
    }
}
