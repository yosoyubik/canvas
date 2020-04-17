import React, { Component } from 'react';

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
    console.log(svgString);
    this.props.api.svg.save('0', svgString);
  }

  render() {
    console.log(this.state, this.props)
    if (this.props.hexagons) {
      drawHexCanvas(this.props);
    }
    return (
      <div ref="canvas">
        <button
          onClick={this.onClickSave.bind(this)}
          className="pointer db f9 green2 bg-gray0-d ba pv3 ph4 b--green2">
          Save Image
        </button>
        <svg id="canvas" width={width} height={height}>
          <g className="hexagon" />
          <g className="mesh-group" />
          <g className="border-group" />
        </svg>
      </div>
    )
  }
}
