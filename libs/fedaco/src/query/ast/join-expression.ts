/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { createKeyword } from '../../query-builder/ast-factory';
import { SqlNode } from '../sql-node';
import { SqlVisitor } from '../sql-visitor';
import { ConditionExpression } from './expression/condition-expression';
import { JoinOnExpression } from './join-on-expression';
import { Identifier } from './identifier';
import { JoinedTable } from './joined-table';
import { PathExpression } from './path-expression';
import { TableReferenceExpression } from './table-reference-expression';


export class JoinExpression extends SqlNode {
  constructor(
    public type = 'inner',
    public name: TableReferenceExpression | PathExpression | Identifier | JoinedTable,
    public on?: JoinOnExpression | ConditionExpression
  ) {
    super();
  }

  accept(visitor: SqlVisitor) {
    return visitor.visitJoinExpression(this);
  }

}

