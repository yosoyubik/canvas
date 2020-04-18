const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/hexagons.js";import React, { Component } from 'react';

import * as d3 from "d3";
import { parseSVG, simpleParseSVG } from "./lib/compile-svg";
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

  onClickSave () {
    const svgString = simpleParseSVG(d3.select("#canvas").node());
    this.props.api.svg.save('0', svgString);
  }

  onClickShare () {
    this.props.api.svg.share('0');
  }

  render() {
    console.log(this.state, this.props)
    if (this.props.hexagons) {
      drawHexCanvas(this.props);
    }
    return (
      React.createElement('div', { ref: "canvas", __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}
        , React.createElement('button', {
          onClick: this.onClickSave.bind(this),
          className: "pointer db f9 green2 bg-gray0-d ba pv3 ph4 b--green2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}, "Save Image"

        )
        , React.createElement('button', {
          onClick: this.onClickShare.bind(this),
          className: "pointer db f9 green2 bg-gray0-d ba pv3 ph4 b--green2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}, "Share Image"

        )
        , React.createElement('svg', { id: "canvas", width: width, height: height, __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
          , React.createElement('g', { className: "hexagon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}} )
          , React.createElement('g', { className: "mesh-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}} )
          , React.createElement('g', { className: "border-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}} )
        )
      )
    )
  }
}
