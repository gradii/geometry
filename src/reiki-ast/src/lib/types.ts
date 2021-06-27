export interface TextRange {
  pos: number;
  end: number;
}

export interface ReadonlyTextRange {
  readonly pos: number;
  readonly end: number;
}

export enum SyntaxKind {
  SingleLineCommentTrivia,
  MultiLineCommentTrivia,
  EndOfFileToken = 'end of file token'
}

export enum JSDocSyntaxKind {
  // JSDoc nodes
  JSDocTypeExpression = 'reiki:jsdoc JSDoc type expression',
  JSDocNameReference = 'reiki:jsdoc JSDoc name reference',
  // The * type
  JSDocAllType = 'reiki:jsdoc JSDoc all type',
  // The ? type
  JSDocUnknownType = 'reiki:jsdoc JSDoc unknown type',
  JSDocNullableType = 'reiki:jsdoc JSDoc nullable type',
  JSDocNonNullableType = 'reiki:jsdoc JSDoc non nullable type',
  JSDocOptionalType = 'reiki:jsdoc JSDoc optional type',
  JSDocFunctionType = 'reiki:jsdoc JSDoc function type',
  JSDocVariadicType = 'reiki:jsdoc JSDoc variadic type',
  // https://jsdoc.app/about-namepaths.html
  JSDocNamepathType = 'reiki:jsdoc JSDoc namepath type',
  JSDocComment = 'reiki:jsdoc JSDoc comment',
  JSDocTypeLiteral = 'reiki:jsdoc JSDoc type literal',
  JSDocSignature = 'reiki:jsdoc JSDoc signature',
  JSDocTag = 'reiki:jsdoc JSDoc tag',
  JSDocAugmentsTag = 'reiki:jsdoc JSDoc augments tag',
  JSDocImplementsTag = 'reiki:jsdoc JSDoc implements tag',
  JSDocAuthorTag = 'reiki:jsdoc JSDoc author tag',
  JSDocDeprecatedTag = 'reiki:jsdoc JSDoc deprecated tag',
  JSDocClassTag = 'reiki:jsdoc JSDoc class tag',
  JSDocPublicTag = 'reiki:jsdoc JSDoc public tag',
  JSDocPrivateTag = 'reiki:jsdoc JSDoc private tag',
  JSDocProtectedTag = 'reiki:jsdoc JSDoc protected tag',
  JSDocReadonlyTag = 'reiki:jsdoc JSDoc readonly tag',
  JSDocCallbackTag = 'reiki:jsdoc JSDoc callback tag',
  JSDocEnumTag = 'reiki:jsdoc JSDoc enum tag',
  JSDocParameterTag = 'reiki:jsdoc JSDoc parameter tag',
  JSDocReturnTag = 'reiki:jsdoc JSDoc return tag',
  JSDocThisTag = 'reiki:jsdoc JSDoc this tag',
  JSDocTypeTag = 'reiki:jsdoc JSDoc type tag',
  JSDocTemplateTag = 'reiki:jsdoc JSDoc template tag',
  JSDocTypedefTag = 'reiki:jsdoc JSDoc typedef tag',
  JSDocSeeTag = 'reiki:jsdoc JSDoc see tag',
  JSDocPropertyTag = 'reiki:jsdoc JSDoc property tag',
}

export enum PunctuationSyntaxKind {
  OpenBraceToken = 'reiki:punctuation open brace token',
  CloseBraceToken = 'reiki:punctuation close brace token',
  OpenParenToken = 'reiki:punctuation open paren token',
  CloseParenToken = 'reiki:punctuation close paren token',
  OpenBracketToken = 'reiki:punctuation open bracket token',
  CloseBracketToken = 'reiki:punctuation close bracket token',
  DotToken = 'reiki:punctuation dot token',
  DotDotDotToken = 'reiki:punctuation dot dot dot token',
  SemicolonToken = 'reiki:punctuation semicolon token',
  CommaToken = 'reiki:punctuation comma token',
  QuestionDotToken = 'reiki:punctuation question dot token',
  LessThanToken = 'reiki:punctuation less than token',
  LessThanSlashToken = 'reiki:punctuation less than slash token',
  GreaterThanToken = 'reiki:punctuation greater than token',
  LessThanEqualsToken = 'reiki:punctuation less than equals token',
  GreaterThanEqualsToken = 'reiki:punctuation greater than equals token',
  EqualsEqualsToken = 'reiki:punctuation equals equals token',
  ExclamationEqualsToken = 'reiki:punctuation exclamation equals token',
  EqualsEqualsEqualsToken = 'reiki:punctuation equals equals equals token',
  ExclamationEqualsEqualsToken = 'reiki:punctuation exclamation equals equals token',
  EqualsGreaterThanToken = 'reiki:punctuation equals greater than token',
  PlusToken = 'reiki:punctuation plus token',
  MinusToken = 'reiki:punctuation minus token',
  AsteriskToken = 'reiki:punctuation asterisk token',
  AsteriskAsteriskToken = 'reiki:punctuation asterisk asterisk token',
  SlashToken = 'reiki:punctuation slash token',
  PercentToken = 'reiki:punctuation percent token',
  PlusPlusToken = 'reiki:punctuation plus plus token',
  MinusMinusToken = 'reiki:punctuation minus minus token',
  LessThanLessThanToken = 'reiki:punctuation less than less than token',
  GreaterThanGreaterThanToken = 'reiki:punctuation greater than greater than token',
  GreaterThanGreaterThanGreaterThanToken = 'reiki:punctuation greater than greater than greater than token',
  AmpersandToken = 'reiki:punctuation ampersand token',
  BarToken = 'reiki:punctuation bar token',
  CaretToken = 'reiki:punctuation caret token',
  ExclamationToken = 'reiki:punctuation exclamation token',
  TildeToken = 'reiki:punctuation tilde token',
  AmpersandAmpersandToken = 'reiki:punctuation ampersand ampersand token',
  BarBarToken = 'reiki:punctuation bar bar token',
  QuestionQuestionToken = 'reiki:punctuation question question token',
  QuestionToken = 'reiki:punctuation question token',
  ColonToken = 'reiki:punctuation colon token',
  AtToken = 'reiki:punctuation at token',
  BacktickToken = 'reiki:punctuation backtick token',
  EqualsToken = 'reiki:punctuation equals token',
  PlusEqualsToken = 'reiki:punctuation plus equals token',
  MinusEqualsToken = 'reiki:punctuation minus equals token',
  AsteriskEqualsToken = 'reiki:punctuation asterisk equals token',
  AsteriskAsteriskEqualsToken = 'reiki:punctuation asterisk asterisk equals token',
  SlashEqualsToken = 'reiki:punctuation slash equals token',
  PercentEqualsToken = 'reiki:punctuation percent equals token',
  LessThanLessThanEqualsToken = 'reiki:punctuation less than less than equals token',
  GreaterThanGreaterThanEqualsToken = 'reiki:punctuation greater than greater than equals token',
  GreaterThanGreaterThanGreaterThanEqualsToken = 'reiki:punctuation greater than greater than greater than equals token',
  AmpersandEqualsToken = 'reiki:punctuation ampersand equals token',
  BarEqualsToken = 'reiki:punctuation bar equals token',
  CaretEqualsToken = 'reiki:punctuation caret equals token',
  BarBarEqualsToken = 'reiki:punctuation bar bar equals token',
  AmpersandAmpersandEqualsToken = 'reiki:punctuation ampersand ampersand equals token',
  QuestionQuestionEqualsToken = 'reiki:punctuation question question equals token',
}

export enum KeywordSyntaxKind {
  AbstractKeyword = 'reiki:keyword abstract keyword',
  AnyKeyword = 'reiki:keyword any keyword',
  AsKeyword = 'reiki:keyword as keyword',
  AssertsKeyword = 'reiki:keyword asserts keyword',
  AsyncKeyword = 'reiki:keyword async keyword',
  AwaitKeyword = 'reiki:keyword await keyword',
  BigIntKeyword = 'reiki:keyword big int keyword',
  BooleanKeyword = 'reiki:keyword boolean keyword',
  BreakKeyword = 'reiki:keyword break keyword',
  CaseKeyword = 'reiki:keyword case keyword',
  CatchKeyword = 'reiki:keyword catch keyword',
  ClassKeyword = 'reiki:keyword class keyword',
  ConstKeyword = 'reiki:keyword const keyword',
  ConstructorKeyword = 'reiki:keyword constructor keyword',
  ContinueKeyword = 'reiki:keyword continue keyword',
  DebuggerKeyword = 'reiki:keyword debugger keyword',
  DeclareKeyword = 'reiki:keyword declare keyword',
  DefaultKeyword = 'reiki:keyword default keyword',
  DeleteKeyword = 'reiki:keyword delete keyword',
  DoKeyword = 'reiki:keyword do keyword',
  ElseKeyword = 'reiki:keyword else keyword',
  EnumKeyword = 'reiki:keyword enum keyword',
  ExportKeyword = 'reiki:keyword export keyword',
  ExtendsKeyword = 'reiki:keyword extends keyword',
  FalseKeyword = 'reiki:keyword false keyword',
  FinallyKeyword = 'reiki:keyword finally keyword',
  ForKeyword = 'reiki:keyword for keyword',
  FromKeyword = 'reiki:keyword from keyword',
  FunctionKeyword = 'reiki:keyword function keyword',
  GetKeyword = 'reiki:keyword get keyword',
  GlobalKeyword = 'reiki:keyword global keyword',
  IfKeyword = 'reiki:keyword if keyword',
  ImplementsKeyword = 'reiki:keyword implements keyword',
  ImportKeyword = 'reiki:keyword import keyword',
  InferKeyword = 'reiki:keyword infer keyword',
  InKeyword = 'reiki:keyword in keyword',
  InstanceOfKeyword = 'reiki:keyword instance of keyword',
  InterfaceKeyword = 'reiki:keyword interface keyword',
  IntrinsicKeyword = 'reiki:keyword intrinsic keyword',
  IsKeyword = 'reiki:keyword is keyword',
  KeyOfKeyword = 'reiki:keyword key of keyword',
  LetKeyword = 'reiki:keyword let keyword',
  ModuleKeyword = 'reiki:keyword module keyword',
  NamespaceKeyword = 'reiki:keyword namespace keyword',
  NeverKeyword = 'reiki:keyword never keyword',
  NewKeyword = 'reiki:keyword new keyword',
  NullKeyword = 'reiki:keyword null keyword',
  NumberKeyword = 'reiki:keyword number keyword',
  ObjectKeyword = 'reiki:keyword object keyword',
  OfKeyword = 'reiki:keyword of keyword',
  PackageKeyword = 'reiki:keyword package keyword',
  PrivateKeyword = 'reiki:keyword private keyword',
  ProtectedKeyword = 'reiki:keyword protected keyword',
  PublicKeyword = 'reiki:keyword public keyword',
  ReadonlyKeyword = 'reiki:keyword readonly keyword',
  RequireKeyword = 'reiki:keyword require keyword',
  ReturnKeyword = 'reiki:keyword return keyword',
  SetKeyword = 'reiki:keyword set keyword',
  StaticKeyword = 'reiki:keyword static keyword',
  StringKeyword = 'reiki:keyword string keyword',
  SuperKeyword = 'reiki:keyword super keyword',
  SwitchKeyword = 'reiki:keyword switch keyword',
  SymbolKeyword = 'reiki:keyword symbol keyword',
  ThisKeyword = 'reiki:keyword this keyword',
  ThrowKeyword = 'reiki:keyword throw keyword',
  TrueKeyword = 'reiki:keyword true keyword',
  TryKeyword = 'reiki:keyword try keyword',
  TypeKeyword = 'reiki:keyword type keyword',
  TypeOfKeyword = 'reiki:keyword type of keyword',
  UndefinedKeyword = 'reiki:keyword undefined keyword',
  UniqueKeyword = 'reiki:keyword unique keyword',
  UnknownKeyword = 'reiki:keyword unknown keyword',
  VarKeyword = 'reiki:keyword var keyword',
  VoidKeyword = 'reiki:keyword void keyword',
  WhileKeyword = 'reiki:keyword while keyword',
  WithKeyword = 'reiki:keyword with keyword',
  YieldKeyword = 'reiki:keyword yield keyword',
}


// export enum ModifierSyntaxKind {
//   AbstractKeyword = 'abstract keyword',
//   AsyncKeyword = 'async keyword',
//   ConstKeyword = 'const keyword',
//   DeclareKeyword = 'declare keyword',
//   DefaultKeyword = 'default keyword',
//   ExportKeyword = 'export keyword',
//   PrivateKeyword = 'private keyword',
//   ProtectedKeyword = 'protected keyword',
//   PublicKeyword = 'public keyword',
//   ReadonlyKeyword = 'readonly keyword',
//   StaticKeyword = 'static keyword',
// }

// export enum KeywordTypeSyntaxKind {
//   AnyKeyword = 'any keyword',
//   BigIntKeyword = 'big int keyword',
//   BooleanKeyword = 'boolean keyword',
//   IntrinsicKeyword = 'intrinsic keyword',
//   NeverKeyword = 'never keyword',
//   NumberKeyword = 'number keyword',
//   ObjectKeyword = 'object keyword',
//   StringKeyword = 'string keyword',
//   SymbolKeyword = 'symbol keyword',
//   UndefinedKeyword = 'undefined keyword',
//   UnknownKeyword = 'unknown keyword',
//   VoidKeyword = 'void keyword',
// }

//
// /* @internal */
// export type TypeNodeSyntaxKind =
//   | KeywordTypeSyntaxKind
//   | SyntaxKind.TypePredicate
//   | SyntaxKind.TypeReference
//   | SyntaxKind.FunctionType
//   | SyntaxKind.ConstructorType
//   | SyntaxKind.TypeQuery
//   | SyntaxKind.TypeLiteral
//   | SyntaxKind.ArrayType
//   | SyntaxKind.TupleType
//   | SyntaxKind.NamedTupleMember
//   | SyntaxKind.OptionalType
//   | SyntaxKind.RestType
//   | SyntaxKind.UnionType
//   | SyntaxKind.IntersectionType
//   | SyntaxKind.ConditionalType
//   | SyntaxKind.InferType
//   | SyntaxKind.ParenthesizedType
//   | SyntaxKind.ThisType
//   | SyntaxKind.TypeOperator
//   | SyntaxKind.IndexedAccessType
//   | SyntaxKind.MappedType
//   | SyntaxKind.LiteralType
//   | SyntaxKind.TemplateLiteralType
//   | SyntaxKind.TemplateLiteralTypeSpan
//   | SyntaxKind.ImportType
//   | SyntaxKind.ExpressionWithTypeArguments
//   | SyntaxKind.JSDocTypeExpression
//   | SyntaxKind.JSDocAllType
//   | SyntaxKind.JSDocUnknownType
//   | SyntaxKind.JSDocNonNullableType
//   | SyntaxKind.JSDocNullableType
//   | SyntaxKind.JSDocOptionalType
//   | SyntaxKind.JSDocFunctionType
//   | SyntaxKind.JSDocVariadicType
//   | SyntaxKind.JSDocNamepathType
//   | SyntaxKind.JSDocSignature
//   | SyntaxKind.JSDocTypeLiteral
//   ;
//
// export type TokenSyntaxKind =
//   | SyntaxKind.Unknown
//   | SyntaxKind.EndOfFileToken
//   | TriviaSyntaxKind
//   | LiteralSyntaxKind
//   | PseudoLiteralSyntaxKind
//   | PunctuationSyntaxKind
//   | SyntaxKind.Identifier
//   | KeywordSyntaxKind
//   ;
//
// export type JsxTokenSyntaxKind =
//   | SyntaxKind.LessThanSlashToken
//   | SyntaxKind.EndOfFileToken
//   | SyntaxKind.ConflictMarkerTrivia
//   | SyntaxKind.JsxText
//   | SyntaxKind.JsxTextAllWhiteSpaces
//   | SyntaxKind.OpenBraceToken
//   | SyntaxKind.LessThanToken
//   ;
//
// export type JSDocSyntaxKind =
//   | SyntaxKind.EndOfFileToken
//   | SyntaxKind.WhitespaceTrivia
//   | SyntaxKind.AtToken
//   | SyntaxKind.NewLineTrivia
//   | SyntaxKind.AsteriskToken
//   | SyntaxKind.OpenBraceToken
//   | SyntaxKind.CloseBraceToken
//   | SyntaxKind.LessThanToken
//   | SyntaxKind.GreaterThanToken
//   | SyntaxKind.OpenBracketToken
//   | SyntaxKind.CloseBracketToken
//   | SyntaxKind.EqualsToken
//   | SyntaxKind.CommaToken
//   | SyntaxKind.DotToken
//   | SyntaxKind.Identifier
//   | SyntaxKind.BacktickToken
//   | SyntaxKind.Unknown
//   | KeywordSyntaxKind
//   ;

export const enum NodeFlags {
  None = 0,
  Let = 1 << 0,  // Variable declaration
  Const = 1 << 1,  // Variable declaration
  NestedNamespace = 1 << 2,  // Namespace declaration
  Synthesized = 1 << 3,  // Node was synthesized during transformation
  Namespace = 1 << 4,  // Namespace declaration
  OptionalChain = 1 << 5,  // Chained MemberExpression rooted to a pseudo-OptionalExpression
  ExportContext = 1 << 6,  // Export context (initialized by binding)
  ContainsThis = 1 << 7,  // Interface contains references to "this"
  HasImplicitReturn = 1 << 8,  // If function implicitly returns on one of codepaths (initialized by binding)
  HasExplicitReturn = 1 << 9,  // If function has explicit reachable return on one of codepaths (initialized by binding)
  GlobalAugmentation = 1 << 10,  // Set if module declaration is an augmentation for the global scope
  HasAsyncFunctions = 1 << 11, // If the file has async functions (initialized by binding)
  DisallowInContext = 1 << 12, // If node was parsed in a context where 'in-expressions' are not allowed
  YieldContext = 1 << 13, // If node was parsed in the 'yield' context created when parsing a generator
  DecoratorContext = 1 << 14, // If node was parsed as part of a decorator
  AwaitContext = 1 << 15, // If node was parsed in the 'await' context created when parsing an async function
  ThisNodeHasError = 1 << 16, // If the parser encountered an error when parsing the code that created this node
  JavaScriptFile = 1 << 17, // If node was parsed in a JavaScript
  ThisNodeOrAnySubNodesHasError = 1 << 18, // If this node or any of its children had an error
  HasAggregatedChildData = 1 << 19, // If we've computed data from children and cached it in this node

  // These flags will be set when the parser encounters a dynamic import expression or 'import.meta' to avoid
  // walking the tree if the flags are not set. However, these flags are just a approximation
  // (hence why it's named "PossiblyContainsDynamicImport") because once set, the flags never get cleared.
  // During editing, if a dynamic import is removed, incremental parsing will *NOT* clear this flag.
  // This means that the tree will always be traversed during module resolution, or when looking for external module indicators.
  // However, the removal operation should not occur often and in the case of the
  // removal, it is likely that users will add the import anyway.
  // The advantage of this approach is its simplicity. For the case of batch compilation,
  // we guarantee that users won't have to pay the price of walking the tree if a dynamic import isn't used.
  /* @internal */ PossiblyContainsDynamicImport = 1 << 20,
  /* @internal */ PossiblyContainsImportMeta = 1 << 21,

  JSDoc = 1 << 22, // If node was parsed inside jsdoc
  /* @internal */ Ambient = 1 << 23, // If node was inside an ambient context -- a declaration file, or inside something with the `declare` modifier.
  /* @internal */ InWithStatement = 1 << 24, // If any ancestor of node was the `statement` of a WithStatement (not the `expression`)
  JsonFile = 1 << 25, // If node was parsed in a Json
  /* @internal */ TypeCached = 1 << 26, // If a type was cached for node at any point
  /* @internal */ Deprecated = 1 << 27, // If has '@deprecated' JSDoc tag

  BlockScoped = Let | Const,

  ReachabilityCheckFlags = HasImplicitReturn | HasExplicitReturn,
  ReachabilityAndEmitFlags = ReachabilityCheckFlags | HasAsyncFunctions,

  // Parsing context flags
  ContextFlags = DisallowInContext |
    YieldContext |
    DecoratorContext |
    AwaitContext |
    JavaScriptFile |
    InWithStatement |
    Ambient,

  // Exclude these flags when parsing a Type
  TypeExcludesFlags = YieldContext | AwaitContext,

  // Represents all flags that are potentially set once and
  // never cleared on SourceFiles which get re-used in between incremental parses.
  // See the comment above on `PossiblyContainsDynamicImport` and `PossiblyContainsImportMeta`.
  /* @internal */ PermanentlySetIncrementalFlags = PossiblyContainsDynamicImport | PossiblyContainsImportMeta,
}

