/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { WrappedStmt } from './wrapped-stmt';

/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export interface WrappedConnection {
  prepare(sql: string): Promise<WrappedStmt>;

  execute(sql: string, bindings?: any[]): Promise<any>;

  // run(sql: string, bindings: any[], callback: (err: string, rows: any[]) => void): Promise<void>;
  //
  // get(sql: string, bindings: any[], callback: (err: string, rows: any[]) => void): Promise<any[]>;

  lastInsertId(): Promise<number>;

}
