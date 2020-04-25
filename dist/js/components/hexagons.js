const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/hexagons.js";import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import * as d3 from "d3";
import { parseSVG, simpleParseSVG } from "./lib/compile-svg";
import { initHexMesh,
         drawHexCanvas,
         width,
         height,
         radius }
from "./lib/hex-canvas";
import { createColorPicker } from "./lib/color";


export class Hexagons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      data: {}
    }
  }

  componentDidMount() {
    console.log("mounting");
    drawHexCanvas(this.props);
    initHexMesh();
    createColorPicker(width);
  }

  onClickSave () {
    const svgString = simpleParseSVG(d3.select("#canvas").node());
    this.props.api.svg.save(this.props.name, svgString);
  }

  onClickShare () {
    this.props.api.svg.share(this.props.name);
  }

  render() {
    d3.select(".hexagon").selectAll("path").remove();
    if (this.props.canvas) {
      console.log("rendering", this.props.name);
      drawHexCanvas(this.props);
    }

    return (
      React.createElement('div', { className: "h-100 w-100 pa3 pt4 bg-gray0-d white-d flex flex-column"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}
        , React.createElement('div', { className: "w-100 dn-m dn-l dn-xl inter pt1 pb6 f8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
          , React.createElement(Link, { to: "/~canvas/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}, "⟵ Canvas")
        )
        , React.createElement('button', {
          onClick: this.onClickSave.bind(this),
          className: "pointer f9 green2 bg-gray0-d ba pv3 ph4 b--green2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}, "Save Image"

        )
        , React.createElement('button', {
          onClick: this.onClickShare.bind(this),
          className: "pointer f9 green2 bg-gray0-d ba pv3 ph4 b--green2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}, "Share Image"

        )
        , React.createElement('div', { ref: "canvas", className: "w-100 mb4 pr6 pr0-l pr0-xl"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
          , React.createElement('svg', { className: "db", id: "canvas", width: width, height: height, __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
            , React.createElement('g', { className: "hexagon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}} )
            , React.createElement('g', { className: "mesh-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}} )
            , React.createElement('g', { className: "border-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}} )
            , React.createElement('g', { className: "legend", __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}} )
          )
        )
      )
    )
  }
}
