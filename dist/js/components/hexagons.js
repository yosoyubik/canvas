const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/hexagons.js";import React, { Component } from 'react';

import { initHexMesh,
         drawHexCanvas,
         width,
         height,
         radius }
from "./lib/hex-canvas";


export class Hexagons extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("mounted");
    drawHexCanvas(this.props);
    initHexMesh();
  }

  render() {
    console.log(this.state, this.props)
    if (this.props.hexagons) {
      drawHexCanvas(this.props);
    }
    return (
      React.createElement('div', { ref: "canvas", __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
        , React.createElement('svg', { width: width, height: height, __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}
          , React.createElement('g', { className: "hexagon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}} )
          , React.createElement('g', { className: "mesh-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}} )
          , React.createElement('g', { className: "border-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}} )
        )
      )
    )
  }
}
