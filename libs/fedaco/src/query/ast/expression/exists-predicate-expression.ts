/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import type { NestedExpression } from '../fragment/nested-expression';
import { QueryBuilder } from './../../../query-builder/query-builder';
import type { SqlVisitor } from '../../sql-visitor';
import { Expression } from './expression';


export class ExistsPredicateExpression extends Expression {
  constructor(
    public expression: NestedExpression,
    public not: boolean = false,
  ) {
    super();
  }

  accept(visitor: SqlVisitor) {
    return visitor.visitExistsPredicateExpression(this);
  }
}
