/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlNode } from '../../../sql-node';
import { SqlVisitor } from '../../../sql-visitor';
import { Identifier } from '../../identifier';
import { OrderByElement } from '../../order-by-element';


export class RejectOrderElementExpression extends SqlNode {
  constructor(
    public columns: Array<SqlNode | Identifier>,
    public orderByElements: OrderByElement[]
  ) {
    super();
  }

  public accept(visitor: SqlVisitor) {
    return visitor.visitRejectOrderElementExpression(this);
  }
}
