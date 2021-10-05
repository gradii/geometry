/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Connection, FieldPacket } from 'mysql2';
import { QueryError } from 'mysql2/typings/mysql/lib/protocol/sequences/Query';
import { WrappedStmt } from '../wrapped-stmt';

export class MysqlWrappedStmt implements WrappedStmt {
  private _bindingValues: any[] = [];

  _lastInsertId: number;
  _affectRows: number;

  constructor(public driverConnection: Connection, public sqlStmt: string) {
  }

  bindValues(bindings: any[]) {
    this._bindingValues = bindings;
    return this;
  }

  async execute(bindings?: any[]) {
    // @ts-ignore
    console.log(`run this ${this.sqlStmt}`, bindings ?? this._bindingValues);

    return new Promise((ok, fail) => {
      this.driverConnection.execute(
        this.sqlStmt,
        bindings ?? this._bindingValues,
        (err: QueryError, result, fields: FieldPacket[]) => {
          if (err) {
            return fail(err);
          }
          ok(result);

          // _self._lastInsertId = this.lastID;
          this._affectRows = fields.length;
        }
      );
    });
  }

  async fetchAll(bindings?: any[]) {
    // @ts-ignore
    console.log(`run this ${this.sqlStmt}`, bindings ?? this._bindingValues);

    return new Promise((ok, fail) => {
      this.driverConnection.query(
        this.sqlStmt,
        bindings ?? this._bindingValues,
        (err: QueryError, result, fields: FieldPacket[]) => {
          if (err) {
            return fail(err);
          }
          ok(result);
        }
      );
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
  }

  bindValue(): this {
    return undefined;
  }
}
