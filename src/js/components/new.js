import React, { Component } from 'react'

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
      let submit = props.api.canvas.create(state.canvasName, state.canvasType);
      submit.then(() => {
        this.setState({
          awaiting: false
        });
        store.setState(prevState => ({
          canvasList: {
            ...prevState.canvasList,
            [state.canvasName]: {
              "type": state.canvasType,
              "data": {},
              "metadata": {"name": state.canvasName, "type": "mesh"}
            }
          }
        }));
        props.history.push(`/~canvas/item/${state.canvasName}`);
      })
    });
  }

  render() {
    console.log(this.state, this.props);
    let displayNameErrElem = (<span />);
    if (this.state.displayNameError) {
      displayNameErrElem = (
        <span className="f9 inter red2 ml3 mt1 db">
          Canvas must have a title.
        </span>
        );
    }

    return (
      <div className="h-100 w-100 mw6 pa3 pt4 overflow-x-hidden bg-gray0-d white-d flex flex-column">
        <div className="w-100 dn-m dn-l dn-xl inter pt1 pb6 f8">
          <Link to="/~canvas/">{"⟵ All Groups"}</Link>
        </div>
        <div className="w-100 mb4 pr6 pr0-l pr0-xl">

          <h2 className="f8 pt6">Create Canvas</h2>

          <h2 className="f8">Name</h2>
          <textarea
            className={
              "f7 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
              "focus-b--black focus-b--white-d"
            }
            rows={1}
            placeholder="My awesome canvas"
            style={{
              resize: "none",
              height: 48,
              paddingTop: 14
            }}
            onChange={this.canvasNameChange}
          />
          {displayNameErrElem}

          <h2 className="f8">Canvas Type</h2>
          <textarea
            className={
              "f7 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
              "focus-b--black focus-b--white-d"
            }
            rows={1}
            placeholder="mesh"
            style={{
              resize: "none",
              height: 48,
              paddingTop: 14
            }}
            onChange={this.canvasTypeChange}
          />

          <button
            onClick={this.onClickCreate.bind(this)}
            className="f9 ba pa2 b--green2 green2 pointer bg-transparent">
            Create Canvas
          </button>
          <Link to="/~canvas">
            <button className="f9 ml3 ba pa2 b--black pointer bg-transparent b--white-d white-d">Cancel</button>
          </Link>
        </div>
      </div>
    );
  }
}
