import { Node } from './common.ast';
import { ArrayBindingElement, BindingName, DotDotDotToken, Expression, PropertyName } from '../types';
import { update } from '../utilities';

export class ObjectBindingPattern extends Node {
  constructor(public elements: readonly BindingElement[]) {
    super();
  }

  updateObjectBindingPattern(elements: readonly BindingElement[]) {
    return this.elements !== elements ? update(new ObjectBindingPattern(elements), this) : this;
  }
}

export class ArrayBindingPattern extends Node {
  constructor(public elements: readonly ArrayBindingElement[]) {
    super();
  }

  updateArrayBindingPattern(elements: readonly ArrayBindingElement[]) {
    return this.elements !== elements ? update(new ArrayBindingPattern(elements), this) : this;
  }
}

export class BindingElement extends Node {
  constructor(public dotDotDotToken: DotDotDotToken | undefined,
              public propertyName: string | PropertyName | undefined,
              public name: string | BindingName,
              public initializer?: Expression) {
    super();
  }

  updateBindingElement(dotDotDotToken: DotDotDotToken | undefined,
                       propertyName: PropertyName | undefined,
                       name: BindingName,
                       initializer: Expression | undefined) {
    return this.dotDotDotToken !== dotDotDotToken ||
           this.propertyName !== propertyName ||
           this.name !== name ||
           this.initializer !== initializer ? update(
      new BindingElement(dotDotDotToken, propertyName, name, initializer),
      this) : this;
  }
}
