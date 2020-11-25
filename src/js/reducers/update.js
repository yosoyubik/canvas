import _ from 'lodash';


export class UpdateReducer {

  /* If we get an incoming object like this:

  { update: {new: {}}}

  It will replace the entire contents of the state with the incoming state enclosed in "new".

  Feel free to amend the behaviour as necessary.
  */
    reduce(json, state) {
        let data = _.get(json, 'update', false);
        if (data) {
            this.reduceState(_.get(data, 'new', false), state);
        }
    }

    reduceState(incoming, state) {
        if (incoming) {
            state = incoming;
        }
    }
}
