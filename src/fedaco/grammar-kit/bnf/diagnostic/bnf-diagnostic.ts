/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BnfNode } from '../node/bnf-node';

export class BnfDiagnostic {
  constructor(
    node: BnfNode,
    message: any,
    start: number,
    length: number
  ) {
  }
}