export const enum ModifierFlags {
  None = 0,
  Export = 1 << 0,  // Declarations
  Ambient = 1 << 1,  // Declarations
  Public = 1 << 2,  // Property/Method
  Private = 1 << 3,  // Property/Method
  Protected = 1 << 4,  // Property/Method
  Static = 1 << 5,  // Property/Method
  Readonly = 1 << 6,  // Property/Method
  Abstract = 1 << 7,  // Class/Method/ConstructSignature
  Async = 1 << 8,  // Property/Method/Function
  Default = 1 << 9,  // Function/Class (export default declaration)
  Const = 1 << 11, // Const enum
  HasComputedJSDocModifiers = 1 << 12, // Indicates the computed modifier flags include modifiers from JSDoc.

  Deprecated = 1 << 13, // Deprecated tag.
  HasComputedFlags = 1 << 29, // Modifier flags have been computed

  AccessibilityModifier = Public | Private | Protected,
  // Accessibility modifiers and 'readonly' can be attached to a parameter in a constructor to make it a property.
  ParameterPropertyModifier = AccessibilityModifier | Readonly,
  NonPublicAccessibilityModifier = Private | Protected,

  TypeScriptModifier = Ambient | Public | Private | Protected | Readonly | Abstract | Const,
  ExportDefault = Export | Default,
  All = Export |
    Ambient |
    Public |
    Private |
    Protected |
    Static |
    Readonly |
    Abstract |
    Async |
    Default |
    Const |
    Deprecated
}

export const enum JsxFlags {
  None = 0,
  /** An element from a named property of the JSX.IntrinsicElements interface */
  IntrinsicNamedElement = 1 << 0,
  /** An element inferred from the string index signature of the JSX.IntrinsicElements interface */
  IntrinsicIndexedElement = 1 << 1,

  IntrinsicElement = IntrinsicNamedElement | IntrinsicIndexedElement,
}

/* @internal */
export const enum RelationComparisonResult {
  Succeeded = 1 << 0, // Should be truthy
  Failed = 1 << 1,
  Reported = 1 << 2,

  ReportsUnmeasurable = 1 << 3,
  ReportsUnreliable = 1 << 4,
  ReportsMask = ReportsUnmeasurable | ReportsUnreliable
}

/* @internal */
export type NodeId = number;

export interface Node extends ReadonlyTextRange {
  readonly flags: NodeFlags;
  /* @internal */
  modifierFlagsCache: ModifierFlags;
}

export interface JSDocContainer {
  /* @internal */
  jsDoc?: JSDoc[];                      // JSDoc that directly precedes this node
  /* @internal */
  jsDocCache?: readonly JSDocTag[];     // Cache for getJSDocTags
}

export type HasJSDoc =
  | ParameterDeclaration
  | CallSignatureDeclaration
  | ConstructSignatureDeclaration
  | MethodSignature
  | PropertySignature
  | ArrowFunction
  | ParenthesizedExpression
  | SpreadAssignment
  | ShorthandPropertyAssignment
  | PropertyAssignment
  | FunctionExpression
  | LabeledStatement
  | ExpressionStatement
  | VariableStatement
  | FunctionDeclaration
  | ConstructorDeclaration
  | MethodDeclaration
  | PropertyDeclaration
  | AccessorDeclaration
  | ClassLikeDeclaration
  | InterfaceDeclaration
  | TypeAliasDeclaration
  | EnumMember
  | EnumDeclaration
  | ModuleDeclaration
  | ImportEqualsDeclaration
  | ImportDeclaration
  | NamespaceExportDeclaration
  | ExportAssignment
  | IndexSignatureDeclaration
  | FunctionTypeNode
  | ConstructorTypeNode
  | JSDocFunctionType
  | ExportDeclaration
  | NamedTupleMember
  | EndOfFileToken
  ;

export type HasType =
  | SignatureDeclaration
  | VariableDeclaration
  | ParameterDeclaration
  | PropertySignature
  | PropertyDeclaration
  | TypePredicateNode
  | ParenthesizedTypeNode
  | TypeOperatorNode
  | MappedTypeNode
  | AssertionExpression
  | TypeAliasDeclaration
  | JSDocTypeExpression
  | JSDocNonNullableType
  | JSDocNullableType
  | JSDocOptionalType
  | JSDocVariadicType
  ;

export type HasTypeArguments =
  | CallExpression
  | NewExpression
  | TaggedTemplateExpression
  | JsxOpeningElement
  | JsxSelfClosingElement;

export type HasInitializer =
  | HasExpressionInitializer
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | JsxAttribute
  ;

export type HasExpressionInitializer =
  | VariableDeclaration
  | ParameterDeclaration
  | BindingElement
  | PropertySignature
  | PropertyDeclaration
  | PropertyAssignment
  | EnumMember
  ;

// NOTE: Changing this list requires changes to `canHaveModifiers` in factory/utilities.ts and `updateModifiers` in factory/nodeFactory.ts
/* @internal */
export type HasModifiers =
  | ParameterDeclaration
  | PropertySignature
  | PropertyDeclaration
  | MethodSignature
  | MethodDeclaration
  | ConstructorDeclaration
  | GetAccessorDeclaration
  | SetAccessorDeclaration
  | IndexSignatureDeclaration
  | FunctionExpression
  | ArrowFunction
  | ClassExpression
  | VariableStatement
  | FunctionDeclaration
  | ClassDeclaration
  | InterfaceDeclaration
  | TypeAliasDeclaration
  | EnumDeclaration
  | ModuleDeclaration
  | ImportEqualsDeclaration
  | ImportDeclaration
  | ExportAssignment
  | ExportDeclaration
  ;

/* @internal */
export type MutableNodeArray<T extends Node> = NodeArray<T> & T[];

export interface NodeArray<T extends Node> extends ReadonlyArray<T>, ReadonlyTextRange {
  hasTrailingComma?: boolean;
  /* @internal */
  transformFlags: TransformFlags;   // Flags for transforms, possibly undefined
}

export const enum TransformFlags {
  None = 0,

  // Facts
  // - Flags used to indicate that a node or subtree contains syntax that requires transformation.
  ContainsTypeScript = 1 << 0,
  ContainsJsx = 1 << 1,
  ContainsESNext = 1 << 2,
  ContainsES2020 = 1 << 3,
  ContainsES2019 = 1 << 4,
  ContainsES2018 = 1 << 5,
  ContainsES2017 = 1 << 6,
  ContainsES2016 = 1 << 7,
  ContainsES2015 = 1 << 8,
  ContainsGenerator = 1 << 9,
  ContainsDestructuringAssignment = 1 << 10,

  // Markers
  // - Flags used to indicate that a subtree contains a specific transformation.
  ContainsTypeScriptClassSyntax = 1 << 11, // Decorators, Property Initializers, Parameter Property Initializers
  ContainsLexicalThis = 1 << 12,
  ContainsRestOrSpread = 1 << 13,
  ContainsObjectRestOrSpread = 1 << 14,
  ContainsComputedPropertyName = 1 << 15,
  ContainsBlockScopedBinding = 1 << 16,
  ContainsBindingPattern = 1 << 17,
  ContainsYield = 1 << 18,
  ContainsAwait = 1 << 19,
  ContainsHoistedDeclarationOrCompletion = 1 << 20,
  ContainsDynamicImport = 1 << 21,
  ContainsClassFields = 1 << 22,
  ContainsPossibleTopLevelAwait = 1 << 23,

  // Please leave this as 1 << 29.
  // It is the maximum bit we can set before we outgrow the size of a v8 small integer (SMI) on an x86 system.
  // It is a good reminder of how much room we have left
  HasComputedFlags = 1 << 29, // Transform flags have been computed.

  // Assertions
  // - Bitmasks that are used to assert facts about the syntax of a node and its subtree.
  AssertTypeScript = ContainsTypeScript,
  AssertJsx = ContainsJsx,
  AssertESNext = ContainsESNext,
  AssertES2020 = ContainsES2020,
  AssertES2019 = ContainsES2019,
  AssertES2018 = ContainsES2018,
  AssertES2017 = ContainsES2017,
  AssertES2016 = ContainsES2016,
  AssertES2015 = ContainsES2015,
  AssertGenerator = ContainsGenerator,
  AssertDestructuringAssignment = ContainsDestructuringAssignment,

  // Scope Exclusions
  // - Bitmasks that exclude flags from propagating out of a specific context
  //   into the subtree flags of their container.
  OuterExpressionExcludes = HasComputedFlags,
  PropertyAccessExcludes = OuterExpressionExcludes,
  NodeExcludes = PropertyAccessExcludes,
  ArrowFunctionExcludes = NodeExcludes | ContainsTypeScriptClassSyntax | ContainsBlockScopedBinding | ContainsYield | ContainsAwait | ContainsHoistedDeclarationOrCompletion | ContainsBindingPattern | ContainsObjectRestOrSpread | ContainsPossibleTopLevelAwait,
  FunctionExcludes = NodeExcludes | ContainsTypeScriptClassSyntax | ContainsLexicalThis | ContainsBlockScopedBinding | ContainsYield | ContainsAwait | ContainsHoistedDeclarationOrCompletion | ContainsBindingPattern | ContainsObjectRestOrSpread | ContainsPossibleTopLevelAwait,
  ConstructorExcludes = NodeExcludes | ContainsLexicalThis | ContainsBlockScopedBinding | ContainsYield | ContainsAwait | ContainsHoistedDeclarationOrCompletion | ContainsBindingPattern | ContainsObjectRestOrSpread | ContainsPossibleTopLevelAwait,
  MethodOrAccessorExcludes = NodeExcludes | ContainsLexicalThis | ContainsBlockScopedBinding | ContainsYield | ContainsAwait | ContainsHoistedDeclarationOrCompletion | ContainsBindingPattern | ContainsObjectRestOrSpread,
  PropertyExcludes = NodeExcludes | ContainsLexicalThis,
  ClassExcludes = NodeExcludes | ContainsTypeScriptClassSyntax | ContainsComputedPropertyName,
  ModuleExcludes = NodeExcludes | ContainsTypeScriptClassSyntax | ContainsLexicalThis | ContainsBlockScopedBinding | ContainsHoistedDeclarationOrCompletion | ContainsPossibleTopLevelAwait,
  TypeExcludes = ~ContainsTypeScript,
  ObjectLiteralExcludes = NodeExcludes | ContainsTypeScriptClassSyntax | ContainsComputedPropertyName | ContainsObjectRestOrSpread,
  ArrayLiteralOrCallOrNewExcludes = NodeExcludes | ContainsRestOrSpread,
  VariableDeclarationListExcludes = NodeExcludes | ContainsBindingPattern | ContainsObjectRestOrSpread,
  ParameterExcludes = NodeExcludes,
  CatchClauseExcludes = NodeExcludes | ContainsObjectRestOrSpread,
  BindingPatternExcludes = NodeExcludes | ContainsRestOrSpread,

  // Propagating flags
  // - Bitmasks for flags that should propagate from a child
  PropertyNamePropagatingFlags = ContainsLexicalThis,

  // Masks
  // - Additional bitmasks
}

export interface Token<TKind = any> extends Node {
  token: TKind
}

export type EndOfFileToken = Token<SyntaxKind.EndOfFileToken> & JSDocContainer;

// Punctuation
export interface PunctuationToken<TKind extends PunctuationSyntaxKind> extends Token<TKind> {
}

export type DotToken = PunctuationToken<PunctuationSyntaxKind.DotToken>;
export type DotDotDotToken = PunctuationToken<PunctuationSyntaxKind.DotDotDotToken>;
export type QuestionToken = PunctuationToken<PunctuationSyntaxKind.QuestionToken>;
export type ExclamationToken = PunctuationToken<PunctuationSyntaxKind.ExclamationToken>;
export type ColonToken = PunctuationToken<PunctuationSyntaxKind.ColonToken>;
export type EqualsToken = PunctuationToken<PunctuationSyntaxKind.EqualsToken>;
export type AsteriskToken = PunctuationToken<PunctuationSyntaxKind.AsteriskToken>;
export type EqualsGreaterThanToken = PunctuationToken<PunctuationSyntaxKind.EqualsGreaterThanToken>;
export type PlusToken = PunctuationToken<PunctuationSyntaxKind.PlusToken>;
export type MinusToken = PunctuationToken<PunctuationSyntaxKind.MinusToken>;
export type QuestionDotToken = PunctuationToken<PunctuationSyntaxKind.QuestionDotToken>;

// Keywords
export interface KeywordToken<TKind = KeywordSyntaxKind> extends Token {
}

export type AssertsKeyword = KeywordToken<KeywordSyntaxKind.AssertsKeyword>;
export type AwaitKeyword = KeywordToken<KeywordSyntaxKind.AwaitKeyword>;

/** @deprecated Use `AwaitKeyword` instead. */
export type AwaitKeywordToken = AwaitKeyword;

/** @deprecated Use `AssertsKeyword` instead. */
export type AssertsToken = AssertsKeyword;

export interface ModifierToken<TKind extends ModifierSyntaxKind> extends KeywordToken<TKind> {
}

export type AbstractKeyword = ModifierToken<ModifierSyntaxKind.AbstractKeyword>;
export type AsyncKeyword = ModifierToken<ModifierSyntaxKind.AsyncKeyword>;
export type ConstKeyword = ModifierToken<ModifierSyntaxKind.ConstKeyword>;
export type DeclareKeyword = ModifierToken<ModifierSyntaxKind.DeclareKeyword>;
export type DefaultKeyword = ModifierToken<ModifierSyntaxKind.DefaultKeyword>;
export type ExportKeyword = ModifierToken<ModifierSyntaxKind.ExportKeyword>;
export type PrivateKeyword = ModifierToken<ModifierSyntaxKind.PrivateKeyword>;
export type ProtectedKeyword = ModifierToken<ModifierSyntaxKind.ProtectedKeyword>;
export type PublicKeyword = ModifierToken<ModifierSyntaxKind.PublicKeyword>;
export type ReadonlyKeyword = ModifierToken<ModifierSyntaxKind.ReadonlyKeyword>;
export type StaticKeyword = ModifierToken<ModifierSyntaxKind.StaticKeyword>;

/** @deprecated Use `ReadonlyKeyword` instead. */
export type ReadonlyToken = ReadonlyKeyword;

export type Modifier =
  | AbstractKeyword
  | AsyncKeyword
  | ConstKeyword
  | DeclareKeyword
  | DefaultKeyword
  | ExportKeyword
  | PrivateKeyword
  | ProtectedKeyword
  | PublicKeyword
  | ReadonlyKeyword
  | StaticKeyword
  ;

export type AccessibilityModifier =
  | PublicKeyword
  | PrivateKeyword
  | ProtectedKeyword
  ;

export type ParameterPropertyModifier =
  | AccessibilityModifier
  | ReadonlyKeyword
  ;

export type ClassMemberModifier =
  | AccessibilityModifier
  | ReadonlyKeyword
  | StaticKeyword
  ;

export type ModifiersArray = ReadonlyArray<Modifier>;

export const enum GeneratedIdentifierFlags {
  // Kinds
  None = 0,                           // Not automatically generated.
  /*@internal*/ Auto = 1,             // Automatically generated identifier.
  /*@internal*/ Loop = 2,             // Automatically generated identifier with a preference for '_i'.
  /*@internal*/ Unique = 3,           // Unique name based on the 'text' property.
  /*@internal*/ Node = 4,             // Unique name based on the node in the 'original' property.
  /*@internal*/ KindMask = 7,         // Mask to extract the kind of identifier from its flags.

  // Flags
  ReservedInNestedScopes = 1 << 3,    // Reserve the generated name in nested scopes
  Optimistic = 1 << 4,                // First instance won't use '_#' if there's no conflict
  FileLevel = 1 << 5,                 // Use only the file identifiers list and not generated names to search for conflicts
  AllowNameSubstitution = 1 << 6, // Used by `module.ts` to indicate generated nodes which can have substitutions performed upon them (as they were generated by an earlier transform phase)
}

export interface Identifier extends PrimaryExpression, Declaration {
  /**
   * Prefer to use `id.unescapedText`. (Note: This is available only in services, not internally to the TypeScript compiler.)
   * Text of identifier, but if the identifier begins with two underscores, this will begin with three.
   */
  readonly escapedText: any;
  readonly originalKeywordKind?: SyntaxKind;                // Original syntaxKind which get set so that we can report an error later
  /*@internal*/
  readonly autoGenerateFlags?: GeneratedIdentifierFlags; // Specifies whether to auto-generate the text for an identifier.
  /*@internal*/
  readonly autoGenerateId?: number;           // Ensures unique generated identifiers get unique names, but clones get the same name.
  /*@internal*/
  generatedImportReference?: ImportSpecifier; // Reference to the generated import specifier this identifier refers to
  isInJSDocNamespace?: boolean;                             // if the node is a member in a JSDoc namespace
  /*@internal*/
  typeArguments?: NodeArray<TypeNode | TypeParameterDeclaration>; // Only defined on synthesized nodes. Though not syntactically valid, used in emitting diagnostics, quickinfo, and signature help.
  /*@internal*/
  jsdocDotPos?: number;                       // Identifier occurs in JSDoc-style generic: Id.<T>
}

// Transient identifier node (marked by id === -1)
export interface TransientIdentifier extends Identifier {
  resolvedSymbol: Symbol;
}

/*@internal*/
export interface GeneratedIdentifier extends Identifier {
  autoGenerateFlags: GeneratedIdentifierFlags;
}

export interface QualifiedName extends Node {
  readonly left: EntityName;
  readonly right: Identifier;
  /*@internal*/
  jsdocDotPos?: number;                      // QualifiedName occurs in JSDoc-style generic: Id1.Id2.<T>
}

export type EntityName = Identifier | QualifiedName;

export type PropertyName = Identifier | StringLiteral | NumericLiteral | ComputedPropertyName | PrivateIdentifier;

export type DeclarationName =
  | Identifier
  | PrivateIdentifier
  | StringLiteralLike
  | NumericLiteral
  | ComputedPropertyName
  | ElementAccessExpression
  | BindingPattern
  | EntityNameExpression;

export interface Declaration extends Node {
  // _declarationBrand: any;
}

export interface NamedDeclaration extends Declaration {
  readonly name?: DeclarationName;
}

/* @internal */
export interface DynamicNamedDeclaration extends NamedDeclaration {
  readonly name: ComputedPropertyName;
}

/* @internal */
export interface DynamicNamedBinaryExpression extends BinaryExpression {
  readonly left: ElementAccessExpression;
}

/* @internal */

// A declaration that supports late-binding (used in checker)
export interface LateBoundDeclaration extends DynamicNamedDeclaration {
  readonly name: LateBoundName;
}

/* @internal */
export interface LateBoundBinaryExpressionDeclaration extends DynamicNamedBinaryExpression {
  readonly left: LateBoundElementAccessExpression;
}

/* @internal */
export interface LateBoundElementAccessExpression extends ElementAccessExpression {
  readonly argumentExpression: EntityNameExpression;
}

export interface DeclarationStatement extends NamedDeclaration, Statement {
  readonly name?: Identifier | StringLiteral | NumericLiteral;
}

export interface ComputedPropertyName extends Node {
  readonly parent: Declaration;
  readonly expression: Expression;
}

export interface PrivateIdentifier extends Node {
  // escaping not strictly necessary
  // avoids gotchas in transforms and utils
  readonly escapedText: any;
}


/* @internal */

// A name that supports late-binding (used in checker)
export interface LateBoundName extends ComputedPropertyName {
  readonly expression: EntityNameExpression;
}

export interface Decorator extends Node {
  readonly parent: NamedDeclaration;
  readonly expression: LeftHandSideExpression;
}

export interface TypeParameterDeclaration extends NamedDeclaration {
  readonly parent: DeclarationWithTypeParameterChildren | InferTypeNode;
  readonly name: Identifier;
  /** Note: Consider calling `getEffectiveConstraintOfTypeParameter` */
  readonly constraint?: TypeNode;
  readonly default?: TypeNode;

  // For error recovery purposes.
  expression?: Expression;
}

export interface SignatureDeclarationBase extends NamedDeclaration, JSDocContainer {
  readonly name?: PropertyName;
  readonly typeParameters?: TypeParameterDeclaration[];
  readonly parameters: ParameterDeclaration[];
  readonly type?: TypeNode;
  /* @internal */
  typeArguments?: NodeArray<TypeNode>; // Used for quick info, replaces typeParameters for instantiated signatures
}

export type SignatureDeclaration =
  | CallSignatureDeclaration
  | ConstructSignatureDeclaration
  | MethodSignature
  | IndexSignatureDeclaration
  | FunctionTypeNode
  | ConstructorTypeNode
  | JSDocFunctionType
  | FunctionDeclaration
  | MethodDeclaration
  | ConstructorDeclaration
  | AccessorDeclaration
  | FunctionExpression
  | ArrowFunction;

export interface CallSignatureDeclaration extends SignatureDeclarationBase, TypeElement {
}

export interface ConstructSignatureDeclaration extends SignatureDeclarationBase, TypeElement {
}

export type BindingName = Identifier | BindingPattern;

export interface VariableDeclaration extends NamedDeclaration {
  readonly parent: VariableDeclarationList | CatchClause;
  readonly name: BindingName;                    // Declared variable name
  readonly exclamationToken?: ExclamationToken;  // Optional definite assignment assertion
  readonly type?: TypeNode;                      // Optional type annotation
  readonly initializer?: Expression;             // Optional initializer
}

/* @internal */
export type InitializedVariableDeclaration = VariableDeclaration & { readonly initializer: Expression };

export interface VariableDeclarationList extends Node {
  readonly parent: VariableStatement | ForStatement | ForOfStatement | ForInStatement;
  readonly declarations: NodeArray<VariableDeclaration>;
}

