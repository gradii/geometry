import { Node } from './common.ast';
import {
  AsteriskToken,
  BinaryOperator,
  BinaryOperatorToken,
  Block,
  ClassElement,
  ColonToken,
  ConciseBody,
  Decorator,
  EqualsGreaterThanToken,
  Expression,
  HeritageClause,
  Identifier,
  KeywordSyntaxKind,
  KeywordToken,
  Modifier,
  ObjectLiteralElementLike,
  ParameterDeclaration,
  PostfixUnaryOperator,
  PrefixUnaryOperator,
  PrivateIdentifier,
  PunctuationSyntaxKind,
  PunctuationToken,
  QuestionDotToken,
  QuestionToken,
  TemplateLiteral,
  TemplateSpan,
  TokenFlags,
  TypeNode,
  TypeParameterDeclaration
} from '../types';
import { update } from '../utilities';

export class ArrayLiteralExpression extends Node {
  constructor(public elements?: readonly Expression[], public multiLine?: boolean) {
    super();
  }

  updateArrayLiteralExpression(elements: readonly Expression[]) {
    return this.elements !== elements ? update(new ArrayLiteralExpression(elements), this) : this;
  }
}

export class ObjectLiteralExpression extends Node {
  constructor(public properties?: readonly ObjectLiteralElementLike[], public multiLine?: boolean) {
    super();
  }

  updateObjectLiteralExpression(properties: readonly ObjectLiteralElementLike[]) {
    return this.properties !== properties ? update(new ObjectLiteralExpression(properties), this) : this;
  }
}

export class PropertyAccessExpression extends Node {
  constructor(public expression: Expression, public name: string | Identifier | PrivateIdentifier) {
    super();
  }

  updatePropertyAccessExpression(expression: Expression, name: Identifier | PrivateIdentifier) {
    return this.expression !== expression ||
           this.name !== name ? update(new PropertyAccessExpression(expression, name),
      this) : this;
  }
}

export class PropertyAccessChain extends Node {
  constructor(public expression: Expression,
              public questionDotToken: QuestionDotToken | undefined,
              public name: string | Identifier | PrivateIdentifier) {
    super();
  }

  updatePropertyAccessChain(expression: Expression,
                            questionDotToken: QuestionDotToken | undefined,
                            name: Identifier | PrivateIdentifier) {
    return this.expression !== expression ||
           this.questionDotToken !== questionDotToken ||
           this.name !== name ? update(
      new PropertyAccessChain(expression, questionDotToken, name),
      this) : this;
  }
}

export class ElementAccessExpression extends Node {
  argumentExpression;

  constructor(public expression: Expression, public index: number | Expression) {
    super();
  }

  updateElementAccessExpression(expression: Expression, argumentExpression: Expression) {
    return this.expression !== expression ||
           this.argumentExpression !== argumentExpression ? update(new ElementAccessExpression(
      expression,
      argumentExpression), this) : this;
  }
}

export class ElementAccessChain extends Node {
  argumentExpression;

  constructor(public expression: Expression,
              public questionDotToken: QuestionDotToken | undefined,
              public index: number | Expression) {
    super();
  }

  updateElementAccessChain(expression: Expression,
                           questionDotToken: QuestionDotToken | undefined,
                           argumentExpression: Expression) {
    return this.expression !== expression ||
           this.questionDotToken !== questionDotToken ||
           this.argumentExpression !== argumentExpression ? update(
      new ElementAccessChain(expression, questionDotToken, argumentExpression),
      this) : this;
  }
}

export class CallExpression extends Node {
  constructor(public expression: Expression,
              public typeArguments: readonly TypeNode[] | undefined,
              public argumentsArray: readonly Expression[] | undefined) {
    super();
  }

  updateCallExpression(expression: Expression,
                       typeArguments: readonly TypeNode[] | undefined,
                       argumentsArray: readonly Expression[]) {
    return this.expression !== expression ||
           this.typeArguments !== typeArguments ||
           this.argumentsArray !== argumentsArray ? update(
      new CallExpression(expression, typeArguments, argumentsArray),
      this) : this;
  }
}

