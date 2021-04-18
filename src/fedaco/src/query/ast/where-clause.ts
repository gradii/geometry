/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlNode } from '../sql-node';
import { SqlVisitor } from '../sql-visitor';
import { ConditionExpression } from './expression/condition-expression';


export class WhereClause extends SqlNode {
  constructor(
    public conditionExpression: ConditionExpression
  ) {
    super();
  }

  accept(visitor: SqlVisitor) {
    return visitor.visitWhereClause(this);
  }
}
