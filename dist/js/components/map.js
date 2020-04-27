const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/map.js";import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import * as d3 from "d3";
import { parseSVG, simpleParseSVG } from "./lib/compile-svg";
import { initMapCanvas, drawMapCanvas, width, height } from "./lib/map-canvas";
import { createColorPicker } from "./lib/color";


export class MapCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }

  componentDidMount() {
    console.log("mounting");
    const { props, state, animationRef } = this;

    fetch("/~canvas/map/us.json")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        this.setState({
          data: json
        });
      });
  }

  onClickSave () {
    const svgString = simpleParseSVG(d3.select("#canvas").node());
    this.props.api.svg.save(this.props.name, svgString);
  }

  onClickShare () {
    this.props.api.svg.share(this.props.name);
  }

  render() {
    const { props, state, animationRef } = this;
    d3.select(".foreground").selectAll("path").remove();
    if (state.data) {
      initMapCanvas(state.data);
      drawMapCanvas(state.data, props);
      createColorPicker(width);
    }

    return (
      React.createElement('div', { className: "h-100 w-100 pa3 pt4 bg-gray0-d white-d flex flex-column"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
        , React.createElement('div', { className: "w-100 dn-m dn-l dn-xl inter pt1 pb6 f8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
          , React.createElement(Link, { to: "/~canvas/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}, "⟵ Canvas")
        )
        , React.createElement('div', { className: "absolute mw5" ,
             style: {right: "20px", top: "20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}} 
          , React.createElement('button', {
            onClick: this.onClickSave.bind(this),
            className: "pointer mr2 f9 green2 bg-gray0-d ba pv3 ph4 b--green2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}, "Save Image"

          )
          , React.createElement('button', {
            onClick: this.onClickShare.bind(this),
            className: "pointer f9 green2 bg-gray0-d ba pv3 ph4 b--green2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
            , "Share Image"

          )
        )
        , React.createElement('div', { ref: "canvas", className: "w-100 mb4 pr6 pr0-l pr0-xl"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
          , React.createElement('svg', { className: "db", id: "canvas", width:  width , height:  height , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
            , React.createElement('g', { className: "foreground", style: { cursor: "pointer", strokeOpacity: .5 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}})
            , React.createElement('g', { className: "background", __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}} )
            , React.createElement('g', { className: "legend", __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}} )
          )
        )
      )
    )
  }
}
