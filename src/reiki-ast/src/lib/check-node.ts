// Literals

import { BigIntLiteral, NumericLiteral, RegularExpressionLiteral, StringLiteral } from './asts/literals.ast';
import {
  JSDocAugmentsTag,
  JSDocCallbackTag,
  JSDocComment,
  JSDocFunctionType,
  JSDocImplementsTag,
  JSDocNameReference,
  JSDocParameterTag,
  JSDocPropertyTag,
  JSDocSignature,
  JSDocTemplateTag,
  JSDocTypedefTag,
  JSDocTypeExpression,
  JSDocTypeLiteral,
  JSDocUnknownTag
} from './asts/jsdoc.ast';
import {
  ConstructSignatureDeclaration,
  IndexSignatureDeclaration,
  JSDoc,
  KeywordSyntaxKind,
  Node,
  ParenthesizedTypeNode,
  PunctuationSyntaxKind,
  TemplateLiteralTypeNode
} from './types';
import { Identifier, PrivateIdentifier } from './asts/identifiers.ast';

import { ComputedPropertyName, QualifiedName } from './asts/names.ast';
import {
  JsxAttribute,
  JsxAttributes,
  JsxClosingElement,
  JsxElement,
  JsxExpression,
  JsxFragment,
  JsxOpeningElement,
  JsxOpeningFragment,
  JsxSelfClosingElement,
  JsxSpreadAttribute,
  JsxText
} from './asts/jsx.ast';
import {
  ArrayLiteralExpression,
  ArrowFunction,
  AsExpression,
  AwaitExpression,
  BinaryExpression,
  CallExpression,
  ClassExpression,
  ConditionalExpression,
  DeleteExpression,
  ElementAccessExpression,
  ExpressionWithTypeArguments,
  FunctionExpression,
  MetaProperty,
  NewExpression,
  NonNullExpression,
  NoSubstitutionTemplateLiteral,
  ObjectLiteralExpression,
  OmittedExpression,
  ParenthesizedExpression,
  PostfixUnaryExpression,
  PrefixUnaryExpression,
  PropertyAccessExpression,
  SpreadElement,
  TaggedTemplateExpression,
  TemplateExpression,
  TemplateHead,
  TemplateMiddle,
  TemplateTail,
  TypeAssertion,
  TypeOfExpression,
  VoidExpression,
  YieldExpression
} from './asts/expression.ast';
import { Bundle, SourceFile, UnparsedPrepend, UnparsedSource } from './asts/top-level_nodes.ast';
import { EnumMember } from './asts/enum.ast';
import { PropertyAssignment, ShorthandPropertyAssignment, SpreadAssignment } from './asts/property_assignments.ast';
import { CaseClause, CatchClause, DefaultClause, HeritageClause } from './asts/clauses.ast';
import { ExternalModuleReference } from './asts/module_references.ast';
import {
  CommaListExpression,
  EndOfDeclarationMarker,
  MergeDeclarationMarker,
  NotEmittedStatement,
  PartiallyEmittedExpression,
  SyntheticReferenceExpression
} from './asts/transformation_nodes.ast';
import {
  Block,
  BreakStatement,
  CaseBlock,
  ClassDeclaration,
  ContinueStatement,
  DebuggerStatement,
  DoStatement,
  EmptyStatement,
  EnumDeclaration,
  ExportAssignment,
  ExportDeclaration,
  ExportSpecifier,
  ExpressionStatement,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  FunctionDeclaration,
  IfStatement,
  ImportClause,
  ImportDeclaration,
  ImportEqualsDeclaration,
  ImportSpecifier,
  InterfaceDeclaration,
  LabeledStatement,
  MissingDeclaration,
  ModuleBlock,
  ModuleDeclaration,
  NamedExports,
  NamedImports,
  NamespaceExport,
  NamespaceExportDeclaration,
  NamespaceImport,
  ReturnStatement,
  SwitchStatement,
  ThrowStatement,
  TryStatement,
  TypeAliasDeclaration,
  VariableDeclaration,
  VariableDeclarationList,
  VariableStatement,
  WhileStatement,
  WithStatement
} from './asts/element.ast';
import { KeywordToken, PunctuationToken } from './asts/token.ast';
import { Decorator, ParameterDeclaration, TypeParameterDeclaration } from './asts/signature_elements.ast';
import {
  CallSignature,
  ConstructorDeclaration,
  ConstructSignature,
  GetAccessorDeclaration,
  IndexSignature,
  MethodDeclaration,
  MethodSignature,
  PropertyDeclaration,
  PropertySignature,
  SetAccessorDeclaration,
  TemplateLiteralTypeSpan
} from './asts/type_elements.ast';
import {
  ArrayTypeNode,
  ConditionalTypeNode,
  ConstructorTypeNode,
  FunctionTypeNode,
  ImportTypeNode,
  IndexedAccessTypeNode,
  InferTypeNode,
  IntersectionTypeNode,
  LiteralTypeNode,
  MappedTypeNode,
  NamedTupleMember,
  OptionalTypeNode,
  ParenthesizedType,
  RestTypeNode,
  TemplateLiteralType,
  ThisTypeNode,
  TupleTypeNode,
  TypeLiteralNode,
  TypeOperatorNode,
  TypePredicateNode,
  TypeQueryNode,
  TypeReferenceNode,
  UnionTypeNode
} from './asts/types.ast';
import { ArrayBindingPattern, BindingElement, ObjectBindingPattern } from './asts/binding_patterns.ast';
import { SyntaxList, SyntheticExpression } from './asts/synthetic_nodes.ast';
import { SemicolonClassElement, TemplateSpan } from './asts/misc.ast';


