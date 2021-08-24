/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isArray, isFunction } from '@gradii/check-type';
import { Collection } from '../../define/collection';
import { Model } from '../model';
import { HasOneOrMany } from './has-one-or-many';

export class HasOne extends HasOneOrMany {
  /*Indicates if a default model instance should be used.

  Alternatively, may be a Closure to execute to retrieve default value.*/
  protected withDefault: Function | boolean;

  /*Return a new model instance in case the relationship does not exist.*/
  public withDefault(callback: Function | boolean = true) {
    this.withDefault = callback;
    return this;
  }

  /*Get the results of the relationship.*/
  public getResults() {
    return this.query.first() || this.getDefaultFor(this.parent);
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    for (let model of models) {
      model.setRelation(relation, this.getDefaultFor(model));
    }
    return models;
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    return this.matchOne(models, results, relation);
  }

  /*Get the default value for this relation.*/
  protected getDefaultFor(model: Model) {
    if (!this.withDefault) {
      return;
    }
    let instance = this.related.newInstance().setAttribute(this.getPlainForeignKey(),
      model.getAttribute(this.localKey));
    if (isFunction(this.withDefault)) {
      return this.withDefault(instance) || instance;
    }
    if (isArray(this.withDefault)) {
      instance.forceFill(this.withDefault);
    }
    return instance;
  }
}
