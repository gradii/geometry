import { Node } from './common.ast';
import {
  AssertsKeyword,
  BooleanLiteral,
  DotDotDotToken,
  EntityName,
  Identifier,
  KeywordSyntaxKind,
  KeywordToken,
  KeywordTypeSyntaxKind,
  LiteralExpression,
  MinusToken,
  NodeArray,
  NullLiteral,
  ParameterDeclaration,
  PlusToken,
  PrefixUnaryExpression,
  QuestionToken,
  ReadonlyKeyword,
  TemplateHead,
  TemplateLiteralTypeSpan,
  TypeElement,
  TypeNode,
  TypeParameterDeclaration
} from '../types';
import { update } from '../utilities';

export class KeywordTypeNode<TKind extends KeywordTypeSyntaxKind> extends Node {
  constructor(public kind: TKind) {
    super();
  }
}

export class TypePredicateNode extends Node {
  constructor(public assertsModifier: AssertsKeyword | undefined,
              public parameterName: Identifier | ThisTypeNode | string,
              public type: TypeNode | undefined) {
    super();
  }

  updateTypePredicateNode(assertsModifier: AssertsKeyword | undefined,
                          parameterName: Identifier | ThisTypeNode,
                          type: TypeNode | undefined) {
    return this.assertsModifier !== assertsModifier ||
           this.parameterName !== parameterName ||
           this.type !== type ? update(
      new TypePredicateNode(assertsModifier, parameterName, type),
      this) : this;
  }
}

export class TypeReferenceNode extends Node {
  constructor(public typeName: string | EntityName, public typeArguments: readonly TypeNode[] | undefined) {
    super();
  }

  updateTypeReferenceNode(typeName: EntityName, typeArguments: NodeArray<TypeNode> | undefined) {
    return this.typeName !== typeName ||
           this.typeArguments !== typeArguments ? update(new TypeReferenceNode(typeName,
      typeArguments), this) : this;
  }
}

export class FunctionTypeNode extends Node {
  constructor(public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public parameters: readonly ParameterDeclaration[],
              public type: TypeNode | undefined) {
    super();
  }

  updateFunctionTypeNode(typeParameters: NodeArray<TypeParameterDeclaration> | undefined,
                         parameters: NodeArray<ParameterDeclaration>,
                         type: TypeNode | undefined) {
    return this.typeParameters !== typeParameters ||
           this.parameters !== parameters ||
           this.type !== type ? update(new FunctionTypeNode(
      typeParameters,
      parameters,
      type), this) : this;
  }
}

export class ConstructorTypeNode extends Node {
  constructor(public typeParameters: readonly TypeParameterDeclaration[] | undefined,
              public parameters: readonly ParameterDeclaration[],
              public type: TypeNode | undefined) {
    super();
  }

  updateConstructorTypeNode(typeParameters: NodeArray<TypeParameterDeclaration> | undefined,
                            parameters: NodeArray<ParameterDeclaration>,
                            type: TypeNode | undefined) {
    return this.typeParameters !== typeParameters ||
           this.parameters !== parameters ||
           this.type !== type ? update(new ConstructorTypeNode(
      typeParameters,
      parameters,
      type), this) : this;
  }
}

export class TypeQueryNode extends Node {
  constructor(public exprName: EntityName) {
    super();
  }

  updateTypeQueryNode(exprName: EntityName) {
    return this.exprName !== exprName ? update(new TypeQueryNode(exprName), this) : this;
  }
}

export class TypeLiteralNode extends Node {
  constructor(public members: readonly TypeElement[] | undefined) {
    super();
  }

  updateTypeLiteralNode(members: NodeArray<TypeElement>) {
    return this.members !== members ? update(new TypeLiteralNode(members), this) : this;
  }
}

export class ArrayTypeNode extends Node {
  constructor(public elementType: TypeNode) {
    super();
  }

  updateArrayTypeNode(elementType: TypeNode): ArrayTypeNode {
    return this.elementType !== elementType ? update(new ArrayTypeNode(elementType), this) : this;
  }
}

export class TupleTypeNode extends Node {
  constructor(public elements: readonly (TypeNode | NamedTupleMember)[]) {
    super();
  }

  updateTupleTypeNode(elements: readonly (TypeNode | NamedTupleMember)[]) {
    return this.elements !== elements ? update(new TupleTypeNode(elements), this) : this;
  }
}

export class NamedTupleMember extends Node {
  constructor(public dotDotDotToken: DotDotDotToken | undefined,
              public name: Identifier,
              public questionToken: QuestionToken | undefined,
              public type: TypeNode) {
    super();
  }

  updateNamedTupleMember(dotDotDotToken: DotDotDotToken | undefined,
                         name: Identifier,
                         questionToken: QuestionToken | undefined,
                         type: TypeNode) {
    return this.dotDotDotToken !== dotDotDotToken ||
           this.name !== name ||
           this.questionToken !== questionToken ||
           this.type !== type ? update(
      new NamedTupleMember(dotDotDotToken, name, questionToken, type),
      this) : this;
  }
}

export class OptionalTypeNode extends Node {
  constructor(public type: TypeNode) {
    super();
  }

  updateOptionalTypeNode(type: TypeNode): OptionalTypeNode {
    return this.type !== type ? update(new OptionalTypeNode(type), this) : this;
  }
}

export class RestTypeNode extends Node {
  constructor(public type: TypeNode) {
    super();
  }

