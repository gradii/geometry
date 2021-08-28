/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { Collection } from '../../define/collection';
import { MorphOneOrMany } from './morph-one-or-many';

export class MorphMany extends MorphOneOrMany {
  /*Get the results of the relationship.*/
  public getResults() {
    return !isBlank(this.getParentKey()) ? this.query.get() : this.related.newCollection();
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    for (let model of models) {
      model.setRelation(relation, this.related.newCollection());
    }
    return models;
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    return this.matchMany(models, results, relation);
  }
}
