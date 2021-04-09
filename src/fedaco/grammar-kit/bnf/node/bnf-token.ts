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