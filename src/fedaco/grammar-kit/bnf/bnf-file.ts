import { AttributeInfo } from './attribute-info';
import { BnfAttrs } from './bnf-attrs';
import { BnfRule } from './bnf-rule';

/**
 *
 */
export class BnfFile {
  myRules = new Map<string, BnfRule>();
  myGlobalAttributes: BnfAttrs[];
  myAttributeValues: Map<string, AttributeInfo[]>;
  myLanguage: string;
  myParserDefinition: any;
  myElementType: any;
  myContentElementType: any;
  myModificationStamp: any;
  myOriginalFile: any;
  myViewProvider: any;
  myTrees: any;
  myPossiblyInvalidated: any;
  myManager: any;
  myPsiLock: any;
  myLoadingAst: any;
  myUserMap: any;
}
