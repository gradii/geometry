import { Node } from './common.ast';
import { NodeArray, TypeNode, TypeParameterDeclaration } from '../types';
import { update } from '../utilities';

// import { update } from 'typescript';
export class Identifier extends Node {
  constructor(public text: string, public typeArguments?: readonly (TypeNode | TypeParameterDeclaration)[]) {
    super();
  }

  updateIdentifier(typeArguments?: NodeArray<TypeNode | TypeParameterDeclaration> | undefined): Identifier {
    return this.typeArguments !== typeArguments ? update(new Identifier(this.text, typeArguments), this) : this;
  }
}

// export class TempVariable extends Node {
//   constructor(public recordTempVariable: ((node: Identifier) => void) | undefined,
//               public reservedInNestedScopes?: boolean) {
//     super();
//   }
// }
//
// export class LoopVariable extends Node {
//   constructor() {
//     super();
//   }
// }

// Identifier
// export class UniqueName extends Node {
//   constructor(public text: string, public flags: GeneratedIdentifierFlags = GeneratedIdentifierFlags.None) {
//     super();
//   }
// }

export class PrivateIdentifier extends Node {
  constructor(public text: string) {
    super();
  }
}
