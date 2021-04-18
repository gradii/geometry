/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ProcessorInterface } from './processor-interface';

export class Processor implements ProcessorInterface {

  processSelect(queryBuilder, results) {
    return results;
  }

  processInsertGetId() {

  }
}
