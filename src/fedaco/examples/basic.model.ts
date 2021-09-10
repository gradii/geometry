/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Column } from '../src/annotation/column';
import { Relation } from '../src/annotation/relation';

import { Model } from '../src/fedaco/model';


export class BasicModel extends Model {

  @Column({
    columnName: 'name'
  })
  name = '132';

  @Column()
  score: string;

  @Relation()
  articles: any[];

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  constructor() {
    super();
  }

}

export class RelationModel extends Model {
  
}
