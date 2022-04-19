import _ from 'lodash';
import type { Patp, Path } from '../../types/noun';

export default class Api {
  bindPaths: Path[] = [];
  constructor(public ship: Patp, public channel: any) {}

  unsubscribe(id: number) {
    this.channel.unsubscribe(id);
  }

  subscribe(
    path: Path,
    method,
    ship = this.ship,
    app: string,
    success,
    fail,
    quit
  ) {
    this.bindPaths = _.uniq([...this.bindPaths, path]);

    return this.channel.subscribe(
      this.ship,
      app,
      path,
      err => {
        fail(err);
      },
      event => {
        success({
          data: event,
          from: {
            ship,
            path
          }
        });
      },
      qui => {
        quit(qui);
      }
    );
  }

  action(
    appl: string,
    mark: string,
    data: any,
    ship = (window as any).ship
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.channel.poke(
        ship,
        appl,
        mark,
        data,
        json => {
          resolve(json);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  scry<T>(app: string, path: Path): Promise<T> {
    return fetch(`/~/scry/${app}${path}.json`).then(
      r => r.json() as Promise<T>
    );
  }

  async spider<T>(
    desk: string,
    inputMark: string,
    outputMark: string,
    threadName: string,
    body: any
  ): Promise<T> {
    const res = await fetch(
      `/spider/${desk}/${inputMark}/${threadName}/${outputMark}.json`,
      {
        method: 'POST',
        body: JSON.stringify(body)
      }
    );

    return res.json();
  }
}