  updateRestTypeNode(type: TypeNode): RestTypeNode {
    return this.type !== type ? update(new RestTypeNode(type), this) : this;
  }
}

export class UnionTypeNode extends Node {
  constructor(public types: readonly TypeNode[]) {
    super();
  }

  updateUnionTypeNode(types: NodeArray<TypeNode>) {
    return this.types !== types ? update(new UnionTypeNode(types), this) : this;
  }
}

export class IntersectionTypeNode extends Node {
  constructor(public types: readonly TypeNode[]) {
    super();
  }

  updateIntersectionTypeNode(types: NodeArray<TypeNode>) {
    return this.types !== types ? update(new IntersectionTypeNode(types), this) : this;
  }
}

export class ConditionalTypeNode extends Node {
  constructor(public checkType: TypeNode,
              public extendsType: TypeNode,
              public trueType: TypeNode,
              public falseType: TypeNode) {
    super();
  }

  updateConditionalTypeNode(checkType: TypeNode, extendsType: TypeNode, trueType: TypeNode, falseType: TypeNode) {
    return this.checkType !== checkType ||
           this.extendsType !== extendsType ||
           this.trueType !== trueType ||
           this.falseType !== falseType ? update(
      new ConditionalTypeNode(checkType, extendsType, trueType, falseType),
      this) : this;
  }
}

export class InferTypeNode extends Node {
  constructor(public typeParameter: TypeParameterDeclaration) {
    super();
  }

  updateInferTypeNode(typeParameter: TypeParameterDeclaration) {
    return this.typeParameter !== typeParameter ? update(new InferTypeNode(typeParameter), this) : this;
  }
}

export class TemplateLiteralType extends Node {
  constructor(public head: TemplateHead, public templateSpans: readonly TemplateLiteralTypeSpan[]) {
    super();
  }

  updateTemplateLiteralType(head: TemplateHead, templateSpans: readonly TemplateLiteralTypeSpan[]) {
    return this.head !== head ||
           this.templateSpans !== templateSpans ? update(new TemplateLiteralType(head,
      templateSpans), this) : this;
  }
}

export class ImportTypeNode extends Node {
  constructor(public argument: TypeNode,
              public qualifier?: EntityName,
              public typeArguments?: readonly TypeNode[],
              public isTypeOf = false) {
    super();
  }

  updateImportTypeNode(argument: TypeNode,
                       qualifier: EntityName | undefined,
                       typeArguments: readonly TypeNode[] | undefined,
                       isTypeOf = this.isTypeOf) {
    return this.argument !== argument ||
           this.qualifier !== qualifier ||
           this.typeArguments !== typeArguments ||
           this.isTypeOf !== isTypeOf ? update(
      new ImportTypeNode(argument, qualifier, typeArguments, isTypeOf),
      this) : this;
  }
}

export class ParenthesizedType extends Node {
  constructor(public type: TypeNode) {
    super();
  }

  updateParenthesizedType(type: TypeNode) {
    return this.type !== type ? update(new ParenthesizedType(type), this) : this;
  }
}

export class ThisTypeNode extends Node {
  constructor() {
    super();
  }
}

export class TypeOperatorNode extends Node {
  constructor(public operator: KeywordToken<KeywordSyntaxKind.KeyOfKeyword | KeywordSyntaxKind.UniqueKeyword | KeywordSyntaxKind.ReadonlyKeyword>,
              public type: TypeNode) {
    super();
  }

  updateTypeOperatorNode(type: TypeNode) {
    return this.type !== type ? update(new TypeOperatorNode(this.operator, type), this) : this;
  }
}

export class IndexedAccessTypeNode extends Node {
  constructor(public objectType: TypeNode, public indexType: TypeNode) {
    super();
  }

  updateIndexedAccessTypeNode(objectType: TypeNode, indexType: TypeNode) {
    return this.objectType !== objectType ||
           this.indexType !== indexType ? update(new IndexedAccessTypeNode(objectType,
      indexType), this) : this;
  }
}

export class MappedTypeNode extends Node {
  constructor(public readonlyToken: ReadonlyKeyword | PlusToken | MinusToken | undefined,
              public typeParameter: TypeParameterDeclaration,
              public nameType: TypeNode | undefined,
              public questionToken: QuestionToken | PlusToken | MinusToken | undefined,
              public type: TypeNode | undefined) {
    super();
  }

  updateMappedTypeNode(readonlyToken: ReadonlyKeyword | PlusToken | MinusToken | undefined,
                       typeParameter: TypeParameterDeclaration,
                       nameType: TypeNode | undefined,
                       questionToken: QuestionToken | PlusToken | MinusToken | undefined,
                       type: TypeNode | undefined): MappedTypeNode {
    return this.readonlyToken !== readonlyToken ||
           this.typeParameter !== typeParameter ||
           this.nameType !== nameType ||
           this.questionToken !== questionToken ||
           this.type !== type ? update(
      new MappedTypeNode(readonlyToken, typeParameter, nameType, questionToken, type),
      this) : this;
  }
}

export class LiteralTypeNode extends Node {
  constructor(public literal: NullLiteral | BooleanLiteral | LiteralExpression | PrefixUnaryExpression) {
    super();
  }

  updateLiteralTypeNode(literal: LiteralTypeNode['literal']) {
    return this.literal !== literal ? update(new LiteralTypeNode(literal), this) : this;
  }
}
