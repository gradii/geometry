/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlNode } from '../sql-node';
import { SqlVisitor } from '../sql-visitor';
import { RawExpression } from './expression/raw-expression';
import { IndexBy } from './index-by';
import { TableReferenceExpression } from './table-reference-expression';


export class FromTable extends SqlNode {
  protected _cached: string;

  constructor(public table: TableReferenceExpression | RawExpression,
              public indexBy?: IndexBy) {
    super();
  }

  accept(visitor: SqlVisitor) {
    if (!this._cached) {
      this._cached = visitor.visitFromTable(this);
    }
    return this._cached;
  }
}
