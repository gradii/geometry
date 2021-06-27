import { Node } from './common.ast';
import {
  DotDotDotToken,
  Expression,
  Identifier,
  JsxAttributeLike,
  JsxChild,
  JsxClosingFragment,
  JsxTagNameExpression,
  StringLiteral,
  TypeNode
} from '../types';
import { update } from '../utilities';

export class JsxElement extends Node {
  constructor(public openingElement: JsxOpeningElement,
              public children: readonly JsxChild[],
              public closingElement: JsxClosingElement) {
    super();
  }

  updateJsxElement(openingElement: JsxOpeningElement,
                   children: readonly JsxChild[],
                   closingElement: JsxClosingElement) {
    return this.openingElement !== openingElement ||
           this.children !== children ||
           this.closingElement !== closingElement ? update(
      new JsxElement(openingElement, children, closingElement),
      this) : this;
  }
}

export class JsxSelfClosingElement extends Node {
  constructor(public tagName: JsxTagNameExpression,
              public typeArguments: readonly TypeNode[] | undefined,
              public attributes: JsxAttributes) {
    super();
  }

  updateJsxSelfClosingElement(tagName: JsxTagNameExpression,
                              typeArguments: readonly TypeNode[] | undefined,
                              attributes: JsxAttributes) {
    return this.tagName !== tagName ||
           this.typeArguments !== typeArguments ||
           this.attributes !== attributes ? update(
      new JsxSelfClosingElement(tagName, typeArguments, attributes),
      this) : this;
  }
}

export class JsxOpeningElement extends Node {
  constructor(public tagName: JsxTagNameExpression,
              public typeArguments: readonly TypeNode[] | undefined,
              public attributes: JsxAttributes) {
    super();
  }

  updateJsxOpeningElement(tagName: JsxTagNameExpression,
                          typeArguments: readonly TypeNode[] | undefined,
                          attributes: JsxAttributes) {
    return this.tagName !== tagName ||
           this.typeArguments !== typeArguments ||
           this.attributes !== attributes ? update(
      new JsxOpeningElement(tagName, typeArguments, attributes),
      this) : this;
  }
}

export class JsxClosingElement extends Node {
  constructor(public tagName: JsxTagNameExpression) {
    super();
  }

  updateJsxClosingElement(tagName: JsxTagNameExpression) {
    return this.tagName !== tagName ? update(new JsxClosingElement(tagName), this) : this;
  }
}

export class JsxFragment extends Node {
  constructor(public openingFragment: JsxOpeningFragment,
              public children: readonly JsxChild[],
              public closingFragment: JsxClosingFragment) {
    super();
  }

  updateJsxFragment(openingFragment: JsxOpeningFragment,
                    children: readonly JsxChild[],
                    closingFragment: JsxClosingFragment) {
    return this.openingFragment !== openingFragment ||
           this.children !== children ||
           this.closingFragment !== closingFragment ? update(
      new JsxFragment(openingFragment, children, closingFragment),
      this) : this;
  }
}

export class JsxText extends Node {
  constructor(public text: string, public containsOnlyTriviaWhiteSpaces?: boolean) {
    super();
  }

  updateJsxText(text: string, containsOnlyTriviaWhiteSpaces?: boolean) {
    return this.text !== text ||
           this.containsOnlyTriviaWhiteSpaces !== containsOnlyTriviaWhiteSpaces ? update(new JsxText(
      text,
      containsOnlyTriviaWhiteSpaces), this) : this;
  }
}

export class JsxOpeningFragment extends Node {
  constructor() {
    super();
  }
}

export class JsxJsxClosingFragment extends Node {
  constructor() {
    super();
  }
}

export class JsxAttribute extends Node {
  constructor(public name: Identifier, public initializer: StringLiteral | JsxExpression | undefined) {
    super();
  }

  updateJsxAttribute(name: Identifier, initializer: StringLiteral | JsxExpression | undefined) {
    return this.name !== name ||
           this.initializer !== initializer ? update(new JsxAttribute(name, initializer),
      this) : this;
  }
}

export class JsxAttributes extends Node {
  constructor(public properties: readonly JsxAttributeLike[]) {
    super();
  }

  updateJsxAttributes(properties: readonly JsxAttributeLike[]) {
    return this.properties !== properties ? update(new JsxAttributes(properties), this) : this;
  }
}

export class JsxSpreadAttribute extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateJsxSpreadAttribute(expression: Expression) {
    return this.expression !== expression ? update(new JsxSpreadAttribute(expression), this) : this;
  }
}

export class JsxExpression extends Node {
  constructor(public dotDotDotToken: DotDotDotToken | undefined, public expression: Expression | undefined) {
    super();
  }

  updateJsxExpression(expression: Expression | undefined) {
    return this.expression !== expression ? update(new JsxExpression(this.dotDotDotToken, expression), this) : this;
  }
}
