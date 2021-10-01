/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Statement } from 'sqlite3';

export class SqliteWrappedStmt {
  private _bindingValues: any[] = [];

  constructor(public driverStmt: Statement) {
  }

  bindValues(bindings: any[]) {
    this._bindingValues = bindings;
    return this;
  }

  async execute(bindings?: any[]) {
    // @ts-ignore
    console.log(`run this ${this.driverStmt.sql}`, bindings ?? this._bindingValues);
    this.driverStmt.run(...(bindings ?? this._bindingValues));
    this.driverStmt.finalize();

  }

  close() {
    // todo improve me. don't know how to close stmt
    this.driverStmt.reset();
    this.driverStmt.finalize();
  }
}
