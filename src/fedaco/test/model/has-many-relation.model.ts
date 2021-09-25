/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Column } from '../../src/annotation/column/column';
import { HasManyColumn } from '../../src/annotation/relation-column/has-many.relation-column';
import { Model } from '../../src/fedaco/model';


export class ArticleModel extends Model {

}


export class MemberModel extends Model {

  @Column()
  id: number;

  @HasManyColumn({
    related: ArticleModel
  })
  articles: Promise<any>;
}


export class HasManyRelationModel extends Model {

  @HasManyColumn({
    related: ArticleModel
  })
  columnFoo: any;
}

