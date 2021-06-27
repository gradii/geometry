import { Node } from './common.ast';
import {
  AsteriskToken,
  Block, CallSignatureDeclaration,
  Decorator,
  ExclamationToken,
  Expression,
  Modifier,
  NodeArray,
  ParameterDeclaration,
  PropertyName,
  QuestionToken,
  TemplateMiddle,
  TemplateTail,
  TypeNode,
  TypeParameterDeclaration
} from '../types';
import { update } from '../utilities';

export class PropertySignature extends Node {
  constructor(public modifiers: readonly Modifier[] | undefined,
              public name: PropertyName | string,
              public questionToken: QuestionToken | undefined,
              public type: TypeNode | undefined) {
    super();
  }

  updatePropertySignature(modifiers: readonly Modifier[] | undefined,
                          name: PropertyName,
                          questionToken: QuestionToken | undefined,
                          type: TypeNode | undefined) {
    return this.modifiers !== modifiers ||
           this.name !== name ||
           this.questionToken !== questionToken ||
           this.type !== type ? update(
      new PropertySignature(modifiers, name, questionToken, type),
      this) : this;
  }
}

export class PropertyDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public name: string | PropertyName,
              public questionOrExclamationToken: QuestionToken | ExclamationToken | undefined,
              public type: TypeNode | undefined,
              public initializer: Expression | undefined) {
    super();
  }

  updatePropertyDeclaration(decorators: readonly Decorator[] | undefined,
                            modifiers: readonly Modifier[] | undefined,
                            name: string | PropertyName,
                            questionOrExclamationToken: QuestionToken | ExclamationToken | undefined,
                            type: TypeNode | undefined,
                            initializer: Expression | undefined) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.name !== name ||
           this.questionOrExclamationToken !== questionOrExclamationToken ||
           this.type !== type ||
           this.initializer !== initializer ? update(
      new PropertyDeclaration(decorators, modifiers, name, questionOrExclamationToken, type, initializer),
      this) : this;
  }
}

export class MethodSignature extends Node {
  constructor(public modifiers: readonly Modifier[] | undefined,
              public name: string | PropertyName,
              public questionToken: QuestionToken | undefined,
              public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public parameters: readonly ParameterDeclaration[],
              public type: TypeNode | undefined) {
    super();
  }

  updateMethodSignature(modifiers: readonly Modifier[] | undefined,
                        name: PropertyName,
                        questionToken: QuestionToken | undefined,
                        typeParameters: NodeArray<TypeParameterDeclaration> | undefined,
                        parameters: NodeArray<ParameterDeclaration>,
                        type: TypeNode | undefined) {
    return this.modifiers !== modifiers ||
           this.name !== name ||
           this.questionToken !== questionToken ||
           this.typeParameters !== typeParameters ||
           this.parameters !== parameters ||
           this.type !== type ? update(
      new MethodSignature(modifiers, name, questionToken, typeParameters, parameters, type),
      this) : this;
  }
}

export class MethodDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public asteriskToken: AsteriskToken | undefined,
              public name: string | PropertyName,
              public questionToken: QuestionToken | undefined,
              public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public parameters: readonly ParameterDeclaration[],
              public type: TypeNode | undefined,
              public body: Block | undefined) {
    super();
  }

  updateMethodDeclaration(decorators: readonly Decorator[] | undefined,
                          modifiers: readonly Modifier[] | undefined,
                          asteriskToken: AsteriskToken | undefined,
                          name: PropertyName,
                          questionToken: QuestionToken | undefined,
                          typeParameters: readonly TypeParameterDeclaration[] | undefined,
                          parameters: readonly ParameterDeclaration[],
                          type: TypeNode | undefined,
                          body: Block | undefined) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.asteriskToken !== asteriskToken ||
           this.name !== name ||
           this.questionToken !== questionToken ||
           this.typeParameters !== typeParameters ||
           this.parameters !== parameters ||
           this.type !== type ||
           this.body !== body ? update(
      new MethodDeclaration(decorators,
        modifiers,
        asteriskToken,
        name,
        questionToken,
        typeParameters,
        parameters,
        type,
        body),
      this) : this;
  }
}

