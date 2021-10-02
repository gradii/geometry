import { SqliteWrappedStmt } from './sqlite/sqlite-wrapped-stmt';

/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export interface WrappedConnection {
  prepare(sql: string): Promise<SqliteWrappedStmt>;

  // run(sql: string, bindings: any[], callback: (err: string, rows: any[]) => void): Promise<void>;
  //
  // get(sql: string, bindings: any[], callback: (err: string, rows: any[]) => void): Promise<any[]>;

  lastInsertId(): Promise<number>;
}
