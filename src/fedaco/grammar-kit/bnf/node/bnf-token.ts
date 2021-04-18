/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BnfNode } from './bnf-node';


export enum SyntaxKind {
  OP_EQ
}

export class BnfToken extends BnfNode {
  kind;

  constructor() {
    super();
  }

  isAttrs() {
    // this.kind = ;
  }
}
