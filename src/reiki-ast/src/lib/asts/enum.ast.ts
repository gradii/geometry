import { Node } from './common.ast';
import { Expression, PropertyName } from '../types';
import { update } from '../utilities';

export class EnumMember extends Node {
  constructor(public name: string | PropertyName, public initializer?: Expression) {
    super();
  }

  updateEnumMember(name: PropertyName, initializer: Expression | undefined) {
    return this.name !== name ||
           this.initializer !== initializer ? update(new EnumMember(name, initializer),
      this) : this;
  }
}
