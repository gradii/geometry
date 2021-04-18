/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export interface ProcessorInterface {
  processSelect(queryBuilder, results);

  processInsertGetId(sql, bindings: any[], sequence?);
}
