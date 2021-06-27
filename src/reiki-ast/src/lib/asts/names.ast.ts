import { Node } from './common.ast';
import { EntityName, Expression, Identifier } from '../types';
import { update } from '../utilities';

export class QualifiedName extends Node {
  constructor(public left: EntityName, public right: string | Identifier) {
    super();
  }

  updateQualifiedName(left: EntityName, right: Identifier) {
    return this.left !== left ||
           this.right !== right ? update(new QualifiedName(left, right), this) : this;
  }
}

export class ComputedPropertyName extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateComputedPropertyName(expression: Expression) {
    return this.expression !== expression ? update(new ComputedPropertyName(expression), this) : this;
  }
}
