import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import * as d3 from "d3";
import { parseSVG, simpleParseSVG } from "./lib/compile-svg";
import { initMapCanvas, drawMapCanvas, width, height } from "./lib/map-canvas";
import { createColorPicker } from "./lib/color";
import { ShareImage } from "./lib/share-image";


export class MapCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }

    this.onClickShare = this.onClickShare.bind(this);
  }

  componentDidMount() {
    // console.log("mounting");
    const { props, state, animationRef } = this;
    const maps = props.metadata.type.split("-");
    if (maps.length > 1) {
      fetch("/~canvas/map/" + maps[1] + ".json")
        .then((response) => response.json())
        .then((json) => {
          // console.log(json);
          this.setState({
            data: json
          });
        });
      }
  }

  onClickSave () {
    const canvas = d3.select("#canvas").clone(true).remove('.legend');
    const type = this.props.metadata.type.split("-");
    const svgString = simpleParseSVG(canvas.node(), type[0]);
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
    const { props, state, animationRef } = this;
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
    props.api.svg.share(this.props.name, chatPath);
  }

  render() {
    const { props, state, animationRef } = this;
    d3.select(".foreground").selectAll("path").remove();
    if (state.data) {
      initMapCanvas(state.data, props.metadata);
      drawMapCanvas(state.data, props);
      createColorPicker(width);
    }

    return (
      <div className="h-100 w-100 pa3 pt4 bg-gray0-d white-d flex flex-column">
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
        <div ref="canvas" className="w-100 mb4 pr6 pr0-l pr0-xl">
          <svg className="db" id="canvas" width={ width } height={ height }>
            <g transform="translate(25,25)" className="foreground" style={{ cursor: "pointer", strokeOpacity: .5 }}/>
            <g transform="translate(25,25)" className="background" />
            <g className="legend" />
          </svg>
        </div>
      </div>
    )
  }
}
