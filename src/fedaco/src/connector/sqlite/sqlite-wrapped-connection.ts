/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { Database, Statement } from 'sqlite3';
import { SqliteWrappedStmt } from './sqlite-wrapped-stmt';

export class SqliteWrappedConnection {

  constructor(public driver: Database) {

  }

  async prepare(sql: string): Promise<SqliteWrappedStmt> {
    return new Promise((resolve, reject) => {
      const stmt = this.driver.prepare(sql, (err: string) => {
        if (err) {
          return reject(err);
        }

        resolve(new SqliteWrappedStmt(stmt));
      });
    });
    // return new SqliteWrappedStmt(this.driver.prepare(sql));
  }

  run(sql: string, bindings: any[], callback: (err: string, rows: any[]) => void) {
    this.driver.run(sql, bindings, callback);
  }

  get(sql: string, bindings: any[], callback: (err: string, rows: any[]) => void) {
    this.driver.get(sql, bindings, callback);
  }

  async lastInsertId() {
    return new Promise((ok, fail) => {
      this.driver.get('select last_insert_rowid()', (err, data) => {
        if (err) {
          fail(err);
        } else {
          ok(data && data['last_insert_rowid()']);
        }
      });
    });
  }

}
