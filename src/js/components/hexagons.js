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
      <div className="h-100 w-100 bg-gray0-d white-d flex flex-column">
        <div className="w-100 dn-m dn-l dn-xl inter pt1 pb6 f8">
          <Link to="/~canvas/">{"⟵ Canvas"}</Link>
        </div>
        <div className="absolute mw5"
             style={{right: "20px", top: "20px"}}
          >
          <ShareImage chats={this.props.chats} share={this.onClickShare} saved={this.props.metadata.saved}/>
          <button
            onClick={this.onClickSave.bind(this)}
            className="pointer ml6 f9 green2 bg-gray0-d ba pv3 ph4 b--green2">
            Save Image
          </button>
        </div>
        <div ref="canvas" className="w-100 pr0-l pr0-xl" style={{overflow: "hidden"}}>
          <svg className="db" id="canvas" width={width} height={height}>
            <g className="hexagon" />
            <g className="mesh-group" />
            <g className="legend" />
          </svg>
        </div>
      </div>
    )
  }
}