export function isNumericLiteral(node: Node): node is NumericLiteral {
  return node instanceof NumericLiteral;
}

export function isBigIntLiteral(node: Node): node is BigIntLiteral {
  return node instanceof BigIntLiteral;
}

export function isStringLiteral(node: Node): node is StringLiteral {
  return node instanceof StringLiteral;
}

export function isJsxText(node: Node): node is JsxText {
  return node instanceof JsxText;
}

export function isRegularExpressionLiteral(node: Node): node is RegularExpressionLiteral {
  return node instanceof RegularExpressionLiteral;
}

export function isNoSubstitutionTemplateLiteral(node: Node): node is NoSubstitutionTemplateLiteral {
  return node instanceof NoSubstitutionTemplateLiteral;
}

// Pseudo-literals

export function isTemplateHead(node: Node): node is TemplateHead {
  return node instanceof TemplateHead;
}

export function isTemplateMiddle(node: Node): node is TemplateMiddle {
  return node instanceof TemplateMiddle;
}

export function isTemplateTail(node: Node): node is TemplateTail {
  return node instanceof TemplateTail;
}

// Identifiers

export function isIdentifier(node: Node): node is Identifier {
  return node instanceof Identifier;
}

// Names

export function isQualifiedName(node: Node): node is QualifiedName {
  return node instanceof QualifiedName;
}

export function isComputedPropertyName(node: Node): node is ComputedPropertyName {
  return node instanceof ComputedPropertyName;
}

export function isPrivateIdentifier(node: Node): node is PrivateIdentifier {
  return node instanceof PrivateIdentifier;
}

// Tokens

/*@internal*/
export function isSuperKeyword(node: Node): node is KeywordToken {
  return node instanceof KeywordToken && node.token === KeywordSyntaxKind.SuperKeyword;
}

/*@internal*/
export function isImportKeyword(node: Node): node is KeywordToken {
  return node instanceof KeywordToken && node.token === KeywordSyntaxKind.ImportKeyword;
}

/*@internal*/
export function isCommaToken(node: Node): node is PunctuationToken<PunctuationSyntaxKind.CommaToken> {
  return node instanceof PunctuationToken && node.token === PunctuationSyntaxKind.CommaToken;
}

/*@internal*/
export function isQuestionToken(node: Node): node is PunctuationToken<PunctuationSyntaxKind.QuestionToken> {
  return node instanceof PunctuationToken && node.token === PunctuationSyntaxKind.QuestionToken;
}

/*@internal*/
export function isExclamationToken(node: Node): node is PunctuationToken<PunctuationSyntaxKind.ExclamationToken> {
  return node instanceof PunctuationToken && node.token === PunctuationSyntaxKind.ExclamationToken;
}

// Signature elements

export function isTypeParameterDeclaration(node: Node): node is TypeParameterDeclaration {
  return node instanceof TypeParameterDeclaration;
}

export function isParameterDeclaration(node: Node): node is ParameterDeclaration {
  return node instanceof ParameterDeclaration;
}

export function isDecorator(node: Node): node is Decorator {
  return node instanceof Decorator;
}

// TypeMember

