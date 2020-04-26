const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/root.js";import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import _ from 'lodash';

import { Skeleton } from '/components/skeleton';
import { Hexagons } from "/components/hexagons"
import { NewScreen } from "/components/new"
import { JoinScreen } from "/components/join"

import { store } from '/store';
import { api } from '/api';


export class Root extends Component {
  constructor(props) {
    super(props);
    this.state = store.state;
    store.setStateHandler(this.setState.bind(this));
  }

  render() {
    const { props, state } = this;
    let canvasList = !!state.canvasList ? state.canvasList : {};
    return (
      React.createElement(BrowserRouter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}
        , React.createElement('div', { className: "absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}
          , React.createElement(Route, { exact: true, path: "/~canvas",
            render:  () => {
              return (
                React.createElement(Skeleton, {
                  activeDrawer: "canvas",
                  history: props.history,
                  canvasList: canvasList, __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}} 
                  , React.createElement(Hexagons, { api: api, canvas: {}, name: 'test', location: 'test', __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}} )
                  )
              )}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}} )
          , React.createElement(Route, { exact: true, path: "/~canvas/new",
              render:  (props) => {
                return (
                  React.createElement(Skeleton, {
                    history: props.history,
                    canvasList: canvasList,
                    activeDrawer: "rightPanel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}
                    , React.createElement(NewScreen, {
                      history: props.history,
                      api: api, __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
                    )
                  )
                );
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}} )
          , React.createElement(Route, { exact: true, path: "/~canvas/item/:name",
              render:  (props) => {
                const name =  props.match.params.name;
                if (canvasList) {
                  let canvas;
                  console.log(canvasList);
                  const data = !!canvasList[name] ? canvasList[name].data : {};
                  const canvasType = !!canvasList[name] ? canvasList[name].metadata.type : "";
                  const location = !!canvasList[name] ? canvasList[name].metadata.location : "";
                  switch (canvasType) {
                    case 'mesh':
                      canvas = React.createElement(Hexagons, { api: api, canvas: data, name: name, location: location, __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}} );
                      break;
                    case 'map': canvas = null; break;
                    default: canvas = null;
                  }
                  console.log(canvas);
                  return (
                    React.createElement(Skeleton, {
                      history: props.history,
                      canvasList: canvasList,
                      activeDrawer: "rightPanel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
                      , canvas
                    )
                  );
                }
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}} )
          , React.createElement(Route, { exact: true, path: "/~canvas/join/(~)?/:ship?/:canvas?",
            render: props => {
              let canvas =
                `/${props.match.params.ship}/${props.match.params.canvas}`;
              let sig = props.match.url.includes("/~/");
              if (sig) {
                canvas = '/~' + canvas;
              }

              return (
                React.createElement(Skeleton, {
                  history: props.history,
                  canvasList: canvasList,
                  activeDrawer: "rightPanel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}
                  , React.createElement(JoinScreen, {
                    api: api,
                    canvasList: canvasList,
                    autoJoin: canvas,
                    ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}} )
                )
              );
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}
          )
        )
      )
    )
  }
}
