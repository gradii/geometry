/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ForwardRefFn } from '../../../query-builder/forward-ref';
import { SqlNode } from '../../sql-node';
import { SqlVisitor } from '../../sql-visitor';


export class StringLiteralExpression extends SqlNode {

  constructor(
    public value: string | ForwardRefFn<string>
  ) {
    super();
  }

  get text() {
    return this.value.toString();
  }

  accept(visitor: SqlVisitor) {
    return visitor.visitStringLiteralExpression(this);
  }
}
