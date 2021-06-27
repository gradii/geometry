import { Node } from './common.ast';
import {
  AsteriskToken,
  AwaitKeyword,
  BindingName,
  CaseOrDefaultClause,
  CatchClause,
  ClassElement,
  Decorator,
  EnumMember,
  ExclamationToken,
  Expression,
  ForInitializer,
  HeritageClause,
  Identifier,
  Modifier,
  ModuleBody,
  ModuleName,
  ModuleReference,
  NamedExportBindings,
  NamedImportBindings,
  NodeFlags,
  ParameterDeclaration,
  Statement,
  TypeElement,
  TypeNode,
  TypeParameterDeclaration
} from '../types';
import { update } from '../utilities';

export class Block extends Node {
  constructor(public statements: readonly Statement[], public multiLine?: boolean) {
    super();
  }

  updateBlock(statements: readonly Statement[]) {
    return this.statements !== statements ? update(new Block(statements), this) : this;
  }
}

export class VariableStatement extends Node {
  constructor(public modifiers: readonly Modifier[] | undefined,
              public declarationList: VariableDeclarationList | readonly VariableDeclaration[]) {
    super();
  }

  updateVariableStatement(modifiers: readonly Modifier[] | undefined, declarationList: VariableDeclarationList) {
    return this.modifiers !== modifiers ||
           this.declarationList !== declarationList ? update(new VariableStatement(
      modifiers,
      declarationList), this) : this;
  }
}

export class EmptyStatement extends Node {
  constructor() {
    super();
  }
}

export class ExpressionStatement extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateExpressionStatement(expression: Expression) {
    return this.expression !== expression ? update(new ExpressionStatement(expression), this) : this;
  }
}

export class IfStatement extends Node {
  constructor(public expression: Expression, public thenStatement: Statement, public elseStatement?: Statement) {
    super();
  }

  updateIfStatement(expression: Expression, thenStatement: Statement, elseStatement: Statement | undefined) {
    return this.expression !== expression ||
           this.thenStatement !== thenStatement ||
           this.elseStatement !== elseStatement ? update(
      new IfStatement(expression, thenStatement, elseStatement),
      this) : this;
  }
}

export class DoStatement extends Node {
  constructor(public statement: Statement, public expression: Expression) {
    super();
  }

  updateDoStatement(statement: Statement, expression: Expression) {
    return this.statement !== statement ||
           this.expression !== expression ? update(new DoStatement(statement,
      expression), this) : this;
  }
}

export class WhileStatement extends Node {
  constructor(public expression: Expression, public statement: Statement) {
    super();
  }

  updateWhileStatement(expression: Expression, statement: Statement) {
    return this.expression !== expression ||
           this.statement !== statement ? update(new WhileStatement(expression,
      statement), this) : this;
  }
}

export class ForStatement extends Node {
  constructor(public initializer: ForInitializer | undefined,
              public condition: Expression | undefined,
              public incrementor: Expression | undefined,
              public statement: Statement) {
    super();
  }

  updateForStatement(initializer: ForInitializer | undefined,
                     condition: Expression | undefined,
                     incrementor: Expression | undefined,
                     statement: Statement) {
    return this.initializer !== initializer ||
           this.condition !== condition ||
           this.incrementor !== incrementor ||
           this.statement !== statement ? update(
      new ForStatement(initializer, condition, incrementor, statement),
      this) : this;
  }
}

export class ForInStatement extends Node {
  constructor(public initializer: ForInitializer, public expression: Expression, public statement: Statement) {
    super();
  }

  updateForInStatement(initializer: ForInitializer, expression: Expression, statement: Statement) {
    return this.initializer !== initializer ||
           this.expression !== expression ||
           this.statement !== statement ? update(
      new ForInStatement(initializer, expression, statement),
      this) : this;
  }
}

export class ForOfStatement extends Node {
  constructor(public awaitModifier: AwaitKeyword | undefined,
              public initializer: ForInitializer,
              public expression: Expression,
              public statement: Statement) {
    super();
  }

  updateForOfStatement(awaitModifier: AwaitKeyword | undefined,
                       initializer: ForInitializer,
                       expression: Expression,
                       statement: Statement) {
    return this.awaitModifier !== awaitModifier ||
           this.initializer !== initializer ||
           this.expression !== expression ||
           this.statement !== statement ? update(
      new ForOfStatement(awaitModifier, initializer, expression, statement),
      this) : this;
  }
}

