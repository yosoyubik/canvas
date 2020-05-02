import React, { Component } from 'react';
import classnames from 'classnames';

import { HeaderBar } from '/components/lib/header-bar';
import { CanvasSidebar } from '/components/lib/canvas-sidebar';

export class Skeleton extends Component {
  render() {
    const { props } = this;
    let rightPanelClasses =
      props.activeDrawer === "keybase" ? "dn flex-m flex-l flex-xl" : "flex";

    return (
      <div className="h-100 w-100 ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl">
        <HeaderBar />
        <div className="cf w-100 h-100 flex ba-m ba-l ba-xl b--gray2 br1">
          <CanvasSidebar
            activeDrawer={props.activeDrawer}
            history={props.history}
            canvasList={props.canvasList}
            selected={this.props.selected}
          />
            <div className="h-100 w-100 flex-auto relative" style={{
              flexGrow: 1,
            }}>
            {props.children}
          </div>
        </div>
      </div>
    );
  }
}
