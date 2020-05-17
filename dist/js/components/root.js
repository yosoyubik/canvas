const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/root.js";import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import _ from 'lodash';

import { Skeleton } from '/components/skeleton';
import { Hexagons } from "/components/hexagons";
import { MapCanvas } from "/components/map";
import { DrawCanvas } from "/components/draw";
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
      React.createElement(BrowserRouter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}
        , React.createElement('div', { className: "absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
          , React.createElement(Route, { exact: true, path: "/~canvas",
            render:  () => {
              let canvas;
              if (state.welcome) {
                canvas = React.createElement(Hexagons, { api: api, canvas: state.welcome.data, chats: {},
                          name: 'welcome', metadata: state.welcome.metadata, __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}} );
              } else {
                canvas = null;
              }
              return (
                React.createElement(Skeleton, {
                  activeDrawer: "canvas",
                  history: props.history,
                  canvasList: canvasList, __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}} 
                  ,  canvas 
                  )
              )}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}} )
          , React.createElement(Route, { exact: true, path: "/~canvas/new",
              render:  (props) => {
                return (
                  React.createElement(Skeleton, {
                    history: props.history,
                    canvasList: canvasList,
                    activeDrawer: "rightPanel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
                    , React.createElement(NewScreen, {
                      history: props.history,
                      api: api, __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}
                    )
                  )
                );
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}} )
          , React.createElement(Route, { exact: true, path: "/~canvas/draw",
                render:  (props) => {
                  return (
                    React.createElement(Skeleton, {
                      history: props.history,
                      canvasList: canvasList,
                      activeDrawer: "rightPanel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
                      , React.createElement(DrawCanvas, {
                        history: props.history,
                        api: api, __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
                      )
                    )
                  );
              }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}} )
          , React.createElement(Route, { exact: true, path: "/~canvas/item/:name",
              render:  (props) => {
                const name =  props.match.params.name;
                if (canvasList) {
                  let canvas;
                  const data = !!canvasList[name] ? canvasList[name].data : {};
                  const chats = state.chats;
                  const canvasType = !!canvasList[name] ? canvasList[name].metadata.type : "";
                  const metadata = !!canvasList[name] ? canvasList[name].metadata : {};
                  const subtypes = canvasType.split("-");
                  switch (subtypes[0]) {
                    case 'mesh':
                      canvas = React.createElement(Hexagons, { api: api, canvas: data, chats: chats,
                                name: name, metadata: metadata, __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}} );
                      break;
                    case 'map':
                      canvas = React.createElement(MapCanvas, { api: api, canvas: data, chats: chats,
                                name: name, metadata: metadata, __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}} );
                      break;
                    case 'draw':
                      canvas = React.createElement(DrawCanvas, { api: api, canvas: data, chats: chats,
                                  name: name, metadata: metadata, __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}} );
                      break;
                    default: canvas = null;
                  }
                  return (
                    React.createElement(Skeleton, {
                      history: props.history,
                      canvasList: canvasList,
                      activeDrawer: "rightPanel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
                      , canvas
                    )
                  );
                }
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}} )
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
                  activeDrawer: "rightPanel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
                  , React.createElement(JoinScreen, {
                    api: api,
                    canvasList: canvasList,
                    autoJoin: canvas,
                    ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}} )
                )
              );
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}
          )
        )
      )
    )
  }
}
