const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/lib/icons/sigil.js";import React, { Component } from 'react';
import { sigil, reactRenderer } from 'urbit-sigil-js';


export class Sigil extends Component {
  render() {
    const { props } = this;

    let classes = props.classes || "";

    if (props.ship.length > 14) {
      return (
        React.createElement('div', {
          className: "bg-black dib " + classes,
          style: { width: props.size, height: props.size }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
        )
      );
    } else {
      return (
        React.createElement('div', { className: "dib " + classes, style: { flexBasis: 32, backgroundColor: props.color }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
          , sigil({
            patp: props.ship,
            renderer: reactRenderer,
            size: props.size,
            colors: [props.color, "white"]
          })
        )
      );
    }
  }
}

