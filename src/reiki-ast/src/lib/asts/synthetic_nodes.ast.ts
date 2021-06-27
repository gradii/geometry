import { Node } from './common.ast';
import { NamedTupleMember, ParameterDeclaration, Type } from '../types';

export class SyntheticExpression extends Node {
  constructor(public type: Type,
              public isSpread = false,
              public tupleNameSource?: ParameterDeclaration | NamedTupleMember) {
    super();
  }
}

export class SyntaxList extends Node {
  constructor(public children: Node[]) {
    super();
  }
}