export interface ParameterDeclaration extends NamedDeclaration, JSDocContainer {
  readonly parent: SignatureDeclaration;
  readonly dotDotDotToken?: DotDotDotToken;    // Present on rest parameter
  readonly name: BindingName;                  // Declared parameter name.
  readonly questionToken?: QuestionToken;      // Present on optional parameter
  readonly type?: TypeNode;                    // Optional type annotation
  readonly initializer?: Expression;           // Optional initializer
}

export interface BindingElement extends NamedDeclaration {
  readonly parent: BindingPattern;
  readonly propertyName?: PropertyName;        // Binding property name (in object binding pattern)
  readonly dotDotDotToken?: DotDotDotToken;    // Present on rest element (in object binding pattern)
  readonly name: BindingName;                  // Declared binding element name
  readonly initializer?: Expression;           // Optional initializer
}

/*@internal*/
export type BindingElementGrandparent = BindingElement['parent']['parent'];

export interface PropertySignature extends TypeElement, JSDocContainer {
  readonly name: PropertyName;                 // Declared property name
  readonly questionToken?: QuestionToken;      // Present on optional property
  readonly type?: TypeNode;                    // Optional type annotation
  initializer?: Expression;                    // Present for use with reporting a grammar error
}

export interface PropertyDeclaration extends ClassElement, JSDocContainer {
  readonly parent: ClassLikeDeclaration;
  readonly name: PropertyName;
  readonly questionToken?: QuestionToken;      // Present for use with reporting a grammar error
  readonly exclamationToken?: ExclamationToken;
  readonly type?: TypeNode;
  readonly initializer?: Expression;           // Optional initializer
}

/*@internal*/
export interface PrivateIdentifierPropertyDeclaration extends PropertyDeclaration {
  name: PrivateIdentifier;
}

/* @internal */
export type InitializedPropertyDeclaration = PropertyDeclaration & { readonly initializer: Expression };

export interface ObjectLiteralElement extends NamedDeclaration {
  _objectLiteralBrand: any;
  readonly name?: PropertyName;
}

/** Unlike ObjectLiteralElement, excludes JSXAttribute and JSXSpreadAttribute. */
export type ObjectLiteralElementLike
  = PropertyAssignment
  | ShorthandPropertyAssignment
  | SpreadAssignment
  | MethodDeclaration
  | AccessorDeclaration
  ;

export interface PropertyAssignment extends ObjectLiteralElement, JSDocContainer {
  readonly parent: ObjectLiteralExpression;
  readonly name: PropertyName;
  readonly questionToken?: QuestionToken; // Present for use with reporting a grammar error
  readonly exclamationToken?: ExclamationToken; // Present for use with reporting a grammar error
  readonly initializer: Expression;
}

export interface ShorthandPropertyAssignment extends ObjectLiteralElement, JSDocContainer {
  readonly parent: ObjectLiteralExpression;
  readonly name: Identifier;
  readonly questionToken?: QuestionToken;
  readonly exclamationToken?: ExclamationToken;
  // used when ObjectLiteralExpression is used in ObjectAssignmentPattern
  // it is a grammar error to appear in actual object initializer:
  readonly equalsToken?: EqualsToken;
  readonly objectAssignmentInitializer?: Expression;
}

export interface SpreadAssignment extends ObjectLiteralElement, JSDocContainer {
  readonly parent: ObjectLiteralExpression;
  readonly expression: Expression;
}

export type VariableLikeDeclaration =
  | VariableDeclaration
  | ParameterDeclaration
  | BindingElement
  | PropertyDeclaration
  | PropertyAssignment
  | PropertySignature
  | JsxAttribute
  | ShorthandPropertyAssignment
  | EnumMember
  | JSDocPropertyTag
  | JSDocParameterTag;

export interface PropertyLikeDeclaration extends NamedDeclaration {
  readonly name: PropertyName;
}

export interface ObjectBindingPattern extends Node {
  readonly parent: VariableDeclaration | ParameterDeclaration | BindingElement;
  readonly elements: NodeArray<BindingElement>;
}

export interface ArrayBindingPattern extends Node {
  readonly parent: VariableDeclaration | ParameterDeclaration | BindingElement;
  readonly elements: NodeArray<ArrayBindingElement>;
}

export type BindingPattern = ObjectBindingPattern | ArrayBindingPattern;

export type ArrayBindingElement = BindingElement | OmittedExpression;

/**
 * Several node kinds share function-like features such as a signature,
 * a name, and a body. These nodes should extend FunctionLikeDeclarationBase.
 * Examples:
 * - FunctionDeclaration
 * - MethodDeclaration
 * - AccessorDeclaration
 */
export interface FunctionLikeDeclarationBase extends SignatureDeclarationBase {
  _functionLikeDeclarationBrand: any;

  readonly asteriskToken?: AsteriskToken;
  readonly questionToken?: QuestionToken;
  readonly exclamationToken?: ExclamationToken;
  readonly body?: Block | Expression;
  /* @internal */
  endFlowNode?: FlowNode;
  /* @internal */
  returnFlowNode?: FlowNode;
}

export type FunctionLikeDeclaration =
  | FunctionDeclaration
  | MethodDeclaration
  | GetAccessorDeclaration
  | SetAccessorDeclaration
  | ConstructorDeclaration
  | FunctionExpression
  | ArrowFunction;
/** @deprecated Use SignatureDeclaration */
export type FunctionLike = SignatureDeclaration;

export interface FunctionDeclaration extends FunctionLikeDeclarationBase, DeclarationStatement {
  readonly name?: Identifier;
  readonly body?: FunctionBody;
}

export interface MethodSignature extends SignatureDeclarationBase, TypeElement {
  readonly parent: ObjectTypeDeclaration;
  readonly name: PropertyName;
}

// Note that a MethodDeclaration is considered both a ClassElement and an ObjectLiteralElement.
// Both the grammars for ClassDeclaration and ObjectLiteralExpression allow for MethodDeclarations
// as child elements, and so a MethodDeclaration satisfies both interfaces.  This avoids the
// alternative where we would need separate kinds/types for ClassMethodDeclaration and
// ObjectLiteralMethodDeclaration, which would look identical.
//
// Because of this, it may be necessary to determine what sort of MethodDeclaration you have
// at later stages of the compiler pipeline.  In that case, you can either check the parent kind
// of the method, or use helpers like isObjectLiteralMethodDeclaration
export interface MethodDeclaration extends FunctionLikeDeclarationBase, ClassElement, ObjectLiteralElement, JSDocContainer {
  readonly parent: ClassLikeDeclaration | ObjectLiteralExpression;
  readonly name: PropertyName;
  readonly body?: FunctionBody;
  /* @internal*/
  exclamationToken?: ExclamationToken; // Present for use with reporting a grammar error
}

export interface ConstructorDeclaration extends FunctionLikeDeclarationBase, ClassElement, JSDocContainer {
  readonly parent: ClassLikeDeclaration;
  readonly body?: FunctionBody;
  /* @internal */
  typeParameters?: TypeParameterDeclaration[]; // Present for use with reporting a grammar error
  /* @internal */
  type?: TypeNode; // Present for use with reporting a grammar error
}

/** For when we encounter a semicolon in a class declaration. ES6 allows these as class elements. */
export interface SemicolonClassElement extends ClassElement {
  readonly parent: ClassLikeDeclaration;
}

// See the comment on MethodDeclaration for the intuition behind GetAccessorDeclaration being a
// ClassElement and an ObjectLiteralElement.
export interface GetAccessorDeclaration extends FunctionLikeDeclarationBase, ClassElement, ObjectLiteralElement, JSDocContainer {
  readonly parent: ClassLikeDeclaration | ObjectLiteralExpression;
  readonly name: PropertyName;
  readonly body?: FunctionBody;
  /* @internal */
  typeParameters?: TypeParameterDeclaration[]; // Present for use with reporting a grammar error
}

// See the comment on MethodDeclaration for the intuition behind SetAccessorDeclaration being a
// ClassElement and an ObjectLiteralElement.
export interface SetAccessorDeclaration extends FunctionLikeDeclarationBase, ClassElement, ObjectLiteralElement, JSDocContainer {
  readonly parent: ClassLikeDeclaration | ObjectLiteralExpression;
  readonly name: PropertyName;
  readonly body?: FunctionBody;
  /* @internal */
  typeParameters?: TypeParameterDeclaration[]; // Present for use with reporting a grammar error
  /* @internal */
  type?: TypeNode; // Present for use with reporting a grammar error
}

export type AccessorDeclaration = GetAccessorDeclaration | SetAccessorDeclaration;

export interface IndexSignatureDeclaration extends SignatureDeclarationBase, ClassElement, TypeElement {
  readonly parent: ObjectTypeDeclaration;
  readonly type: TypeNode;
}

export interface TypeNode extends Node {
  _typeNodeBrand: any;
}

/* @internal */
// export interface TypeNode extends Node {
//   readonly kind: TypeNodeSyntaxKind;
// }

export interface KeywordTypeNode<TKind extends KeywordTypeSyntaxKind = KeywordTypeSyntaxKind> extends KeywordToken<TKind>, TypeNode {
  // readonly kind: TKind;
}

export interface ImportTypeNode extends NodeWithTypeArguments {
  readonly isTypeOf: boolean;
  readonly argument: TypeNode;
  readonly qualifier?: EntityName;
}

/* @internal */
export type LiteralImportTypeNode =
  ImportTypeNode
  & { readonly argument: LiteralTypeNode & { readonly literal: StringLiteral } };

export interface ThisTypeNode extends TypeNode {
}

export type FunctionOrConstructorTypeNode = FunctionTypeNode | ConstructorTypeNode;

export interface FunctionOrConstructorTypeNodeBase extends TypeNode, SignatureDeclarationBase {
  readonly type: TypeNode;
}

export interface FunctionTypeNode extends FunctionOrConstructorTypeNodeBase {
}

export interface ConstructorTypeNode extends FunctionOrConstructorTypeNodeBase {
}

export interface NodeWithTypeArguments extends TypeNode {
  readonly typeArguments?: NodeArray<TypeNode>;
}

export type TypeReferenceType = TypeReferenceNode | ExpressionWithTypeArguments;

export interface TypeReferenceNode extends NodeWithTypeArguments {
  readonly typeName: EntityName;
}

export interface TypePredicateNode extends TypeNode {
  readonly parent: SignatureDeclaration | JSDocTypeExpression;
  readonly assertsModifier?: AssertsToken;
  readonly parameterName: Identifier | ThisTypeNode;
  readonly type?: TypeNode;
}

export interface TypeQueryNode extends TypeNode {
  readonly exprName: EntityName;
}

// A TypeLiteral is the declaration node for an anonymous symbol.
export interface TypeLiteralNode extends TypeNode, Declaration {
  readonly members: NodeArray<TypeElement>;
}

export interface ArrayTypeNode extends TypeNode {
  readonly elementType: TypeNode;
}

export interface TupleTypeNode extends TypeNode {
  readonly elements: NodeArray<TypeNode | NamedTupleMember>;
}

export interface NamedTupleMember extends TypeNode, JSDocContainer, Declaration {
  readonly dotDotDotToken?: Token<PunctuationSyntaxKind.DotDotDotToken>;
  readonly name: Identifier;
  readonly questionToken?: Token<PunctuationSyntaxKind.QuestionToken>;
  readonly type: TypeNode;
}

export interface OptionalTypeNode extends TypeNode {
  readonly type: TypeNode;
}

export interface RestTypeNode extends TypeNode {
  readonly type: TypeNode;
}

export type UnionOrIntersectionTypeNode = UnionTypeNode | IntersectionTypeNode;

export interface UnionTypeNode extends TypeNode {
  readonly types: NodeArray<TypeNode>;
}

export interface IntersectionTypeNode extends TypeNode {
  readonly types: NodeArray<TypeNode>;
}

export interface ConditionalTypeNode extends TypeNode {
  readonly checkType: TypeNode;
  readonly extendsType: TypeNode;
  readonly trueType: TypeNode;
  readonly falseType: TypeNode;
}

export interface InferTypeNode extends TypeNode {
  readonly typeParameter: TypeParameterDeclaration;
}

export interface ParenthesizedTypeNode extends TypeNode {
  readonly type: TypeNode;
}

export interface TypeOperatorNode extends TypeNode {
  readonly operator: KeywordSyntaxKind.KeyOfKeyword | KeywordSyntaxKind.UniqueKeyword | KeywordSyntaxKind.ReadonlyKeyword;
  readonly type: TypeNode;
}

/* @internal */
export interface UniqueTypeOperatorNode extends TypeOperatorNode {
  readonly operator: KeywordSyntaxKind.UniqueKeyword;
}

export interface IndexedAccessTypeNode extends TypeNode {
  readonly objectType: TypeNode;
  readonly indexType: TypeNode;
}

export interface MappedTypeNode extends TypeNode, Declaration {
  readonly readonlyToken?: ReadonlyToken | PlusToken | MinusToken;
  readonly typeParameter: TypeParameterDeclaration;
  readonly nameType?: TypeNode;
  readonly questionToken?: QuestionToken | PlusToken | MinusToken;
  readonly type?: TypeNode;
}

export interface LiteralTypeNode extends TypeNode {
  readonly literal: NullLiteral | BooleanLiteral | LiteralExpression | PrefixUnaryExpression;
}

export interface StringLiteral extends LiteralExpression, Declaration {
  /* @internal */
  readonly textSourceNode?: Identifier | StringLiteralLike | NumericLiteral; // Allows a StringLiteral to get its text from another node (used by transforms).
  /** Note: this is only set when synthesizing a node, not during parsing. */
  /* @internal */
  readonly singleQuote?: boolean;
}

export type StringLiteralLike = StringLiteral | NoSubstitutionTemplateLiteral;
export type PropertyNameLiteral = Identifier | StringLiteralLike | NumericLiteral;

export interface TemplateLiteralTypeNode extends TypeNode {
  readonly head: TemplateHead;
  readonly templateSpans: NodeArray<TemplateLiteralTypeSpan>;
}

export interface TemplateLiteralTypeSpan extends TypeNode {
  readonly parent: TemplateLiteralTypeNode;
  readonly type: TypeNode;
  readonly literal: TemplateMiddle | TemplateTail;
}

// Note: 'brands' in our syntax nodes serve to give us a small amount of nominal typing.
// Consider 'Expression'.  Without the brand, 'Expression' is actually no different
// (structurally) than 'Node'.  Because of this you can pass any Node to a function that
// takes an Expression without any error.  By using the 'brands' we ensure that the type
// checker actually thinks you have something of the right type.  Note: the brands are
// never actually given values.  At runtime they have zero cost.

export interface Expression extends Node {
  _expressionBrand: any;
}

export interface OmittedExpression extends Expression {
}

// Represents an expression that is elided as part of a transformation to emit comments on a
// not-emitted node. The 'expression' property of a PartiallyEmittedExpression should be emitted.
export interface PartiallyEmittedExpression extends LeftHandSideExpression {
  readonly expression: Expression;
}

export interface UnaryExpression extends Expression {
  _unaryExpressionBrand: any;
}

/** Deprecated, please use UpdateExpression */
export type IncrementExpression = UpdateExpression;

export interface UpdateExpression extends UnaryExpression {
  _updateExpressionBrand: any;
}

// see: https://tc39.github.io/ecma262/#prod-UpdateExpression
// see: https://tc39.github.io/ecma262/#prod-UnaryExpression
export type PrefixUnaryOperator
  = PunctuationSyntaxKind.PlusPlusToken
  | PunctuationSyntaxKind.MinusMinusToken
  | PunctuationSyntaxKind.PlusToken
  | PunctuationSyntaxKind.MinusToken
  | PunctuationSyntaxKind.TildeToken
  | PunctuationSyntaxKind.ExclamationToken;

export interface PrefixUnaryExpression extends UpdateExpression {
  readonly operator: PrefixUnaryOperator;
  readonly operand: UnaryExpression;
}

// see: https://tc39.github.io/ecma262/#prod-UpdateExpression
export type PostfixUnaryOperator
  = PunctuationSyntaxKind.PlusPlusToken
  | PunctuationSyntaxKind.MinusMinusToken
  ;

export interface PostfixUnaryExpression extends UpdateExpression {
  readonly operand: LeftHandSideExpression;
  readonly operator: PostfixUnaryOperator;
}

export interface LeftHandSideExpression extends UpdateExpression {
  _leftHandSideExpressionBrand: any;
}

export interface MemberExpression extends LeftHandSideExpression {
  _memberExpressionBrand: any;
}

export interface PrimaryExpression extends MemberExpression {
  _primaryExpressionBrand: any;
}

export interface NullLiteral extends PrimaryExpression {
}

export interface TrueLiteral extends PrimaryExpression {
}

export interface FalseLiteral extends PrimaryExpression {
}

export type BooleanLiteral = TrueLiteral | FalseLiteral;

export interface ThisExpression extends PrimaryExpression {
}

export interface SuperExpression extends PrimaryExpression {
}

export interface ImportExpression extends PrimaryExpression {
}

export interface DeleteExpression extends UnaryExpression {
  readonly expression: UnaryExpression;
}

export interface TypeOfExpression extends UnaryExpression {
  readonly expression: UnaryExpression;
}

export interface VoidExpression extends UnaryExpression {
  readonly expression: UnaryExpression;
}

export interface AwaitExpression extends UnaryExpression {
  readonly expression: UnaryExpression;
}

export interface YieldExpression extends Expression {
  readonly asteriskToken?: AsteriskToken;
  readonly expression?: Expression;
}

export interface SyntheticExpression extends Expression {
  readonly isSpread: boolean;
  readonly type: Type;
  readonly tupleNameSource?: ParameterDeclaration | NamedTupleMember;
}

// see: https://tc39.github.io/ecma262/#prod-ExponentiationExpression
export type ExponentiationOperator =
  | PunctuationSyntaxKind.AsteriskAsteriskToken
  ;

// see: https://tc39.github.io/ecma262/#prod-MultiplicativeOperator
export type MultiplicativeOperator =
  | PunctuationSyntaxKind.AsteriskToken
  | PunctuationSyntaxKind.SlashToken
  | PunctuationSyntaxKind.PercentToken
  ;

// see: https://tc39.github.io/ecma262/#prod-MultiplicativeExpression
export type MultiplicativeOperatorOrHigher =
  | ExponentiationOperator
  | MultiplicativeOperator
  ;

// see: https://tc39.github.io/ecma262/#prod-AdditiveExpression
export type AdditiveOperator =
  | PunctuationSyntaxKind.PlusToken
  | PunctuationSyntaxKind.MinusToken
  ;

// see: https://tc39.github.io/ecma262/#prod-AdditiveExpression
export type AdditiveOperatorOrHigher =
  | MultiplicativeOperatorOrHigher
  | AdditiveOperator
  ;

// see: https://tc39.github.io/ecma262/#prod-ShiftExpression
export type ShiftOperator =
  | PunctuationSyntaxKind.LessThanLessThanToken
  | PunctuationSyntaxKind.GreaterThanGreaterThanToken
  | PunctuationSyntaxKind.GreaterThanGreaterThanGreaterThanToken
  ;

// see: https://tc39.github.io/ecma262/#prod-ShiftExpression
export type ShiftOperatorOrHigher =
  | AdditiveOperatorOrHigher
  | ShiftOperator
  ;

// see: https://tc39.github.io/ecma262/#prod-RelationalExpression
export type RelationalOperator =
  | PunctuationSyntaxKind.LessThanToken
  | PunctuationSyntaxKind.LessThanEqualsToken
  | PunctuationSyntaxKind.GreaterThanToken
  | PunctuationSyntaxKind.GreaterThanEqualsToken
  | KeywordSyntaxKind.InstanceOfKeyword
  | KeywordSyntaxKind.InKeyword
  ;

// see: https://tc39.github.io/ecma262/#prod-RelationalExpression
export type RelationalOperatorOrHigher =
  | ShiftOperatorOrHigher
  | RelationalOperator
  ;

// see: https://tc39.github.io/ecma262/#prod-EqualityExpression
export type EqualityOperator =
  | PunctuationSyntaxKind.EqualsEqualsToken
  | PunctuationSyntaxKind.EqualsEqualsEqualsToken
  | PunctuationSyntaxKind.ExclamationEqualsEqualsToken
  | PunctuationSyntaxKind.ExclamationEqualsToken
  ;

// see: https://tc39.github.io/ecma262/#prod-EqualityExpression
export type EqualityOperatorOrHigher =
  | RelationalOperatorOrHigher
  | EqualityOperator;

// see: https://tc39.github.io/ecma262/#prod-BitwiseANDExpression
// see: https://tc39.github.io/ecma262/#prod-BitwiseXORExpression
// see: https://tc39.github.io/ecma262/#prod-BitwiseORExpression
export type BitwiseOperator =
  | PunctuationSyntaxKind.AmpersandToken
  | PunctuationSyntaxKind.BarToken
  | PunctuationSyntaxKind.CaretToken
  ;

// see: https://tc39.github.io/ecma262/#prod-BitwiseANDExpression
// see: https://tc39.github.io/ecma262/#prod-BitwiseXORExpression
// see: https://tc39.github.io/ecma262/#prod-BitwiseORExpression
export type BitwiseOperatorOrHigher =
  | EqualityOperatorOrHigher
  | BitwiseOperator
  ;

// see: https://tc39.github.io/ecma262/#prod-LogicalANDExpression
// see: https://tc39.github.io/ecma262/#prod-LogicalORExpression
export type LogicalOperator =
  | PunctuationSyntaxKind.AmpersandAmpersandToken
  | PunctuationSyntaxKind.BarBarToken
  ;

