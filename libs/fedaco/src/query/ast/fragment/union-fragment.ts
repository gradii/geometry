/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { QueryBuilder } from '../../../query-builder/query-builder';
import { SqlNode } from '../../sql-node';
import { SqlVisitor } from '../../sql-visitor';


export class UnionFragment extends SqlNode {
  constructor(
    public expression: QueryBuilder,
    public all: boolean
  ) {
    super();
  }

  accept(visitor: SqlVisitor) {
    return visitor.visitUnionFragment(this);
  }
}