export class ConstructorDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public parameters: readonly ParameterDeclaration[],
              public body: Block | undefined) {
    super();
  }

  updateConstructorDeclaration(decorators: readonly Decorator[] | undefined,
                               modifiers: readonly Modifier[] | undefined,
                               parameters: readonly ParameterDeclaration[],
                               body: Block | undefined) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.parameters !== parameters ||
           this.body !== body ? update(
      new ConstructorDeclaration(decorators, modifiers, parameters, body),
      this) : this;
  }
}

export class GetAccessorDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public name: string | PropertyName,
              public parameters: readonly ParameterDeclaration[],
              public type: TypeNode | undefined,
              public body: Block | undefined) {
    super();
  }

  updateGetAccessorDeclaration(decorators: readonly Decorator[] | undefined,
                               modifiers: readonly Modifier[] | undefined,
                               name: PropertyName,
                               parameters: readonly ParameterDeclaration[],
                               type: TypeNode | undefined,
                               body: Block | undefined) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.name !== name ||
           this.parameters !== parameters ||
           this.type !== type ||
           this.body !== body ? update(
      new GetAccessorDeclaration(decorators, modifiers, name, parameters, type, body),
      this) : this;
  }
}

export class SetAccessorDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public name: string | PropertyName,
              public parameters: readonly ParameterDeclaration[],
              public body: Block | undefined) {
    super();
  }

  updateSetAccessorDeclaration(decorators: readonly Decorator[] | undefined,
                               modifiers: readonly Modifier[] | undefined,
                               name: PropertyName,
                               parameters: readonly ParameterDeclaration[],
                               body: Block | undefined) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.name !== name ||
           this.parameters !== parameters ||
           this.body !== body ? update(
      new SetAccessorDeclaration(decorators, modifiers, name, parameters, body),
      this) : this;
  }
}

export class CallSignature extends Node {
  constructor(public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public parameters: readonly ParameterDeclaration[],
              public type: TypeNode | undefined) {
    super();
  }

  updateCallSignature(typeParameters: TypeParameterDeclaration[] | undefined,
                      parameters: ParameterDeclaration[],
                      type: TypeNode | undefined) {
    return this.typeParameters !== typeParameters ||
           this.parameters !== parameters ||
           this.type !== type ? update(new CallSignature(
      typeParameters,
      parameters,
      type), this) : this;
  }
}

export class ConstructSignature extends Node {
  constructor(public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public parameters: readonly ParameterDeclaration[],
              public type: TypeNode | undefined) {
    super();
  }

  updateConstructSignature(typeParameters: NodeArray<TypeParameterDeclaration> | undefined,
                           parameters: NodeArray<ParameterDeclaration>,
                           type: TypeNode | undefined) {
    return this.typeParameters !== typeParameters ||
           this.parameters !== parameters ||
           this.type !== type ? update(new ConstructSignature(
      typeParameters,
      parameters,
      type), this) : this;
  }
}

export class IndexSignature extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public parameters: readonly ParameterDeclaration[],
              public type: TypeNode | undefined) {
    super();
  }

  updateIndexSignature(decorators: readonly Decorator[] | undefined,
                       modifiers: readonly Modifier[] | undefined,
                       parameters: readonly ParameterDeclaration[],
                       type: TypeNode) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.parameters !== parameters ||
           this.type !== type ? update(
      new IndexSignature(decorators, modifiers, parameters, type),
      this) : this;
  }
}

export class TemplateLiteralTypeSpan extends Node {
  constructor(public type: TypeNode, public literal: TemplateMiddle | TemplateTail) {
    super();
  }

  updateTemplateLiteralTypeSpan(type: TypeNode, literal: TemplateMiddle | TemplateTail) {
    return this.type !== type ||
           this.literal !== literal ? update(new TemplateLiteralTypeSpan(type, literal),
      this) : this;
  }
}
