import _ from 'lodash';


export class InitialReducer {
  /* if we get a diff from the app that looks like this:

  { initial: {}}

  it will set the state to look like the contents of "initial"

  */
    reduce(json, state) {
        let data = _.get(json, 'initial', false);
        if (data) {
            state = data;
        }
    }
}
