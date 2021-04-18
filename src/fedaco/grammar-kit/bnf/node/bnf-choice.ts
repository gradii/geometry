/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BnfExpression } from './bnf-expression';
import { BnfNode } from './bnf-node';


export class BnfChoice extends BnfNode {

  expressionList: BnfExpression[];

  constructor() {
    super();
  }
}