export class ContinueStatement extends Node {
  constructor(public label?: string | Identifier) {
    super();
  }

  updateContinueStatement(label: Identifier | undefined) {
    return this.label !== label ? update(new ContinueStatement(label), this) : this;
  }
}

export class BreakStatement extends Node {
  constructor(public label?: string | Identifier) {
    super();
  }

  updateBreakStatement(label: Identifier | undefined) {
    return this.label !== label ? update(new BreakStatement(label), this) : this;
  }
}

export class ReturnStatement extends Node {
  constructor(public expression?: Expression) {
    super();
  }

  updateReturnStatement(expression: Expression | undefined) {
    return this.expression !== expression ? update(new ReturnStatement(expression), this) : this;
  }
}

export class WithStatement extends Node {
  constructor(public expression: Expression, public statement: Statement) {
    super();
  }

  updateWithStatement(expression: Expression, statement: Statement) {
    return this.expression !== expression ||
           this.statement !== statement ? update(new WithStatement(expression,
      statement), this) : this;
  }
}

export class SwitchStatement extends Node {
  constructor(public expression: Expression, public caseBlock: CaseBlock) {
    super();
  }

  updateSwitchStatement(expression: Expression, caseBlock: CaseBlock) {
    return this.expression !== expression ||
           this.caseBlock !== caseBlock ? update(new SwitchStatement(expression,
      caseBlock), this) : this;
  }
}

export class LabeledStatement extends Node {
  constructor(public label: string | Identifier, public statement: Statement) {
    super();
  }

  updateLabeledStatement(label: Identifier, statement: Statement) {
    return this.label !== label ||
           this.statement !== statement ? update(new LabeledStatement(label, statement),
      this) : this;
  }
}

export class ThrowStatement extends Node {
  constructor(public expression: Expression) {
    super();
  }

  updateThrowStatement(expression: Expression) {
    return this.expression !== expression ? update(new ThrowStatement(expression), this) : this;
  }
}

export class TryStatement extends Node {
  constructor(public tryBlock: Block,
              public catchClause: CatchClause | undefined,
              public finallyBlock: Block | undefined) {
    super();
  }

  updateTryStatement(tryBlock: Block, catchClause: CatchClause | undefined, finallyBlock: Block | undefined) {
    return this.tryBlock !== tryBlock ||
           this.catchClause !== catchClause ||
           this.finallyBlock !== finallyBlock ? update(
      new TryStatement(tryBlock, catchClause, finallyBlock),
      this) : this;
  }
}

export class DebuggerStatement extends Node {
  constructor() {
    super();
  }
}

export class VariableDeclaration extends Node {
  constructor(public name: string | BindingName,
              public exclamationToken: ExclamationToken | undefined,
              public type: TypeNode | undefined,
              public initializer: Expression | undefined) {
    super();
  }

  updateVariableDeclaration(name: BindingName,
                            exclamationToken: ExclamationToken | undefined,
                            type: TypeNode | undefined,
                            initializer: Expression | undefined) {
    return this.name !== name ||
           this.exclamationToken !== exclamationToken ||
           this.type !== type ||
           this.initializer !== initializer ? update(
      new VariableDeclaration(name, exclamationToken, type, initializer),
      this) : this;
  }
}

export class VariableDeclarationList extends Node {
  constructor(public declarations: readonly VariableDeclaration[], public flags = NodeFlags.None) {
    super();
  }

  updateVariableDeclarationList(declarations: readonly VariableDeclaration[]) {
    return this.declarations !== declarations ? update(new VariableDeclarationList(declarations), this) : this;
  }
}

export class FunctionDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public asteriskToken: AsteriskToken | undefined,
              public name: string | Identifier | undefined,
              public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public parameters: readonly ParameterDeclaration[],
              public type: TypeNode | undefined,
              public body: Block | undefined) {
    super();
  }

  updateFunctionDeclaration(decorators: readonly Decorator[] | undefined,
                            modifiers: readonly Modifier[] | undefined,
                            asteriskToken: AsteriskToken | undefined,
                            name: Identifier | undefined,
                            typeParameters: readonly TypeParameterDeclaration[] | undefined,
                            parameters: readonly ParameterDeclaration[],
                            type: TypeNode | undefined,
                            body: Block | undefined) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.asteriskToken !== asteriskToken ||
           this.name !== name ||
           this.typeParameters !== typeParameters ||
           this.parameters !== parameters ||
           this.type !== type ||
           this.body !== body ?
      update(
        new FunctionDeclaration(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body),
        this) : this;
  }
}

