import { Node } from './common.ast';
import { BindingName, DotDotDotToken, Expression, Identifier, Modifier, QuestionToken, TypeNode, Decorator as IDecorator } from '../types';
import { update } from '../utilities';

export class TypeParameterDeclaration extends Node {
  constructor(public name: string | Identifier, public constraint?: TypeNode, public defaultType?: TypeNode) {
    super();
  }

  updateTypeParameterDeclaration(name: Identifier,
                                 constraint: TypeNode | undefined,
                                 defaultType: TypeNode | undefined) {
    return this.name !== name ||
           this.constraint !== constraint ||
           this.defaultType !== defaultType ? update(new TypeParameterDeclaration(
      name,
      constraint,
      defaultType), this) : this;
  }
}

export class ParameterDeclaration extends Node {
  constructor(public decorators: readonly IDecorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public dotDotDotToken: DotDotDotToken | undefined,
              public name: string | BindingName,
              public questionToken?: QuestionToken,
              public type?: TypeNode,
              public initializer?: Expression) {
    super();
  }

  updateParameterDeclaration(decorators: readonly IDecorator[] | undefined,
                             modifiers: readonly Modifier[] | undefined,
                             dotDotDotToken: DotDotDotToken | undefined,
                             name: string | BindingName,
                             questionToken: QuestionToken | undefined,
                             type: TypeNode | undefined,
                             initializer: Expression | undefined) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.dotDotDotToken !== dotDotDotToken ||
           this.name !== name ||
           this.questionToken !== questionToken ||
           this.type !== type ||
           this.initializer !== initializer ? update(
      new ParameterDeclaration(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer),
      this) : this;
  }
}

export class Decorator extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateDecorator(expression: Expression) {
    return this.expression !== expression ? update(new Decorator(expression), this) : this;
  }
}
