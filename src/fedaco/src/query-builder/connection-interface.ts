/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 *
 */
export interface ConnectionInterface {
  select(sql: string, bindings: any[], readConnection?: boolean): Promise<any> | any;

  insert(sql: string, bindings: any[]): Promise<any> | boolean;

  /*Run an SQL statement and get the number of rows affected.*/
  affectingStatement(query: string, bindings: any[]): Promise<any> | any;

  update(sql: string, bindings: any[]): Promise<any> | any;

  delete(sql: string, bindings: any[]): Promise<any> | any;

  statement(sql: string, bindings: any[]): Promise<any> | any;

  getName(): string;
}