export function isPropertySignature(node: Node): node is PropertySignature {
  return node instanceof PropertySignature;
}

export function isPropertyDeclaration(node: Node): node is PropertyDeclaration {
  return node instanceof PropertyDeclaration;
}

export function isMethodSignature(node: Node): node is MethodSignature {
  return node instanceof MethodSignature;
}

export function isMethodDeclaration(node: Node): node is MethodDeclaration {
  return node instanceof MethodDeclaration;
}

export function isConstructorDeclaration(node: Node): node is ConstructorDeclaration {
  return node instanceof ConstructorDeclaration;
}

export function isGetAccessorDeclaration(node: Node): node is GetAccessorDeclaration {
  return node instanceof GetAccessorDeclaration;
}

export function isSetAccessorDeclaration(node: Node): node is SetAccessorDeclaration {
  return node instanceof SetAccessorDeclaration;
}

export function isCallSignature(node: Node): node is CallSignature {
  return node instanceof CallSignature;
}

export function isConstructSignatureDeclaration(node: Node): node is ConstructSignatureDeclaration {
  return node instanceof ConstructSignature;
}

export function isIndexSignatureDeclaration(node: Node): node is IndexSignatureDeclaration {
  return node instanceof IndexSignature;
}

// Type

export function isTypePredicateNode(node: Node): node is TypePredicateNode {
  return node instanceof TypePredicateNode; //TypePredicate
}

export function isTypeReferenceNode(node: Node): node is TypeReferenceNode {
  return node instanceof TypeReferenceNode; //TypeReference
}

export function isFunctionTypeNode(node: Node): node is FunctionTypeNode {
  return node instanceof FunctionTypeNode; //FunctionType
}

export function isConstructorTypeNode(node: Node): node is ConstructorTypeNode {
  return node instanceof ConstructorTypeNode; //ConstructorType
}

export function isTypeQueryNode(node: Node): node is TypeQueryNode {
  return node instanceof TypeQueryNode; //TypeQuery
}

export function isTypeLiteralNode(node: Node): node is TypeLiteralNode {
  return node instanceof TypeLiteralNode; //TypeLiteral
}

export function isArrayTypeNode(node: Node): node is ArrayTypeNode {
  return node instanceof ArrayTypeNode; //ArrayType
}

export function isTupleTypeNode(node: Node): node is TupleTypeNode {
  return node instanceof TupleTypeNode; //TupleType
}

export function isNamedTupleMember(node: Node): node is NamedTupleMember {
  return node instanceof NamedTupleMember;
}

export function isOptionalTypeNode(node: Node): node is OptionalTypeNode {
  return node instanceof OptionalTypeNode; //OptionalType
}

export function isRestTypeNode(node: Node): node is RestTypeNode {
  return node instanceof RestTypeNode; //RestType
}

export function isUnionTypeNode(node: Node): node is UnionTypeNode {
  return node instanceof UnionTypeNode; //UnionType
}

export function isIntersectionTypeNode(node: Node): node is IntersectionTypeNode {
  return node instanceof IntersectionTypeNode; //IntersectionType
}

export function isConditionalTypeNode(node: Node): node is ConditionalTypeNode {
  return node instanceof ConditionalTypeNode; //ConditionalType
}

export function isInferTypeNode(node: Node): node is InferTypeNode {
  return node instanceof InferTypeNode; //InferType
}

export function isParenthesizedTypeNode(node: Node): node is ParenthesizedTypeNode {
  return node instanceof ParenthesizedType; //ParenthesizedType
}

export function isThisTypeNode(node: Node): node is ThisTypeNode {
  return node instanceof ThisTypeNode; //ThisType
}

export function isTypeOperatorNode(node: Node): node is TypeOperatorNode {
  return node instanceof TypeOperatorNode; //TypeOperator
}

export function isIndexedAccessTypeNode(node: Node): node is IndexedAccessTypeNode {
  return node instanceof IndexedAccessTypeNode; //IndexedAccessType
}

export function isMappedTypeNode(node: Node): node is MappedTypeNode {
  return node instanceof MappedTypeNode; //MappedType
}

export function isLiteralTypeNode(node: Node): node is LiteralTypeNode {
  return node instanceof LiteralTypeNode; //LiteralType
}

export function isImportTypeNode(node: Node): node is ImportTypeNode {
  return node instanceof ImportTypeNode; //ImportType
}

