import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import * as d3 from "d3";
import { parseSVG, simpleParseSVG } from "./lib/compile-svg";

import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "@d3/draw-me";


export class DrawCanvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
    this.drawRef = React.createRef();
    this.lineWidthRef = React.createRef();
    this.strokeStyleRef = React.createRef();
  }

  componentDidMount() {
    const { drawRef, lineWidthRef, strokeStyleRef } = this;

    const runtime = new Runtime();
    runtime.module(notebook, name => {
      console.log(name);
      if (name === "viewof strokes") {
        return new Inspector(drawRef.current);
      }else if (name === "viewof lineWidth") {
        return new Inspector(lineWidthRef.current);
      }else if (name === "viewof strokeStyle") {
        return new Inspector(strokeStyleRef.current);
      }
    });
  }

  render() {
    const { props, state } = this;

    return (
      <div className="h-100 w-100 pa3 pt4 bg-gray0-d white-d flex flex-column">
        <div ref={this.lineWidthRef}></div>
        <div ref={this.strokeStyleRef}></div>
        <div ref={this.drawRef}></div>
      </div>
    )
  }
}
