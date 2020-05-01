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
      load: this.loadCanvas.bind(this),
      join: this.joinCanvas.bind(this),
      leave: this.leaveCanvas.bind(this)
    };

    this.image = {
      save: this.saveImage.bind(this),
      share: this.shareImage.bind(this)
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

  saveImage(location, name, svgData, last, type) {
    this.action("canvas-view", "canvas-view", {
      save: {
        'location': location,
        'canvas-name': name,
        'svg': svgData,
        'last': last,
        'type': type
      }
    });
  }

  shareImage(name, chatPath, type) {
    this.action("canvas-view", "canvas-view", {
      share: {
        'canvas-name': name,
        'chat-path': chatPath,
        'type': type
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

  joinCanvas(ship, name) {
    this.action("canvas-view", "canvas-view", {
      join: {
        'ship': ship,
        'canvas-name': name
      }
    });
  }

  leaveCanvas(ship, name) {
    this.action("canvas-view", "canvas-view", {
      leave: {
        'ship': ship,
        'canvas-name': name
      }
    });
  }

  create(name, type, location, subtype) {
    console.log("creating");
    let create = {};
    create[type] = {
      'canvas': null,
      'metadata': {
        'name': name,
        'type': subtype,
        'location': location,
        'saved': false
      }
    };
    return this.action("canvas-view", "canvas-view", {
      create: create
    });
  }

  paint(strokes) {
    // console.log(strokes);
    this.action("canvas-view", "canvas-view", {
      paint: strokes
    });
  }

  // paint(name, location, stroke) {
  //   console.log(name, stroke);
  //   this.action("canvas-view", "canvas-view", {
  //     paint: {
  //       'canvas-name': name,
  //       'stroke': stroke,
  //       'location': location
  //     }
  //   });
  // }

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
