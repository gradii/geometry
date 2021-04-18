/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BnfNode } from './bnf-node';
import { BnfStringLiteralExpression } from './bnf-string-literal-expression';


export class BnfAttrPattern extends BnfNode {

  literalExpression: BnfStringLiteralExpression;

  constructor() {
    super();
  }

}
