/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BnfAttr } from './bnf-attr';
import { BnfNode } from './bnf-node';


export class BnfAttrs extends BnfNode {
  attrList: BnfAttr[];

  constructor() {
    super();
  }
}
