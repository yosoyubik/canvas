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
import { ShareImage } from "./lib/share-image";
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
    // console.log("mounting");
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
      // console.log("rendering", this.props.name);
      drawHexCanvas(this.props);
    }

    return (
      <div className="h-100 w-100 pa3 pt4 bg-gray0-d white-d flex flex-column">
        <div className="w-100 dn-m dn-l dn-xl inter pt1 pb6 f8">
          <Link to="/~canvas/">{"⟵ Canvas"}</Link>
        </div>
        <div className="absolute mw5"
             style={{right: "20px", top: "20px"}}
          >
          <ShareImage chats={this.props.chats} api={this.props.api} />
          <button
            onClick={this.onClickSave.bind(this)}
            className="pointer ml6 f9 green2 bg-gray0-d ba pv3 ph4 b--green2">
            Save Image
          </button>
        </div>
        <div ref="canvas" className="w-100 mb4 pr6 pr0-l pr0-xl">
          <svg className="db" id="canvas" width={width} height={height}>
            <g className="hexagon" />
            <g className="mesh-group" />
            <g className="border-group" />
            <g className="legend" />
          </svg>
        </div>
      </div>
    )
  }
}
