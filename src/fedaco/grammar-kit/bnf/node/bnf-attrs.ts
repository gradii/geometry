import { BnfAttr } from './bnf-attr';
import { BnfNode } from './bnf-node';


export class BnfAttrs extends BnfNode {
  attrList: BnfAttr[];

  constructor() {
    super();
  }
}