/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 *
 */
export interface ConnectionInterface {
  select(sql: string, bindings: any[], readConnection?: boolean): Promise<any>;

  insert(sql: string, bindings: any[]);

  /*Run an SQL statement and get the number of rows affected.*/
  affectingStatement(query: string, bindings: any[]);

  update(sql: string, bindings: any[]);

  delete(sql: string, bindings: any[]);

  statement(sql: string, bindings: any[]);

  getName();
}
