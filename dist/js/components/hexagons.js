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
import { createColorPicker } from "./lib/color";


export class Hexagons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      data: {}
    }
    this.onClickShare = this.onClickShare.bind(this);
  }

  componentDidMount() {
    // console.log("mounting");
    drawHexCanvas(this.props);
    initHexMesh();
    createColorPicker(width);
  }

  onClickSave () {
    const canvas = d3.select("#canvas");
    const svgString = simpleParseSVG(canvas.node(), 'mesh');
    console.log("LENGTH", svgString.length);
    const chunkSize = Math.round(svgString.length / 4);
    let last = false;
    let i = 0;
    let chunks = [];
    while (i < svgString.length) {
      this.props.api.svg.save(
        this.props.metadata.location,
        this.props.name,
        svgString.slice(i, chunkSize + i),
        ((i + chunkSize ) >= svgString.length) );
      i += chunkSize;
    }
  }

  onClickShare (chatPath) {
    // this.setState({
    //   error: false,
    //   success: true,
    //   awaiting: true
    // }, () => {
    //   props.api.canvas.create(
    //     state.canvasName,
    //     state.template,
    //     '~' + ship
    //   ).then(() => {
    //     this.setState({
    //       awaiting: false
    //     });
    //     props.history.push(`/~canvas/item/${state.canvasName}`);
    //   })
    // });
    this.props.api.svg.share(this.props.name, chatPath);
  }

  render() {
    d3.select(".hexagon").selectAll("path").remove();
    if (this.props.canvas) {
      // console.log("rendering", this.props.name);
      drawHexCanvas(this.props);
    }

    return (
      React.createElement('div', { className: "h-100 w-100 bg-gray0-d white-d flex flex-column"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
        , React.createElement('div', { className: "w-100 dn-m dn-l dn-xl inter pt1 pb6 f8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
          , React.createElement(Link, { to: "/~canvas/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}, "⟵ Canvas")
        )
        , React.createElement('div', { className: "absolute mw5" ,
             style: {right: "20px", top: "20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
          
          , React.createElement(ShareImage, { chats: this.props.chats, share: this.onClickShare, saved: this.props.metadata.saved, __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}})
          , React.createElement('button', {
            onClick: this.onClickSave.bind(this),
            className: "pointer ml6 f9 green2 bg-gray0-d ba pv3 ph4 b--green2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}, "Save Image"

          )
        )
        , React.createElement('div', { ref: "canvas", className: "w-100 pr0-l pr0-xl"  , style: {overflow: "hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
          , React.createElement('svg', { className: "db", id: "canvas", width: width, height: height, __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}
            , React.createElement('g', { className: "hexagon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}} )
            , React.createElement('g', { className: "mesh-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}} )
            , React.createElement('g', { className: "legend", __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}} )
          )
        )
      )
    )
  }
}
