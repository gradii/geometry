/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BnfAttrPattern } from './bnf-attr-pattern';
import { BnfExpression } from './bnf-expression';
import { BnfNode } from './bnf-node';


export class BnfAttr extends BnfNode {

  attrPattern: BnfAttrPattern;

  expression: BnfExpression;

  /**
   * psi element
   */
  id: any;

  constructor() {
    super();
  }


}
