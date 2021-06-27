// export function update(withOriginal = false) {
//   return withOriginal ? updateWithOriginal : updateWithoutOriginal;
// }
import { Identifier } from './asts/identifiers.ast';
import { Node, CharacterCodes, JSDocSyntaxKind, ReadonlyTextRange, TextRange } from './types';

export function update<T extends TextRange>(range: T, location: TextRange | undefined): T {
  return setTextRange(range, location);
}

export function setTextRange<T extends TextRange>(range: T, location: TextRange | undefined): T {
  return location ? setTextRangePosEnd(range, location.pos, location.end) : range;
}

export function setTextRangePosEnd<T extends ReadonlyTextRange>(range: T, pos: number, end: number) {
  return setTextRangeEnd(setTextRangePos(range, pos), end);
}

export function setTextRangePos<T extends ReadonlyTextRange>(range: T, pos: number) {
  (range as TextRange).pos = pos;
  return range;
}

export function setTextRangeEnd<T extends ReadonlyTextRange>(range: T, end: number) {
  (range as TextRange).end = end;
  return range;
}

// export function setOriginalNode<T extends Node>(node: T, original: Node | undefined): T {
//   node.original = original;
//   if (original) {
//     const emitNode = original.emitNode;
//     if (emitNode) node.emitNode = mergeEmitNode(emitNode, node.emitNode);
//   }
//   return node;
// }
//
// function updateWithoutOriginal<T extends Node>(updated: T, original: T): T {
//   if (updated !== original) {
//     setTextRange(updated, original);
//   }
//   return updated;
// }
//
// function updateWithOriginal<T extends Node>(updated: T, original: T): T {
//   if (updated !== original) {
//     setOriginalNode(updated, original);
//     setTextRange(updated, original);
//   }
//   return updated;
// }



export function getDefaultTagNameForKind(kind: JSDocSyntaxKind): string {
  switch (kind) {
    case JSDocSyntaxKind.JSDocTypeTag:
      return 'type';
    case JSDocSyntaxKind.JSDocReturnTag:
      return 'returns';
    case JSDocSyntaxKind.JSDocThisTag:
      return 'this';
    case JSDocSyntaxKind.JSDocEnumTag:
      return 'enum';
    case JSDocSyntaxKind.JSDocAuthorTag:
      return 'author';
    case JSDocSyntaxKind.JSDocClassTag:
      return 'class';
    case JSDocSyntaxKind.JSDocPublicTag:
      return 'public';
    case JSDocSyntaxKind.JSDocPrivateTag:
      return 'private';
    case JSDocSyntaxKind.JSDocProtectedTag:
      return 'protected';
    case JSDocSyntaxKind.JSDocReadonlyTag:
      return 'readonly';
    case JSDocSyntaxKind.JSDocTemplateTag:
      return 'template';
    case JSDocSyntaxKind.JSDocTypedefTag:
      return 'typedef';
    case JSDocSyntaxKind.JSDocParameterTag:
      return 'param';
    case JSDocSyntaxKind.JSDocPropertyTag:
      return 'prop';
    case JSDocSyntaxKind.JSDocCallbackTag:
      return 'callback';
    case JSDocSyntaxKind.JSDocAugmentsTag:
      return 'augments';
    case JSDocSyntaxKind.JSDocImplementsTag:
      return 'implements';
    default:
      throw new Error(`Unsupported kind: ${kind}`);
  }
}


export function escapeLeadingUnderscores(identifier: string): any {
  return (
    identifier.length >= 2 &&
    identifier.charCodeAt(0) === CharacterCodes._ &&
    identifier.charCodeAt(1) === CharacterCodes._ ?
      '_' + identifier :
      identifier
  ) as any;
}