export class CallChain extends Node {
  constructor(public expression: Expression,
              public questionDotToken: QuestionDotToken | undefined,
              public typeArguments: readonly TypeNode[] | undefined,
              public argumentsArray: readonly Expression[] | undefined) {
    super();
  }

  updateCallChain(expression: Expression,
                  questionDotToken: QuestionDotToken | undefined,
                  typeArguments: readonly TypeNode[] | undefined,
                  argumentsArray: readonly Expression[]) {
    return this.expression !== expression ||
           this.questionDotToken !== questionDotToken ||
           this.typeArguments !== typeArguments ||
           this.argumentsArray !== argumentsArray ? update(
      new CallChain(expression, questionDotToken, typeArguments, argumentsArray),
      this) : this;
  }
}

export class NewExpression extends Node {
  constructor(public expression: Expression,
              public typeArguments: readonly TypeNode[] | undefined,
              public argumentsArray: readonly Expression[] | undefined) {
    super();
  }

  updateNewExpression(expression: Expression,
                      typeArguments: readonly TypeNode[] | undefined,
                      argumentsArray: readonly Expression[] | undefined) {
    return this.expression !== expression ||
           this.typeArguments !== typeArguments ||
           this.argumentsArray !== argumentsArray ? update(
      new NewExpression(expression, typeArguments, argumentsArray),
      this) : this;
  }
}

export class TaggedTemplateExpression extends Node {
  constructor(public tag: Expression,
              public typeArguments: readonly TypeNode[] | undefined,
              public template: TemplateLiteral) {
    super();
  }

  updateTaggedTemplateExpression(tag: Expression,
                                 typeArguments: readonly TypeNode[] | undefined,
                                 template: TemplateLiteral) {
    return this.tag !== tag ||
           this.typeArguments !== typeArguments ||
           this.template !== template ? update(new TaggedTemplateExpression(
      tag,
      typeArguments,
      template), this) : this;
  }
}

export class TypeAssertion extends Node {
  constructor(public type: TypeNode, public expression: Expression) {
    super();
  }

  updateTypeAssertion(type: TypeNode, expression: Expression) {
    return this.type !== type ||
           this.expression !== expression ? update(new TypeAssertion(type, expression),
      this) : this;
  }
}

export class ParenthesizedExpression extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateParenthesizedExpression(expression: Expression) {
    return this.expression !== expression ? update(new ParenthesizedExpression(expression), this) : this;
  }
}

export class FunctionExpression extends Node {
  constructor(public modifiers: readonly Modifier[] | undefined,
              public asteriskToken: AsteriskToken | undefined,
              public name: string | Identifier | undefined,
              public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public parameters: readonly ParameterDeclaration[] | undefined,
              public type: TypeNode | undefined,
              public body: Block) {
    super();
  }

  updateFunctionExpression(modifiers: readonly Modifier[] | undefined,
                           asteriskToken: AsteriskToken | undefined,
                           name: Identifier | undefined,
                           typeParameters: readonly TypeParameterDeclaration[] | undefined,
                           parameters: readonly ParameterDeclaration[],
                           type: TypeNode | undefined,
                           body: Block) {
    return this.modifiers !== modifiers ||
           this.asteriskToken !== asteriskToken ||
           this.name !== name ||
           this.typeParameters !== typeParameters ||
           this.parameters !== parameters ||
           this.type !== type ||
           this.body !== body ? update(
      new FunctionExpression(modifiers, asteriskToken, name, typeParameters, parameters, type, body),
      this) : this;
  }
}

export class ArrowFunction extends Node {
  constructor(public modifiers: readonly Modifier[] | undefined,
              public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public parameters: readonly ParameterDeclaration[],
              public type: TypeNode | undefined,
              public equalsGreaterThanToken: EqualsGreaterThanToken | undefined,
              public body: ConciseBody) {
    super();
  }

