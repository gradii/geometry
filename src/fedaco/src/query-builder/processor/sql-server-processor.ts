/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isNumber } from '@gradii/check-type';
import { Connection } from '../../connection';
import { Processor } from '../processor';
import { QueryBuilder } from '../query-builder';

export class SqlServerProcessor extends Processor {
  /*Process an "insert get ID" query.*/
  public processInsertGetId(query: QueryBuilder, sql: string, values: any[],
                            sequence: string | null = null) {
    const connection = query.getConnection();
    connection.insert(sql, values);
    let id;
    if (connection.getConfig('odbc') === true) {
      id = this.processInsertGetIdForOdbc(connection);
    } else {
      id = connection.getPdo().lastInsertId();
    }
    return isNumber(id) ? /*cast type int*/ id : id;
  }

  /*Process an "insert get ID" query for ODBC.*/
  protected processInsertGetIdForOdbc(connection: Connection) {
    const result = connection.selectFromWriteConnection(
      'SELECT CAST(COALESCE(SCOPE_IDENTITY(), @@IDENTITY) AS int) AS insertid');
    if (!result) {
      throw new Error('Unable to retrieve lastInsertID for ODBC.');
    }
    const row = result[0];
    return row.insertid;
  }

  /*Process the results of a column listing query.*/
  public processColumnListing(results: any[]) {
    return results.map(result => {
      return /*cast type object*/ result.name;
    });
  }
}
