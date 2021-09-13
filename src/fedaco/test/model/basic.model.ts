/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { Column } from '../../src/annotation/column';
import { RelationColumn } from '../../src/annotation/relation';
import { Model } from '../../src/fedaco/model';

export class BasicModel extends Model {

  @Column({
    columnName: 'name'
  })
  name = '132';

  @Column()
  score: string;

  @RelationColumn()
  articles: any[];

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  constructor() {
    super();
  }

}

