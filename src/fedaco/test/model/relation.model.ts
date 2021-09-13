/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { RelationColumn } from '../../src/annotation/relation';
import { Model } from '../../src/fedaco/model';

export class RelationModel extends Model {

  @RelationColumn()
  columnFoo: any;

}