export function isTemplateLiteralTypeSpan(node: Node): node is TemplateLiteralTypeSpan {
  return node instanceof TemplateLiteralTypeSpan;
}

export function isTemplateLiteralTypeNode(node: Node): node is TemplateLiteralTypeNode {
  return node instanceof TemplateLiteralType; //TemplateLiteralType
}

// Binding patterns

export function isObjectBindingPattern(node: Node): node is ObjectBindingPattern {
  return node instanceof ObjectBindingPattern;
}

export function isArrayBindingPattern(node: Node): node is ArrayBindingPattern {
  return node instanceof ArrayBindingPattern;
}

export function isBindingElement(node: Node): node is BindingElement {
  return node instanceof BindingElement;
}

// Expression

export function isArrayLiteralExpression(node: Node): node is ArrayLiteralExpression {
  return node instanceof ArrayLiteralExpression;
}

export function isObjectLiteralExpression(node: Node): node is ObjectLiteralExpression {
  return node instanceof ObjectLiteralExpression;
}

export function isPropertyAccessExpression(node: Node): node is PropertyAccessExpression {
  return node instanceof PropertyAccessExpression;
}

export function isElementAccessExpression(node: Node): node is ElementAccessExpression {
  return node instanceof ElementAccessExpression;
}

export function isCallExpression(node: Node): node is CallExpression {
  return node instanceof CallExpression;
}

export function isNewExpression(node: Node): node is NewExpression {
  return node instanceof NewExpression;
}

export function isTaggedTemplateExpression(node: Node): node is TaggedTemplateExpression {
  return node instanceof TaggedTemplateExpression;
}

export function isTypeAssertionExpression(node: Node): node is TypeAssertion {
  return node instanceof TypeAssertion;
}

export function isParenthesizedExpression(node: Node): node is ParenthesizedExpression {
  return node instanceof ParenthesizedExpression;
}

export function isFunctionExpression(node: Node): node is FunctionExpression {
  return node instanceof FunctionExpression;
}

export function isArrowFunction(node: Node): node is ArrowFunction {
  return node instanceof ArrowFunction;
}

export function isDeleteExpression(node: Node): node is DeleteExpression {
  return node instanceof DeleteExpression;
}

export function isTypeOfExpression(node: Node): node is TypeOfExpression {
  return node instanceof TypeOfExpression;
}

export function isVoidExpression(node: Node): node is VoidExpression {
  return node instanceof VoidExpression;
}

export function isAwaitExpression(node: Node): node is AwaitExpression {
  return node instanceof AwaitExpression;
}

export function isPrefixUnaryExpression(node: Node): node is PrefixUnaryExpression {
  return node instanceof PrefixUnaryExpression;
}

export function isPostfixUnaryExpression(node: Node): node is PostfixUnaryExpression {
  return node instanceof PostfixUnaryExpression;
}

export function isBinaryExpression(node: Node): node is BinaryExpression {
  return node instanceof BinaryExpression;
}

export function isConditionalExpression(node: Node): node is ConditionalExpression {
  return node instanceof ConditionalExpression;
}

export function isTemplateExpression(node: Node): node is TemplateExpression {
  return node instanceof TemplateExpression;
}

export function isYieldExpression(node: Node): node is YieldExpression {
  return node instanceof YieldExpression;
}

export function isSpreadElement(node: Node): node is SpreadElement {
  return node instanceof SpreadElement;
}

export function isClassExpression(node: Node): node is ClassExpression {
  return node instanceof ClassExpression;
}

export function isOmittedExpression(node: Node): node is OmittedExpression {
  return node instanceof OmittedExpression;
}

export function isExpressionWithTypeArguments(node: Node): node is ExpressionWithTypeArguments {
  return node instanceof ExpressionWithTypeArguments;
}

export function isAsExpression(node: Node): node is AsExpression {
  return node instanceof AsExpression;
}

export function isNonNullExpression(node: Node): node is NonNullExpression {
  return node instanceof NonNullExpression;
}

export function isMetaProperty(node: Node): node is MetaProperty {
  return node instanceof MetaProperty;
}

export function isSyntheticExpression(node: Node): node is SyntheticExpression {
  return node instanceof SyntheticExpression;
}

export function isPartiallyEmittedExpression(node: Node): node is PartiallyEmittedExpression {
  return node instanceof PartiallyEmittedExpression;
}

export function isCommaListExpression(node: Node): node is CommaListExpression {
  return node instanceof CommaListExpression;
}

