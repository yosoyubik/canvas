const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/lib/canvas-title.js";import React, { Component } from 'react';
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
      React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
        , React.createElement(Link, { to: `/~canvas/item/${props.id}`, key: props.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}
          , React.createElement('div', { className: "w-100 v-mid f7 ph2 z1 pv1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
            , React.createElement('p', { className: "f8 dib" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}, props.id)
            ,  (props.location === ("~" + ship)) ?
              (React.createElement('span', { className: "ph3 f9 pb1 gray2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}, "(local)")) :
              (React.createElement('button', { className: "ph3 f9 pb1 red2 bg-gray0-d b--red2"     ,
               onClick: this.onClickLeave.bind(this), __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}, "leave"

                , React.createElement('span', { className: "ml1 pointer" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}, "x")
              ))
            
          )
        )
      )
    );
  }
}
