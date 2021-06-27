import { Node } from './common.ast';
import { Expression } from '../types';
import { update } from '../utilities';

export class ExternalModuleReference extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateExternalModuleReference(expression: Expression) {
    return this.expression !== expression ? update(new ExternalModuleReference(expression), this) : this;
  }
}
