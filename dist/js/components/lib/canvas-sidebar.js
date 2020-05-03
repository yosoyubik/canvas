const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/lib/canvas-sidebar.js";import React, { Component } from 'react';

import { api } from '/api';

import { Route, Link } from 'react-router-dom';
import { Sigil } from '/components/lib/icons/sigil';
import { cite } from '/lib/util';
import { CanvasTitle } from '/components/lib/canvas-title'


export class CanvasSidebar extends Component {
  // drawer to the left
  onClickLeave() {
    api.canvas.leave(each[1].metadata.location, each[0])
  }
  render() {
    const { props, state } = this;
    // console.log(props, state);
    let selectedClass = (props.selected === "me") ? "bg-gray4 bg-gray1-d" : "bg-white bg-gray0-d";

    let rootIdentity = React.createElement(Link, {
            key: 1,
            to: "/~canvas/me", __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
            , React.createElement('div', {
              className: 
                "w-100 pl4 pt1 pb1 f9 flex justify-start content-center " +
                selectedClass, __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
              , React.createElement(Sigil, {
              ship: window.ship,
              color: "#000000",
              classes: "mix-blend-diff",
              size: 32, __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}})
              , React.createElement('p', {
                className: "f9 w-70 dib v-mid ml2 nowrap mono"      ,
                style: {paddingTop: 6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}
                , cite(window.ship)
              )
            )
          )

    let activeClasses = (this.props.activeDrawer === "canvas") ? "" : "dn-s";
    let canvasItems = null;
    if (!!props.canvasList) {
      console.log(props.canvasList);
      canvasItems = Object.entries(props.canvasList).map((each, i) => {
        console.log(each, i);
        return (
          React.createElement(CanvasTitle, { key: i, id: each[0],
           private: each[1].metadata.private,
           location: each[1].metadata.location, __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}} )
        )
      });
    }

    return (
      React.createElement('div', { className: "bn br-m br-xl b--gray4 b--gray2-d lh-copy h-100 " +
       "flex-shrink-0 pt3 pt0-m pt0-l pt0-xl relative overflow-y-hidden " +
        "dn-s flex-basis-100-s flex-basis-250-ns " + activeClasses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}

        , React.createElement('a', { className: "db dn-m dn-l dn-xl f8 pb6 pl3"      , href: "/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}, "⟵ Landscape" )
        , React.createElement('div', { className: "overflow-auto pb8 h-100 pr3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
          , React.createElement(Link, { to: "/~canvas/new", className: "dib", __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
            , React.createElement('p', { className: "green2 pa4 f9 dib"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}, "New Canvas" )
          )
          , React.createElement(Link, { to: "/~canvas/join", className: "dib", __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
            , React.createElement('p', { className: "f9 gray2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}, "Join Canvas" )
          )
          , React.createElement('div', { className: "pt1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
            , React.createElement('h2', { className: "f8 pr4 pb2 pl4 gray2 c-default"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}, "Gallery")
            ,  canvasItems 
          )
        )
      )
    );
  }
}