  updateArrowFunction(modifiers: readonly Modifier[] | undefined,
                      typeParameters: readonly TypeParameterDeclaration[] | undefined,
                      parameters: readonly ParameterDeclaration[],
                      type: TypeNode | undefined,
                      equalsGreaterThanToken: EqualsGreaterThanToken,
                      body: ConciseBody): ArrowFunction {
    return this.modifiers !== modifiers ||
           this.typeParameters !== typeParameters ||
           this.parameters !== parameters ||
           this.type !== type ||
           this.equalsGreaterThanToken !== equalsGreaterThanToken ||
           this.body !== body ? update(
      new ArrowFunction(modifiers, typeParameters, parameters, type, equalsGreaterThanToken, body),
      this) : this;
  }
}

export class DeleteExpression extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateDeleteExpression(expression: Expression): DeleteExpression {
    return this.expression !== expression ? update(new DeleteExpression(expression), this) : this;
  }
}

export class TypeOfExpression extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateTypeOfExpression(expression: Expression) {
    return this.expression !== expression ? update(new TypeOfExpression(expression), this) : this;
  }
}

export class VoidExpression extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateVoidExpression(expression: Expression) {
    return this.expression !== expression ? update(new VoidExpression(expression), this) : this;
  }
}

export class AwaitExpression extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateAwaitExpression(expression: Expression) {
    return this.expression !== expression ? update(new AwaitExpression(expression), this) : this;
  }
}

export class PrefixUnaryExpression extends Node {
  constructor(public operator: PunctuationToken<PrefixUnaryOperator>, public operand: Expression) {
    super();
  }

  updatePrefixUnaryExpression(operand: Expression) {
    return this.operand !== operand ? update(new PrefixUnaryExpression(this.operator, operand), this) : this;
  }
}

export class PostfixUnaryExpression extends Node {
  constructor(public operand: Expression, public operator: PunctuationToken<PostfixUnaryOperator>) {
    super();
  }

  updatePostfixUnaryExpression(operand: Expression) {
    return this.operand !== operand ? update(new PostfixUnaryExpression(operand, this.operator), this) : this;
  }
}

export class BinaryExpression extends Node {
  constructor(public left: Expression,
              public operator: BinaryOperator | BinaryOperatorToken,
              public right: Expression) {
    super();
  }

  updateBinaryExpression(left: Expression, operator: BinaryOperatorToken, right: Expression) {
    return this.left !== left ||
           this.operator !== operator ||
           this.right !== right ? update(new BinaryExpression(left,
      operator,
      right), this) : this;
  }
}

export class ConditionalExpression extends Node {
  constructor(public condition: Expression,
              public questionToken: QuestionToken | undefined,
              public whenTrue: Expression,
              public colonToken: ColonToken | undefined,
              public whenFalse: Expression) {
    super();
  }

  updateConditionalExpression(condition: Expression,
                              questionToken: PunctuationToken<PunctuationSyntaxKind.QuestionToken>,
                              whenTrue: Expression,
                              colonToken: PunctuationToken<PunctuationSyntaxKind.ColonToken>,
                              whenFalse: Expression) {
    return this.condition !== condition ||
           this.questionToken !== questionToken ||
           this.whenTrue !== whenTrue ||
           this.colonToken !== colonToken ||
           this.whenFalse !== whenFalse ? update(
      new ConditionalExpression(condition, questionToken, whenTrue, colonToken, whenFalse),
      this) : this;
  }
}

export class TemplateExpression extends Node {
  constructor(public head: TemplateHead, public templateSpans: readonly TemplateSpan[]) {
    super();
  }

  updateTemplateExpression(head: TemplateHead, templateSpans: readonly TemplateSpan[]) {
    return this.head !== head ||
           this.templateSpans !== templateSpans ? update(new TemplateExpression(head,
      templateSpans), this) : this;
  }
}