// Misc

export function isTemplateSpan(node: Node): node is TemplateSpan {
  return node instanceof TemplateSpan;
}

export function isSemicolonClassElement(node: Node): node is SemicolonClassElement {
  return node instanceof SemicolonClassElement;
}

// Elements

export function isBlock(node: Node): node is Block {
  return node instanceof Block;
}

export function isVariableStatement(node: Node): node is VariableStatement {
  return node instanceof VariableStatement;
}

export function isEmptyStatement(node: Node): node is EmptyStatement {
  return node instanceof EmptyStatement;
}

export function isExpressionStatement(node: Node): node is ExpressionStatement {
  return node instanceof ExpressionStatement;
}

export function isIfStatement(node: Node): node is IfStatement {
  return node instanceof IfStatement;
}

export function isDoStatement(node: Node): node is DoStatement {
  return node instanceof DoStatement;
}

export function isWhileStatement(node: Node): node is WhileStatement {
  return node instanceof WhileStatement;
}

export function isForStatement(node: Node): node is ForStatement {
  return node instanceof ForStatement;
}

export function isForInStatement(node: Node): node is ForInStatement {
  return node instanceof ForInStatement;
}

export function isForOfStatement(node: Node): node is ForOfStatement {
  return node instanceof ForOfStatement;
}

export function isContinueStatement(node: Node): node is ContinueStatement {
  return node instanceof ContinueStatement;
}

export function isBreakStatement(node: Node): node is BreakStatement {
  return node instanceof BreakStatement;
}

export function isReturnStatement(node: Node): node is ReturnStatement {
  return node instanceof ReturnStatement;
}

export function isWithStatement(node: Node): node is WithStatement {
  return node instanceof WithStatement;
}

export function isSwitchStatement(node: Node): node is SwitchStatement {
  return node instanceof SwitchStatement;
}

export function isLabeledStatement(node: Node): node is LabeledStatement {
  return node instanceof LabeledStatement;
}

export function isThrowStatement(node: Node): node is ThrowStatement {
  return node instanceof ThrowStatement;
}

export function isTryStatement(node: Node): node is TryStatement {
  return node instanceof TryStatement;
}

export function isDebuggerStatement(node: Node): node is DebuggerStatement {
  return node instanceof DebuggerStatement;
}

export function isVariableDeclaration(node: Node): node is VariableDeclaration {
  return node instanceof VariableDeclaration;
}

export function isVariableDeclarationList(node: Node): node is VariableDeclarationList {
  return node instanceof VariableDeclarationList;
}

export function isFunctionDeclaration(node: Node): node is FunctionDeclaration {
  return node instanceof FunctionDeclaration;
}

export function isClassDeclaration(node: Node): node is ClassDeclaration {
  return node instanceof ClassDeclaration;
}

export function isInterfaceDeclaration(node: Node): node is InterfaceDeclaration {
  return node instanceof InterfaceDeclaration;
}

export function isTypeAliasDeclaration(node: Node): node is TypeAliasDeclaration {
  return node instanceof TypeAliasDeclaration;
}

export function isEnumDeclaration(node: Node): node is EnumDeclaration {
  return node instanceof EnumDeclaration;
}

export function isModuleDeclaration(node: Node): node is ModuleDeclaration {
  return node instanceof ModuleDeclaration;
}

export function isModuleBlock(node: Node): node is ModuleBlock {
  return node instanceof ModuleBlock;
}

export function isCaseBlock(node: Node): node is CaseBlock {
  return node instanceof CaseBlock;
}

export function isNamespaceExportDeclaration(node: Node): node is NamespaceExportDeclaration {
  return node instanceof NamespaceExportDeclaration;
}

export function isImportEqualsDeclaration(node: Node): node is ImportEqualsDeclaration {
  return node instanceof ImportEqualsDeclaration;
}

export function isImportDeclaration(node: Node): node is ImportDeclaration {
  return node instanceof ImportDeclaration;
}

export function isImportClause(node: Node): node is ImportClause {
  return node instanceof ImportClause;
}

export function isNamespaceImport(node: Node): node is NamespaceImport {
  return node instanceof NamespaceImport;
}

export function isNamespaceExport(node: Node): node is NamespaceExport {
  return node instanceof NamespaceExport;
}

export function isNamedImports(node: Node): node is NamedImports {
  return node instanceof NamedImports;
}

