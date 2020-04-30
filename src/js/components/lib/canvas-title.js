import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { api } from '/api';

export class CanvasTitle extends Component {
  // drawer to the left
  onClickLeave() {
    api.canvas.leave(this.props.location, this.props.id);
  }
  render() {
    const { props, state } = this;
    return (
      <div>
        <Link to={`/~canvas/item/${props.id}`} key={props.id}>
          <div className="w-100 v-mid f7 ph2 z1 pv1">
            <p className="f8 dib">{props.id}</p>
          </div>
        </Link>
        { (props.location === ("~" + ship)) ?
          (<p className="ph6 f9 pb1 gray2">Local</p>) :
          (<button className="pointer ph6 f9 pb1 red2 bg-gray0-d b--red2"
           onClick={this.onClickLeave.bind(this)}>
            leave shared canvas
          </button>)
        }
      </div>
    );
  }
}
