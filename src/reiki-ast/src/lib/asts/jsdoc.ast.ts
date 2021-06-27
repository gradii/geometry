import { Node } from './common.ast';
import {
  EntityName,
  Identifier,
  JSDocNamespaceDeclaration,
  JSDocPropertyLikeTag,
  JSDocReturnTag,
  JSDocTag,
  JSDocType,
  ParameterDeclaration,
  TypeNode,
  TypeParameterDeclaration
} from '../types';
import { update } from '../utilities';
import { getDefaultTagName } from './_utils';

export class JSDocPrimaryTypeWorker<T extends JSDocType> extends Node {
  constructor(public kind: any) {
    super();
  }
}

export class JSDocUnaryTypeWorker extends Node {
  node;

  constructor(public kind: any, public type: any) {
    super();
  }

  updateJSDocUnaryTypeWorker(node, type) {
    return this.node !== node ||
           this.type !== type ? update(new JSDocUnaryTypeWorker(node, type), this) : this;
  }
}

export class JSDocFunctionType extends Node {
  constructor(public parameters: readonly ParameterDeclaration[], public type: TypeNode | undefined) {
    super();
  }

  updateJSDocFunctionType(parameters: readonly ParameterDeclaration[], type: TypeNode | undefined): JSDocFunctionType {
    return this.parameters !== parameters ||
           this.type !== type ? update(new JSDocFunctionType(parameters, type),
      this) : this;
  }
}

export class JSDocTypeLiteral extends Node {
  constructor(public propertyTags?: readonly JSDocPropertyLikeTag[], public isArrayType = false) {
    super();
  }

  updateJSDocTypeLiteral(propertyTags: readonly JSDocPropertyLikeTag[] | undefined,
                         isArrayType: boolean): JSDocTypeLiteral {
    return this.propertyTags !== propertyTags ||
           this.isArrayType !== isArrayType ? update(new JSDocTypeLiteral(
      propertyTags,
      isArrayType), this) : this;
  }
}

export class JSDocTypeExpression extends Node {
  constructor(public type: TypeNode) {
    super();
  }

  updateJSDocTypeExpression(type: TypeNode): JSDocTypeExpression {
    return this.type !== type ? update(new JSDocTypeExpression(type), this) : this;
  }
}

export class JSDocSignature extends Node {
  constructor(public typeParameters: readonly JSDocTemplateTag[] | undefined,
              public parameters: readonly JSDocParameterTag[],
              public type?: JSDocReturnTag) {
    super();
  }

  updateJSDocSignature(typeParameters: readonly JSDocTemplateTag[] | undefined,
                       parameters: readonly JSDocParameterTag[],
                       type: JSDocReturnTag | undefined): JSDocSignature {
    return this.typeParameters !== typeParameters ||
           this.parameters !== parameters ||
           this.type !== type ? update(new JSDocSignature(
      typeParameters,
      parameters,
      type), this) : this;
  }
}

export class BaseJSDocTag<T extends JSDocTag> extends Node {
  constructor(public kind: any, public tagName: Identifier, public comment: string | undefined) {
    super();
  }
}

export class JSDocTemplateTag extends Node {
  constructor(public tagName: Identifier | undefined,
              public constraint: JSDocTypeExpression | undefined,
              public typeParameters: readonly TypeParameterDeclaration[],
              public comment?: string) {
    super();
  }

  updateJSDocTemplateTag(tagName: Identifier = getDefaultTagName(this),
                         constraint: JSDocTypeExpression | undefined,
                         typeParameters: readonly TypeParameterDeclaration[],
                         comment: string | undefined): JSDocTemplateTag {
    return this.tagName !== tagName ||
           this.constraint !== constraint ||
           this.typeParameters !== typeParameters ||
           this.comment !== comment ? update(
      new JSDocTemplateTag(tagName, constraint, typeParameters, comment),
      this) : this;
  }
}

export class JSDocTypedefTag extends Node {
  constructor(public tagName: Identifier | undefined,
              public typeExpression?: JSDocTypeExpression,
              public fullName?: Identifier | JSDocNamespaceDeclaration,
              public comment?: string) {
    super();
  }

  updateJSDocTypedefTag(tagName: Identifier = getDefaultTagName(this),
                        typeExpression: JSDocTypeExpression | undefined,
                        fullName: Identifier | JSDocNamespaceDeclaration | undefined,
                        comment: string | undefined): JSDocTypedefTag {
    return this.tagName !== tagName ||
           this.typeExpression !== typeExpression ||
           this.fullName !== fullName ||
           this.comment !== comment ? update(
      new JSDocTypedefTag(tagName, typeExpression, fullName, comment),
      this) : this;
  }
}

export class JSDocParameterTag extends Node {
  constructor(public tagName: Identifier | undefined,
              public name: EntityName,
              public isBracketed: boolean,
              public typeExpression?: JSDocTypeExpression,
              public isNameFirst?: boolean,
              public comment?: string) {
    super();
  }

  updateJSDocParameterTag(tagName: Identifier = getDefaultTagName(this),
                          name: EntityName,
                          isBracketed: boolean,
                          typeExpression: JSDocTypeExpression | undefined,
                          isNameFirst: boolean,
                          comment: string | undefined): JSDocParameterTag {
    return this.tagName !== tagName ||
           this.name !== name ||
           this.isBracketed !== isBracketed ||
           this.typeExpression !== typeExpression ||
           this.isNameFirst !== isNameFirst ||
           this.comment !== comment ? update(
      new JSDocParameterTag(tagName, name, isBracketed, typeExpression, isNameFirst, comment),
      this) : this;
  }
}

