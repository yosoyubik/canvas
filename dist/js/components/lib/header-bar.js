const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/lib/header-bar.js";import React, { Component } from "react";
import { cite } from '../../lib/util';
import { IconHome } from "/components/lib/icons/icon-home";
import { Sigil } from "/components/lib/icons/sigil";

export class HeaderBar extends Component {
  render() {

    let title = document.title === "Home" ? "" : document.title;

    return (
      React.createElement('div', {
        className: 
          "bg-white bg-gray0-d w-100 justify-between relative tc pt3 db"
        ,
        style: { height: 40 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
        , React.createElement('a', {
          className: "dib gray2 f9 inter absolute left-0"     ,
          href: "/",
          style: { top: 14 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
          , React.createElement(IconHome, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 21}})
          , React.createElement('span', {
            className: "ml2 white-d v-top lh-title"   ,
            style: { paddingTop: 3 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, "Home"

          )
        )
        , React.createElement('span', {
          className: "f9 white-d inter dib"   ,
          style: {
            verticalAlign: "text-top",
            paddingTop: 3
          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
          , title
        )
        , React.createElement('div', { className: "absolute right-0 lh-copy"  , style: { top: 8 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}
          , React.createElement(Sigil, {
            ship: "~" + window.ship,
            classes: "v-mid mix-blend-diff" ,
            size: 16,
            color: "#000000", __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}
          )
          , React.createElement('span', { className: "mono white-d f9 ml2 c-default"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 43}}, cite(window.ship))
        )
      )
    );
  }
}
