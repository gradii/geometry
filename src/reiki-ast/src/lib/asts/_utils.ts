import { Identifier } from './identifiers.ast';
import { escapeLeadingUnderscores, getDefaultTagNameForKind } from '../utilities';

export function getDefaultTagName(node: any) {
  const defaultTagName = getDefaultTagNameForKind(node.kind);
  return node.tagName.escapedText === escapeLeadingUnderscores(defaultTagName)
    ? node.tagName
    : new Identifier(defaultTagName);
}