export class JSDocPropertyTag extends Node {
  constructor(public tagName: Identifier | undefined,
              public name: EntityName,
              public isBracketed: boolean,
              public typeExpression?: JSDocTypeExpression,
              public isNameFirst?: boolean,
              public comment?: string) {
    super();
  }

  updateJSDocPropertyTag(tagName: Identifier = getDefaultTagName(this),
                         name: EntityName,
                         isBracketed: boolean,
                         typeExpression: JSDocTypeExpression | undefined,
                         isNameFirst: boolean,
                         comment: string | undefined): JSDocPropertyTag {
    return this.tagName !== tagName ||
           this.name !== name ||
           this.isBracketed !== isBracketed ||
           this.typeExpression !== typeExpression ||
           this.isNameFirst !== isNameFirst ||
           this.comment !== comment ? update(
      new JSDocPropertyTag(tagName, name, isBracketed, typeExpression, isNameFirst, comment),
      this) : this;
  }
}

export class JSDocCallbackTag extends Node {
  constructor(public tagName: Identifier | undefined,
              public typeExpression: JSDocSignature,
              public fullName?: Identifier | JSDocNamespaceDeclaration,
              public comment?: string) {
    super();
  }

  updateJSDocCallbackTag(tagName: Identifier = getDefaultTagName(this),
                         typeExpression: JSDocSignature,
                         fullName: Identifier | JSDocNamespaceDeclaration | undefined,
                         comment: string | undefined): JSDocCallbackTag {
    return this.tagName !== tagName ||
           this.typeExpression !== typeExpression ||
           this.fullName !== fullName ||
           this.comment !== comment ? update(
      new JSDocCallbackTag(tagName, typeExpression, fullName, comment),
      this) : this;
  }
}

export class JSDocAugmentsTag extends Node {
  constructor(public tagName: Identifier | undefined, public className: any, public comment?: string) {
    super();
  }

  updateJSDocAugmentsTag(tagName: Identifier = getDefaultTagName(this),
                         className: any,
                         comment: string | undefined): JSDocAugmentsTag {
    return this.tagName !== tagName ||
           this.className !== className ||
           this.comment !== comment ? update(new JSDocAugmentsTag(
      tagName,
      className,
      comment), this) : this;
  }
}

export class JSDocImplementsTag extends Node {
  constructor(public tagName: Identifier | undefined, public className: any, public comment?: string) {
    super();
  }

  updateJSDocImplementsTag(tagName: Identifier = getDefaultTagName(this),
                           className: any,
                           comment: string | undefined): JSDocImplementsTag {
    return this.tagName !== tagName ||
           this.className !== className ||
           this.comment !== comment ? update(new JSDocImplementsTag(
      tagName,
      className,
      comment), this) : this;
  }
}

export class JSDocSeeTag extends Node {
  constructor(public tagName: Identifier | undefined,
              public name: JSDocNameReference | undefined,
              public comment?: string) {
    super();
  }

  updateJSDocSeeTag(tagName: Identifier | undefined,
                    name: JSDocNameReference | undefined,
                    comment?: string): JSDocSeeTag {
    return this.tagName !== tagName ||
           this.name !== name ||
           this.comment !== comment ? update(new JSDocSeeTag(tagName,
      name,
      comment), this) : this;
  }
}

export class JSDocNameReference extends Node {
  constructor(public name: EntityName) {
    super();
  }

  updateJSDocNameReference(name: EntityName): JSDocNameReference {
    return this.name !== name ? update(new JSDocNameReference(name), this) : this;
  }
}

export class JSDocSimpleTagWorker<T extends JSDocTag> extends Node {
  node;

  constructor(public kind: any, public tagName: Identifier | undefined, public comment?: string) {
    super();
  }

  updateJSDocSimpleTagWorker(node: T, tagName: Identifier = getDefaultTagName(this), comment: string | undefined) {
    return this.node !== node ||
           this.tagName !== tagName ||
           this.comment !== comment ? update(new JSDocSimpleTagWorker(
      node,
      tagName,
      comment), this) : this;
  }
}

export class JSDocTypeLikeTagWorker<T extends JSDocTag & {
  typeExpression?: JSDocTypeExpression;
}> extends Node {
  node;

  constructor(public kind: any,
              public tagName: Identifier | undefined,
              public typeExpression?: JSDocTypeExpression,
              public comment?: string) {
    super();
  }

  updateJSDocTypeLikeTagWorker(node: T,
                               tagName: Identifier = getDefaultTagName(this),
                               typeExpression: JSDocTypeExpression | undefined,
                               comment: string | undefined) {
    return this.node !== node ||
           this.tagName !== tagName ||
           this.typeExpression !== typeExpression ||
           this.comment !== comment ? update(
      new JSDocTypeLikeTagWorker(node, tagName, typeExpression, comment),
      this) : this;
  }
}

export class JSDocUnknownTag extends Node {
  constructor(public tagName: Identifier, public comment?: string) {
    super();
  }

  updateJSDocUnknownTag(tagName: Identifier, comment: string | undefined): JSDocUnknownTag {
    return this.tagName !== tagName ||
           this.comment !== comment ? update(new JSDocUnknownTag(tagName, comment),
      this) : this;
  }
}

export class JSDocComment extends Node {
  constructor(public comment?: string | undefined, public tags?: readonly JSDocTag[] | undefined) {
    super();
  }

  updateJSDocComment(comment: string | undefined, tags: readonly JSDocTag[] | undefined) {
    return this.comment !== comment ||
           this.tags !== tags ? update(new JSDocComment(comment, tags), this) : this;
  }
}
