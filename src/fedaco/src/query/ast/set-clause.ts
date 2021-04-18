/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlNode } from '../sql-node';
import { SqlVisitor } from '../sql-visitor';


export class SetClause extends SqlNode {
  constructor() {
    super();
  }

  accept(visitor: SqlVisitor) {
    return visitor.visitSetClause(this);
  }
}
