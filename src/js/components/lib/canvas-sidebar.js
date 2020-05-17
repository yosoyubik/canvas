import React, { Component } from 'react';

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
    let selectedClass = (props.selected === "me") ? "bg-gray4 bg-gray1-d" : "bg-white bg-gray0-d";

    let rootIdentity = <Link
            key={1}
            to={"/~canvas/me"}>
            <div
              className={
                "w-100 pl4 pt1 pb1 f9 flex justify-start content-center " +
                selectedClass}>
              <Sigil
              ship={window.ship}
              color="#000000"
              classes="mix-blend-diff"
              size={32}/>
              <p
                className="f9 w-70 dib v-mid ml2 nowrap mono"
                style={{paddingTop: 6}}>
                {cite(window.ship)}
              </p>
            </div>
          </Link>

    let activeClasses = (this.props.activeDrawer === "canvas") ? "" : "dn-s";
    let canvasItems = null;
    if (!!props.canvasList) {
      canvasItems = Object.entries(props.canvasList).map((each, i) => {
        return (
          <CanvasTitle key={i} id={each[0]}
           private={each[1].metadata.private}
           location={each[1].metadata.location} />
        )
      });
    }

    return (
      <div className={"bn br-m br-xl b--gray4 b--gray2-d lh-copy h-100 " +
       "flex-shrink-0 pt3 pt0-m pt0-l pt0-xl relative overflow-y-hidden " +
        "dn-s flex-basis-100-s flex-basis-250-ns " + activeClasses}>

        <a className="db dn-m dn-l dn-xl f8 pb6 pl3" href="/">⟵ Landscape</a>
        <div className="overflow-auto pb8 h-100 pr3">
          <Link to="/~canvas/new" className="dib">
            <p className="green2 pa4 f9 dib">New Canvas</p>
          </Link>
          <Link to="/~canvas/join" className="dib">
            <p className="f9 gray2">Join Canvas</p>
          </Link>
          <div className="pt1">
            <h2 className="f8 pr4 pb2 pl4 gray2 c-default">Gallery</h2>
            { canvasItems }
          </div>
        </div>
      </div>
    );
  }
}