export class ClassDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public name: string | Identifier | undefined,
              public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public heritageClauses: readonly HeritageClause[] | undefined,
              public members: readonly ClassElement[]) {
    super();
  }

  updateClassDeclaration(decorators: readonly Decorator[] | undefined,
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
      new ClassDeclaration(decorators, modifiers, name, typeParameters, heritageClauses, members),
      this) : this;
  }
}

export class InterfaceDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public name: string | Identifier,
              public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public heritageClauses: readonly HeritageClause[] | undefined,
              public members: readonly TypeElement[]) {
    super();
  }

  updateInterfaceDeclaration(decorators: readonly Decorator[] | undefined,
                             modifiers: readonly Modifier[] | undefined,
                             name: Identifier,
                             typeParameters: readonly TypeParameterDeclaration[] | undefined,
                             heritageClauses: readonly HeritageClause[] | undefined,
                             members: readonly TypeElement[]) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.name !== name ||
           this.typeParameters !== typeParameters ||
           this.heritageClauses !== heritageClauses ||
           this.members !== members ? update(
      new InterfaceDeclaration(decorators, modifiers, name, typeParameters, heritageClauses, members),
      this) : this;
  }
}

export class TypeAliasDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public name: string | Identifier,
              public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public type: TypeNode) {
    super();
  }

  updateTypeAliasDeclaration(decorators: readonly Decorator[] | undefined,
                             modifiers: readonly Modifier[] | undefined,
                             name: Identifier,
                             typeParameters: readonly TypeParameterDeclaration[] | undefined,
                             type: TypeNode) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.name !== name ||
           this.typeParameters !== typeParameters ||
           this.type !== type ? update(
      new TypeAliasDeclaration(decorators, modifiers, name, typeParameters, type),
      this) : this;
  }
}

export class EnumDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public name: string | Identifier,
              public members: readonly EnumMember[]) {
    super();
  }

  updateEnumDeclaration(decorators: readonly Decorator[] | undefined,
                        modifiers: readonly Modifier[] | undefined,
                        name: Identifier,
                        members: readonly EnumMember[]) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.name !== name ||
           this.members !== members ? update(
      new EnumDeclaration(decorators, modifiers, name, members),
      this) : this;
  }
}

export class ModuleDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public name: ModuleName,
              public body: ModuleBody | undefined,
              public flags = NodeFlags.None) {
    super();
  }

  updateModuleDeclaration(decorators: readonly Decorator[] | undefined,
                          modifiers: readonly Modifier[] | undefined,
                          name: ModuleName,
                          body: ModuleBody | undefined) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.name !== name ||
           this.body !== body ? update(
      new ModuleDeclaration(decorators, modifiers, name, body),
      this) : this;
  }
}

export class ModuleBlock extends Node {
  constructor(public statements: readonly Statement[]) {
    super();
  }

  updateModuleBlock(statements: readonly Statement[]) {
    return this.statements !== statements ? update(new ModuleBlock(statements), this) : this;
  }
}

export class CaseBlock extends Node {
  constructor(public clauses: readonly CaseOrDefaultClause[]) {
    super();
  }

  updateCaseBlock(clauses: readonly CaseOrDefaultClause[]) {
    return this.clauses !== clauses ? update(new CaseBlock(clauses), this) : this;
  }
}

export class NamespaceExportDeclaration extends Node {
  constructor(public name: string | Identifier) {
    super();
  }

  updateNamespaceExportDeclaration(name: Identifier) {
    return this.name !== name ? update(new NamespaceExportDeclaration(name), this) : this;
  }
}

export class ImportEqualsDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public name: string | Identifier,
              public moduleReference: ModuleReference) {
    super();
  }

  updateImportEqualsDeclaration(decorators: readonly Decorator[] | undefined,
                                modifiers: readonly Modifier[] | undefined,
                                name: Identifier,
                                moduleReference: ModuleReference) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.name !== name ||
           this.moduleReference !== moduleReference ? update(
      new ImportEqualsDeclaration(decorators, modifiers, name, moduleReference),
      this) : this;
  }
}