// see: https://tc39.github.io/ecma262/#prod-LogicalANDExpression
// see: https://tc39.github.io/ecma262/#prod-LogicalORExpression
export type LogicalOperatorOrHigher =
  | BitwiseOperatorOrHigher
  | LogicalOperator
  ;

// see: https://tc39.github.io/ecma262/#prod-AssignmentOperator
export type CompoundAssignmentOperator =
  | PunctuationSyntaxKind.PlusEqualsToken
  | PunctuationSyntaxKind.MinusEqualsToken
  | PunctuationSyntaxKind.AsteriskAsteriskEqualsToken
  | PunctuationSyntaxKind.AsteriskEqualsToken
  | PunctuationSyntaxKind.SlashEqualsToken
  | PunctuationSyntaxKind.PercentEqualsToken
  | PunctuationSyntaxKind.AmpersandEqualsToken
  | PunctuationSyntaxKind.BarEqualsToken
  | PunctuationSyntaxKind.CaretEqualsToken
  | PunctuationSyntaxKind.LessThanLessThanEqualsToken
  | PunctuationSyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken
  | PunctuationSyntaxKind.GreaterThanGreaterThanEqualsToken
  | PunctuationSyntaxKind.BarBarEqualsToken
  | PunctuationSyntaxKind.AmpersandAmpersandEqualsToken
  | PunctuationSyntaxKind.QuestionQuestionEqualsToken
  ;

// see: https://tc39.github.io/ecma262/#prod-AssignmentExpression
export type AssignmentOperator =
  | PunctuationSyntaxKind.EqualsToken
  | CompoundAssignmentOperator
  ;

// see: https://tc39.github.io/ecma262/#prod-AssignmentExpression
export type AssignmentOperatorOrHigher =
  | PunctuationSyntaxKind.QuestionQuestionToken
  | LogicalOperatorOrHigher
  | AssignmentOperator
  ;

// see: https://tc39.github.io/ecma262/#prod-Expression
export type BinaryOperator =
  | AssignmentOperatorOrHigher
  | PunctuationSyntaxKind.CommaToken
  ;

export type LogicalOrCoalescingAssignmentOperator
  = PunctuationSyntaxKind.AmpersandAmpersandEqualsToken
  | PunctuationSyntaxKind.BarBarEqualsToken
  | PunctuationSyntaxKind.QuestionQuestionEqualsToken
  ;

export type BinaryOperatorToken = Token<BinaryOperator>;

export interface BinaryExpression extends Expression, Declaration {
  readonly left: Expression;
  readonly operatorToken: BinaryOperatorToken;
  readonly right: Expression;
}

export type AssignmentOperatorToken = Token<AssignmentOperator>;

export interface AssignmentExpression<TOperator extends AssignmentOperatorToken> extends BinaryExpression {
  readonly left: LeftHandSideExpression;
  readonly operatorToken: TOperator;
}

export interface ObjectDestructuringAssignment extends AssignmentExpression<EqualsToken> {
  readonly left: ObjectLiteralExpression;
}

export interface ArrayDestructuringAssignment extends AssignmentExpression<EqualsToken> {
  readonly left: ArrayLiteralExpression;
}

export type DestructuringAssignment =
  | ObjectDestructuringAssignment
  | ArrayDestructuringAssignment
  ;

export type BindingOrAssignmentElement =
  | VariableDeclaration
  | ParameterDeclaration
  | ObjectBindingOrAssignmentElement
  | ArrayBindingOrAssignmentElement
  ;

export type ObjectBindingOrAssignmentElement =
  | BindingElement
  | PropertyAssignment // AssignmentProperty
  | ShorthandPropertyAssignment // AssignmentProperty
  | SpreadAssignment // AssignmentRestProperty
  ;

export type ArrayBindingOrAssignmentElement =
  | BindingElement
  | OmittedExpression // Elision
  | SpreadElement // AssignmentRestElement
  | ArrayLiteralExpression // ArrayAssignmentPattern
  | ObjectLiteralExpression // ObjectAssignmentPattern
  | AssignmentExpression<EqualsToken> // AssignmentElement
  | Identifier // DestructuringAssignmentTarget
  | PropertyAccessExpression // DestructuringAssignmentTarget
  | ElementAccessExpression // DestructuringAssignmentTarget
  ;

export type BindingOrAssignmentElementRestIndicator =
  | DotDotDotToken // from BindingElement
  | SpreadElement // AssignmentRestElement
  | SpreadAssignment // AssignmentRestProperty
  ;

export type BindingOrAssignmentElementTarget =
  | BindingOrAssignmentPattern
  | Identifier
  | PropertyAccessExpression
  | ElementAccessExpression
  | OmittedExpression;

export type ObjectBindingOrAssignmentPattern =
  | ObjectBindingPattern
  | ObjectLiteralExpression // ObjectAssignmentPattern
  ;

export type ArrayBindingOrAssignmentPattern =
  | ArrayBindingPattern
  | ArrayLiteralExpression // ArrayAssignmentPattern
  ;

export type AssignmentPattern = ObjectLiteralExpression | ArrayLiteralExpression;

export type BindingOrAssignmentPattern = ObjectBindingOrAssignmentPattern | ArrayBindingOrAssignmentPattern;

export interface ConditionalExpression extends Expression {
  readonly condition: Expression;
  readonly questionToken: QuestionToken;
  readonly whenTrue: Expression;
  readonly colonToken: ColonToken;
  readonly whenFalse: Expression;
}

export type FunctionBody = Block;
export type ConciseBody = FunctionBody | Expression;

export interface FunctionExpression extends PrimaryExpression, FunctionLikeDeclarationBase, JSDocContainer {
  readonly name?: Identifier;
  readonly body: FunctionBody;  // Required, whereas the member inherited from FunctionDeclaration is optional
}

export interface ArrowFunction extends Expression, FunctionLikeDeclarationBase, JSDocContainer {
  readonly equalsGreaterThanToken: EqualsGreaterThanToken;
  readonly body: ConciseBody;
  readonly name: never;
}

// The text property of a LiteralExpression stores the interpreted value of the literal in text form. For a StringLiteral,
// or any literal of a template, this means quotes have been removed and escapes have been converted to actual characters.
// For a NumericLiteral, the stored value is the toString() representation of the number. For example 1, 1.00, and 1e0 are all stored as just "1".
export interface LiteralLikeNode extends Node {
  text: string;
  isUnterminated?: boolean;
  hasExtendedUnicodeEscape?: boolean;
}

export interface TemplateLiteralLikeNode extends LiteralLikeNode {
  rawText?: string;
  /* @internal */
  templateFlags?: TokenFlags;
}

// The text property of a LiteralExpression stores the interpreted value of the literal in text form. For a StringLiteral,
// or any literal of a template, this means quotes have been removed and escapes have been converted to actual characters.
// For a NumericLiteral, the stored value is the toString() representation of the number. For example 1, 1.00, and 1e0 are all stored as just "1".
export interface LiteralExpression extends LiteralLikeNode, PrimaryExpression {
  _literalExpressionBrand: any;
}

export interface RegularExpressionLiteral extends LiteralExpression {
}

export interface NoSubstitutionTemplateLiteral extends LiteralExpression, TemplateLiteralLikeNode, Declaration {
  /* @internal */
  templateFlags?: TokenFlags;
}

export const enum TokenFlags {
  None = 0,
  /* @internal */
  PrecedingLineBreak = 1 << 0,
  /* @internal */
  PrecedingJSDocComment = 1 << 1,
  /* @internal */
  Unterminated = 1 << 2,
  /* @internal */
  ExtendedUnicodeEscape = 1 << 3,
  Scientific = 1 << 4,        // e.g. `10e2`
  Octal = 1 << 5,             // e.g. `0777`
  HexSpecifier = 1 << 6,      // e.g. `0x00000000`
  BinarySpecifier = 1 << 7,   // e.g. `0b0110010000000000`
  OctalSpecifier = 1 << 8,    // e.g. `0o777`
  /* @internal */
  ContainsSeparator = 1 << 9, // e.g. `0b1100_0101`
  /* @internal */
  UnicodeEscape = 1 << 10,
  /* @internal */
  ContainsInvalidEscape = 1 << 11,    // e.g. `\uhello`
  /* @internal */
  BinaryOrOctalSpecifier = BinarySpecifier | OctalSpecifier,
  /* @internal */
  NumericLiteralFlags = Scientific | Octal | HexSpecifier | BinaryOrOctalSpecifier | ContainsSeparator,
  /* @internal */
  TemplateLiteralLikeFlags = ContainsInvalidEscape,
}

export interface NumericLiteral extends LiteralExpression, Declaration {
  /* @internal */
  readonly numericLiteralFlags: TokenFlags;
}

export interface BigIntLiteral extends LiteralExpression {
}

export type LiteralToken =
  | NumericLiteral
  | BigIntLiteral
  | StringLiteral
  | JsxText
  | JsxTextAllWhiteSpaces
  | RegularExpressionLiteral
  | NoSubstitutionTemplateLiteral
  ;

export interface TemplateHead extends TemplateLiteralLikeNode {
  readonly parent: TemplateExpression | TemplateLiteralTypeNode;
  /* @internal */
  templateFlags?: TokenFlags;
}

export interface TemplateMiddle extends TemplateLiteralLikeNode {
  readonly parent: TemplateSpan | TemplateLiteralTypeSpan;
  /* @internal */
  templateFlags?: TokenFlags;
}

export interface TemplateTail extends TemplateLiteralLikeNode {
  readonly parent: TemplateSpan | TemplateLiteralTypeSpan;
  /* @internal */
  templateFlags?: TokenFlags;
}

export type PseudoLiteralToken =
  | TemplateHead
  | TemplateMiddle
  | TemplateTail
  ;

export type TemplateLiteralToken =
  | NoSubstitutionTemplateLiteral
  | PseudoLiteralToken
  ;

export interface TemplateExpression extends PrimaryExpression {
  readonly head: TemplateHead;
  readonly templateSpans: NodeArray<TemplateSpan>;
}

export type TemplateLiteral =
  | TemplateExpression
  | NoSubstitutionTemplateLiteral
  ;

// Each of these corresponds to a substitution expression and a template literal, in that order.
// The template literal must have kind TemplateMiddleLiteral or TemplateTailLiteral.
export interface TemplateSpan extends Node {
  readonly parent: TemplateExpression;
  readonly expression: Expression;
  readonly literal: TemplateMiddle | TemplateTail;
}

export interface ParenthesizedExpression extends PrimaryExpression, JSDocContainer {
  readonly expression: Expression;
}

export interface ArrayLiteralExpression extends PrimaryExpression {
  readonly elements: NodeArray<Expression>;
  /* @internal */
  multiLine?: boolean;
}

export interface SpreadElement extends Expression {
  readonly parent: ArrayLiteralExpression | CallExpression | NewExpression;
  readonly expression: Expression;
}

/**
 * This interface is a base interface for ObjectLiteralExpression and JSXAttributes to extend from. JSXAttributes is similar to
 * ObjectLiteralExpression in that it contains array of properties; however, JSXAttributes' properties can only be
 * JSXAttribute or JSXSpreadAttribute. ObjectLiteralExpression, on the other hand, can only have properties of type
 * ObjectLiteralElement (e.g. PropertyAssignment, ShorthandPropertyAssignment etc.)
 */
export interface ObjectLiteralExpressionBase<T extends ObjectLiteralElement> extends PrimaryExpression, Declaration {
  readonly properties: NodeArray<T>;
}

// An ObjectLiteralExpression is the declaration node for an anonymous symbol.
export interface ObjectLiteralExpression extends ObjectLiteralExpressionBase<ObjectLiteralElementLike> {
  /* @internal */
  multiLine?: boolean;
}

export type EntityNameExpression = Identifier | PropertyAccessEntityNameExpression;
export type EntityNameOrEntityNameExpression = EntityName | EntityNameExpression;
export type AccessExpression = PropertyAccessExpression | ElementAccessExpression;

export interface PropertyAccessExpression extends MemberExpression, NamedDeclaration {
  readonly expression: LeftHandSideExpression;
  readonly questionDotToken?: QuestionDotToken;
  readonly name: Identifier | PrivateIdentifier;
}

/*@internal*/
export interface PrivateIdentifierPropertyAccessExpression extends PropertyAccessExpression {
  readonly name: PrivateIdentifier;
}

export interface PropertyAccessChain extends PropertyAccessExpression {
  _optionalChainBrand: any;
  readonly name: Identifier | PrivateIdentifier;
}

/* @internal */
export interface PropertyAccessChainRoot extends PropertyAccessChain {
  readonly questionDotToken: QuestionDotToken;
}

export interface SuperPropertyAccessExpression extends PropertyAccessExpression {
  readonly expression: SuperExpression;
}

/** Brand for a PropertyAccessExpression which, like a QualifiedName, consists of a sequence of identifiers separated by dots. */
export interface PropertyAccessEntityNameExpression extends PropertyAccessExpression {
  _propertyAccessExpressionLikeQualifiedNameBrand?: any;
  readonly expression: EntityNameExpression;
  readonly name: Identifier;
}

export interface ElementAccessExpression extends MemberExpression {
  readonly expression: LeftHandSideExpression;
  readonly questionDotToken?: QuestionDotToken;
  readonly argumentExpression: Expression;
}

export interface ElementAccessChain extends ElementAccessExpression {
  _optionalChainBrand: any;
}

/* @internal */
export interface ElementAccessChainRoot extends ElementAccessChain {
  readonly questionDotToken: QuestionDotToken;
}

export interface SuperElementAccessExpression extends ElementAccessExpression {
  readonly expression: SuperExpression;
}

// see: https://tc39.github.io/ecma262/#prod-SuperProperty
export type SuperProperty = SuperPropertyAccessExpression | SuperElementAccessExpression;

export interface CallExpression extends LeftHandSideExpression, Declaration {
  readonly expression: LeftHandSideExpression;
  readonly questionDotToken?: QuestionDotToken;
  readonly typeArguments?: NodeArray<TypeNode>;
  readonly arguments: NodeArray<Expression>;
}

export interface CallChain extends CallExpression {
  _optionalChainBrand: any;
}

/* @internal */
export interface CallChainRoot extends CallChain {
  readonly questionDotToken: QuestionDotToken;
}

export type OptionalChain =
  | PropertyAccessChain
  | ElementAccessChain
  | CallChain
  | NonNullChain
  ;

/* @internal */
export type OptionalChainRoot =
  | PropertyAccessChainRoot
  | ElementAccessChainRoot
  | CallChainRoot
  ;

/** @internal */
export interface WellKnownSymbolExpression extends PropertyAccessExpression {
  readonly expression: Identifier & { readonly escapedText: any };
  readonly name: Identifier;
}

/** @internal */
export type BindableObjectDefinePropertyCall = CallExpression & {
  readonly arguments: readonly [BindableStaticNameExpression, StringLiteralLike | NumericLiteral, ObjectLiteralExpression] & Readonly<TextRange>;
};

/** @internal */
export type BindableStaticNameExpression =
  | EntityNameExpression
  | BindableStaticElementAccessExpression
  ;

/** @internal */
export type LiteralLikeElementAccessExpression = ElementAccessExpression & Declaration & {
  readonly argumentExpression: StringLiteralLike | NumericLiteral | WellKnownSymbolExpression;
};

/** @internal */
export type BindableStaticElementAccessExpression = LiteralLikeElementAccessExpression & {
  readonly expression: BindableStaticNameExpression;
};

/** @internal */
export type BindableElementAccessExpression = ElementAccessExpression & {
  readonly expression: BindableStaticNameExpression;
};

/** @internal */
export type BindableStaticAccessExpression =
  | PropertyAccessEntityNameExpression
  | BindableStaticElementAccessExpression
  ;

/** @internal */
export type BindableAccessExpression =
  | PropertyAccessEntityNameExpression
  | BindableElementAccessExpression
  ;

/** @internal */
export interface BindableStaticPropertyAssignmentExpression extends BinaryExpression {
  readonly left: BindableStaticAccessExpression;
}

/** @internal */
export interface BindablePropertyAssignmentExpression extends BinaryExpression {
  readonly left: BindableAccessExpression;
}

// see: https://tc39.github.io/ecma262/#prod-SuperCall
export interface SuperCall extends CallExpression {
  readonly expression: SuperExpression;
}

export interface ImportCall extends CallExpression {
  readonly expression: ImportExpression;
}

export interface ExpressionWithTypeArguments extends NodeWithTypeArguments {
  readonly parent: HeritageClause | JSDocAugmentsTag | JSDocImplementsTag;
  readonly expression: LeftHandSideExpression;
}

export interface NewExpression extends PrimaryExpression, Declaration {
  readonly expression: LeftHandSideExpression;
  readonly typeArguments?: NodeArray<TypeNode>;
  readonly arguments?: NodeArray<Expression>;
}

export interface TaggedTemplateExpression extends MemberExpression {
  readonly tag: LeftHandSideExpression;
  readonly typeArguments?: NodeArray<TypeNode>;
  readonly template: TemplateLiteral;
  /*@internal*/
  questionDotToken?: QuestionDotToken; // NOTE: Invalid syntax, only used to report a grammar error.
}

export type CallLikeExpression =
  | CallExpression
  | NewExpression
  | TaggedTemplateExpression
  | Decorator
  | JsxOpeningLikeElement
  ;

export interface AsExpression extends Expression {
  readonly expression: Expression;
  readonly type: TypeNode;
}

export interface TypeAssertion extends UnaryExpression {
  readonly type: TypeNode;
  readonly expression: UnaryExpression;
}

export type AssertionExpression =
  | TypeAssertion
  | AsExpression
  ;

export interface NonNullExpression extends LeftHandSideExpression {
  readonly expression: Expression;
}

export interface NonNullChain extends NonNullExpression {
  _optionalChainBrand: any;
}

// NOTE: MetaProperty is really a MemberExpression, but we consider it a PrimaryExpression
//       for the same reasons we treat NewExpression as a PrimaryExpression.
export interface MetaProperty extends PrimaryExpression {
  readonly keywordToken: KeywordToken<KeywordSyntaxKind.NewKeyword | KeywordSyntaxKind.ImportKeyword>;
  readonly name: Identifier;
}

/* @internal */
export interface ImportMetaProperty extends MetaProperty {
  readonly keywordToken: KeywordToken<KeywordSyntaxKind.ImportKeyword>;
  readonly name: Identifier & { readonly escapedText: any };
}

/// A JSX expression of the form <TagName attrs>...</TagName>
export interface JsxElement extends PrimaryExpression {
  readonly openingElement: JsxOpeningElement;
  readonly children: NodeArray<JsxChild>;
  readonly closingElement: JsxClosingElement;
}

/// Either the opening tag in a <Tag>...</Tag> pair or the lone <Tag /> in a self-closing form
export type JsxOpeningLikeElement =
  | JsxSelfClosingElement
  | JsxOpeningElement
  ;

export type JsxAttributeLike =
  | JsxAttribute
  | JsxSpreadAttribute
  ;

export type JsxTagNameExpression =
  | Identifier
  | ThisExpression
  | JsxTagNamePropertyAccess
  ;

export interface JsxTagNamePropertyAccess extends PropertyAccessExpression {
  readonly expression: JsxTagNameExpression;
}

export interface JsxAttributes extends ObjectLiteralExpressionBase<JsxAttributeLike> {
  readonly parent: JsxOpeningLikeElement;
}

/// The opening element of a <Tag>...</Tag> JsxElement
export interface JsxOpeningElement extends Expression {
  readonly parent: JsxElement;
  readonly tagName: JsxTagNameExpression;
  readonly typeArguments?: NodeArray<TypeNode>;
  readonly attributes: JsxAttributes;
}

/// A JSX expression of the form <TagName attrs />
export interface JsxSelfClosingElement extends PrimaryExpression {
  readonly tagName: JsxTagNameExpression;
  readonly typeArguments?: NodeArray<TypeNode>;
  readonly attributes: JsxAttributes;
}

/// A JSX expression of the form <>...</>
export interface JsxFragment extends PrimaryExpression {
  readonly openingFragment: JsxOpeningFragment;
  readonly children: NodeArray<JsxChild>;
  readonly closingFragment: JsxClosingFragment;
}

/// The opening element of a <>...</> JsxFragment
export interface JsxOpeningFragment extends Expression {
  readonly parent: JsxFragment;
}

/// The closing element of a <>...</> JsxFragment
export interface JsxClosingFragment extends Expression {
  readonly parent: JsxFragment;
}

export interface JsxAttribute extends ObjectLiteralElement {
  readonly parent: JsxAttributes;
  readonly name: Identifier;
  /// JSX attribute initializers are optional; <X y /> is sugar for <X y={true} />
  readonly initializer?: StringLiteral | JsxExpression;
}

export interface JsxSpreadAttribute extends ObjectLiteralElement {
  readonly parent: JsxAttributes;
  readonly expression: Expression;
}

export interface JsxClosingElement extends Node {
  readonly parent: JsxElement;
  readonly tagName: JsxTagNameExpression;
}

export interface JsxExpression extends Expression {
  readonly parent: JsxElement | JsxAttributeLike;
  readonly dotDotDotToken?: Token<PunctuationSyntaxKind.DotDotDotToken>;
  readonly expression?: Expression;
}

export interface JsxText extends LiteralLikeNode {
  readonly parent: JsxElement;
  readonly containsOnlyTriviaWhiteSpaces: boolean;
}

