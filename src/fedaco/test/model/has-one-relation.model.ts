/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { HasOneColumn } from '../../src/annotation/relation';
import { Model } from '../../src/fedaco/model';

export class HasOneRelationModel extends Model {

  @HasOneColumn({})
  columnFoo: any;

}
