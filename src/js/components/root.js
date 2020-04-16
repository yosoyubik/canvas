import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import _ from 'lodash';

import { HeaderBar } from "./lib/header-bar"
import { Hexagons } from "./hexagons"

import { store } from '/store';
import { api } from '/api';


export class Root extends Component {
  constructor(props) {
    super(props);
    this.state = store.state;
    store.setStateHandler(this.setState.bind(this));
  }

  render() {
    const { props, state } = this;
    console.log(state);
    console.log(state.hexagons);
    return (
      <BrowserRouter>
        <div className="absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl">
        <HeaderBar/>
        <Route exact path="/~canvas" render={ () => {
          return (
            <div className="cf w-100 flex flex-column ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl f9 white-d">
              <Hexagons api={api} hexagons={state.hexagons} />
            </div>
          )}}
        />
        </div>
      </BrowserRouter>
    )
  }
}