export interface JsxTextAllWhiteSpaces extends LiteralLikeNode {
  readonly parent: JsxElement;
  readonly containsOnlyTriviaWhiteSpaces: boolean;
}

export type JsxChild =
  | JsxText
  | JsxExpression
  | JsxElement
  | JsxSelfClosingElement
  | JsxFragment
  ;

export interface Statement extends Node {
  _statementBrand: any;
}

// Represents a statement that is elided as part of a transformation to emit comments on a
// not-emitted node.
export interface NotEmittedStatement extends Statement {
}

/**
 * Marks the end of transformed declaration to properly emit exports.
 */

/* @internal */
export interface EndOfDeclarationMarker extends Statement {
}

/**
 * A list of comma-separated expressions. This node is only created by transformations.
 */
export interface CommaListExpression extends Expression {
  readonly elements: NodeArray<Expression>;
}

/**
 * Marks the beginning of a merged transformed declaration.
 */

/* @internal */
export interface MergeDeclarationMarker extends Statement {
}

/* @internal */
export interface SyntheticReferenceExpression extends LeftHandSideExpression {
  readonly expression: Expression;
  readonly thisArg: Expression;
}

export interface EmptyStatement extends Statement {
}

export interface DebuggerStatement extends Statement {
}

export interface MissingDeclaration extends DeclarationStatement {
  /*@internal*/
  decorators?: NodeArray<Decorator>; // Present for use with reporting a grammar error
  /*@internal*/
  modifiers?: ModifiersArray; // Present for use with reporting a grammar error
  readonly name?: Identifier;
}

export interface Block extends Statement {
  readonly statements: NodeArray<Statement>;
  /*@internal*/
  multiLine?: boolean;
}

export interface VariableStatement extends Statement, JSDocContainer {
  /* @internal*/
  decorators?: NodeArray<Decorator>; // Present for use with reporting a grammar error
  readonly declarationList: VariableDeclarationList;
}

export interface ExpressionStatement extends Statement, JSDocContainer {
  readonly expression: Expression;
}

/* @internal */
export interface PrologueDirective extends ExpressionStatement {
  readonly expression: StringLiteral;
}

export interface IfStatement extends Statement {
  readonly expression: Expression;
  readonly thenStatement: Statement;
  readonly elseStatement?: Statement;
}

export interface IterationStatement extends Statement {
  readonly statement: Statement;
}

export interface DoStatement extends IterationStatement {
  readonly expression: Expression;
}

export interface WhileStatement extends IterationStatement {
  readonly expression: Expression;
}

export type ForInitializer =
  | VariableDeclarationList
  | Expression
  ;

export interface ForStatement extends IterationStatement {
  readonly initializer?: ForInitializer;
  readonly condition?: Expression;
  readonly incrementor?: Expression;
}

export type ForInOrOfStatement =
  | ForInStatement
  | ForOfStatement
  ;

export interface ForInStatement extends IterationStatement {
  readonly initializer: ForInitializer;
  readonly expression: Expression;
}

export interface ForOfStatement extends IterationStatement {
  readonly awaitModifier?: AwaitKeywordToken;
  readonly initializer: ForInitializer;
  readonly expression: Expression;
}

export interface BreakStatement extends Statement {
  readonly label?: Identifier;
}

export interface ContinueStatement extends Statement {
  readonly label?: Identifier;
}

export type BreakOrContinueStatement =
  | BreakStatement
  | ContinueStatement
  ;

export interface ReturnStatement extends Statement {
  readonly expression?: Expression;
}

export interface WithStatement extends Statement {
  readonly expression: Expression;
  readonly statement: Statement;
}

export interface SwitchStatement extends Statement {
  readonly expression: Expression;
  readonly caseBlock: CaseBlock;
  possiblyExhaustive?: boolean; // initialized by binding
}

export interface CaseBlock extends Node {
  readonly parent: SwitchStatement;
  readonly clauses: NodeArray<CaseOrDefaultClause>;
}

export interface CaseClause extends Node {
  readonly parent: CaseBlock;
  readonly expression: Expression;
  readonly statements: NodeArray<Statement>;
  /* @internal */
  fallthroughFlowNode?: FlowNode;
}

export interface DefaultClause extends Node {
  readonly parent: CaseBlock;
  readonly statements: NodeArray<Statement>;
  /* @internal */
  fallthroughFlowNode?: FlowNode;
}

export type CaseOrDefaultClause =
  | CaseClause
  | DefaultClause
  ;

export interface LabeledStatement extends Statement, JSDocContainer {
  readonly label: Identifier;
  readonly statement: Statement;
}

export interface ThrowStatement extends Statement {
  readonly expression: Expression;
}

export interface TryStatement extends Statement {
  readonly tryBlock: Block;
  readonly catchClause?: CatchClause;
  readonly finallyBlock?: Block;
}

export interface CatchClause extends Node {
  readonly parent: TryStatement;
  readonly variableDeclaration?: VariableDeclaration;
  readonly block: Block;
}

export type ObjectTypeDeclaration =
  | ClassLikeDeclaration
  | InterfaceDeclaration
  | TypeLiteralNode
  ;

export type DeclarationWithTypeParameters =
  | DeclarationWithTypeParameterChildren
  | JSDocTypedefTag
  | JSDocCallbackTag
  | JSDocSignature
  ;

export type DeclarationWithTypeParameterChildren =
  | SignatureDeclaration
  | ClassLikeDeclaration
  | InterfaceDeclaration
  | TypeAliasDeclaration
  | JSDocTemplateTag
  ;

export interface ClassLikeDeclarationBase extends NamedDeclaration, JSDocContainer {
  readonly name?: Identifier;
  readonly typeParameters?: NodeArray<TypeParameterDeclaration>;
  readonly heritageClauses?: NodeArray<HeritageClause>;
  readonly members: NodeArray<ClassElement>;
}

export interface ClassDeclaration extends ClassLikeDeclarationBase, DeclarationStatement {
  /** May be undefined in `export default class { ... }`. */
  readonly name?: Identifier;
}

export interface ClassExpression extends ClassLikeDeclarationBase, PrimaryExpression {
}

export type ClassLikeDeclaration =
  | ClassDeclaration
  | ClassExpression
  ;

export interface ClassElement extends NamedDeclaration {
  // _classElementBrand: any;
  readonly name?: PropertyName;
}

export interface TypeElement extends NamedDeclaration {
  // _typeElementBrand: any;
  readonly name?: PropertyName;
  readonly questionToken?: QuestionToken;
}

export interface InterfaceDeclaration extends DeclarationStatement, JSDocContainer {
  // readonly kind: SyntaxKind.InterfaceDeclaration;
  readonly name: Identifier;
  readonly typeParameters?: NodeArray<TypeParameterDeclaration>;
  readonly heritageClauses?: NodeArray<HeritageClause>;
  readonly members: NodeArray<TypeElement>;
}

export interface HeritageClause extends Node {
  readonly parent: InterfaceDeclaration | ClassLikeDeclaration;
  readonly token: KeywordToken<KeywordSyntaxKind.ExtendsKeyword | KeywordSyntaxKind.ImplementsKeyword>;
  readonly types: NodeArray<ExpressionWithTypeArguments>;
}

export interface TypeAliasDeclaration extends DeclarationStatement, JSDocContainer {
  readonly name: Identifier;
  readonly typeParameters?: NodeArray<TypeParameterDeclaration>;
  readonly type: TypeNode;
}

export interface EnumMember extends NamedDeclaration, JSDocContainer {
  readonly parent: EnumDeclaration;
  // This does include ComputedPropertyName, but the parser will give an error
  // if it parses a ComputedPropertyName in an EnumMember
  readonly name: PropertyName;
  readonly initializer?: Expression;
}

export interface EnumDeclaration extends DeclarationStatement, JSDocContainer {
  readonly name: Identifier;
  readonly members: NodeArray<EnumMember>;
}

export type ModuleName =
  | Identifier
  | StringLiteral
  ;

export type ModuleBody =
  | NamespaceBody
  | JSDocNamespaceBody
  ;

/* @internal */
export interface AmbientModuleDeclaration extends ModuleDeclaration {
  readonly body?: ModuleBlock;
}

export interface ModuleDeclaration extends DeclarationStatement, JSDocContainer {
  readonly parent: ModuleBody | SourceFile;
  readonly name: ModuleName;
  readonly body?: ModuleBody | JSDocNamespaceDeclaration;
}

export type NamespaceBody =
  | ModuleBlock
  | NamespaceDeclaration
  ;

export interface NamespaceDeclaration extends ModuleDeclaration {
  readonly name: Identifier;
  readonly body: NamespaceBody;
}

export type JSDocNamespaceBody =
  | Identifier
  | JSDocNamespaceDeclaration
  ;

export interface JSDocNamespaceDeclaration extends ModuleDeclaration {
  readonly name: Identifier;
  readonly body?: JSDocNamespaceBody;
}

export interface ModuleBlock extends Node, Statement {
  readonly parent: ModuleDeclaration;
  readonly statements: NodeArray<Statement>;
}

export type ModuleReference =
  | EntityName
  | ExternalModuleReference
  ;

/**
 * One of:
 * - import x = require("mod");
 * - import x = M.x;
 */
export interface ImportEqualsDeclaration extends DeclarationStatement, JSDocContainer {
  readonly parent: SourceFile | ModuleBlock;
  readonly name: Identifier;

  // 'EntityName' for an internal module reference, 'ExternalModuleReference' for an external
  // module reference.
  readonly moduleReference: ModuleReference;
}

export interface ExternalModuleReference extends Node {
  readonly parent: ImportEqualsDeclaration;
  readonly expression: Expression;
}

// In case of:
// import "mod"  => importClause = undefined, moduleSpecifier = "mod"
// In rest of the cases, module specifier is string literal corresponding to module
// ImportClause information is shown at its declaration below.
export interface ImportDeclaration extends Statement, JSDocContainer {
  readonly parent: SourceFile | ModuleBlock;
  readonly importClause?: ImportClause;
  /** If this is not a StringLiteral it will be a grammar error. */
  readonly moduleSpecifier: Expression;
}

export type NamedImportBindings =
  | NamespaceImport
  | NamedImports
  ;

export type NamedExportBindings =
  | NamespaceExport
  | NamedExports
  ;

// In case of:
// import d from "mod" => name = d, namedBinding = undefined
// import * as ns from "mod" => name = undefined, namedBinding: NamespaceImport = { name: ns }
// import d, * as ns from "mod" => name = d, namedBinding: NamespaceImport = { name: ns }
// import { a, b as x } from "mod" => name = undefined, namedBinding: NamedImports = { elements: [{ name: a }, { name: x, propertyName: b}]}
// import d, { a, b as x } from "mod" => name = d, namedBinding: NamedImports = { elements: [{ name: a }, { name: x, propertyName: b}]}
export interface ImportClause extends NamedDeclaration {
  readonly parent: ImportDeclaration;
  readonly isTypeOnly: boolean;
  readonly name?: Identifier; // Default binding
  readonly namedBindings?: NamedImportBindings;
}

export interface NamespaceImport extends NamedDeclaration {
  readonly parent: ImportClause;
  readonly name: Identifier;
}

export interface NamespaceExport extends NamedDeclaration {
  readonly parent: ExportDeclaration;
  readonly name: Identifier
}

export interface NamespaceExportDeclaration extends DeclarationStatement, JSDocContainer {
  readonly name: Identifier;
  /* @internal */
  decorators?: NodeArray<Decorator>; // Present for use with reporting a grammar error
  /* @internal */
  modifiers?: ModifiersArray; // Present for use with reporting a grammar error
}

export interface ExportDeclaration extends DeclarationStatement, JSDocContainer {
  readonly parent: SourceFile | ModuleBlock;
  readonly isTypeOnly: boolean;
  /** Will not be assigned in the case of `export * from "foo";` */
  readonly exportClause?: NamedExportBindings;
  /** If this is not a StringLiteral it will be a grammar error. */
  readonly moduleSpecifier?: Expression;
}

export interface NamedImports extends Node {
  readonly parent: ImportClause;
  readonly elements: NodeArray<ImportSpecifier>;
}

export interface NamedExports extends Node {
  readonly parent: ExportDeclaration;
  readonly elements: NodeArray<ExportSpecifier>;
}

export type NamedImportsOrExports = NamedImports | NamedExports;

export interface ImportSpecifier extends NamedDeclaration {
  readonly parent: NamedImports;
  readonly propertyName?: Identifier;  // Name preceding "as" keyword (or undefined when "as" is absent)
  readonly name: Identifier;           // Declared name
}

export interface ExportSpecifier extends NamedDeclaration {
  readonly parent: NamedExports;
  readonly propertyName?: Identifier;  // Name preceding "as" keyword (or undefined when "as" is absent)
  readonly name: Identifier;           // Declared name
}

export type ImportOrExportSpecifier =
  | ImportSpecifier
  | ExportSpecifier
  ;

export type TypeOnlyCompatibleAliasDeclaration =
  | ImportClause
  | NamespaceImport
  | ImportOrExportSpecifier
  ;

/**
 * This is either an `export =` or an `export default` declaration.
 * Unless `isExportEquals` is set, this node was parsed as an `export default`.
 */
export interface ExportAssignment extends DeclarationStatement, JSDocContainer {
  readonly parent: SourceFile;
  readonly isExportEquals?: boolean;
  readonly expression: Expression;
}

export interface FileReference extends TextRange {
  fileName: string;
}

export interface CheckJsDirective extends TextRange {
  enabled: boolean;
}

export type CommentKind = SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia;

export interface CommentRange extends TextRange {
  hasTrailingNewLine?: boolean;
  kind: CommentKind;
}

export interface SynthesizedComment extends CommentRange {
  text: string;
  pos: -1;
  end: -1;
  hasLeadingNewline?: boolean;
}

// represents a top level: { type } expression in a JSDoc comment.
export interface JSDocTypeExpression extends TypeNode {
  readonly type: TypeNode;
}

export interface JSDocNameReference extends Node {
  readonly name: EntityName;
}

export interface JSDocType extends TypeNode {
  _jsDocTypeBrand: any;
}

export interface JSDocAllType extends JSDocType {
}

export interface JSDocUnknownType extends JSDocType {
}

export interface JSDocNonNullableType extends JSDocType {
  readonly type: TypeNode;
}

export interface JSDocNullableType extends JSDocType {
  readonly type: TypeNode;
}

export interface JSDocOptionalType extends JSDocType {
  readonly type: TypeNode;
}

export interface JSDocFunctionType extends JSDocType, SignatureDeclarationBase {
}

export interface JSDocVariadicType extends JSDocType {
  readonly type: TypeNode;
}

export interface JSDocNamepathType extends JSDocType {
  readonly type: TypeNode;
}

export type JSDocTypeReferencingNode =
  | JSDocVariadicType
  | JSDocOptionalType
  | JSDocNullableType
  | JSDocNonNullableType
  ;

export interface JSDoc extends Node {
  readonly parent: HasJSDoc;
  readonly tags?: NodeArray<JSDocTag>;
  readonly comment?: string;
}

export interface JSDocTag extends Node {
  readonly kind: JSDocSyntaxKind;
  readonly parent: JSDoc | JSDocTypeLiteral;
  readonly tagName: Identifier;
  readonly comment?: string;
}

export interface JSDocUnknownTag extends JSDocTag {
}

/**
 * Note that `@extends` is a synonym of `@augments`.
 * Both tags are represented by this interface.
 */
export interface JSDocAugmentsTag extends JSDocTag {
  readonly class: ExpressionWithTypeArguments & { readonly expression: Identifier | PropertyAccessEntityNameExpression };
}

export interface JSDocImplementsTag extends JSDocTag {
  readonly class: ExpressionWithTypeArguments & { readonly expression: Identifier | PropertyAccessEntityNameExpression };
}

export interface JSDocAuthorTag extends JSDocTag {
}

export interface JSDocDeprecatedTag extends JSDocTag {
}

export interface JSDocClassTag extends JSDocTag {
}

export interface JSDocPublicTag extends JSDocTag {
}

export interface JSDocPrivateTag extends JSDocTag {
}

export interface JSDocProtectedTag extends JSDocTag {
}

export interface JSDocReadonlyTag extends JSDocTag {
}

export interface JSDocEnumTag extends JSDocTag, Declaration {
  readonly parent: JSDoc;
  readonly typeExpression: JSDocTypeExpression;
}

export interface JSDocThisTag extends JSDocTag {
  readonly typeExpression: JSDocTypeExpression;
}

export interface JSDocTemplateTag extends JSDocTag {
  readonly constraint: JSDocTypeExpression | undefined;
  readonly typeParameters: NodeArray<TypeParameterDeclaration>;
}

export interface JSDocSeeTag extends JSDocTag {
  readonly name?: JSDocNameReference;
}

export interface JSDocReturnTag extends JSDocTag {
  readonly typeExpression?: JSDocTypeExpression;
}

export interface JSDocTypeTag extends JSDocTag {
  readonly typeExpression: JSDocTypeExpression;
}

export interface JSDocTypedefTag extends JSDocTag, NamedDeclaration {
  readonly parent: JSDoc;
  readonly fullName?: JSDocNamespaceDeclaration | Identifier;
  readonly name?: Identifier;
  readonly typeExpression?: JSDocTypeExpression | JSDocTypeLiteral;
}

export interface JSDocCallbackTag extends JSDocTag, NamedDeclaration {
  readonly parent: JSDoc;
  readonly fullName?: JSDocNamespaceDeclaration | Identifier;
  readonly name?: Identifier;
  readonly typeExpression: JSDocSignature;
}

export interface JSDocSignature extends JSDocType, Declaration {
  readonly typeParameters?: readonly JSDocTemplateTag[];
  readonly parameters: readonly JSDocParameterTag[];
  readonly type: JSDocReturnTag | undefined;
}

export interface JSDocPropertyLikeTag extends JSDocTag, Declaration {
  readonly parent: JSDoc;
  readonly name: EntityName;
  readonly typeExpression?: JSDocTypeExpression;
  /** Whether the property name came before the type -- non-standard for JSDoc, but Typescript-like */
  readonly isNameFirst: boolean;
  readonly isBracketed: boolean;
}

export interface JSDocPropertyTag extends JSDocPropertyLikeTag {
}

export interface JSDocParameterTag extends JSDocPropertyLikeTag {
}

export interface JSDocTypeLiteral extends JSDocType {
  readonly jsDocPropertyTags?: readonly JSDocPropertyLikeTag[];
  /** If true, then this type literal represents an *array* of its type. */
  readonly isArrayType: boolean;
}

// NOTE: Ensure this is up-to-date with src/debug/debug.ts
export const enum FlowFlags {
  Unreachable = 1 << 0,  // Unreachable code
  Start = 1 << 1,  // Start of flow graph
  BranchLabel = 1 << 2,  // Non-looping junction
  LoopLabel = 1 << 3,  // Looping junction
  Assignment = 1 << 4,  // Assignment
  TrueCondition = 1 << 5,  // Condition known to be true
  FalseCondition = 1 << 6,  // Condition known to be false
  SwitchClause = 1 << 7,  // Switch statement clause
  ArrayMutation = 1 << 8,  // Potential array mutation
  Call = 1 << 9,  // Potential assertion call
  ReduceLabel = 1 << 10, // Temporarily reduce antecedents of label
  Referenced = 1 << 11, // Referenced as antecedent once
  Shared = 1 << 12, // Referenced as antecedent more than once

  Label = BranchLabel | LoopLabel,
  Condition = TrueCondition | FalseCondition,
}

export type FlowNode =
  | FlowStart
  | FlowLabel
  | FlowAssignment
  | FlowCall
  | FlowCondition
  | FlowSwitchClause
  | FlowArrayMutation
  | FlowCall
  | FlowReduceLabel;

export interface FlowNodeBase {
  flags: FlowFlags;
  id?: number;     // Node id used by flow type cache in checker
}

// FlowStart represents the start of a control flow. For a function expression or arrow
// function, the node property references the function (which in turn has a flowNode
// property for the containing control flow).
export interface FlowStart extends FlowNodeBase {
  node?: FunctionExpression | ArrowFunction | MethodDeclaration;
}

// FlowLabel represents a junction with multiple possible preceding control flows.
export interface FlowLabel extends FlowNodeBase {
  antecedents: FlowNode[] | undefined;
}

// FlowAssignment represents a node that assigns a value to a narrowable reference,
// i.e. an identifier or a dotted name that starts with an identifier or 'this'.
export interface FlowAssignment extends FlowNodeBase {
  node: Expression | VariableDeclaration | BindingElement;
  antecedent: FlowNode;
}

export interface FlowCall extends FlowNodeBase {
  node: CallExpression;
  antecedent: FlowNode;
}

// FlowCondition represents a condition that is known to be true or false at the
// node's location in the control flow.
export interface FlowCondition extends FlowNodeBase {
  node: Expression;
  antecedent: FlowNode;
}

export interface FlowSwitchClause extends FlowNodeBase {
  switchStatement: SwitchStatement;
  clauseStart: number;   // Start index of case/default clause range
  clauseEnd: number;     // End index of case/default clause range
  antecedent: FlowNode;
}

// FlowArrayMutation represents a node potentially mutates an array, i.e. an
// operation of the form 'x.push(value)', 'x.unshift(value)' or 'x[n] = value'.
export interface FlowArrayMutation extends FlowNodeBase {
  node: CallExpression | BinaryExpression;
  antecedent: FlowNode;
}

