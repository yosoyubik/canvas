import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

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
    this.state = {
      name: '',
      data: {}
    }
  }

  componentDidMount() {
    console.log("mounting");
    drawHexCanvas(this.props);
    initHexMesh();
  }

  onClickSave () {
    const svgString = simpleParseSVG(d3.select("#canvas").node());
    this.props.api.svg.save(this.props.name, svgString);
  }

  onClickShare () {
    this.props.api.svg.share(this.props.name);
  }

  render() {
    // const svgClass = "cf w-100 flex flex-column ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl f9 white-d";
    d3.select(".hexagon").selectAll("path").remove();
    if (this.props.canvas) {
      console.log("rendering", this.props.name);
      drawHexCanvas(this.props);
    }

    return (
      <div className="h-100 w-100 pa3 pt4 bg-gray0-d white-d flex flex-column">
        <div className="w-100 dn-m dn-l dn-xl inter pt1 pb6 f8">
          <Link to="/~canvas/">{"⟵ Canvas"}</Link>
        </div>
        <button
          onClick={this.onClickSave.bind(this)}
          className="pointer f9 green2 bg-gray0-d ba pv3 ph4 b--green2">
          Save Image
        </button>
        <button
          onClick={this.onClickShare.bind(this)}
          className="pointer f9 green2 bg-gray0-d ba pv3 ph4 b--green2">
          Share Image
        </button>
        <div ref="canvas" className="w-100 mb4 pr6 pr0-l pr0-xl">
          <svg className="db" id="canvas" width={width} height={height}>
            <g className="hexagon" />
            <g className="mesh-group" />
            <g className="border-group" />
          </svg>
        </div>
      </div>
    )
  }
}
