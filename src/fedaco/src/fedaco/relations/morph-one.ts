/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Collection } from '../../define/collection';
import { MorphOneOrMany } from './morph-one-or-many';

export class MorphOne extends MorphOneOrMany {
  /*Get the results of the relationship.*/
  public getResults() {
    return this.query.first();
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    for (let model of models) {
      model.setRelation(relation, null);
    }
    return models;
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    return this.matchOne(models, results, relation);
  }
}