export interface FlowReduceLabel extends FlowNodeBase {
  target: FlowLabel;
  antecedents: FlowNode[];
  antecedent: FlowNode;
}

export type FlowType = Type | IncompleteType;

// Incomplete types occur during control flow analysis of loops. An IncompleteType
// is distinguished from a regular type by a flags value of zero. Incomplete type
// objects are internal to the getFlowTypeOfReference function and never escape it.
export interface IncompleteType {
  flags: TypeFlags;  // No flags set
  type: Type;        // The type marked incomplete
}

export interface AmdDependency {
  path: string;
  name?: string;
}

/* @internal */
/**
 * Subset of properties from SourceFile that are used in multiple utility functions
 */
export interface SourceFileLike {
  readonly text: string;
  lineMap?: readonly number[];

  /* @internal */
  getPositionOfLineAndCharacter?(line: number, character: number, allowEdits?: true): number;
}


/* @internal */
export interface RedirectInfo {
  /** Source file this redirects to. */
  readonly redirectTarget: SourceFile;
  /**
   * Source file for the duplicate package. This will not be used by the Program,
   * but we need to keep this around so we can watch for changes in underlying.
   */
  readonly unredirected: SourceFile;
}

// Source files are declarations when they are external modules.
export interface SourceFile extends Declaration {
  readonly statements: NodeArray<Statement>;
  readonly endOfFileToken: Token<SyntaxKind.EndOfFileToken>;

  fileName: string;
  /* @internal */
  path: any;
  text: string;
  /** Resolved path can be different from path property,
   * when file is included through project reference is mapped to its output instead of source
   * in that case resolvedPath = path to output file
   * path = input file's path
   */
  /* @internal */
  resolvedPath: any;
  /** Original file name that can be different from fileName,
   * when file is included through project reference is mapped to its output instead of source
   * in that case originalFileName = name of input file
   * fileName = output file's name
   */
  /* @internal */
  originalFileName: string;

  [key: string]: any
}

/* @internal */
export interface CommentDirective {
  range: TextRange;
  type: CommentDirectiveType,
}

/* @internal */
export const enum CommentDirectiveType {
  ExpectError,
  Ignore,
}

/*@internal*/
export type ExportedModulesFromDeclarationEmit = readonly Symbol[];

export interface UnparsedSource extends Node {
  fileName: string;
  text: string;

  [key: string]: any;
}

export type UnparsedSourceText =
  | UnparsedPrepend
  | UnparsedTextLike
  ;

export type UnparsedNode =
  | UnparsedPrologue
  | UnparsedSourceText
  | UnparsedSyntheticReference
  ;

export interface UnparsedSection extends Node {
  readonly kind: SyntaxKind;
  readonly parent: UnparsedSource;
  readonly data?: string;
}

export interface UnparsedPrologue extends UnparsedSection {
  readonly parent: UnparsedSource;
  readonly data: string;
}

export interface UnparsedPrepend extends UnparsedSection {
  readonly parent: UnparsedSource;
  readonly data: string;
  readonly texts: readonly UnparsedTextLike[];
}

export interface UnparsedTextLike extends UnparsedSection {
  readonly parent: UnparsedSource;
}

export interface UnparsedSyntheticReference extends UnparsedSection {
  readonly parent: UnparsedSource;
  /*@internal*/
  readonly section: any;
}

export interface JsonSourceFile extends SourceFile {
  readonly statements: NodeArray<JsonObjectExpressionStatement>;
}

export interface TsConfigSourceFile extends JsonSourceFile {
  extendedSourceFiles?: string[];
}

export interface JsonMinusNumericLiteral extends PrefixUnaryExpression {
  readonly operator: PunctuationSyntaxKind.MinusToken;
  readonly operand: NumericLiteral;
}

export type JsonObjectExpression =
  | ObjectLiteralExpression
  | ArrayLiteralExpression
  | JsonMinusNumericLiteral
  | NumericLiteral
  | StringLiteral
  | BooleanLiteral
  | NullLiteral
  ;

export interface JsonObjectExpressionStatement extends ExpressionStatement {
  readonly expression: JsonObjectExpression;
}

// export interface ScriptReferenceHost {
//   getCompilerOptions(): CompilerOptions;
//
//   getSourceFile(fileName: string): SourceFile | undefined;
//
//   getSourceFileByPath(path: Path): SourceFile | undefined;
//
//   getCurrentDirectory(): string;
// }

export interface ParseConfigHost {
  useCaseSensitiveFileNames: boolean;

  readDirectory(rootDir: string,
                extensions: readonly string[],
                excludes: readonly string[] | undefined,
                includes: readonly string[],
                depth?: number): readonly string[];

  /**
   * Gets a value indicating whether the specified path exists and is a file.
   * @param path The path to test.
   */
  fileExists(path: string): boolean;

  readFile(path: string): string | undefined;

  trace?(s: string): void;
}

/**
 * Branded string for keeping track of when we've turned an ambiguous path
 * specified like "./blah" to an absolute path to an actual
 * tsconfig file, e.g. "/root/blah/tsconfig.json"
 */
export type ResolvedConfigFileName = string & { _isResolvedConfigFileName: never };

export type WriteFileCallback = (
  fileName: string,
  data: string,
  writeByteOrderMark: boolean,
  onError?: (message: string) => void,
  sourceFiles?: readonly SourceFile[]
) => void;

export class OperationCanceledException {
}

export interface CancellationToken {
  isCancellationRequested(): boolean;

  /** @throws OperationCanceledException if isCancellationRequested is true */
  throwIfCancellationRequested(): void;
}

/*@internal*/
export enum RefFileKind {
  Import,
  ReferenceFile,
  TypeReferenceDirective
}

/*@internal*/
export interface RefFile {
  referencedFileName: string;
  kind: RefFileKind;
  index: number;
  file: any;
}


export interface ResolvedProjectReference {
  commandLine: any;
  sourceFile: SourceFile;
  references?: readonly (ResolvedProjectReference | undefined)[];
}

/* @internal */
export const enum StructureIsReused {
  Not = 0,
  SafeModules = 1 << 0,
  Completely = 1 << 1,
}

// export type CustomTransformerFactory = (context: TransformationContext) => CustomTransformer;
//
// export interface CustomTransformer {
//   transformSourceFile(node: SourceFile): SourceFile;
//
//   transformBundle(node: Bundle): Bundle;
// }
//
// export interface CustomTransformers {
//   /** Custom transformers to evaluate before built-in .js transformations. */
//   before?: (TransformerFactory<SourceFile> | CustomTransformerFactory)[];
//   /** Custom transformers to evaluate after built-in .js transformations. */
//   after?: (TransformerFactory<SourceFile> | CustomTransformerFactory)[];
//   /** Custom transformers to evaluate after built-in .d.ts transformations. */
//   afterDeclarations?: (TransformerFactory<Bundle | SourceFile> | CustomTransformerFactory)[];
// }
//
// /*@internal*/
// export interface EmitTransformers {
//   scriptTransformers: readonly TransformerFactory<SourceFile | Bundle>[];
//   declarationTransformers: readonly TransformerFactory<SourceFile | Bundle>[];
// }

export interface SourceMapSpan {
  /** Line number in the .js file. */
  emittedLine: number;
  /** Column number in the .js file. */
  emittedColumn: number;
  /** Line number in the .ts file. */
  sourceLine: number;
  /** Column number in the .ts file. */
  sourceColumn: number;
  /** Optional name (index into names array) associated with this span. */
  nameIndex?: number;
  /** .ts file (index into sources array) associated with this span */
  sourceIndex: number;
}

// /* @internal */
// export interface SourceMapEmitResult {
//   inputSourceFileNames: readonly string[];      // Input source file (which one can use on program to get the file), 1:1 mapping with the sourceMap.sources list
//   sourceMap: RawSourceMap;
// }

/** Return code used by getEmitOutput function to indicate status of the function */
export enum ExitStatus {
  // Compiler ran successfully.  Either this was a simple do-nothing compilation (for example,
  // when -version or -help was provided, or this was a normal compilation, no diagnostics
  // were produced, and all outputs were generated successfully.
  Success = 0,

  // Diagnostics were produced and because of them no code was generated.
  DiagnosticsPresent_OutputsSkipped = 1,

  // Diagnostics were produced and outputs were generated in spite of them.
  DiagnosticsPresent_OutputsGenerated = 2,

  // When build skipped because passed in project is invalid
  InvalidProject_OutputsSkipped = 3,

  // When build is skipped because project references form cycle
  ProjectReferenceCycle_OutputsSkipped = 4,

  /** @deprecated Use ProjectReferenceCycle_OutputsSkipped instead. */
  ProjectReferenceCycle_OutputsSkupped = 4,
}

// export interface EmitResult {
//   emitSkipped: boolean;
//   /** Contains declaration emit diagnostics */
//   diagnostics: readonly Diagnostic[];
//   emittedFiles?: string[]; // Array of files the compiler wrote to disk
//   /* @internal */
//   sourceMaps?: SourceMapEmitResult[];  // Array of sourceMapData if compiler emitted sourcemaps
//   /* @internal */
//   exportedModulesFromDeclarationEmit?: ExportedModulesFromDeclarationEmit;
// }
//
// /* @internal */
// export interface TypeCheckerHost extends ModuleSpecifierResolutionHost {
//   readonly redirectTargetsMap: RedirectTargetsMap;
//
//   getCompilerOptions(): CompilerOptions;
//
//   getSourceFiles(): readonly SourceFile[];
//
//   getSourceFile(fileName: string): SourceFile | undefined;
//
//   getResolvedTypeReferenceDirectives(): ReadonlyESMap<string, ResolvedTypeReferenceDirective | undefined>;
//
//   getProjectReferenceRedirect(fileName: string): string | undefined;
//
//   isSourceOfProjectReferenceRedirect(fileName: string): boolean;
// }

// export interface TypeChecker {
//   getTypeOfSymbolAtLocation(symbol: Symbol, node: Node): Type;
//
//   getDeclaredTypeOfSymbol(symbol: Symbol): Type;
//
//   getPropertiesOfType(type: Type): Symbol[];
//
//   getPropertyOfType(type: Type, propertyName: string): Symbol | undefined;
//
//   getPrivateIdentifierPropertyOfType(leftType: Type, name: string, location: Node): Symbol | undefined;
//
//   /* @internal */
//   getTypeOfPropertyOfType(type: Type, propertyName: string): Type | undefined;
//
//   getIndexInfoOfType(type: Type, kind: IndexKind): IndexInfo | undefined;
//
//   getSignaturesOfType(type: Type, kind: SignatureKind): readonly Signature[];
//
//   getIndexTypeOfType(type: Type, kind: IndexKind): Type | undefined;
//
//   getBaseTypes(type: InterfaceType): BaseType[];
//
//   getBaseTypeOfLiteralType(type: Type): Type;
//
//   getWidenedType(type: Type): Type;
//
//   /* @internal */
//   getPromisedTypeOfPromise(promise: Type, errorNode?: Node): Type | undefined;
//
//   /* @internal */
//   getAwaitedType(type: Type): Type | undefined;
//
//   getReturnTypeOfSignature(signature: Signature): Type;
//
//   /**
//    * Gets the type of a parameter at a given position in a signature.
//    * Returns `any` if the index is not valid.
//    */
//
//   /* @internal */
//   getParameterType(signature: Signature, parameterIndex: number): Type;
//
//   getNullableType(type: Type, flags: TypeFlags): Type;
//
//   getNonNullableType(type: Type): Type;
//
//   /* @internal */
//   getNonOptionalType(type: Type): Type;
//
//   /* @internal */
//   isNullableType(type: Type): boolean;
//
//   getTypeArguments(type: TypeReference): readonly Type[];
//
//   // TODO: GH#18217 `xToDeclaration` calls are frequently asserted as defined.
//   /** Note that the resulting nodes cannot be checked. */
//   typeToTypeNode(type: Type,
//                  enclosingDeclaration: Node | undefined,
//                  flags: NodeBuilderFlags | undefined): TypeNode | undefined;
//
//   /* @internal */
//   typeToTypeNode(type: Type,
//                  enclosingDeclaration: Node | undefined,
//                  flags: NodeBuilderFlags | undefined,
//                  tracker?: SymbolTracker): TypeNode | undefined; // eslint-disable-line @typescript-eslint/unified-signatures
//   /** Note that the resulting nodes cannot be checked. */
//   signatureToSignatureDeclaration(signature: Signature,
//                                   kind: SyntaxKind,
//                                   enclosingDeclaration: Node | undefined,
//                                   flags: NodeBuilderFlags | undefined): SignatureDeclaration & { typeArguments?: NodeArray<TypeNode> } | undefined;
//
//   /* @internal */
//   signatureToSignatureDeclaration(signature: Signature,
//                                   kind: SyntaxKind,
//                                   enclosingDeclaration: Node | undefined,
//                                   flags: NodeBuilderFlags | undefined,
//                                   tracker?: SymbolTracker): SignatureDeclaration & { typeArguments?: NodeArray<TypeNode> } | undefined; // eslint-disable-line @typescript-eslint/unified-signatures
//   /** Note that the resulting nodes cannot be checked. */
//   indexInfoToIndexSignatureDeclaration(indexInfo: IndexInfo,
//                                        kind: IndexKind,
//                                        enclosingDeclaration: Node | undefined,
//                                        flags: NodeBuilderFlags | undefined): IndexSignatureDeclaration | undefined;
//
//   /* @internal */
//   indexInfoToIndexSignatureDeclaration(indexInfo: IndexInfo,
//                                        kind: IndexKind,
//                                        enclosingDeclaration: Node | undefined,
//                                        flags: NodeBuilderFlags | undefined,
//                                        tracker?: SymbolTracker): IndexSignatureDeclaration | undefined; // eslint-disable-line @typescript-eslint/unified-signatures
//   /** Note that the resulting nodes cannot be checked. */
//   symbolToEntityName(symbol: Symbol,
//                      meaning: SymbolFlags,
//                      enclosingDeclaration: Node | undefined,
//                      flags: NodeBuilderFlags | undefined): EntityName | undefined;
//
//   /** Note that the resulting nodes cannot be checked. */
//   symbolToExpression(symbol: Symbol,
//                      meaning: SymbolFlags,
//                      enclosingDeclaration: Node | undefined,
//                      flags: NodeBuilderFlags | undefined): Expression | undefined;
//
//   /** Note that the resulting nodes cannot be checked. */
//   symbolToTypeParameterDeclarations(symbol: Symbol,
//                                     enclosingDeclaration: Node | undefined,
//                                     flags: NodeBuilderFlags | undefined): NodeArray<TypeParameterDeclaration> | undefined;
//
//   /** Note that the resulting nodes cannot be checked. */
//   symbolToParameterDeclaration(symbol: Symbol,
//                                enclosingDeclaration: Node | undefined,
//                                flags: NodeBuilderFlags | undefined): ParameterDeclaration | undefined;
//
//   /** Note that the resulting nodes cannot be checked. */
//   typeParameterToDeclaration(parameter: TypeParameter,
//                              enclosingDeclaration: Node | undefined,
//                              flags: NodeBuilderFlags | undefined): TypeParameterDeclaration | undefined;
//
//   getSymbolsInScope(location: Node, meaning: SymbolFlags): Symbol[];
//
//   getSymbolAtLocation(node: Node): Symbol | undefined;
//
//   getSymbolsOfParameterPropertyDeclaration(parameter: ParameterDeclaration, parameterName: string): Symbol[];
//
//   /**
//    * The function returns the value (local variable) symbol of an identifier in the short-hand property assignment.
//    * This is necessary as an identifier in short-hand property assignment can contains two meaning: property name and property value.
//    */
//   getShorthandAssignmentValueSymbol(location: Node): Symbol | undefined;
//
//   getExportSpecifierLocalTargetSymbol(location: ExportSpecifier | Identifier): Symbol | undefined;
//
//   /**
//    * If a symbol is a local symbol with an associated exported symbol, returns the exported symbol.
//    * Otherwise returns its input.
//    * For example, at `export type T = number;`:
//    *     - `getSymbolAtLocation` at the location `T` will return the exported symbol for `T`.
//    *     - But the result of `getSymbolsInScope` will contain the *local* symbol for `T`, not the exported symbol.
//    *     - Calling `getExportSymbolOfSymbol` on that local symbol will return the exported symbol.
//    */
//   getExportSymbolOfSymbol(symbol: Symbol): Symbol;
//
//   getPropertySymbolOfDestructuringAssignment(location: Identifier): Symbol | undefined;
//
//   getTypeOfAssignmentPattern(pattern: AssignmentPattern): Type;
//
//   getTypeAtLocation(node: Node): Type;
//
//   getTypeFromTypeNode(node: TypeNode): Type;
//
//   signatureToString(signature: Signature,
//                     enclosingDeclaration?: Node,
//                     flags?: TypeFormatFlags,
//                     kind?: SignatureKind): string;
//
//   typeToString(type: Type, enclosingDeclaration?: Node, flags?: TypeFormatFlags): string;
//
//   symbolToString(symbol: Symbol, enclosingDeclaration?: Node, meaning?: SymbolFlags, flags?: SymbolFormatFlags): string;
//
//   typePredicateToString(predicate: TypePredicate, enclosingDeclaration?: Node, flags?: TypeFormatFlags): string;
//
//   /* @internal */
//   writeSignature(signature: Signature,
//                  enclosingDeclaration?: Node,
//                  flags?: TypeFormatFlags,
//                  kind?: SignatureKind,
//                  writer?: EmitTextWriter): string;
//
//   /* @internal */
//   writeType(type: Type, enclosingDeclaration?: Node, flags?: TypeFormatFlags, writer?: EmitTextWriter): string;
//
//   /* @internal */
//   writeSymbol(symbol: Symbol,
//               enclosingDeclaration?: Node,
//               meaning?: SymbolFlags,
//               flags?: SymbolFormatFlags,
//               writer?: EmitTextWriter): string;
//
//   /* @internal */
//   writeTypePredicate(predicate: TypePredicate,
//                      enclosingDeclaration?: Node,
//                      flags?: TypeFormatFlags,
//                      writer?: EmitTextWriter): string;
//
//   getFullyQualifiedName(symbol: Symbol): string;
//
//   getAugmentedPropertiesOfType(type: Type): Symbol[];
//
//   getRootSymbols(symbol: Symbol): readonly Symbol[];
//
//   getSymbolOfExpando(node: Node, allowDeclaration: boolean): Symbol | undefined;
//
//   getContextualType(node: Expression): Type | undefined;
//
//   /* @internal */
//   getContextualType(node: Expression, contextFlags?: ContextFlags): Type | undefined; // eslint-disable-line @typescript-eslint/unified-signatures
//   /* @internal */
//   getContextualTypeForObjectLiteralElement(element: ObjectLiteralElementLike): Type | undefined;
//
//   /* @internal */
//   getContextualTypeForArgumentAtIndex(call: CallLikeExpression, argIndex: number): Type | undefined;
//
//   /* @internal */
//   getContextualTypeForJsxAttribute(attribute: JsxAttribute | JsxSpreadAttribute): Type | undefined;
//
//   /* @internal */
//   isContextSensitive(node: Expression | MethodDeclaration | ObjectLiteralElementLike | JsxAttributeLike): boolean;
//
//   /**
//    * returns unknownSignature in the case of an error.
//    * returns undefined if the node is not valid.
//    * @param argumentCount Apparent number of arguments, passed in case of a possibly incomplete call. This should come from an ArgumentListInfo. See `signatureHelp.ts`.
//    */
//   getResolvedSignature(node: CallLikeExpression,
//                        candidatesOutArray?: Signature[],
//                        argumentCount?: number): Signature | undefined;
//
//   /* @internal */
//   getResolvedSignatureForSignatureHelp(node: CallLikeExpression,
//                                        candidatesOutArray?: Signature[],
//                                        argumentCount?: number): Signature | undefined;
//
//   /* @internal */
//   getExpandedParameters(sig: Signature): readonly (readonly Symbol[])[];
//
//   /* @internal */
//   hasEffectiveRestParameter(sig: Signature): boolean;
//
//   getSignatureFromDeclaration(declaration: SignatureDeclaration): Signature | undefined;
//
//   isImplementationOfOverload(node: SignatureDeclaration): boolean | undefined;
//
//   isUndefinedSymbol(symbol: Symbol): boolean;
//
//   isArgumentsSymbol(symbol: Symbol): boolean;
//
//   isUnknownSymbol(symbol: Symbol): boolean;
//
//   /* @internal */
//   getMergedSymbol(symbol: Symbol): Symbol;
//
//   getConstantValue(node: EnumMember | PropertyAccessExpression | ElementAccessExpression): string | number | undefined;
//
//   isValidPropertyAccess(node: PropertyAccessExpression | QualifiedName | ImportTypeNode, propertyName: string): boolean;
//
//   /** Exclude accesses to private properties or methods with a `this` parameter that `type` doesn't satisfy. */
//
//   /* @internal */
//   isValidPropertyAccessForCompletions(node: PropertyAccessExpression | ImportTypeNode | QualifiedName,
//                                       type: Type,
//                                       property: Symbol): boolean;
//
//   /** Follow all aliases to get the original symbol. */
//   getAliasedSymbol(symbol: Symbol): Symbol;
//
//   /** Follow a *single* alias to get the immediately aliased symbol. */
//
//   /* @internal */
//   getImmediateAliasedSymbol(symbol: Symbol): Symbol | undefined;
//
//   getExportsOfModule(moduleSymbol: Symbol): Symbol[];
//
//   /** Unlike `getExportsOfModule`, this includes properties of an `export =` value. */
//
//   /* @internal */
//   getExportsAndPropertiesOfModule(moduleSymbol: Symbol): Symbol[];
//
//   getJsxIntrinsicTagNamesAt(location: Node): Symbol[];
//
//   isOptionalParameter(node: ParameterDeclaration): boolean;
//
//   getAmbientModules(): Symbol[];
//
//   tryGetMemberInModuleExports(memberName: string, moduleSymbol: Symbol): Symbol | undefined;
//
//   /**
//    * Unlike `tryGetMemberInModuleExports`, this includes properties of an `export =` value.
//    * Does *not* return properties of primitive types.
//    */
//
//   /* @internal */
//   tryGetMemberInModuleExportsAndProperties(memberName: string, moduleSymbol: Symbol): Symbol | undefined;
//
//   getApparentType(type: Type): Type;
//
//   /* @internal */
//   getSuggestedSymbolForNonexistentProperty(name: Identifier | PrivateIdentifier | string,
//                                            containingType: Type): Symbol | undefined;
//
//   /* @internal */
//   getSuggestedSymbolForNonexistentJSXAttribute(name: Identifier | string, containingType: Type): Symbol | undefined;
//
//   /* @internal */
//   getSuggestionForNonexistentProperty(name: Identifier | PrivateIdentifier | string,
//                                       containingType: Type): string | undefined;
//
//   /* @internal */
//   getSuggestedSymbolForNonexistentSymbol(location: Node, name: string, meaning: SymbolFlags): Symbol | undefined;
//
//   /* @internal */
//   getSuggestionForNonexistentSymbol(location: Node, name: string, meaning: SymbolFlags): string | undefined;
//
//   /* @internal */
//   getSuggestedSymbolForNonexistentModule(node: Identifier, target: Symbol): Symbol | undefined;
//
//   /* @internal */
//   getSuggestionForNonexistentExport(node: Identifier, target: Symbol): string | undefined;
//
//   getBaseConstraintOfType(type: Type): Type | undefined;
//
//   getDefaultFromTypeParameter(type: Type): Type | undefined;
//
//   /* @internal */
//   getAnyType(): Type;
//
//   /* @internal */
//   getStringType(): Type;
//
//   /* @internal */
//   getNumberType(): Type;
//
//   /* @internal */
//   getBooleanType(): Type;
//
//   /* @internal */
//   getFalseType(fresh?: boolean): Type;
//
//   /* @internal */
//   getTrueType(fresh?: boolean): Type;
//
//   /* @internal */
//   getVoidType(): Type;
//
//   /* @internal */
//   getUndefinedType(): Type;
//
//   /* @internal */
//   getNullType(): Type;
//
//   /* @internal */
//   getESSymbolType(): Type;
//
//   /* @internal */
//   getNeverType(): Type;
//
//   /* @internal */
//   getOptionalType(): Type;
//
//   /* @internal */
//   getUnionType(types: Type[], subtypeReduction?: UnionReduction): Type;
//
//   /* @internal */
//   createArrayType(elementType: Type): Type;
//
//   /* @internal */
//   getElementTypeOfArrayType(arrayType: Type): Type | undefined;
//
//   /* @internal */
//   createPromiseType(type: Type): Type;
//
//   /* @internal */
//   isTypeAssignableTo(source: Type, target: Type): boolean;
//
//   /* @internal */
//   createAnonymousType(symbol: Symbol | undefined,
//                       members: SymbolTable,
//                       callSignatures: Signature[],
//                       constructSignatures: Signature[],
//                       stringIndexInfo: IndexInfo | undefined,
//                       numberIndexInfo: IndexInfo | undefined): Type;
//
//   /* @internal */
//   createSignature(
//     declaration: SignatureDeclaration,
//     typeParameters: readonly TypeParameter[] | undefined,
//     thisParameter: Symbol | undefined,
//     parameters: readonly Symbol[],
//     resolvedReturnType: Type,
//     typePredicate: TypePredicate | undefined,
//     minArgumentCount: number,
//     flags: SignatureFlags
//   ): Signature;
//
//   /* @internal */
//   createSymbol(flags: SymbolFlags, name: any): TransientSymbol;
//
//   /* @internal */
//   createIndexInfo(type: Type, isReadonly: boolean, declaration?: SignatureDeclaration): IndexInfo;
//
//   /* @internal */
//   isSymbolAccessible(symbol: Symbol,
//                      enclosingDeclaration: Node | undefined,
//                      meaning: SymbolFlags,
//                      shouldComputeAliasToMarkVisible: boolean): SymbolAccessibilityResult;
//
//   /* @internal */
//   tryFindAmbientModuleWithoutAugmentations(moduleName: string): Symbol | undefined;
//
//   /* @internal */
//   getSymbolWalker(accept?: (symbol: Symbol) => boolean): SymbolWalker;
//
//   // Should not be called directly.  Should only be accessed through the Program instance.
//   /* @internal */
//   getDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): Diagnostic[];
//
//   /* @internal */
//   getGlobalDiagnostics(): Diagnostic[];
//
//   /* @internal */
//   getEmitResolver(sourceFile?: SourceFile, cancellationToken?: CancellationToken): EmitResolver;
//
//   /* @internal */
//   getTypeCatalog(): readonly Type[];
//
//   /* @internal */
//   getNodeCount(): number;
//
//   /* @internal */
//   getIdentifierCount(): number;
//
//   /* @internal */
//   getSymbolCount(): number;
//
//   /* @internal */
//   getTypeCount(): number;
//
//   /* @internal */
//   getInstantiationCount(): number;
//
//   /* @internal */
//   getRelationCacheSizes(): { assignable: number, identity: number, subtype: number, strictSubtype: number };
//
//   /* @internal */
//   getRecursionIdentity(type: Type): object | undefined;
//
//   /* @internal */
//   isArrayType(type: Type): boolean;
//
//   /* @internal */
//   isTupleType(type: Type): boolean;
//
//   /* @internal */
//   isArrayLikeType(type: Type): boolean;
//
//   /**
//    * True if `contextualType` should not be considered for completions because
//    * e.g. it specifies `kind: "a"` and obj has `kind: "b"`.
//    */
//
//   /* @internal */
//   isTypeInvalidDueToUnionDiscriminant(contextualType: Type, obj: ObjectLiteralExpression | JsxAttributes): boolean;
//
//   /**
//    * For a union, will include a property if it's defined in *any* of the member types.
//    * So for `{ a } | { b }`, this will include both `a` and `b`.
//    * Does not include properties of primitive types.
//    */
//
//   /* @internal */
//   getAllPossiblePropertiesOfTypes(type: readonly Type[]): Symbol[];
//
//   /* @internal */
//   resolveName(name: string,
//               location: Node | undefined,
//               meaning: SymbolFlags,
//               excludeGlobals: boolean): Symbol | undefined;
//
//   /* @internal */
//   getJsxNamespace(location?: Node): string;
//
//   /**
//    * Note that this will return undefined in the following case:
//    *     // a.ts
//    *     export namespace N { export class C { } }
//    *     // b.ts
//    *     <<enclosingDeclaration>>
//    * Where `C` is the symbol we're looking for.
//    * This should be called in a loop climbing parents of the symbol, so we'll get `N`.
//    */
//
//   /* @internal */
//   getAccessibleSymbolChain(symbol: Symbol,
//                            enclosingDeclaration: Node | undefined,
//                            meaning: SymbolFlags,
//                            useOnlyExternalAliasing: boolean): Symbol[] | undefined;
//
//   /* @internal */
//   getTypePredicateOfSignature(signature: Signature): TypePredicate | undefined;
//
//   /* @internal */
//   resolveExternalModuleName(moduleSpecifier: Expression): Symbol | undefined;
//
//   /**
//    * An external module with an 'export =' declaration resolves to the target of the 'export =' declaration,
//    * and an external module with no 'export =' declaration resolves to the module itself.
//    */
//
//   /* @internal */
//   resolveExternalModuleSymbol(symbol: Symbol): Symbol;
//
//   /** @param node A location where we might consider accessing `this`. Not necessarily a ThisExpression. */
//
//   /* @internal */
//   tryGetThisTypeAt(node: Node, includeGlobalThis?: boolean): Type | undefined;
//
//   /* @internal */
//   getTypeArgumentConstraint(node: TypeNode): Type | undefined;
//
//   /**
//    * Does *not* get *all* suggestion diagnostics, just the ones that were convenient to report in the checker.
//    * Others are added in computeSuggestionDiagnostics.
//    */
//
//   /* @internal */
//   getSuggestionDiagnostics(file: SourceFile, cancellationToken?: CancellationToken): readonly DiagnosticWithLocation[];
//
//   /**
//    * Depending on the operation performed, it may be appropriate to throw away the checker
//    * if the cancellation token is triggered. Typically, if it is used for error checking
//    * and the operation is cancelled, then it should be discarded, otherwise it is safe to keep.
//    */
//   runWithCancellationToken<T>(token: CancellationToken, cb: (checker: TypeChecker) => T): T;
//
//   /* @internal */
//   getLocalTypeParametersOfClassOrInterfaceOrTypeAlias(symbol: Symbol): readonly TypeParameter[] | undefined;
//
//   /* @internal */
//   isDeclarationVisible(node: Declaration | AnyImportSyntax): boolean;
// }

