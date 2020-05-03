const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/join.js";import React, { Component } from 'react';
import classnames from 'classnames';
import { Route, Link } from 'react-router-dom';
import urbitOb from 'urbit-ob';
import { Spinner } from './lib/icons/icon-spinner';


export class JoinScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canvas: '/',
      error: false,
      awaiting: false,
    };

    this.canvasChange = this.canvasChange.bind(this);
  }

  componentDidMount() {
    const { props } = this;
    console.log("componentDidMount");
    if (props.autoJoin !== "/undefined/undefined" &&
    props.autoJoin !== "/~/undefined/undefined") {
      let canvas = props.autoJoin.split('/');
      let sig = props.autoJoin.includes("/~/");

      let ship = !!sig ? station[2] : station[1];
      canvas = canvas.join('/');
      if (
        canvas.length < 2 ||
        (!!sig && canvas.length < 3) ||
        !urbitOb.isValidPatp(ship)
      ) {
        this.setState({
          error: true,
        });
        return;
      }
      console.log("setting");
      this.setState({
        awaiting: true
      }, () => {
        console.log("awaiting");
        props.api.canvas.join(ship, canvasName).then(() => {
          this.setState({
            awaiting: false
          });
        });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { props, state } = this;
    // let canvas = state.canvas.split('/');
    // let canvasName = canvas[canvas.length - 1];
    // if (canvasName in props.canvasList) {
    //   props.history.push(`/~canvas/item/${canvasName}`);
    // }
  }

  onClickJoin() {
    const { props, state } = this;
    console.log("onClickJoin");
    let text = state.canvas;

    let canvas = text.split('/');
    let canvasName = canvas[canvas.length - 1];

    if (canvasName in props.canvasList ||
        text.length === 0) {
      this.setState({
        error: true,
      });
      return;
    }

    let sig = state.canvas.includes("~/");
    let ship = !!sig ? canvas[1] : canvas[0];

    canvas = canvas.join('/');

    if (
      (!sig && canvas.split('/').length < 2) ||
      (!!sig && canvas.split('/').length < 3) ||
      !urbitOb.isValidPatp(ship)
    ) {
      this.setState({
        error: true,
      });
      return;
    }
    console.log("setting");
    this.setState({
      awaiting: true
    }, () => {
      console.log("awaiting");
      props.api.canvas.join(ship, canvasName).then(() => {
        this.setState({
          awaiting: false
        });
        props.history.push(`/~canvas/item/${canvasName}`);
      });
    });
  }

  canvasChange(event) {
    this.setState({
      canvas: event.target.value
    });
  }

  render() {
    const { props, state } = this;

    let joinClasses = "db f9 green2 ba pa2 b--green2 bg-gray0-d pointer";
    if ((!state.canvas) || (state.canvas === "/")) {
      joinClasses = 'db f9 gray2 ba pa2 b--gray3 bg-gray0-d pointer';
    }

    let errElem = (React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 123}} ));
    if (state.error) {
      errElem = (
        React.createElement('span', { className: "f9 inter red2 db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}, "Canvas must have a valid name."

        )
      );
    }

    return (
      React.createElement('div', { className: `h-100 w-100 pa3 pt2 overflow-x-hidden flex flex-column
      bg-gray0-d white-d`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}
        , React.createElement('div', {
          className: "w-100 dn-m dn-l dn-xl inter pt1 pb6 f8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}
          , React.createElement(Link, { to: "/~canvas/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}, "⟵ All Chats")
        )
        , React.createElement('h2', { className: "mb3 f8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}, "Join Existing Canvas"  )
        , React.createElement('div', { className: "w-100", __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}
          , React.createElement('p', { className: "f8 lh-copy mt3 db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}, "Enter a "  , React.createElement('span', { className: "mono", __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}, "~ship/canvas-name"), " or "  , React.createElement('span', { className: "mono", __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}, "~/~ship/canvas-name"))
          , React.createElement('p', { className: "f9 gray2 mb4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}, "Canvas names use lowercase, hyphens, and slashes."      )
          , React.createElement('textarea', {
            ref:  e => { this.textarea = e; } ,
            className: "f7 mono ba bg-gray0-d white-d pa3 mb2 db " +
            "focus-b--black focus-b--white-d b--gray3 b--gray2-d",
            placeholder: "~zod/canvas",
            spellCheck: "false",
            rows: 1,
            onKeyPress: e => {
              if (e.key === "Enter") {
                this.onClickJoin();
              }
            },
            style: {
              resize: 'none',
            },
            onChange: this.canvasChange, __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}} )
          , errElem
          , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 160}} )
          , React.createElement('button', {
            onClick: this.onClickJoin.bind(this),
            className: joinClasses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
          , "Join Canvas" )
          , React.createElement(Spinner, { awaiting: this.state.awaiting, classes: "mt4", text: "Joining canvas..." , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}} )
        )
      )
    );
  }
}
