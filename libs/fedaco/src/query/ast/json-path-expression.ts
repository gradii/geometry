/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlNode } from '../sql-node';
import { SqlVisitor } from '../sql-visitor';
import { Identifier } from './identifier';
import { PathExpression } from './path-expression';

// MultiPartIdentifier
export class JsonPathExpression extends SqlNode {

  constructor(
    public pathExpression: PathExpression,
    public pathLeg: Identifier,
    public jsonLiteral: Identifier,
  ) {
    super();
  }

  public accept(visitor: SqlVisitor) {
    return visitor.visitJsonPathExpression(this);
  }
}