/* @internal */
export const enum UnionReduction {
  None = 0,
  Literal,
  Subtype,
}

/* @internal */
export const enum ContextFlags {
  None = 0,
  Signature = 1 << 0, // Obtaining contextual signature
  NoConstraints = 1 << 1, // Don't obtain type variable constraints
  Completions = 1 << 2, // Ignore inference to current node and parent nodes out to the containing call for completions
  SkipBindingPatterns = 1 << 3, // Ignore contextual types applied by binding patterns
}

// NOTE: If modifying this enum, must modify `TypeFormatFlags` too!
export const enum NodeBuilderFlags {
  None = 0,
  // Options
  NoTruncation = 1 << 0,   // Don't truncate result
  WriteArrayAsGenericType = 1 << 1,   // Write Array<T> instead T[]
  GenerateNamesForShadowedTypeParams = 1 << 2,   // When a type parameter T is shadowing another T, generate a name for it so it can still be referenced
  UseStructuralFallback = 1 << 3,   // When an alias cannot be named by its symbol, rather than report an error, fallback to a structural printout if possible
  ForbidIndexedAccessSymbolReferences = 1 << 4,   // Forbid references like `I["a"]["b"]` - print `typeof I.a<x>.b<y>` instead
  WriteTypeArgumentsOfSignature = 1 << 5,   // Write the type arguments instead of type parameters of the signature
  UseFullyQualifiedType = 1 << 6,   // Write out the fully qualified type name (eg. Module.Type, instead of Type)
  UseOnlyExternalAliasing = 1 << 7,   // Only use external aliases for a symbol
  SuppressAnyReturnType = 1 << 8,   // If the return type is any-like and can be elided, don't offer a return type.
  WriteTypeParametersInQualifiedName = 1 << 9,
  MultilineObjectLiterals = 1 << 10,  // Always write object literals across multiple lines
  WriteClassExpressionAsTypeLiteral = 1 << 11,  // Write class {} as { new(): {} } - used for mixin declaration emit
  UseTypeOfFunction = 1 << 12,  // Build using typeof instead of function type literal
  OmitParameterModifiers = 1 << 13,  // Omit modifiers on parameters
  UseAliasDefinedOutsideCurrentScope = 1 << 14,  // Allow non-visible aliases
  UseSingleQuotesForStringLiteralType = 1 << 28,  // Use single quotes for string literal type
  NoTypeReduction = 1 << 29,  // Don't call getReducedType
  NoUndefinedOptionalParameterType = 1 << 30,  // Do not add undefined to optional parameter type

  // Error handling
  AllowThisInObjectLiteral = 1 << 15,
  AllowQualifedNameInPlaceOfIdentifier = 1 << 16,
  AllowAnonymousIdentifier = 1 << 17,
  AllowEmptyUnionOrIntersection = 1 << 18,
  AllowEmptyTuple = 1 << 19,
  AllowUniqueESSymbolType = 1 << 20,
  AllowEmptyIndexInfoType = 1 << 21,

  // Errors (cont.)
  AllowNodeModulesRelativePaths = 1 << 26,
  /* @internal */ DoNotIncludeSymbolChain = 1 << 27,    // Skip looking up and printing an accessible symbol chain

  IgnoreErrors = AllowThisInObjectLiteral |
    AllowQualifedNameInPlaceOfIdentifier |
    AllowAnonymousIdentifier |
    AllowEmptyUnionOrIntersection |
    AllowEmptyTuple |
    AllowEmptyIndexInfoType |
    AllowNodeModulesRelativePaths,

  // State
  InObjectTypeLiteral = 1 << 22,
  InTypeAlias = 1 << 23,    // Writing type in type alias declaration
  InInitialEntityName = 1 << 24,    // Set when writing the LHS of an entity name or entity name expression
  InReverseMappedType = 1 << 25,
}

// Ensure the shared flags between this and `NodeBuilderFlags` stay in alignment
export const enum TypeFormatFlags {
  None = 0,
  NoTruncation = 1 << 0,  // Don't truncate typeToString result
  WriteArrayAsGenericType = 1 << 1,  // Write Array<T> instead T[]
  // hole because there's a hole in node builder flags
  UseStructuralFallback = 1 << 3,   // When an alias cannot be named by its symbol, rather than report an error, fallback to a structural printout if possible
  // hole because there's a hole in node builder flags
  WriteTypeArgumentsOfSignature = 1 << 5,  // Write the type arguments instead of type parameters of the signature
  UseFullyQualifiedType = 1 << 6,  // Write out the fully qualified type name (eg. Module.Type, instead of Type)
  // hole because `UseOnlyExternalAliasing` is here in node builder flags, but functions which take old flags use `SymbolFormatFlags` instead
  SuppressAnyReturnType = 1 << 8,  // If the return type is any-like, don't offer a return type.
  // hole because `WriteTypeParametersInQualifiedName` is here in node builder flags, but functions which take old flags use `SymbolFormatFlags` for this instead
  MultilineObjectLiterals = 1 << 10, // Always print object literals across multiple lines (only used to map into node builder flags)
  WriteClassExpressionAsTypeLiteral = 1 << 11, // Write a type literal instead of (Anonymous class)
  UseTypeOfFunction = 1 << 12, // Write typeof instead of function type literal
  OmitParameterModifiers = 1 << 13, // Omit modifiers on parameters

  UseAliasDefinedOutsideCurrentScope = 1 << 14, // For a `type T = ... ` defined in a different file, write `T` instead of its value, even though `T` can't be accessed in the current scope.
  UseSingleQuotesForStringLiteralType = 1 << 28, // Use single quotes for string literal type
  NoTypeReduction = 1 << 29, // Don't call getReducedType

  // Error Handling
  AllowUniqueESSymbolType = 1 << 20, // This is bit 20 to align with the same bit in `NodeBuilderFlags`

  // TypeFormatFlags exclusive
  AddUndefined = 1 << 17, // Add undefined to types of initialized, non-optional parameters
  WriteArrowStyleSignature = 1 << 18, // Write arrow style signature

  // State
  InArrayType = 1 << 19, // Writing an array element type
  InElementType = 1 << 21, // Writing an array or union element type
  InFirstTypeArgument = 1 << 22, // Writing first type argument of the instantiated type
  InTypeAlias = 1 << 23, // Writing type in type alias declaration

  /** @deprecated */ WriteOwnNameForAnyLike = 0,  // Does nothing

  NodeBuilderFlagsMask = NoTruncation |
    WriteArrayAsGenericType |
    UseStructuralFallback |
    WriteTypeArgumentsOfSignature |
    UseFullyQualifiedType |
    SuppressAnyReturnType |
    MultilineObjectLiterals |
    WriteClassExpressionAsTypeLiteral |
    UseTypeOfFunction |
    OmitParameterModifiers |
    UseAliasDefinedOutsideCurrentScope |
    AllowUniqueESSymbolType |
    InTypeAlias |
    UseSingleQuotesForStringLiteralType |
    NoTypeReduction,
}

export const enum SymbolFormatFlags {
  None = 0x00000000,

  // Write symbols's type argument if it is instantiated symbol
  // eg. class C<T> { p: T }   <-- Show p as C<T>.p here
  //     var a: C<number>;
  //     var p = a.p; <--- Here p is property of C<number> so show it as C<number>.p instead of just C.p
  WriteTypeParametersOrArguments = 0x00000001,

  // Use only external alias information to get the symbol name in the given context
  // eg.  module m { export class c { } } import x = m.c;
  // When this flag is specified m.c will be used to refer to the class instead of alias symbol x
  UseOnlyExternalAliasing = 0x00000002,

  // Build symbol name using any nodes needed, instead of just components of an entity name
  AllowAnyNodeKind = 0x00000004,

  // Prefer aliases which are not directly visible
  UseAliasDefinedOutsideCurrentScope = 0x00000008,

  // Skip building an accessible symbol chain
  /* @internal */ DoNotIncludeSymbolChain = 0x00000010,
}

/* @internal */
export interface SymbolWalker {
  /** Note: Return values are not ordered. */
  walkType(root: Type): { visitedTypes: readonly Type[], visitedSymbols: readonly Symbol[] };

  /** Note: Return values are not ordered. */
  walkSymbol(root: Symbol): { visitedTypes: readonly Type[], visitedSymbols: readonly Symbol[] };
}

/* @internal */
export const enum SymbolAccessibility {
  Accessible,
  NotAccessible,
  CannotBeNamed
}

/* @internal */
export const enum SyntheticSymbolKind {
  UnionOrIntersection,
  Spread
}

export const enum TypePredicateKind {
  This,
  Identifier,
  AssertsThis,
  AssertsIdentifier
}

export interface TypePredicateBase {
  kind: TypePredicateKind;
  type: Type | undefined;
}

export interface ThisTypePredicate extends TypePredicateBase {
  kind: TypePredicateKind.This;
  parameterName: undefined;
  parameterIndex: undefined;
  type: Type;
}

export interface IdentifierTypePredicate extends TypePredicateBase {
  kind: TypePredicateKind.Identifier;
  parameterName: string;
  parameterIndex: number;
  type: Type;
}

export interface AssertsThisTypePredicate extends TypePredicateBase {
  kind: TypePredicateKind.AssertsThis;
  parameterName: undefined;
  parameterIndex: undefined;
  type: Type | undefined;
}

export interface AssertsIdentifierTypePredicate extends TypePredicateBase {
  kind: TypePredicateKind.AssertsIdentifier;
  parameterName: string;
  parameterIndex: number;
  type: Type | undefined;
}

export type TypePredicate =
  ThisTypePredicate
  | IdentifierTypePredicate
  | AssertsThisTypePredicate
  | AssertsIdentifierTypePredicate;

/* @internal */
export type AnyImportSyntax = ImportDeclaration | ImportEqualsDeclaration;

/* @internal */
export type AnyImportOrRequire = AnyImportSyntax | RequireVariableDeclaration;

/* @internal */
export type AnyImportOrRequireStatement = AnyImportSyntax | RequireVariableStatement;


/* @internal */
export type AnyImportOrReExport = AnyImportSyntax | ExportDeclaration;

/* @internal */
export interface ValidImportTypeNode extends ImportTypeNode {
  argument: LiteralTypeNode & { literal: StringLiteral };
}

/* @internal */
export type AnyValidImportOrReExport =
  | (ImportDeclaration | ExportDeclaration) & { moduleSpecifier: StringLiteral }
  | ImportEqualsDeclaration & { moduleReference: ExternalModuleReference & { expression: StringLiteral } }
  | RequireOrImportCall
  | ValidImportTypeNode;

/* @internal */
export type RequireOrImportCall = CallExpression & { expression: Identifier, arguments: [StringLiteralLike] };

/* @internal */
export interface RequireVariableDeclaration extends VariableDeclaration {
  readonly initializer: RequireOrImportCall;
}

/* @internal */
export interface RequireVariableStatement extends VariableStatement {
  readonly declarationList: RequireVariableDeclarationList;
}

/* @internal */
export interface RequireVariableDeclarationList extends VariableDeclarationList {
  readonly declarations: NodeArray<RequireVariableDeclaration>;
}

/* @internal */
export type LateVisibilityPaintedStatement =
  | AnyImportSyntax
  | VariableStatement
  | ClassDeclaration
  | FunctionDeclaration
  | ModuleDeclaration
  | TypeAliasDeclaration
  | InterfaceDeclaration
  | EnumDeclaration;

/* @internal */
export interface SymbolVisibilityResult {
  accessibility: SymbolAccessibility;
  aliasesToMakeVisible?: LateVisibilityPaintedStatement[]; // aliases that need to have this symbol visible
  errorSymbolName?: string; // Optional symbol name that results in error
  errorNode?: Node; // optional node that results in error
}

/* @internal */
export interface SymbolAccessibilityResult extends SymbolVisibilityResult {
  errorModuleName?: string; // If the symbol is not visible from module, module's name
}

