/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { Connection as MysqlConnection, RowDataPacket } from 'mysql2';
import { WrappedConnection } from '../wrapped-connection';
import { MysqlWrappedStmt } from './mysql-wrapped-stmt';

export class MysqlWrappedConnection implements WrappedConnection {

  constructor(public driver: MysqlConnection) {

  }

  async prepare(sql: string): Promise<MysqlWrappedStmt> {
    return Promise.resolve(new MysqlWrappedStmt(this.driver, sql));
  }

  async exec(sql: string) {
    return new Promise((ok, fail) => {
      this.driver.query(sql, (err, result, fields) => {
        if (err) {
          return fail(err);
        }
        ok(result);
      });
    });
  }

  async execute(sql: string, bindings?: any[]): Promise<any> {
    return new Promise((ok, fail) => {
      this.driver.execute(sql, bindings, (err, result, fields) => {
        if (err) {
          return fail(err);
        }
        ok(result);
      });
    });
  }

  // run(sql: string, bindings: any[], callback: (err: string, rows: any[]) => void) {
  //   this.driver.run(sql, bindings, callback);
  // }
  //
  // async get(sql: string, bindings: any[], callback: (err: string, rows: any[]) => void) {
  //   // return this.driver.get(sql, bindings, callback);
  // }

  async lastInsertId(): Promise<number> {
    return new Promise((ok, fail) => {
      this.driver.execute('select LAST_INSERT_ID()', (err, data: RowDataPacket[]) => {
        if (err) {
          fail(err);
        } else {
          ok(data && data.length === 1 && data[0]['`LAST_INSERT_ID()`']);
        }
      });
    });
  }

}
