const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/new.js";import React, { Component } from 'react'

import { Route, Link } from 'react-router-dom';
import { sigil, stringRenderer } from 'urbit-sigil-js'
import { deSig } from '/lib/util';
import urbitOb from 'urbit-ob';

import { store } from '/store';

export class NewScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canvasName: '',
      canvasType: 'mesh'
    }

    this.canvasNameChange = this.canvasNameChange.bind(this);
    this.canvasTypeChange = this.canvasTypeChange.bind(this);
  }


  canvasNameChange(event) {
    const asciiSafe = event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    this.setState({
      canvasName: event.target.value
      // idName: asciiSafe + '-' + Math.floor(Math.random()*10000), // uniqueness
    });
  }

  canvasTypeChange(event) {
    // Validate existing types
    this.setState({
      canvasType: event.target.value
    });
  }

  onClickCreate() {
    const { props, state } = this;

    this.setState({
      error: false,
      success: true,
      awaiting: true
    }, () => {
      props.api.canvas.create(
        state.canvasName,
        state.canvasType,
        '~' + ship
      ).then(() => {
        this.setState({
          awaiting: false
        });
        // store.setState(prevState => ({
        //   canvasList: {
        //     ...prevState.canvasList,
        //     [state.canvasName]: {
        //       "data": {},
        //       "metadata": {
        //         "name": state.canvasName,
        //         "type": "mesh",
        //         "location": '~' + ship
        //       }
        //     }
        //   }
        // }));
        props.history.push(`/~canvas/item/${state.canvasName}`);
      })
    });
  }

  render() {
    console.log(this.state, this.props);
    let displayNameErrElem = (React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 75}} ));
    if (this.state.displayNameError) {
      displayNameErrElem = (
        React.createElement('span', { className: "f9 inter red2 ml3 mt1 db"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}, "Canvas must have a title."

        )
        );
    }

    return (
      React.createElement('div', { className: "h-100 w-100 mw6 pa3 pt4 overflow-x-hidden bg-gray0-d white-d flex flex-column"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
        , React.createElement('div', { className: "w-100 dn-m dn-l dn-xl inter pt1 pb6 f8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
          , React.createElement(Link, { to: "/~canvas/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}, "⟵ All Groups")
        )
        , React.createElement('div', { className: "w-100 mb4 pr6 pr0-l pr0-xl"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}

          , React.createElement('h2', { className: "f8 pt6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}, "Create Canvas" )

          , React.createElement('h2', { className: "f8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}, "Name")
          , React.createElement('textarea', {
            className: 
              "f7 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
              "focus-b--black focus-b--white-d"
            ,
            rows: 1,
            placeholder: "My awesome canvas"  ,
            style: {
              resize: "none",
              height: 48,
              paddingTop: 14
            },
            onChange: this.canvasNameChange, __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}
          )
          , displayNameErrElem

          , React.createElement('h2', { className: "f8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}, "Canvas Type" )
          , React.createElement('textarea', {
            className: 
              "f7 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
              "focus-b--black focus-b--white-d"
            ,
            rows: 1,
            placeholder: "mesh",
            style: {
              resize: "none",
              height: 48,
              paddingTop: 14
            },
            onChange: this.canvasTypeChange, __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
          )

          , React.createElement('button', {
            onClick: this.onClickCreate.bind(this),
            className: "f9 ba pa2 b--green2 green2 pointer bg-transparent"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}, "Create Canvas"

          )
          , React.createElement(Link, { to: "/~canvas", __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}
            , React.createElement('button', { className: "f9 ml3 ba pa2 b--black pointer bg-transparent b--white-d white-d"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}, "Cancel")
          )
        )
      )
    );
  }
}
