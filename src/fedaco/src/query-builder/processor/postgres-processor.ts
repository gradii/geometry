/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isNumber, isObject } from '@gradii/check-type';
import { Processor } from '../processor';
import { QueryBuilder } from '../query-builder';

export class PostgresProcessor extends Processor {
  /*Process an "insert get ID" query.*/
  public processInsertGetId(query: QueryBuilder, sql: string, values: any[],
                            sequence: string | null = null) {
    const connection = query.getConnection();
    connection.recordsHaveBeenModified();
    let result   = connection.selectFromWriteConnection(sql, values)[0];
    let sequence = sequence || 'id';
    let id       = isObject(result) ? result[sequence] : result[sequence];
    return isNumber(id) ? /*cast type int*/ id : id;
  }

  /*Process the results of a column listing query.*/
  public processColumnListing(results: any[]) {
    return results.map(result => {
      return /*cast type object*/ result.column_name;
    });
  }
}