/* @internal */
export interface AllAccessorDeclarations {
  firstAccessor: AccessorDeclaration;
  secondAccessor: AccessorDeclaration | undefined;
  getAccessor: GetAccessorDeclaration | undefined;
  setAccessor: SetAccessorDeclaration | undefined;
}

/** Indicates how to serialize the name for a TypeReferenceNode when emitting decorator metadata */

/* @internal */
export enum TypeReferenceSerializationKind {
  // The TypeReferenceNode could not be resolved.
  // The type name should be emitted using a safe fallback.
  Unknown,

  // The TypeReferenceNode resolves to a type with a constructor
  // function that can be reached at runtime (e.g. a `class`
  // declaration or a `var` declaration for the static side
  // of a type, such as the global `Promise` type in lib.d.ts).
  TypeWithConstructSignatureAndValue,

  // The TypeReferenceNode resolves to a Void-like, Nullable, or Never type.
  VoidNullableOrNeverType,

  // The TypeReferenceNode resolves to a Number-like type.
  NumberLikeType,

  // The TypeReferenceNode resolves to a BigInt-like type.
  BigIntLikeType,

  // The TypeReferenceNode resolves to a String-like type.
  StringLikeType,

  // The TypeReferenceNode resolves to a Boolean-like type.
  BooleanType,

  // The TypeReferenceNode resolves to an Array-like type.
  ArrayLikeType,

  // The TypeReferenceNode resolves to the ESSymbol type.
  ESSymbolType,

  // The TypeReferenceNode resolved to the global Promise constructor symbol.
  Promise,

  // The TypeReferenceNode resolves to a Function type or a type with call signatures.
  TypeWithCallSignature,

  // The TypeReferenceNode resolves to any other type.
  ObjectType,
}

/* @internal */
export const enum EnumKind {
  Numeric,                            // Numeric enum (each member has a TypeFlags.Enum type)
  Literal                             // Literal enum (each member has a TypeFlags.EnumLiteral type)
}

/* @internal */
export const enum CheckFlags {
  Instantiated = 1 << 0,         // Instantiated symbol
  SyntheticProperty = 1 << 1,         // Property in union or intersection type
  SyntheticMethod = 1 << 2,         // Method in union or intersection type
  Readonly = 1 << 3,         // Readonly transient symbol
  ReadPartial = 1 << 4,         // Synthetic property present in some but not all constituents
  WritePartial = 1 << 5,         // Synthetic property present in some but only satisfied by an index signature in others
  HasNonUniformType = 1 << 6,         // Synthetic property with non-uniform type in constituents
  HasLiteralType = 1 << 7,         // Synthetic property with at least one literal type in constituents
  ContainsPublic = 1 << 8,         // Synthetic property with public constituent(s)
  ContainsProtected = 1 << 9,         // Synthetic property with protected constituent(s)
  ContainsPrivate = 1 << 10,        // Synthetic property with private constituent(s)
  ContainsStatic = 1 << 11,        // Synthetic property with static constituent(s)
  Late = 1 << 12,        // Late-bound symbol for a computed property with a dynamic name
  ReverseMapped = 1 << 13,        // Property of reverse-inferred homomorphic mapped type
  OptionalParameter = 1 << 14,        // Optional parameter
  RestParameter = 1 << 15,        // Rest parameter
  DeferredType = 1 << 16,        // Calculation of the type of this symbol is deferred due to processing costs, should be fetched with `getTypeOfSymbolWithDeferredType`
  HasNeverType = 1 << 17,        // Synthetic property with at least one never type in constituents
  Mapped = 1 << 18,        // Property of mapped type
  StripOptional = 1 << 19,        // Strip optionality in mapped property
  Synthetic = SyntheticProperty | SyntheticMethod,
  Discriminant = HasNonUniformType | HasLiteralType,
  Partial = ReadPartial | WritePartial
}

/* @internal */
export const enum NodeCheckFlags {
  TypeChecked = 0x00000001,  // Node has been type checked
  LexicalThis = 0x00000002,  // Lexical 'this' reference
  CaptureThis = 0x00000004,  // Lexical 'this' used in body
  CaptureNewTarget = 0x00000008,  // Lexical 'new.target' used in body
  SuperInstance = 0x00000100,  // Instance 'super' reference
  SuperStatic = 0x00000200,  // Static 'super' reference
  ContextChecked = 0x00000400,  // Contextual types have been assigned
  AsyncMethodWithSuper = 0x00000800,  // An async method that reads a value from a member of 'super'.
  AsyncMethodWithSuperBinding = 0x00001000,  // An async method that assigns a value to a member of 'super'.
  CaptureArguments = 0x00002000,  // Lexical 'arguments' used in body
  EnumValuesComputed = 0x00004000,  // Values for enum members have been computed, and any errors have been reported for them.
  LexicalModuleMergesWithClass = 0x00008000,  // Instantiated lexical module declaration is merged with a previous class declaration.
  LoopWithCapturedBlockScopedBinding = 0x00010000,  // Loop that contains block scoped variable captured in closure
  ContainsCapturedBlockScopeBinding = 0x00020000,  // Part of a loop that contains block scoped variable captured in closure
  CapturedBlockScopedBinding = 0x00040000,  // Block-scoped binding that is captured in some function
  BlockScopedBindingInLoop = 0x00080000,  // Block-scoped binding with declaration nested inside iteration statement
  ClassWithBodyScopedClassBinding = 0x00100000,  // Decorated class that contains a binding to itself inside of the class body.
  BodyScopedClassBinding = 0x00200000,  // Binding to a decorated class inside of the class's body.
  NeedsLoopOutParameter = 0x00400000,  // Block scoped binding whose value should be explicitly copied outside of the converted loop
  AssignmentsMarked = 0x00800000,  // Parameter assignments have been marked
  ClassWithConstructorReference = 0x01000000,  // Class that contains a binding to its constructor inside of the class body.
  ConstructorReferenceInClass = 0x02000000,  // Binding to a class constructor inside of the class's body.
  ContainsClassWithPrivateIdentifiers = 0x04000000,  // Marked on all block-scoped containers containing a class with private identifiers.
}

export const enum TypeFlags {
  Any = 1 << 0,
  Unknown = 1 << 1,
  String = 1 << 2,
  Number = 1 << 3,
  Boolean = 1 << 4,
  Enum = 1 << 5,
  BigInt = 1 << 6,
  StringLiteral = 1 << 7,
  NumberLiteral = 1 << 8,
  BooleanLiteral = 1 << 9,
  EnumLiteral = 1 << 10,  // Always combined with StringLiteral, NumberLiteral, or Union
  BigIntLiteral = 1 << 11,
  ESSymbol = 1 << 12,  // Type of symbol primitive introduced in ES6
  UniqueESSymbol = 1 << 13,  // unique symbol
  Void = 1 << 14,
  Undefined = 1 << 15,
  Null = 1 << 16,
  Never = 1 << 17,  // Never type
  TypeParameter = 1 << 18,  // Type parameter
  Object = 1 << 19,  // Object type
  Union = 1 << 20,  // Union (T | U)
  Intersection = 1 << 21,  // Intersection (T & U)
  Index = 1 << 22,  // keyof T
  IndexedAccess = 1 << 23,  // T[K]
  Conditional = 1 << 24,  // T extends U ? X : Y
  Substitution = 1 << 25,  // Type parameter substitution
  NonPrimitive = 1 << 26,  // intrinsic object type
  TemplateLiteral = 1 << 27,  // Template literal type
  StringMapping = 1 << 28,  // Uppercase/Lowercase type

  /* @internal */
  AnyOrUnknown = Any | Unknown,
  /* @internal */
  Nullable = Undefined | Null,
  Literal = StringLiteral | NumberLiteral | BigIntLiteral | BooleanLiteral,
  Unit = Literal | UniqueESSymbol | Nullable,
  StringOrNumberLiteral = StringLiteral | NumberLiteral,
  /* @internal */
  StringOrNumberLiteralOrUnique = StringLiteral | NumberLiteral | UniqueESSymbol,
  /* @internal */
  DefinitelyFalsy = StringLiteral | NumberLiteral | BigIntLiteral | BooleanLiteral | Void | Undefined | Null,
  PossiblyFalsy = DefinitelyFalsy | String | Number | BigInt | Boolean,
  /* @internal */
  Intrinsic = Any |
    Unknown |
    String |
    Number |
    BigInt |
    Boolean |
    BooleanLiteral |
    ESSymbol |
    Void |
    Undefined |
    Null |
    Never |
    NonPrimitive,
  /* @internal */
  Primitive = String |
    Number |
    BigInt |
    Boolean |
    Enum |
    EnumLiteral |
    ESSymbol |
    Void |
    Undefined |
    Null |
    Literal |
    UniqueESSymbol,
  StringLike = String | StringLiteral | TemplateLiteral | StringMapping,
  NumberLike = Number | NumberLiteral | Enum,
  BigIntLike = BigInt | BigIntLiteral,
  BooleanLike = Boolean | BooleanLiteral,
  EnumLike = Enum | EnumLiteral,
  ESSymbolLike = ESSymbol | UniqueESSymbol,
  VoidLike = Void | Undefined,
  /* @internal */
  DisjointDomains = NonPrimitive | StringLike | NumberLike | BigIntLike | BooleanLike | ESSymbolLike | VoidLike | Null,
  UnionOrIntersection = Union | Intersection,
  StructuredType = Object | Union | Intersection,
  TypeVariable = TypeParameter | IndexedAccess,
  InstantiableNonPrimitive = TypeVariable | Conditional | Substitution,
  InstantiablePrimitive = Index | TemplateLiteral | StringMapping,
  Instantiable = InstantiableNonPrimitive | InstantiablePrimitive,
  StructuredOrInstantiable = StructuredType | Instantiable,
  /* @internal */
  ObjectFlagsType = Any | Nullable | Never | Object | Union | Intersection,
  /* @internal */
  Simplifiable = IndexedAccess | Conditional,
  /* @internal */
  Substructure = Object |
    Union |
    Intersection |
    Index |
    IndexedAccess |
    Conditional |
    Substitution |
    TemplateLiteral |
    StringMapping,
  // 'Narrowable' types are types where narrowing actually narrows.
  // This *should* be every type other than null, undefined, void, and never
  Narrowable = Any |
    Unknown |
    StructuredOrInstantiable |
    StringLike |
    NumberLike |
    BigIntLike |
    BooleanLike |
    ESSymbol |
    UniqueESSymbol |
    NonPrimitive,
  /* @internal */
  NotPrimitiveUnion = Any | Unknown | Enum | Void | Never | StructuredOrInstantiable,
  // The following flags are aggregated during union and intersection type construction
  /* @internal */
  IncludesMask = Any | Unknown | Primitive | Never | Object | Union | Intersection | NonPrimitive | TemplateLiteral,
  // The following flags are used for different purposes during union and intersection type construction
  /* @internal */
  IncludesStructuredOrInstantiable = TypeParameter,
  /* @internal */
  IncludesNonWideningType = Index,
  /* @internal */
  IncludesWildcard = IndexedAccess,
  /* @internal */
  IncludesEmptyObject = Conditional,
}

export type DestructuringPattern = BindingPattern | ObjectLiteralExpression | ArrayLiteralExpression;

/* @internal */
export type TypeId = number;

// Properties common to all types
export interface Type {
  flags: TypeFlags;                // Flags
  /* @internal */
  id: TypeId;      // Unique ID
  /* @internal */
  checker: any;
  symbol: Symbol;                  // Symbol associated with type (if any)
  pattern?: DestructuringPattern;  // Destructuring pattern represented by type (if any)
  aliasSymbol?: Symbol;            // Alias associated with type
  aliasTypeArguments?: readonly Type[]; // Alias type arguments (if any)
  /* @internal */
  aliasTypeArgumentsContainsMarker?: boolean; // Alias type arguments (if any)
  /* @internal */
  permissiveInstantiation?: Type;  // Instantiation with type parameters mapped to wildcard type
  /* @internal */
  restrictiveInstantiation?: Type; // Instantiation with type parameters mapped to unconstrained form
  /* @internal */
  immediateBaseConstraint?: Type;  // Immediate base constraint cache
  /* @internal */
  widened?: Type; // Cached widened form of the type
}

/* @internal */

// Intrinsic types (TypeFlags.Intrinsic)
export interface IntrinsicType extends Type {
  intrinsicName: string;        // Name of intrinsic type
  objectFlags: ObjectFlags;
}

/* @internal */
export interface NullableType extends IntrinsicType {
  objectFlags: ObjectFlags;
}

/* @internal */
export interface FreshableIntrinsicType extends IntrinsicType {
  freshType: IntrinsicType;     // Fresh version of type
  regularType: IntrinsicType;   // Regular version of type
}

/* @internal */
export type FreshableType = LiteralType | FreshableIntrinsicType;

// String literal types (TypeFlags.StringLiteral)
// Numeric literal types (TypeFlags.NumberLiteral)
// BigInt literal types (TypeFlags.BigIntLiteral)
export interface LiteralType extends Type {
  value: string | number | PseudoBigInt; // Value of literal
  freshType: LiteralType;                // Fresh version of type
  regularType: LiteralType;              // Regular version of type
}

// Unique symbol types (TypeFlags.UniqueESSymbol)
export interface UniqueESSymbolType extends Type {
  symbol: Symbol;
  escapedName: any;
}

export interface StringLiteralType extends LiteralType {
  value: string;
}

export interface NumberLiteralType extends LiteralType {
  value: number;
}

export interface BigIntLiteralType extends LiteralType {
  value: PseudoBigInt;
}

// Enum types (TypeFlags.Enum)
export interface EnumType extends Type {
}

export const enum ObjectFlags {
  Class = 1 << 0,  // Class
  Interface = 1 << 1,  // Interface
  Reference = 1 << 2,  // Generic type reference
  Tuple = 1 << 3,  // Synthesized generic tuple type
  Anonymous = 1 << 4,  // Anonymous
  Mapped = 1 << 5,  // Mapped
  Instantiated = 1 << 6,  // Instantiated anonymous or mapped type
  ObjectLiteral = 1 << 7,  // Originates in an object literal
  EvolvingArray = 1 << 8,  // Evolving array type
  ObjectLiteralPatternWithComputedProperties = 1 << 9,  // Object literal pattern with computed properties
  ContainsSpread = 1 << 10, // Object literal contains spread operation
  ReverseMapped = 1 << 11, // Object contains a property from a reverse-mapped type
  JsxAttributes = 1 << 12, // Jsx attributes type
  MarkerType = 1 << 13, // Marker type used for variance probing
  JSLiteral = 1 << 14, // Object type declared in JS - disables errors on read/write of nonexisting members
  FreshLiteral = 1 << 15, // Fresh object literal
  ArrayLiteral = 1 << 16, // Originates in an array literal
  ObjectRestType = 1 << 17, // Originates in object rest declaration
  /* @internal */
  PrimitiveUnion = 1 << 18, // Union of only primitive types
  /* @internal */
  ContainsWideningType = 1 << 19, // Type is or contains undefined or null widening type
  /* @internal */
  ContainsObjectOrArrayLiteral = 1 << 20, // Type is or contains object literal type
  /* @internal */
  NonInferrableType = 1 << 21, // Type is or contains anyFunctionType or silentNeverType
  /* @internal */
  IsGenericObjectTypeComputed = 1 << 22, // IsGenericObjectType flag has been computed
  /* @internal */
  IsGenericObjectType = 1 << 23, // Union or intersection contains generic object type
  /* @internal */
  IsGenericIndexTypeComputed = 1 << 24, // IsGenericIndexType flag has been computed
  /* @internal */
  IsGenericIndexType = 1 << 25, // Union or intersection contains generic index type
  /* @internal */
  CouldContainTypeVariablesComputed = 1 << 26, // CouldContainTypeVariables flag has been computed
  /* @internal */
  CouldContainTypeVariables = 1 << 27, // Type could contain a type variable
  /* @internal */
  ContainsIntersections = 1 << 28, // Union contains intersections
  /* @internal */
  IsNeverIntersectionComputed = 1 << 28, // IsNeverLike flag has been computed
  /* @internal */
  IsNeverIntersection = 1 << 29, // Intersection reduces to never
  /* @internal */
  IsClassInstanceClone = 1 << 30, // Type is a clone of a class instance type
  ClassOrInterface = Class | Interface,
  /* @internal */
  RequiresWidening = ContainsWideningType | ContainsObjectOrArrayLiteral,
  /* @internal */
  PropagatingFlags = ContainsWideningType | ContainsObjectOrArrayLiteral | NonInferrableType,

  // Object flags that uniquely identify the kind of ObjectType
  /* @internal */
  ObjectTypeKindMask = ClassOrInterface | Reference | Tuple | Anonymous | Mapped | ReverseMapped | EvolvingArray,
}

export const enum CharacterCodes {
  nullCharacter = 0,
  maxAsciiCharacter = 0x7F,

  lineFeed = 0x0A,              // \n
  carriageReturn = 0x0D,        // \r
  lineSeparator = 0x2028,
  paragraphSeparator = 0x2029,
  nextLine = 0x0085,

  // Unicode 3.0 space characters
  space = 0x0020,   // " "
  nonBreakingSpace = 0x00A0,   //
  enQuad = 0x2000,
  emQuad = 0x2001,
  enSpace = 0x2002,
  emSpace = 0x2003,
  threePerEmSpace = 0x2004,
  fourPerEmSpace = 0x2005,
  sixPerEmSpace = 0x2006,
  figureSpace = 0x2007,
  punctuationSpace = 0x2008,
  thinSpace = 0x2009,
  hairSpace = 0x200A,
  zeroWidthSpace = 0x200B,
  narrowNoBreakSpace = 0x202F,
  ideographicSpace = 0x3000,
  mathematicalSpace = 0x205F,
  ogham = 0x1680,

  _ = 0x5F,
  $ = 0x24,

  _0 = 0x30,
  _1 = 0x31,
  _2 = 0x32,
  _3 = 0x33,
  _4 = 0x34,
  _5 = 0x35,
  _6 = 0x36,
  _7 = 0x37,
  _8 = 0x38,
  _9 = 0x39,

  a = 0x61,
  b = 0x62,
  c = 0x63,
  d = 0x64,
  e = 0x65,
  f = 0x66,
  g = 0x67,
  h = 0x68,
  i = 0x69,
  j = 0x6A,
  k = 0x6B,
  l = 0x6C,
  m = 0x6D,
  n = 0x6E,
  o = 0x6F,
  p = 0x70,
  q = 0x71,
  r = 0x72,
  s = 0x73,
  t = 0x74,
  u = 0x75,
  v = 0x76,
  w = 0x77,
  x = 0x78,
  y = 0x79,
  z = 0x7A,

  A = 0x41,
  B = 0x42,
  C = 0x43,
  D = 0x44,
  E = 0x45,
  F = 0x46,
  G = 0x47,
  H = 0x48,
  I = 0x49,
  J = 0x4A,
  K = 0x4B,
  L = 0x4C,
  M = 0x4D,
  N = 0x4E,
  O = 0x4F,
  P = 0x50,
  Q = 0x51,
  R = 0x52,
  S = 0x53,
  T = 0x54,
  U = 0x55,
  V = 0x56,
  W = 0x57,
  X = 0x58,
  Y = 0x59,
  Z = 0x5a,

  ampersand = 0x26,             // &
  asterisk = 0x2A,              // *
  at = 0x40,                    // @
  backslash = 0x5C,             // \
  backtick = 0x60,              // `
  bar = 0x7C,                   // |
  caret = 0x5E,                 // ^
  closeBrace = 0x7D,            // }
  closeBracket = 0x5D,          // ]
  closeParen = 0x29,            // )
  colon = 0x3A,                 // :
  comma = 0x2C,                 // ,
  dot = 0x2E,                   // .
  doubleQuote = 0x22,           // "
  equals = 0x3D,                // =
  exclamation = 0x21,           // !
  greaterThan = 0x3E,           // >
  hash = 0x23,                  // #
  lessThan = 0x3C,              // <
  minus = 0x2D,                 // -
  openBrace = 0x7B,             // {
  openBracket = 0x5B,           // [
  openParen = 0x28,             // (
  percent = 0x25,               // %
  plus = 0x2B,                  // +
  question = 0x3F,              // ?
  semicolon = 0x3B,             // ;
  singleQuote = 0x27,           // '
  slash = 0x2F,                 // /
  tilde = 0x7E,                 // ~

  backspace = 0x08,             // \b
  formFeed = 0x0C,              // \f
  byteOrderMark = 0xFEFF,
  tab = 0x09,                   // \t
  verticalTab = 0x0B,           // \v
}



/* @internal */
export const enum VarianceFlags {
  Invariant = 0,  // Neither covariant nor contravariant
  Covariant = 1 << 0,  // Covariant
  Contravariant = 1 << 1,  // Contravariant
  Bivariant = Covariant | Contravariant,  // Both covariant and contravariant
  Independent = 1 << 2,  // Unwitnessed type parameter
  VarianceMask = Invariant | Covariant | Contravariant | Independent, // Mask containing all measured variances without the unmeasurable flag
  Unmeasurable = 1 << 3,  // Variance result is unusable - relationship relies on structural comparisons which are not reflected in generic relationships
  Unreliable = 1 << 4,  // Variance result is unreliable - checking may produce false negatives, but not false positives
  AllowsStructuralFallback = Unmeasurable | Unreliable,
}

/** Represents a bigint literal value without requiring bigint support */
export interface PseudoBigInt {
  negative: boolean;
  base10Value: string;
}
