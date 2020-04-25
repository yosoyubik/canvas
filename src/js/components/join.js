import React, { Component } from 'react';
import classnames from 'classnames';
import { Route, Link } from 'react-router-dom';
import urbitOb from 'urbit-ob';


export class JoinScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canvas: '/',
      error: false
    };

    this.canvasChange = this.canvasChange.bind(this);
  }

  componentDidMount() {
    const { props } = this;
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
      this.setState({
        canvas
      }, () => {
        props.api.canvas.join(ship, canvas, true);
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { props, state } = this;
    console.log("ccomponentDidUpdate");
    let canvas = state.canvas.split('/');
    console.log(canvas);
    let canvasName = canvas[canvas.length - 1];
    console.log(canvasName, props.canvasList);
    if (canvasName in props.canvasList) {
      props.history.push(`/~canvas/item/${canvasName}`);
    }
  }

  onClickJoin() {
    const { props, state } = this;

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
    console.log(canvas);
    props.api.canvas.join(ship, canvasName);
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

    let errElem = (<span />);
    if (state.error) {
      errElem = (
        <span className="f9 inter red2 db">
          Canvas must have a valid name.
        </span>
      );
    }

    return (
      <div className={`h-100 w-100 pa3 pt2 overflow-x-hidden flex flex-column
      bg-gray0-d white-d`}>
        <div
          className="w-100 dn-m dn-l dn-xl inter pt1 pb6 f8">
          <Link to="/~canvas/">{"⟵ All Chats"}</Link>
        </div>
        <h2 className="mb3 f8">Join Existing Canvas</h2>
        <div className="w-100">
          <p className="f8 lh-copy mt3 db">Enter a <span className="mono">~ship/canvas-name</span> or <span className="mono">~/~ship/canvas-name</span></p>
          <p className="f9 gray2 mb4">Canvas names use lowercase, hyphens, and slashes.</p>
          <textarea
            ref={ e => { this.textarea = e; } }
            className={"f7 mono ba bg-gray0-d white-d pa3 mb2 db " +
            "focus-b--black focus-b--white-d b--gray3 b--gray2-d"}
            placeholder="~zod/canvas"
            spellCheck="false"
            rows={1}
            onKeyPress={e => {
              if (e.key === "Enter") {
                this.onClickJoin();
              }
            }}
            style={{
              resize: 'none',
            }}
            onChange={this.canvasChange} />
          {errElem}
          <br />
          <button
            onClick={this.onClickJoin.bind(this)}
            className={joinClasses}
          >Join Canvas</button>
        </div>
      </div>
    );
  }
}
