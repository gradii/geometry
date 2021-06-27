import { Node } from './common.ast';
import {
  Block, ClassLikeDeclaration,
  Expression,
  ExpressionWithTypeArguments, InterfaceDeclaration,
  KeywordSyntaxKind,
  KeywordToken,
  Statement,
  VariableDeclaration
} from '../types';
import { update } from '../utilities';

export class CaseClause extends Node {
  constructor(public expression: Expression, public statements: readonly Statement[]) {
    super();
  }

  updateCaseClause(expression: Expression, statements: readonly Statement[]) {
    return this.expression !== expression ||
           this.statements !== statements ? update(new CaseClause(expression,
      statements), this) : this;
  }
}

export class DefaultClause extends Node {
  constructor(public statements: readonly Statement[]) {
    super();
  }

  updateDefaultClause(statements: readonly Statement[]) {
    return this.statements !== statements ? update(new DefaultClause(statements), this) : this;
  }
}

export class HeritageClause extends Node {
  constructor(public parent: InterfaceDeclaration | ClassLikeDeclaration,
              public token: KeywordToken<KeywordSyntaxKind.ExtendsKeyword | KeywordSyntaxKind.ImplementsKeyword>,
              public types: readonly ExpressionWithTypeArguments[]) {
    super();
  }

  updateHeritageClause(types: readonly ExpressionWithTypeArguments[]) {
    return this.types !== types ? update(new HeritageClause(this.token, types), this) : this;
  }
}

export class CatchClause extends Node {
  constructor(public variableDeclaration: string | VariableDeclaration | undefined, public block: Block) {
    super();
  }

  updateCatchClause(variableDeclaration: VariableDeclaration | undefined, block: Block) {
    return this.variableDeclaration !== variableDeclaration ||
           this.block !== block ? update(new CatchClause(
      variableDeclaration,
      block), this) : this;
  }
}
