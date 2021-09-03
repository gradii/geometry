/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Collection } from '../../define/collection';
import { Model } from '../model';
import { mixinInteractsWithDictionary } from './concerns/interacts-with-dictionary';
import { mixinSupportsDefaultModels } from './concerns/supports-default-models';
import { HasManyThrough } from './has-many-through';

export class HasOneThrough extends mixinInteractsWithDictionary(
  mixinSupportsDefaultModels(
    HasManyThrough
  )
) {
  /*Get the results of the relationship.*/
  public getResults() {
    return this.first() || this._getDefaultFor(this.farParent);
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    for (let model of models) {
      model.setRelation(relation, this._getDefaultFor(model));
    }
    return models;
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    let dictionary = this.buildDictionary(results);
    for (let model of models) {
      const key = this.getDictionaryKey(model.getAttribute(this.localKey));
      if (dictionary[key] !== undefined) {
        let value = dictionary[key];
        model.setRelation(relation, reset(value));
      }
    }
    return models;
  }

  /*Make a new related instance for the given model.*/
  public newRelatedInstanceFor(parent: Model) {
    return this._related.newInstance();
  }
}
