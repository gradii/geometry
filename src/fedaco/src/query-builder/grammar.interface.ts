/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlVisitor } from '../query/sql-visitor';
import { Builder } from './builder';

export interface GrammarInterface {
  compileAggregateFragment(functionName, columns, visitor: SqlVisitor): string;

  compileJoinFragment(builder: Builder, visitor: SqlVisitor): string;

  compileNestedPredicate(builder: Builder, visitor: SqlVisitor): string;

  compileSelect(builder: Builder): string;

  compileInsert(builder: Builder, values: any): string;

  compileExists(builder: Builder): string;

  distinct(distinct: boolean | any[]): string;

  getOperators(): string[];

  quoteColumnName(columnName: string): string;

  quoteTableName(tableName: string): string;

  quoteSchemaName(tableName: string): string;

  setTablePrefix(prefix: string): void;
}
