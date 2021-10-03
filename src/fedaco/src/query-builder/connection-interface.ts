/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SchemaBuilder } from '../schema/schema-builder';
import { QueryBuilder } from './query-builder';

/**
 *
 */
export interface ConnectionInterface {
  select(sql: string, bindings: any[], readConnection?: boolean): Promise<any> | any;

  insert(sql: string, bindings: any[]): Promise<boolean>;

  // todo implement me
  // insertGetId(sql: string, bindings: any[]): Promise<any> | boolean;

  /*Run an SQL statement and get the number of rows affected.*/
  affectingStatement(query: string, bindings: any[]): Promise<any> | any;

  update(sql: string, bindings: any[]): Promise<any> | any;

  delete(sql: string, bindings: any[]): Promise<any> | any;

  statement(sql: string, bindings: any[]): Promise<any> | any;

  getName(): string;

  getSchemaBuilder(): SchemaBuilder;

  table(table: Function | QueryBuilder | string, as?: string): QueryBuilder;

  getPdo(): any;

  recordsHaveBeenModified(): any;

  selectFromWriteConnection(sql: string, values: any): any;

  getConfig(name: string): any;
}
