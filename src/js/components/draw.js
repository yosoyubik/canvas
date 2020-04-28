import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import * as d3 from "d3";
import { parseSVG, simpleParseSVG } from "./lib/compile-svg";

// import { Runtime, Inspector } from "@observablehq/runtime";
// import notebook from "@yosoyubik/draw-me";

import { width, height, initDrawCanvas, drawHexCanvas } from "./lib/draw-canvas";


export class DrawCanvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      forms: [],
      line: "1",
      color: "#000000"
    }
    this.drawRef = React.createRef();
    this.lineWidthRef = React.createRef();
    this.strokeStyleRef = React.createRef();

    this.setStrokes = this.setStrokes.bind(this);
    this.onChangeLine = this.onChangeLine.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);
  }

  componentDidUpdate() {
    console.log("componentDidUpdate", this.state.line, this.state.color);
    drawHexCanvas(this.props, this.state.line, this.state.color);
  }

  componentDidMount() {
    const { drawRef, lineWidthRef, strokeStyleRef, props, state } = this;

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
    console.log(state.line, state.color);
    drawHexCanvas(props, state.line, state.color);
    if (props.canvas.length) {

    //   (async () => {
    //     const forms = await observer.value("inputData");
    //     props.canvas.concat(forms)
    //     // console.log(props.canvas);
    //     observer.redefine("inputData", props.canvas);
    //     observer.redefine("exposedData", props.canvas);
    //     // Re-render
    //     // runtime.module(notebook, name => {
    //     //   console.log(name);
    //     //   if (name === "viewof exposedData") {
    //     //     return Inspector.into(drawRef.current);
    //     //   }
    //     // });
    //   })();
    }

    // this.setState({observer: observer});
  }

  // TODO: setStrokes doesn't know when the mouse stops moving
  setStrokes(updatedForms) {
    const { props, state, setState } = this;
    if (updatedForms.length < state.forms.length) {
      const newForm = updatedForms[updatedForms.length - 1];
      setState({ buffer: [newForm] });
    } else {
      setState(state => {
        const forms = [...state.forms, newForm];
        return { forms, buffer: [newForm] };
      }, () => {
        props.canvas.push(newForm);
        props.api.canvas.paint({
          "canvas-name": props.name,
          "location": props.location,
          "strokes": [newForm]
        });
      });
    }
  }

  onClickSave () {
    const { props, state } = this;
    (async () => {
      // const forms = await state.observer.value("exposedData");
      // let formsClone = forms.slice();
      // formsClone.forEach(function(stroke, i, array) {
      //   const lineWidth = stroke.lineWidth;
      //   const strokeStyle = stroke.strokeStyle;
      //   array[i] = { draw: {
      //     coords: stroke,
      //     lineWidth: lineWidth,
      //     strokeStyle: strokeStyle
      //   }}
      // });
      //
      // // console.log(formsClone, props.location);
      // props.api.canvas.paint({
      //   "canvas-name": props.name,
      //   "location": props.location,
      //   "strokes": formsClone
      // })
      // .then(() => {
      //   console.log("saving canvas");
      //   // const svgString = simpleParseSVG(d3.select("canvas").node());
      //   // this.props.api.svg.save(this.props.name, svgString);
      // })
      ;
    })();
  }

  onChangeLine(event) {
    this.setState({ line: event.target.value });
  }

  onChangeColor(event) {
    this.setState({ color: event.target.value });
  }

  onClickShare () {
    this.props.api.svg.share(this.props.name);
  }

  render() {
    const { props, state, onChangeLine, onChangeColor } = this;

    return (
      <div className="h-100 w-100 pa3 pt4 bg-gray0-d white-d flex flex-column">
        <div className="absolute mw5"
             style={{right: "20px", top: "20px"}} >
          <button
            onClick={this.onClickSave.bind(this)}
            className="pointer mr2 f9 green2 bg-gray0-d ba pv3 ph4 b--green2">
            Save Image
          </button>
          <button
            onClick={this.onClickShare.bind(this)}
            className="pointer f9 green2 bg-gray0-d ba pv3 ph4 b--green2"
            >
            Share Image
          </button>
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
