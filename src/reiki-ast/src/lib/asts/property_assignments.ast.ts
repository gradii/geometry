import { Node } from './common.ast';
import { Expression, Identifier, PropertyName } from '../types';
import { update } from '../utilities';

export class PropertyAssignment extends Node {
  constructor(public name: string | PropertyName, public initializer: Expression) {
    super();
  }

  updatePropertyAssignment(name: PropertyName, initializer: Expression) {
    return this.name !== name ||
           this.initializer !== initializer ? update(new PropertyAssignment(name, initializer),
      this) : this;
  }
}

export class ShorthandPropertyAssignment extends Node {
  constructor(public name: string | Identifier, public objectAssignmentInitializer?: Expression) {
    super();
  }

  updateShorthandPropertyAssignment(name: Identifier, objectAssignmentInitializer: Expression | undefined) {
    return this.name !== name ||
           this.objectAssignmentInitializer !== objectAssignmentInitializer ? update(new ShorthandPropertyAssignment(
      name,
      objectAssignmentInitializer), this) : this;
  }
}

export class SpreadAssignment extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateSpreadAssignment(expression: Expression) {
    return this.expression !== expression ? update(new SpreadAssignment(expression), this) : this;
  }
}
