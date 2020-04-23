import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class UrbitApi {
  setAuthTokens(authTokens) {
    this.authTokens = authTokens;
    this.bindPaths = [];

    this.canvas = {
      paint: this.paint.bind(this),
      create: this.create.bind(this),
      load: this.loadCanvas.bind(this)
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
    this.action("canvas-view", "json", data);
  }

  saveSVG(name, svgData) {
    this.action("canvas-view", "canvas-view", {
      save: {
        'canvas-name': name,
        'svg': svgData,
      }
    });
  }

  shareSVG(name) {
    this.action("canvas-view", "canvas-view", {
      share: {
        'canvas-name': name
      }
    });
  }

  loadCanvas(name) {
    this.action("canvas-view", "canvas-view", {
      load: {
        'name': name
      }
    });
  }

  create(name, type, location) {
    console.log("creating");
    return this.action("canvas-view", "canvas-view", {
      create: {
        'name': name,
        'type': type,
        'location': location
      }
    });
  }

  paint(name, location, stroke) {
    console.log(name, stroke);
    this.action("canvas-view", "canvas-view", {
      paint: {
        'canvas-name': name,
        'stroke': stroke,
        'location': location
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