export class ImportDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public importClause: ImportClause | undefined,
              public moduleSpecifier: Expression) {
    super();
  }

  updateImportDeclaration(decorators: readonly Decorator[] | undefined,
                          modifiers: readonly Modifier[] | undefined,
                          importClause: ImportClause | undefined,
                          moduleSpecifier: Expression) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.importClause !== importClause ||
           this.moduleSpecifier !== moduleSpecifier ? update(
      new ImportDeclaration(decorators, modifiers, importClause, moduleSpecifier),
      this) : this;
  }
}

export class ImportClause extends Node {
  constructor(public isTypeOnly: boolean,
              public name: Identifier | undefined,
              public namedBindings: NamedImportBindings | undefined) {
    super();
  }

  updateImportClause(isTypeOnly: boolean,
                     name: Identifier | undefined,
                     namedBindings: NamedImportBindings | undefined) {
    return this.isTypeOnly !== isTypeOnly ||
           this.name !== name ||
           this.namedBindings !== namedBindings ? update(new ImportClause(
      isTypeOnly,
      name,
      namedBindings), this) : this;
  }
}

export class NamespaceImport extends Node {
  constructor(public name: Identifier) {
    super();
  }

  updateNamespaceImport(name: Identifier) {
    return this.name !== name ? update(new NamespaceImport(name), this) : this;
  }
}

export class NamespaceExport extends Node {
  constructor(public name: Identifier) {
    super();
  }

  updateNamespaceExport(name: Identifier) {
    return this.name !== name ? update(new NamespaceExport(name), this) : this;
  }
}

export class NamedImports extends Node {
  constructor(public elements: readonly ImportSpecifier[]) {
    super();
  }

  updateNamedImports(elements: readonly ImportSpecifier[]) {
    return this.elements !== elements ? update(new NamedImports(elements), this) : this;
  }
}

export class ImportSpecifier extends Node {
  constructor(public propertyName: Identifier | undefined, public name: Identifier) {
    super();
  }

  updateImportSpecifier(propertyName: Identifier | undefined, name: Identifier) {
    return this.propertyName !== propertyName ||
           this.name !== name ? update(new ImportSpecifier(propertyName, name),
      this) : this;
  }
}

export class ExportAssignment extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public isExportEquals: boolean | undefined,
              public expression: Expression) {
    super();
  }

  updateExportAssignment(decorators: readonly Decorator[] | undefined,
                         modifiers: readonly Modifier[] | undefined,
                         expression: Expression) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.expression !== expression ? update(new ExportAssignment(
      decorators,
      modifiers,
      this.isExportEquals,
      expression), this) : this;
  }
}

export class ExportDeclaration extends Node {
  constructor(public decorators: readonly Decorator[] | undefined,
              public modifiers: readonly Modifier[] | undefined,
              public isTypeOnly: boolean,
              public exportClause: NamedExportBindings | undefined,
              public moduleSpecifier?: Expression) {
    super();
  }

  updateExportDeclaration(decorators: readonly Decorator[] | undefined,
                          modifiers: readonly Modifier[] | undefined,
                          isTypeOnly: boolean,
                          exportClause: NamedExportBindings | undefined,
                          moduleSpecifier: Expression | undefined) {
    return this.decorators !== decorators ||
           this.modifiers !== modifiers ||
           this.isTypeOnly !== isTypeOnly ||
           this.exportClause !== exportClause ||
           this.moduleSpecifier !== moduleSpecifier ? update(
      new ExportDeclaration(decorators, modifiers, isTypeOnly, exportClause, moduleSpecifier),
      this) : this;
  }
}

export class NamedExports extends Node {
  constructor(public elements: readonly ExportSpecifier[]) {
    super();
  }

  updateNamedExports(elements: readonly ExportSpecifier[]) {
    return this.elements !== elements ? update(new NamedExports(elements), this) : this;
  }
}

export class ExportSpecifier extends Node {
  constructor(public propertyName: string | Identifier | undefined, public name: string | Identifier) {
    super();
  }

  updateExportSpecifier(propertyName: Identifier | undefined, name: Identifier) {
    return this.propertyName !== propertyName ||
           this.name !== name ? update(new ExportSpecifier(propertyName, name),
      this) : this;
  }
}

export class MissingDeclaration extends Node {
  constructor() {
    super();
  }
}
