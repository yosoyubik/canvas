import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import * as d3 from "d3";
import { parseSVG, simpleParseSVG } from "./lib/compile-svg";

import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "@yosoyubik/draw-me";


export class DrawCanvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      forms: [],
      buffer: []
    }
    this.drawRef = React.createRef();
    this.lineWidthRef = React.createRef();
    this.strokeStyleRef = React.createRef();

    this.setStrokes = this.setStrokes.bind(this);
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

  componentDidMount() {
    const { drawRef, lineWidthRef, strokeStyleRef, props, state } = this;

    const runtime = new Runtime();
    const observer = runtime.module(notebook, name => {
      console.log(name);
      switch (name) {
        case "inputData":
          return { fulfilled(value) {
            console.log("inputData", value);
            state.forms = value;
          }}
        case "render":
          return { fulfilled(value) {
            console.log("render", value);
          }}
          // console.log(props.canvas);
          // if (props.canvas.length) {
          //   return props.canvas;
          // } else {
          //   return [];
          // }
        case "viewof exposedData":
          return new Inspector(drawRef.current);
        // TODO: implement live update
        case "exposedData":
          return { fulfilled(value) {
            console.log(value);
            state.buffer = value;
          }
            // if (value && value.length) setStrokes(value); }
          };
        case "viewof lineWidth":
          return new Inspector(lineWidthRef.current);
        case "viewof strokeStyle":
          return new Inspector(strokeStyleRef.current);
      }
    });

    if (props.canvas.length) {
      console.log(props.canvas);
      state.forms.value = props.canvas;
      state.buffer.value = props.canvas;
      (async () => {
        const forms = await observer.value("exposedData");
        const forms2 = await observer.value("inputData");
        console.log(forms, forms2);
        props.canvas.concat(forms)
        // console.log(props.canvas);
        observer.redefine("inputData", props.canvas);
        observer.redefine("exposedData", props.canvas);
        // Re-render
        // runtime.module(notebook, name => {
        //   console.log(name);
        //   if (name === "viewof exposedData") {
        //     return Inspector.into(drawRef.current);
        //   }
        // });
      })();
    }

    this.setState({observer: observer});
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
      const forms = await state.observer.value("exposedData");
      let formsClone = forms.slice();
      formsClone.forEach(function(stroke, i, array) {
        const lineWidth = stroke.lineWidth;
        const strokeStyle = stroke.strokeStyle;
        array[i] = { draw: {
          coords: stroke,
          lineWidth: lineWidth,
          strokeStyle: strokeStyle
        }}
      });

      // console.log(formsClone, props.location);
      props.api.canvas.paint({
        "canvas-name": props.name,
        "location": props.location,
        "strokes": formsClone
      })
      // .then(() => {
      //   console.log("saving canvas");
      //   // const svgString = simpleParseSVG(d3.select("canvas").node());
      //   // this.props.api.svg.save(this.props.name, svgString);
      // })
      ;
    })();
  }

  onClickShare () {
    this.props.api.svg.share(this.props.name);
  }

  render() {
    const { props, state } = this;

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
        <div ref={this.lineWidthRef}></div>
        <div ref={this.strokeStyleRef}></div>
        <div ref={this.drawRef}></div>
      </div>
    )
  }
}
