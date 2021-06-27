import { Decorator, ModifierFlags, ModifiersArray, Node as INode, NodeFlags, TransformFlags } from '../types';

export class ReadonlyTextRange {
  readonly pos: number;
  readonly end: number;
}

export class Node extends ReadonlyTextRange {
  readonly flags: NodeFlags;
  /* @internal */
  modifierFlagsCache: ModifierFlags;
  /* @internal */
  readonly transformFlags: TransformFlags; // Flags for transforms
  readonly decorators?: ReadonlyArray<Decorator>; // Array of decorators (in document order)
  readonly modifiers?: ModifiersArray; // Array of modifiers
  readonly parent: INode; // Parent node (initialized by binding)
  /* @internal */
  symbol: Symbol; // Symbol declared by node (initialized by binding)
}

export class NodeArray<T extends INode> extends Node {
  constructor(public elements?: readonly T[], public hasTrailingComma?: boolean) {
    super();
  }
}
