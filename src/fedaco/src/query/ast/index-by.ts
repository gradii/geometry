/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlNode } from '../sql-node';

/**
 * IndexBy ::= "INDEX" "BY" SimpleStateFieldPathExpression
 */

export class IndexBy extends SqlNode {
  public constructor(
    public simpleStateFieldPathExpression/*: PathExpression*/ = null
  ) {
    super();
  }

  public accept(sqlVisitor) {
    return sqlVisitor.visitIndexBy(this);
  }
}
