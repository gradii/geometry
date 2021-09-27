/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isNumber } from '@gradii/check-type';
import { ProcessorInterface } from './processor-interface';
import { QueryBuilder } from './query-builder';

export class Processor implements ProcessorInterface {
  processSelect(queryBuilder, results) {
    return results;
  }

  processInsertGetId(query: QueryBuilder, sql: string, values: any[], sequence: string | null = null) {
    query.getConnection().insert(sql, values);
    const id = query.getConnection().getPdo().lastInsertId(sequence);
    return isNumber(id) ? /*cast type int*/ id : id;
  }

  processColumnListing(results: any[]): string[] {
    return results;
  }
}
