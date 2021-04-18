/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlNode } from '../../sql-node';
import { SqlVisitor } from '../../sql-visitor';


export class RawExpression extends SqlNode {
  constructor(public value: string | number | boolean) {
    super();
  }

  accept(visitor: SqlVisitor) {
    return visitor.visitRawExpression(this);
  }
}
