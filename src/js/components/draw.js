import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import * as d3 from "d3";
import { parseSVG, simpleParseSVG } from "./lib/compile-svg";
import { width, height,
         initDrawCanvas, drawHexCanvas }
       from "./lib/draw-canvas";
import { ShareImage } from "./lib/share-image";
import { Spinner } from './lib/icons/icon-spinner';

// TODO: future work
// import { Runtime, Inspector } from "@observablehq/runtime";
// import notebook from "@yosoyubik/draw-me";


export class DrawCanvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      forms: [],
      line: "1",
      color: "#000000",
      awaiting: false
    }
    this.drawRef = React.createRef();
    this.lineWidthRef = React.createRef();
    this.strokeStyleRef = React.createRef();

    this.onChangeLine = this.onChangeLine.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
  }

  componentDidUpdate() {
    drawHexCanvas(this.props, this.state.line, this.state.color);
    if (this.state.awaiting && this.props.metadata.saved) {
      this.setState({
        awaiting: false
      });
    }
  }

  componentDidMount() {
    const { drawRef, lineWidthRef, strokeStyleRef, props, state } = this;
    // TODO: future work
    // Using observablehq makes the code cleaner encapsulating the
    // logic in a separate compoenent and interfering less with React's
    // DOM manipulation.
    //
    // const runtime = new Runtime();
    // const observer = runtime.module(notebook, name => {
    //   console.log(name);
    //   switch (name) {
    //     case "viewof exposedData":
    //       return new Inspector(drawRef.current);
    //     case "viewof lineWidth":
    //       return new Inspector(lineWidthRef.current);
    //     case "viewof strokeStyle":
    //       return new Inspector(strokeStyleRef.current);
    //   }
    // });
    //
    initDrawCanvas();
    drawHexCanvas(props, state.line, state.color);
  }

  onClickSave () {
    const { props, state } = this;
    this.setState({
      awaiting: true
    }, () => {
      const canvas = d3.select("canvas")
          .node().toDataURL("image/png").split("base64,")[1];
      const chunkSize = 700 * 2**9;
      let last = false;
      let i = 0;
      let chunks = [];
      while (i < canvas.length) {
        props.api.image.save(
          props.metadata.location,
          props.name,
          canvas.slice(i, chunkSize + i),
          ((i + chunkSize ) >= canvas.length),
          'png');
        i += chunkSize;
      }
    });
  }

  onChangeLine(event) {
    this.setState({ line: event.target.value });
  }

  onChangeColor(event) {
    this.setState({ color: event.target.value });
  }

  render() {
    const { props, state, onChangeLine, onChangeColor } = this;

    return (
      <div className="h-100 w-100 pa3 pt4 bg-gray0-d white-d flex flex-column">
        <div className="absolute mw5"
             style={{right: "20px", top: "20px"}}
          >
          <ShareImage chats={props.chats} name={props.name} type={'png'}
                      saved={props.metadata.saved} api={props.api}/>
          <div className="ml1 dib">
            <button
              onClick={this.onClickSave.bind(this)}
              className="pointer ml6 f9 green2 bg-gray0-d ba pv3 ph4 b--green2">
              Save Image
            </button>
            <Spinner awaiting={this.state.awaiting} classes="absolute ml6 mt4" text="Saving..." />
          </div>
        </div>
        <div ref={this.lineWidthRef}>
          <input id="line" type="range" min="0.5" max="20" value={this.state.line}
                 step="0.5" style={{width:"120px"}} onChange={onChangeLine} />
        </div>
        <div ref={this.strokeStyleRef}>
          <input id="color" type="color" style={{width:"120px"}} onChange={onChangeColor} />
        </div>
        <div ref={this.drawRef}>
          <canvas id="canvas" width={width} height={height}></canvas>
        </div>
      </div>
    )
  }
}
