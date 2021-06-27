import { Node } from './common.ast';
import { KeywordSyntaxKind, KeywordTypeSyntaxKind, ModifierSyntaxKind, PunctuationSyntaxKind } from '../types';

export class Token extends Node {
  constructor(public token: any) {
    super();
  }
}

export class PunctuationToken<T = PunctuationSyntaxKind> extends Node {
  constructor(public token: T) {
    super();
  }
}
//
// export class KeywordTypeToken extends Node {
//   constructor(public token: KeywordSyntaxKind) {
//     super();
//   }
// }
//
// export class ModifierToken extends Node {
//   constructor(public token: KeywordSyntaxKind) {
//     super();
//   }
// }

export class KeywordToken<T = KeywordSyntaxKind> extends Node {
  constructor(public token: T) {
    super();
  }
}
