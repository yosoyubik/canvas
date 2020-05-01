const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/lib/icons/icon-spinner.js";import React, { Component } from 'react';

export class Spinner extends Component {
  render() {

    let classes = !!this.props.classes ? this.props.classes : "";
    let text = !!this.props.text ? this.props.text : "";
    let awaiting = !!this.props.awaiting ? this.props.awaiting : false;

    if (awaiting) {
      return (
        React.createElement('div', { className: classes + " z-2 bg-white bg-gray0-d white-d", __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
          , React.createElement('img', { className: "invert-d spin-active v-mid"  ,
            src: "/~canvas/img/Spinner.png",
            width: 16,
            height: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}} )
          , React.createElement('p', { className: "dib f9 ml2 v-mid inter"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}, text)
        )
      );
    }
    else {
      return null;
    }
  }
}
