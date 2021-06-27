import { Node } from './common.ast';
import { Expression, TemplateMiddle, TemplateTail } from '../types';
import { update } from '../utilities';

export class TemplateSpan extends Node {
  constructor(public expression: Expression, public literal: TemplateMiddle | TemplateTail) {
    super();
  }

  updateTemplateSpan(expression: Expression, literal: TemplateMiddle | TemplateTail) {
    return this.expression !== expression ||
           this.literal !== literal ? update(new TemplateSpan(expression, literal),
      this) : this;
  }
}

export class SemicolonClassElement extends Node {
  constructor() {
    super();
  }
}
