/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlNode } from '../sql-node';
import { SqlVisitor } from '../sql-visitor';
import { BindingVariable } from './binding-variable';
import { RawExpression } from './expression/raw-expression';
import { NestedExpression } from './fragment/nested-expression';


export class ValuesInsertSource extends SqlNode {
  constructor(
    public isDefault: boolean,
    public valuesList: (BindingVariable | RawExpression)[][] = [],
    public select?: NestedExpression
  ) {
    super();
  }

  accept(visitor: SqlVisitor) {
    return visitor.visitValuesInsertSource(this);
  }
}
