import React, { Component } from 'react';

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
      <div ref="canvas">
        <svg width={width} height={height}>
          <g className="hexagon" />
          <g className="mesh-group" />
          <g className="border-group" />
        </svg>
      </div>
    )
  }
}
