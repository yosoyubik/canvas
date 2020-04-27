const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/root.js";import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import _ from 'lodash';

import { Skeleton } from '/components/skeleton';
import { Hexagons } from "/components/hexagons";
import { MapCanvas } from "/components/map";
import { NewScreen } from "/components/new";
import { JoinScreen } from "/components/join";

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
      React.createElement(BrowserRouter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}
        , React.createElement('div', { className: "absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}
          , React.createElement(Route, { exact: true, path: "/~canvas",
            render:  () => {
              return (
                React.createElement(Skeleton, {
                  activeDrawer: "canvas",
                  history: props.history,
                  canvasList: canvasList, __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}} 
                  , React.createElement(Hexagons, { api: api, canvas: {}, name: 'test', location: 'test', __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}} )
                  )
              )}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}} )
          , React.createElement(Route, { exact: true, path: "/~canvas/new",
              render:  (props) => {
                return (
                  React.createElement(Skeleton, {
                    history: props.history,
                    canvasList: canvasList,
                    activeDrawer: "rightPanel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}
                    , React.createElement(NewScreen, {
                      history: props.history,
                      api: api, __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}
                    )
                  )
                );
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}} )
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
                      canvas = React.createElement(Hexagons, { api: api, canvas: data, name: name, location: location, __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}} );
                      break;
                    case 'map':
                      canvas = React.createElement(MapCanvas, { api: api, canvas: data, name: name, location: location, __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}} );
                      break;
                    default: canvas = null;
                  }
                  console.log(canvas);
                  return (
                    React.createElement(Skeleton, {
                      history: props.history,
                      canvasList: canvasList,
                      activeDrawer: "rightPanel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
                      , canvas
                    )
                  );
                }
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}} )
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
                  activeDrawer: "rightPanel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
                  , React.createElement(JoinScreen, {
                    api: api,
                    canvasList: canvasList,
                    autoJoin: canvas,
                    ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}} )
                )
              );
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
          )
        )
      )
    )
  }
}
