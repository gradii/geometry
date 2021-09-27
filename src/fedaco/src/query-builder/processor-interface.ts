import { QueryBuilder } from './query-builder';

/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export interface ProcessorInterface {
  processSelect(queryBuilder, results);

  processInsertGetId(query: QueryBuilder, sql: string, values: any[], sequence?: string): number;

  processInsertGetId(sql: string, bindings: any[], sequence?: string): number;
}
