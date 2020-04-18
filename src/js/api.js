import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class UrbitApi {
  setAuthTokens(authTokens) {
    this.authTokens = authTokens;
    this.bindPaths = [];

    this.hexagons = {
      paint: this.paint.bind(this),
    };

    this.svg = {
      save: this.saveSVG.bind(this),
      share: this.shareSVG.bind(this)
    };
  }

  bind(path, method, ship = this.authTokens.ship, appl = "canvas", success, fail) {
    this.bindPaths = _.uniq([...this.bindPaths, path]);

    window.subscriptionId = window.urb.subscribe(ship, appl, path,
      (err) => {
        fail(err);
      },
      (event) => {
        success({
          data: event,
          from: {
            ship,
            path
          }
        });
      },
      (err) => {
        fail(err);
      });
  }

  canvas(data) {
    this.action("canvas", "json", data);
  }

  saveSVG(canvasID, svgData) {
    this.action("canvas", "canvas-action", {
      save: {
        'canvas-id': canvasID,
        'svg': svgData,
      }
    });
  }

  shareSVG(canvasID) {
    this.action("canvas", "canvas-action", {
      share: {
        'canvas-id': canvasID
      }
    });
  }

  paint(canvasID, id, filled) {
    console.log(canvasID, id, filled);
    this.action("canvas", "canvas-action", {
      paint: {
        'canvas-id': canvasID,
        'id': id,
        'filled': filled
      }
    });
  }

  action(appl, mark, data) {
    return new Promise((resolve, reject) => {
      window.urb.poke(ship, appl, mark, data,
        (json) => {
          resolve(json);
        },
        (err) => {
          reject(err);
        });
    });
  }
}
export let api = new UrbitApi();
window.api = api;
