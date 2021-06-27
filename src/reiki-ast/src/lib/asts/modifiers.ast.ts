import { Node } from './common.ast';
import { ModifierFlags, ModifierSyntaxKind } from '../types';

export class Modifier<T extends ModifierSyntaxKind> extends Node {
  constructor(public kind: T) {
    super();
  }
}

export class ModifiersFromModifierFlags extends Node {
  constructor(public modifierFlags: ModifierFlags) {
    super();
  }
}
