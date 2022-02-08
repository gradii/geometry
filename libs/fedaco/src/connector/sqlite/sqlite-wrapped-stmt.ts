/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { WrappedStmt } from '../wrapped-stmt';

export class SqliteWrappedStmt implements WrappedStmt {
  private _bindingValues: any[] = [];

  _lastInsertId: number;
  _affectRows: number;

  constructor(public driverStmt: import('sqlite3').Statement) {
  }

  bindValues(bindings: any[]) {
    this._bindingValues = bindings;
    return this;
  }

  async execute(bindings?: any[]) {
    // @ts-ignore
    console.log(`run this ${this.driverStmt.sql}`, bindings ?? this._bindingValues);

    const _self = this;

    return new Promise((ok, fail) => {
      this.driverStmt
        .run(...(bindings ?? this._bindingValues),
          function (this: import('sqlite3').RunResult, err: string) {
            if (err) {
              return fail(err);
            }
            _self._lastInsertId = this.lastID;
            _self._affectRows   = this.changes;
          })
        .finalize((err) => {
          if (err) {
            return fail(err);
          }
          ok(true);
        });
    });
  }

  async fetchAll(bindings?: any[]) {
    // @ts-ignore
    console.log(`run this ${this.driverStmt.sql}`, bindings ?? this._bindingValues);

    return new Promise((ok, fail) => {
      this.driverStmt.all(bindings ?? this._bindingValues,
        function (this: import('sqlite3').RunResult, err: string, rows) {
          if (err) {
            return fail(err);
          }
          ok(rows);
        });
      this.driverStmt.finalize((err) => {
      });
    });
  }

  lastInsertId() {
    return this._lastInsertId;
  }

  affectCount() {
    // @ts-ignore
    // return this.driverStmt.changes;
    return this._affectRows;
  }

  close() {
    // todo improve me. don't know how to close stmt
    this.driverStmt.reset();
    this.driverStmt.finalize();
  }

  bindValue(): this {
    return undefined;
  }
}
