/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlNode } from '../sql-node';
import { SqlVisitor } from '../sql-visitor';


export class GroupByClause extends SqlNode {
  constructor(
    public groups: SqlNode[]
  ) {
    super();
  }

  accept(visitor: SqlVisitor) {
    return visitor.visitGroupByClause(this);
  }
}
