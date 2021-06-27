import { Node } from './common.ast';
import { Expression } from '../types';
import { update } from '../utilities';

export class NotEmittedStatement extends Node {
  constructor(public original: Node) {
    super();
  }
}

export class PartiallyEmittedExpression extends Node {
  constructor(public expression: Expression, public original?: Node) {
    super();
  }

  updatePartiallyEmittedExpression(expression: Expression) {
    return this.expression !== expression ? update(new PartiallyEmittedExpression(expression), this) : this;
  }
}

export class CommaListExpression extends Node {
  constructor(public elements: readonly Expression[]) {
    super();
  }

  updateCommaListExpression(elements: readonly Expression[]) {
    return this.elements !== elements ? update(new CommaListExpression(elements), this) : this;
  }
}

export class EndOfDeclarationMarker extends Node {
  constructor(public original: Node) {
    super();
  }
}

export class MergeDeclarationMarker extends Node {
  constructor(public original: Node) {
    super();
  }
}

export class SyntheticReferenceExpression extends Node {
  constructor(public expression: Expression, public thisArg: Expression) {
    super();
  }

  updateSyntheticReferenceExpression(expression: Expression, thisArg: Expression) {
    return this.expression !== expression ||
           this.thisArg !== thisArg ? update(new SyntheticReferenceExpression(
      expression,
      thisArg), this) : this;
  }
}
