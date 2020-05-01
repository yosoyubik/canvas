const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/draw.js";import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import * as d3 from "d3";
import { parseSVG, simpleParseSVG } from "./lib/compile-svg";
import { width, height,
         initDrawCanvas, drawHexCanvas }
       from "./lib/draw-canvas";
import { ShareImage } from "./lib/share-image";
// import { Runtime, Inspector } from "@observablehq/runtime";
// import notebook from "@yosoyubik/draw-me";


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
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickShare = this.onClickShare.bind(this);
  }

  componentDidUpdate() {
    console.log("componentDidUpdate", this.state.line, this.state.color);
    drawHexCanvas(this.props, this.state.line, this.state.color);
  }

  componentDidMount() {
    const { drawRef, lineWidthRef, strokeStyleRef, props, state } = this;
    // TODO: Using observablehq makes the code cleaner encapsulating the
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
    const canvas = d3.select("canvas").node().toDataURL("image/png");
    // canvas.replace('data:image/png;base64,', '');
    // .split("base64,")[1]
    props.api.image.save(
      props.metadata.location,
      props.name,
      canvas.split("base64,")[1],
      true,
      'png');
  }

  onChangeLine(event) {
    this.setState({ line: event.target.value });
  }

  onChangeColor(event) {
    this.setState({ color: event.target.value });
  }

  onClickShare (chatPath) {
    this.props.api.image.share(this.props.name, chatPath, 'png');
  }

  render() {
    const { props, state, onChangeLine, onChangeColor } = this;

    return (
      React.createElement('div', { className: "h-100 w-100 pa3 pt4 bg-gray0-d white-d flex flex-column"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}
        , React.createElement('div', { className: "absolute mw5" ,
             style: {right: "20px", top: "20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}
          
          , React.createElement(ShareImage, { chats: this.props.chats, share: this.onClickShare, saved: this.props.metadata.saved, __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}})
          , React.createElement('button', {
            onClick: this.onClickSave.bind(this),
            className: "pointer ml6 f9 green2 bg-gray0-d ba pv3 ph4 b--green2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}, "Save Image"

          )
        )
        , React.createElement('div', { ref: this.lineWidthRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
          , React.createElement('input', { id: "line", type: "range", min: "0.5", max: "20", value: this.state.line,
                 step: "0.5", style: {width:"120px"}, onChange: onChangeLine, __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}} )
        )
        , React.createElement('div', { ref: this.strokeStyleRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}
          , React.createElement('input', { id: "color", type: "color", style: {width:"120px"}, onChange: onChangeColor, __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}} )
        )
        , React.createElement('div', { ref: this.drawRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
          , React.createElement('canvas', { id: "canvas", width: width, height: height, __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}})
        )
      )
    )
  }
}
