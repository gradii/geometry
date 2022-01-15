/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlVisitor } from '../../sql-visitor';
import { BindingVariable } from '../binding-variable';
import { RawExpression } from './raw-expression';


export class RawBindingExpression extends RawExpression {
  constructor(
    public raw: RawExpression,
    public bindings: BindingVariable[]
  ) {
    super(raw.value);
  }

  accept(visitor: SqlVisitor) {
    return visitor.visitRawBindingExpression(this);
  }
}