export function isImportSpecifier(node: Node): node is ImportSpecifier {
  return node instanceof ImportSpecifier;
}

export function isExportAssignment(node: Node): node is ExportAssignment {
  return node instanceof ExportAssignment;
}

export function isExportDeclaration(node: Node): node is ExportDeclaration {
  return node instanceof ExportDeclaration;
}

export function isNamedExports(node: Node): node is NamedExports {
  return node instanceof NamedExports;
}

export function isExportSpecifier(node: Node): node is ExportSpecifier {
  return node instanceof ExportSpecifier;
}

export function isMissingDeclaration(node: Node): node is MissingDeclaration {
  return node instanceof MissingDeclaration;
}

export function isNotEmittedStatement(node: Node): node is NotEmittedStatement {
  return node instanceof NotEmittedStatement;
}

/* @internal */
export function isSyntheticReference(node: Node): node is SyntheticReferenceExpression {
  return node instanceof SyntheticReferenceExpression;
}

/* @internal */
export function isMergeDeclarationMarker(node: Node): node is MergeDeclarationMarker {
  return node instanceof MergeDeclarationMarker;
}

/* @internal */
export function isEndOfDeclarationMarker(node: Node): node is EndOfDeclarationMarker {
  return node instanceof EndOfDeclarationMarker;
}

// Module References

export function isExternalModuleReference(node: Node): node is ExternalModuleReference {
  return node instanceof ExternalModuleReference;
}

// JSX

export function isJsxElement(node: Node): node is JsxElement {
  return node instanceof JsxElement;
}

export function isJsxSelfClosingElement(node: Node): node is JsxSelfClosingElement {
  return node instanceof JsxSelfClosingElement;
}

export function isJsxOpeningElement(node: Node): node is JsxOpeningElement {
  return node instanceof JsxOpeningElement;
}

export function isJsxClosingElement(node: Node): node is JsxClosingElement {
  return node instanceof JsxClosingElement;
}

export function isJsxFragment(node: Node): node is JsxFragment {
  return node instanceof JsxFragment;
}

export function isJsxOpeningFragment(node: Node): node is JsxOpeningFragment {
  return node instanceof JsxOpeningFragment;
}

// export function isJsxClosingFragment(node: Node): node is JsxClosingFragment {
//   return node instanceof JsxClosingFragment;
// }

export function isJsxAttribute(node: Node): node is JsxAttribute {
  return node instanceof JsxAttribute;
}

export function isJsxAttributes(node: Node): node is JsxAttributes {
  return node instanceof JsxAttributes;
}

export function isJsxSpreadAttribute(node: Node): node is JsxSpreadAttribute {
  return node instanceof JsxSpreadAttribute;
}

export function isJsxExpression(node: Node): node is JsxExpression {
  return node instanceof JsxExpression;
}

// Clauses

export function isCaseClause(node: Node): node is CaseClause {
  return node instanceof CaseClause;
}

export function isDefaultClause(node: Node): node is DefaultClause {
  return node instanceof DefaultClause;
}

export function isHeritageClause(node: Node): node is HeritageClause {
  return node instanceof HeritageClause;
}

export function isCatchClause(node: Node): node is CatchClause {
  return node instanceof CatchClause;
}

// Property assignments

export function isPropertyAssignment(node: Node): node is PropertyAssignment {
  return node instanceof PropertyAssignment;
}

export function isShorthandPropertyAssignment(node: Node): node is ShorthandPropertyAssignment {
  return node instanceof ShorthandPropertyAssignment;
}

export function isSpreadAssignment(node: Node): node is SpreadAssignment {
  return node instanceof SpreadAssignment;
}

// Enum

export function isEnumMember(node: Node): node is EnumMember {
  return node instanceof EnumMember;
}

// Unparsed

export function isUnparsedPrepend(node: Node): node is UnparsedPrepend {
  return node instanceof UnparsedPrepend;
}

// Top-level nodes
export function isSourceFile(node: Node): node is SourceFile {
  return node instanceof SourceFile;
}

export function isBundle(node: Node): node is Bundle {
  return node instanceof Bundle;
}

export function isUnparsedSource(node: Node): node is UnparsedSource {
  return node instanceof UnparsedSource;
}

// JSDoc Elements

export function isJSDocTypeExpression(node: Node): node is JSDocTypeExpression {
  return node instanceof JSDocTypeExpression;
}

