import { Node } from './common.ast';
import { LiteralToken, PropertyNameLiteral, PseudoBigInt, TokenFlags } from '../types';

export class NumericLiteral extends Node {
  constructor(public value: string | number, public numericLiteralFlags: TokenFlags = TokenFlags.None) {
    super();
  }
}

export class BigIntLiteral extends Node {
  constructor(public value: string | PseudoBigInt) {
    super();
  }
}

export class StringLiteral extends Node {
  constructor(public text: string, public isSingleQuote?: boolean, public hasExtendedUnicodeEscape?: boolean) {
    super();
  }
}

export class StringLiteralFromNode extends Node {
  constructor(public sourceNode: PropertyNameLiteral) {
    super();
  }
}

export class RegularExpressionLiteral extends Node {
  constructor(public text: string) {
    super();
  }
}

//edited JsxTextAllWhiteSpaces
export class LiteralLikeNode extends Node {
  constructor(public token: LiteralToken, public text: string) {
    super();
  }
}
