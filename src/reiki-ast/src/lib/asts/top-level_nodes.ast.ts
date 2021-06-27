import { Node } from './common.ast';
import {
  // BundleFileHasNoDefaultLib,
  // BundleFileReference,
  EndOfFileToken,
  NodeFlags,
  Statement, SyntaxKind,
  UnparsedSourceText
} from '../types';
import { update } from '../utilities';
import { Token } from './token.ast';

export class SourceFile extends Node {
  isDeclarationFile;
  referencedFiles;
  typeReferenceDirectives;
  hasNoDefaultLib;
  libReferenceDirectives;

  constructor(
    public statements: readonly Statement[],
    public endOfFileToken: EndOfFileToken = new Token(SyntaxKind.EndOfFileToken)
  ) {
    super();
  }

  static createSourceFile() {
  }
}

export class Bundle extends Node {
  constructor(public sourceFiles: readonly SourceFile[],
    public prepends: readonly (UnparsedSource | InputFiles)[] = []) {
    super();
  }

  updateBundle(sourceFiles: readonly SourceFile[], prepends: readonly (UnparsedSource | InputFiles)[] = []) {
    return this.sourceFiles !== sourceFiles ||
           this.prepends !== prepends ? update(new Bundle(sourceFiles, prepends),
      this
    ) : this;
  }
}

export class UnparsedSource extends Node {
  constructor(public prologues: readonly UnparsedPrologue[],
    public syntheticReferences: readonly UnparsedSyntheticReference[] | undefined,
    public texts: readonly UnparsedSourceText[]) {
    super();
  }
}

export class UnparsedPrologue extends Node {
  constructor(public data?: string) {
    super();
  }
}

export class UnparsedPrepend extends Node {
  constructor(public data: string | undefined, public texts: readonly UnparsedTextLike[]) {
    super();
  }
}

export class UnparsedTextLike extends Node {
  constructor(public data: string | undefined, public internal: boolean) {
    super();
  }
}

export class UnparsedSyntheticReference extends Node {
  constructor(public section: any) {
    super();
  }
}

export class InputFiles extends Node {
  constructor() {
    super();
  }
}
