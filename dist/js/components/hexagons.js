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
import { ShareImage } from "./lib/share-image";
import { SaveImage } from "./lib/save-image";
import { createColorPicker } from "./lib/color";


export class Hexagons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      data: {}
    }
    this.onClickSave = this.onClickSave.bind(this);
  }

  componentDidMount() {
    drawHexCanvas(this.props);
    initHexMesh();
    createColorPicker(width);
  }

  onClickSave (removeColor, removeMesh) {
    const canvas = d3.select("#canvas").node().cloneNode(true);
    if (removeColor) {
      d3.select(canvas).select(".legend").selectAll("*").remove();
    }
    if (removeMesh) {
      d3.select(canvas).select(".mesh-group").selectAll("*").remove();
    }
    const svgString = simpleParseSVG(d3.select(canvas).node(), 'mesh');
    const chunkSize = 700 * 2**9;
    let last = false;
    let i = 0;
    let chunks = [];
    while (i < svgString.length) {
      this.props.api.image.save(
        this.props.metadata.location,
        this.props.name,
        svgString.slice(i, chunkSize + i),
        ((i + chunkSize ) >= svgString.length),
        'svg');
      i += chunkSize;
    }
  }

  render() {
    const { props, state } = this;
    d3.select(".hexagon").selectAll("path").remove();
    if (this.props.canvas) {
      drawHexCanvas(this.props);
    }
    return (
      React.createElement('div', { className: "h-100 w-100 bg-gray0-d white-d flex flex-column"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
        , React.createElement('div', { className: "w-100 dn-m dn-l dn-xl inter pt1 pb6 f8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
          , React.createElement(Link, { to: "/~canvas/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}, "⟵ Canvas")
        )
        ,  (props.metadata.type !== 'mesh-welcome') ?
          React.createElement('div', { className: "absolute mw5" ,
               style: {right: "20px", top: "20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
            
            , React.createElement(ShareImage, { chats: props.chats, name: props.name, type: 'svg',
                        saved: props.metadata.saved, api: props.api, __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}})
            , React.createElement(SaveImage, { save: this.onClickSave, hasMesh: true, saved: props.metadata.saved, __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}} )
          ) : null
        
        , React.createElement('div', { ref: "canvas", className: "w-100 pr0-l pr0-xl"  , style: {overflow: "hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
          , React.createElement('svg', { className: "db", id: "canvas", width: width, height: height,
               viewBox: `0 0 ${width} ${height}`,
               perserveaspectratio: "xMinYMid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}
            , React.createElement('g', { className: "hexagon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}} )
            , React.createElement('g', { className: "mesh-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}} )
            , React.createElement('g', { className: "legend", __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}} )
          )
        )
      )
    )
  }
}