export function isJSDocNameReference(node: Node): node is JSDocNameReference {
  return node instanceof JSDocNameReference;
}

// export function isJSDocAllType(node: Node): node is JSDocAllType {
//   return node instanceof JSDocAllType;
// }
//
// export function isJSDocUnknownType(node: Node): node is JSDocUnknownType {
//   return node instanceof JSDocUnknownType;
// }
//
// export function isJSDocNullableType(node: Node): node is JSDocNullableType {
//   return node instanceof JSDocNullableType;
// }
//
// export function isJSDocNonNullableType(node: Node): node is JSDocNonNullableType {
//   return node instanceof JSDocNonNullableType;
// }
//
// export function isJSDocOptionalType(node: Node): node is JSDocOptionalType {
//   return node instanceof JSDocOptionalType;
// }

export function isJSDocFunctionType(node: Node): node is JSDocFunctionType {
  return node instanceof JSDocFunctionType;
}

// export function isJSDocVariadicType(node: Node): node is JSDocVariadicType {
//   return node instanceof JSDocVariadicType;
// }
//
// export function isJSDocNamepathType(node: Node): node is JSDocNamepathType {
//   return node instanceof JSDocNamepathType;
// }

export function isJSDoc(node: Node): node is JSDoc {
  return node instanceof JSDocComment;
}

export function isJSDocTypeLiteral(node: Node): node is JSDocTypeLiteral {
  return node instanceof JSDocTypeLiteral;
}

export function isJSDocSignature(node: Node): node is JSDocSignature {
  return node instanceof JSDocSignature;
}

// JSDoc Tags

export function isJSDocAugmentsTag(node: Node): node is JSDocAugmentsTag {
  return node instanceof JSDocAugmentsTag;
}

// export function isJSDocAuthorTag(node: Node): node is JSDocAuthorTag {
//   return node instanceof JSDocAuthorTag;
// }
//
// export function isJSDocClassTag(node: Node): node is JSDocClassTag {
//   return node instanceof JSDocClassTag;
// }

export function isJSDocCallbackTag(node: Node): node is JSDocCallbackTag {
  return node instanceof JSDocCallbackTag;
}

// export function isJSDocPublicTag(node: Node): node is JSDocPublicTag {
//   return node instanceof JSDocPublicTag;
// }
//
// export function isJSDocPrivateTag(node: Node): node is JSDocPrivateTag {
//   return node instanceof JSDocPrivateTag;
// }
//
// export function isJSDocProtectedTag(node: Node): node is JSDocProtectedTag {
//   return node instanceof JSDocProtectedTag;
// }
//
// export function isJSDocReadonlyTag(node: Node): node is JSDocReadonlyTag {
//   return node instanceof JSDocReadonlyTag;
// }
//
// export function isJSDocDeprecatedTag(node: Node): node is JSDocDeprecatedTag {
//   return node instanceof JSDocDeprecatedTag;
//
// }
//
// export function isJSDocEnumTag(node: Node): node is JSDocEnumTag {
//   return node instanceof JSDocEnumTag;
// }

export function isJSDocParameterTag(node: Node): node is JSDocParameterTag {
  return node instanceof JSDocParameterTag;
}

// export function isJSDocReturnTag(node: Node): node is JSDocReturnTag {
//   return node instanceof JSDocReturnTag;
// }

// export function isJSDocThisTag(node: Node): node is JSDocThisTag {
//   return node instanceof JSDocThisTag;
// }
//
// export function isJSDocTypeTag(node: Node): node is JSDocTypeTag {
//   return node instanceof JSDocTypeTag;
// }

export function isJSDocTemplateTag(node: Node): node is JSDocTemplateTag {
  return node instanceof JSDocTemplateTag;
}

export function isJSDocTypedefTag(node: Node): node is JSDocTypedefTag {
  return node instanceof JSDocTypedefTag;
}

export function isJSDocUnknownTag(node: Node): node is JSDocUnknownTag {
  return node instanceof JSDocUnknownTag;
}

export function isJSDocPropertyTag(node: Node): node is JSDocPropertyTag {
  return node instanceof JSDocPropertyTag;
}

export function isJSDocImplementsTag(node: Node): node is JSDocImplementsTag {
  return node instanceof JSDocImplementsTag;
}

// Synthesized list

/* @internal */
export function isSyntaxList(n: Node): n is SyntaxList {
  return n instanceof SyntaxList;
}