export class TemplateLiteralLikeNode extends Node {
  constructor(
    // public kind: TemplateLiteralToken['kind'],
    public text: string, public rawText: string | undefined, public templateFlags: TokenFlags | undefined) {
    super();
  }
}

export class TemplateHead extends Node {
  constructor(public text: string | undefined, public rawText?: string, public templateFlags?: TokenFlags) {
    super();
  }
}

export class TemplateMiddle extends Node {
  constructor(public text: string | undefined, public rawText?: string, public templateFlags?: TokenFlags) {
    super();
  }
}

export class TemplateTail extends Node {
  constructor(public text: string | undefined, public rawText?: string, public templateFlags?: TokenFlags) {
    super();
  }
}

export class NoSubstitutionTemplateLiteral extends Node {
  constructor(public text: string | undefined, public rawText?: string, public templateFlags?: TokenFlags) {
    super();
  }
}

export class YieldExpression extends Node {
  constructor(public asteriskToken: AsteriskToken | undefined, public expression: Expression | undefined) {
    super();
  }

  updateYieldExpression(asteriskToken: AsteriskToken | undefined, expression: Expression) {
    return this.asteriskToken !== asteriskToken ||
           this.expression !== expression ? update(new YieldExpression(
      asteriskToken,
      expression), this) : this;
  }
}

export class SpreadElement extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateSpreadElement(expression: Expression) {
    return this.expression !== expression ? update(new SpreadElement(expression), this) : this;
  }
}

export class ClassExpression extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public name: string | Identifier | undefined,
              public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public heritageClauses: readonly HeritageClause[] | undefined,
              public members: readonly ClassElement[]) {
    super();
  }

  updateClassExpression(decorators: readonly Decorator[] | undefined,
                        modifiers: readonly Modifier[] | undefined,
                        name: Identifier | undefined,
                        typeParameters: readonly TypeParameterDeclaration[] | undefined,
                        heritageClauses: readonly HeritageClause[] | undefined,
                        members: readonly ClassElement[]) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.name !== name ||
           this.typeParameters !== typeParameters ||
           this.heritageClauses !== heritageClauses ||
           this.members !== members ? update(
      new ClassExpression(decorators, modifiers, name, typeParameters, heritageClauses, members),
      this) : this;
  }
}

export class OmittedExpression extends Node {
  constructor() {
    super();
  }
}

export class ExpressionWithTypeArguments extends Node {
  constructor(public expression: Expression, public typeArguments: readonly TypeNode[] | undefined) {
    super();
  }

  updateExpressionWithTypeArguments(expression: Expression, typeArguments: readonly TypeNode[] | undefined) {
    return this.expression !== expression ||
           this.typeArguments !== typeArguments ? update(new ExpressionWithTypeArguments(
      expression,
      typeArguments), this) : this;
  }
}

export class AsExpression extends Node {
  constructor(public expression: Expression, public type: TypeNode) {
    super();
  }

  updateAsExpression(expression: Expression, type: TypeNode) {
    return this.expression !== expression ||
           this.type !== type ? update(new AsExpression(expression, type),
      this) : this;
  }
}

export class NonNullExpression extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateNonNullExpression(expression: Expression) {
    return this.expression !== expression ? update(new NonNullExpression(expression), this) : this;
  }
}

export class NonNullChain extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateNonNullChain(expression: Expression) {
    return this.expression !== expression ? update(new NonNullChain(expression), this) : this;
  }
}

export class MetaProperty extends Node {
  constructor(public keywordToken: KeywordToken<KeywordSyntaxKind.NewKeyword | KeywordSyntaxKind.ImportKeyword>,
              public name: Identifier) {
    super();
  }

  updateMetaProperty(name: Identifier) {
    return this.name !== name ? update(new MetaProperty(this.keywordToken, name), this) : this;
  }
}
