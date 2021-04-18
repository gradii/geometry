/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlNode } from '../../sql-node';
import { SqlVisitor } from '../../sql-visitor';
import { ColumnReferenceExpression } from '../column-reference-expression';


export class NullPredicateExpression extends SqlNode {
  constructor(
    public expression: ColumnReferenceExpression,
    public not: boolean = false
  ) {
    super();
  }

  accept(visitor: SqlVisitor) {
    return visitor.visitNullPredicateExpression(this);
  }
}
