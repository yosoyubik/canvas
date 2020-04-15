const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/root.js";import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import _ from 'lodash';
import { HeaderBar } from "./lib/header-bar"
import { Hexagons } from "./hexagons"


export class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      React.createElement(BrowserRouter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
        , React.createElement('div', { className: "absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
        , React.createElement(HeaderBar, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 18}})
        , React.createElement(Route, { exact: true, path: "/~canvas", render:  () => {
          return (
            React.createElement('div', { className: "cf w-100 flex flex-column pa4 ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl f9 white-d"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
              , React.createElement('h1', { className: "mt0 f8 fw4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, "canvas")
              , React.createElement('p', { className: "lh-copy measure pt3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}, "Welcome to your Landscape application."    )
              , React.createElement('p', { className: "lh-copy measure pt3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}, "To get started, edit "    , React.createElement('code', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}, "src/index.js"), " or "  , React.createElement('code', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}, "canvas.hoon"), " and "  , React.createElement('code', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}, "|commit %home" ), " on your Urbit ship to see your changes."        )
              , React.createElement('a', { className: "black no-underline db f8 pt3"    , href: "https://urbit.org/docs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, "-> Read the docs"   )
              , React.createElement(Hexagons, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} )
            )
          )}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}
        )
        )
      )
    )
  }
}
