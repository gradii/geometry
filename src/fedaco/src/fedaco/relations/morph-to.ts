/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Collection } from '../../define/collection';
import { FedacoBuilder } from '../fedaco-builder';
import { Model } from '../model';
import { BelongsTo } from './belongs-to';

export class MorphTo extends BelongsTo {
  /*The type of the polymorphic relation.*/
  protected morphType: string;
  /*The models whose relations are being eager loaded.*/
  protected models: Collection;
  /*All of the models keyed by ID.*/
  protected dictionary: any[] = [];
  /*A buffer of dynamic calls to query macros.*/
  protected macroBuffer: any[] = [];

  /*Create a new morph to relationship instance.*/
  public constructor(query: FedacoBuilder, parent: Model, foreignKey: string, otherKey: string,
                     type: string, relation: string) {
    super(query, parent, foreignKey, otherKey, relation);
    this.morphType = type;
  }

  /*Get the results of the relationship.*/
  public getResults() {
    if (!this.otherKey) {
      return;
    }
    return this.query.first();
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    this.buildDictionary(this.models = Collection.make(models));
  }

  /*Build a dictionary with the models.*/
  protected buildDictionary(models: Collection) {
    for (let model of models) {
      if (model[this.morphType]) {
        this.dictionary[model[this.morphType]][model[this.foreignKey]].push(model);
      }
    }
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    return models;
  }

  /*Associate the model instance to the given parent.*/
  public associate(model: Model) {
    this.parent.setAttribute(this.foreignKey, model.getKey());
    this.parent.setAttribute(this.morphType, model.getMorphClass());
    return this.parent.setRelation(this.relation, model);
  }

  /*Dissociate previously associated model from the given parent.*/
  public dissociate() {
    this.parent.setAttribute(this.foreignKey, null);
    this.parent.setAttribute(this.morphType, null);
    return this.parent.setRelation(this.relation, null);
  }

  /*Get the results of the relationship.

  Called via eager load method of Eloquent query builder.*/
  public getEager() {
    for (let type of array_keys(this.dictionary)) {
      this.matchToMorphParents(type, this.getResultsByType(type));
    }
    return this.models;
  }

  /*Match the results for a given type to their parents.*/
  protected matchToMorphParents(type: string, results: Collection) {
    for (let result of results) {
      if (this.dictionary[type][result.getKey()] !== undefined) {
        for (let model of this.dictionary[type][result.getKey()]) {
          model.setRelation(this.relation, result);
        }
      }
    }
  }

  /*Get all of the relation results for a type.*/
  protected getResultsByType(type: string) {
    let instance = this.createModelByType(type);
    let key      = instance.getTable() + '.' + instance.getKeyName();
    let query    = this.replayMacros(instance.newQuery()).mergeModelDefinedRelationConstraints(
      this.getQuery())._with(this.getQuery().getEagerLoads());
    return query.whereIn(key, this.gatherKeysByType(type).all()).get();
  }

  /*Gather all of the foreign keys for a given type.*/
  protected gatherKeysByType(type: string) {
    let foreign = this.foreignKey;
    return collect(this.dictionary[type]).map(models => {
      return head(models)[foreign];
    }).values().unique();
  }

  /*Create a new model instance by type.*/
  public createModelByType(type: string) {
    let clazz = this.parent.getActualClassNameForMorph(type);
    return new clazz();
  }

  /*Get the foreign key "type" name.*/
  public getMorphType() {
    return this.morphType;
  }

  /*Get the dictionary used by the relationship.*/
  public getDictionary() {
    return this.dictionary;
  }

  // /*Replay stored macro calls on the actual related instance.*/
  // protected replayMacros(query: Builder) {
  //   for (let macro of this.macroBuffer) {
  //     call_user_func_array([query, macro['method']], macro['parameters']);
  //   }
  //   return query;
  // }

  // /*Handle dynamic method calls to the relationship.*/
  // public __call(method: string, parameters: any[]) {
  //   try {
  //     return super.__call(method, parameters);
  //   } catch (e: BadMethodCallException) {
  //     this.macroBuffer.push(compact('method', 'parameters'));
  //     return this;
  //   }
  // }
}
