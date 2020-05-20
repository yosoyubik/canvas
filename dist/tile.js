const _jsxFileName = "/Users/jose/urbit/canvas/tile/tile.js";import React, { Component } from 'react';
import _ from 'lodash';


export default class canvasTile extends Component {

  render() {
    return (
      React.createElement('div', { className: "w-100 h-100 relative bg-white bg-gray0-d ba b--black b--gray1-d"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
        , React.createElement('a', { className: "w-100 h-100 db pa2 no-underline"    , href: "/~canvas", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10}}
          , React.createElement('p', { className: "black white-d absolute f9"   , style: { left: 8, top: 8 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}, "Canvas")
          , React.createElement('img', {
            className: "absolute",
            style: { left: 16, top: 26 },
            src: "/~canvas/img/Tile.png",
            width: 90,
            height: 70, __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}} )
        )
      )
    );
  }
}

window.canvasTile = canvasTile;
