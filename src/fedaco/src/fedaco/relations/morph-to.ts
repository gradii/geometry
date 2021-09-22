/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { tap } from 'ramda';
import { Collection } from '../../define/collection';
import { FedacoBuilder } from '../fedaco-builder';
import { Model } from '../model';
import { BelongsTo } from './belongs-to';

export class MorphTo extends BelongsTo {
  /*The type of the polymorphic relation.*/
  protected _morphType: string;
  /*The models whose relations are being eager loaded.*/
  protected _models: Collection;
  /*All of the models keyed by ID.*/
  protected _dictionary: Map<any, any> = new Map();
  /*A buffer of dynamic calls to query macros.*/
  protected _macroBuffer: any[] = [];
  /*A map of relations to load for each individual morph type.*/
  protected _morphableEagerLoads: Map<any, any> = new Map();
  /*A map of relationship counts to load for each individual morph type.*/
  protected _morphableEagerLoadCounts: Map<any, any> = new Map();
  /*A map of constraints to apply for each individual morph type.*/
  protected _morphableConstraints: Map<any, any> = new Map();

  /*Create a new morph to relationship instance.*/
  public constructor(query: FedacoBuilder, parent: Model, foreignKey: string, ownerKey: string,
                     type: string, relation: string) {
    super(query, parent, foreignKey, ownerKey, relation);
    this._morphType = type;
  }

  /*{@inheritdoc}*/
  public select(columns = ['*']) {
    this._macroBuffer.push({
      'method'    : 'select',
      'parameters': [columns]
    });
    return super.select(columns);
  }

  /*{@inheritdoc}*/
  public selectRaw(expression: string, bindings: any = {}) {
    this._macroBuffer.push({
      'method'    : 'selectRaw',
      'parameters': [expression, bindings]
    });
    return super.selectRaw(expression, bindings);
  }

  /*{@inheritdoc}*/
  public selectSub(query: any, as: string) {
    this._macroBuffer.push({
      'method'    : 'selectSub',
      'parameters': [query, as]
    });
    return super.selectSub(query, as);
  }

  /*{@inheritdoc}*/
  public addSelect(column: any) {
    this._macroBuffer.push({
      'method'    : 'addSelect',
      'parameters': [column]
    });
    return super.addSelect(column);
  }

  /*Specify constraints on the query for a given morph type.*/
  public withoutGlobalScopes(scopes?: any[]) {
    this._macroBuffer.push({
      'method'    : 'addSelect',
      'parameters': [scopes]
    });
    // return super.withoutGlobalScopes(parameters);
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    this.buildDictionary(this._models = models);
  }

  /*Build a dictionary with the models.*/
  protected buildDictionary(models: Collection) {
    for (const model of models) {
      if (model[this._morphType]) {
        const morphTypeKey = this._getDictionaryKey(model[this._morphType]);
        const foreignKeyKey = this._getDictionaryKey(model[this._foreignKey]);
        this._dictionary.get(morphTypeKey)[foreignKeyKey].push(model);
      }
    }
  }

  /*Get the results of the relationship.

  Called via eager load method of Eloquent query builder.*/
  public async getEager(): Promise<Collection> {
    for (const type of Object.keys(this._dictionary)) {
      // @ts-ignore todo fixme
      this.matchToMorphParents(type, await this.getResultsByType(type));
    }
    return this._models;
  }

  /*Get all of the relation results for a type.*/
  protected async getResultsByType(clazz: typeof Model) {
    const instance = this.createModelByType(clazz);
    const ownerKey = this.ownerKey ?? instance.getKeyName();
    const query = this.replayMacros(instance.newQuery()).mergeConstraintsFrom(
      this.getQuery())._with({
      ...this.getQuery().getEagerLoads(),
      ...this._morphableEagerLoads.get(instance.constructor) ?? {}
    }).withCount(/*cast type array*/this._morphableEagerLoadCounts.get(instance.constructor) ?? []);
    const callback = this._morphableConstraints.get(instance.constructor) ?? null;
    if (callback) {
      callback(query);
    }
    const whereIn = this.whereInMethod(instance, ownerKey);
    return query[whereIn](instance.getTable() + '.' + ownerKey,
      this.gatherKeysByType(clazz, instance.getKeyType())).get();
  }

  /*Gather all of the foreign keys for a given type.*/
  protected gatherKeysByType(clazz: typeof Model, keyType: string) {
    return keyType !== 'string' ?
      Object.keys(this._dictionary.get(clazz)) :
      Object.keys(this._dictionary.get(clazz)).map(modelId => {
        return /*cast type string*/ modelId;
      });
  }

  /*Create a new model instance by type.*/
  public createModelByType(clazz: typeof Model) {
    // let clazz = Model.getActualClassNameForMorph(type);
    return tap(instance => {
      if (!instance.getConnectionName()) {
        instance.setConnection(this.getConnection().getName());
      }
    }, new clazz());
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    return models;
  }

  /*Match the results for a given type to their parents.*/
  protected matchToMorphParents(clazz: typeof Model, results: Collection) {
    for (const result of results) {
      const ownerKey = !isBlank(this.ownerKey) ? this._getDictionaryKey(
        result[this.ownerKey]) : result.getKey();
      if (this._dictionary.get(clazz)[ownerKey] !== undefined) {
        for (const model of this._dictionary.get(clazz)[ownerKey]) {
          model.setRelation(this.relationName, result);
        }
      }
    }
  }

  /*Associate the model instance to the given parent.*/
  public associate(model: Model) {
    let foreignKey;
    if (model instanceof Model) {
      foreignKey = this.ownerKey && model[this.ownerKey] ? this.ownerKey : model.getKeyName();
    }
    this._parent.setAttribute(this._foreignKey, model instanceof Model ? model[foreignKey] : null);
    this._parent.setAttribute(this._morphType,
      model instanceof Model ? model.getMorphClass() : null);
    return this._parent.setRelation(this.relationName, model);
  }

  /*Dissociate previously associated model from the given parent.*/
  public dissociate() {
    this._parent.setAttribute(this._foreignKey, null);
    this._parent.setAttribute(this._morphType, null);
    return this._parent.setRelation(this.relationName, null);
  }

  /*Touch all of the related models for the relationship.*/
  public touch() {
    if (!isBlank(this.child[this._foreignKey])) {
      super.touch();
    }
  }

  /*Make a new related instance for the given model.*/
  protected newRelatedInstanceFor(parent: Model) {
    return parent[this.getRelationName()]().getRelated().newInstance();
  }

  /*Get the foreign key "type" name.*/
  public getMorphType() {
    return this._morphType;
  }

  /*Get the dictionary used by the relationship.*/
  public getDictionary() {
    return this._dictionary;
  }

  /*Specify which relations to load for a given morph type.*/
  public morphWith(_with: Map<any, any>) {
    _with.forEach((k, v) => {
      this._morphableEagerLoads.set(k, v);
    });
    return this;
  }

  /*Specify which relationship counts to load for a given morph type.*/
  public morphWithCount(withCount: Map<any, any>) {
    withCount.forEach((k, v) => {
      this._morphableEagerLoadCounts.set(k, v);
    });
    return this;
  }

  /*Specify constraints on the query for a given morph type.*/
  public constrain(callbacks: Map<any, any>) {
    callbacks.forEach((k, v) => {
      this._morphableConstraints.set(k, v);
    });
    return this;
  }

  /*Replay stored macro calls on the actual related instance.*/
  protected replayMacros(query: FedacoBuilder) {
    for (const macro of this._macroBuffer) {
      // @ts-ignore
      query[macro['method']](...macro['parameters']);
    }
    return query;
  }

  // /*Handle dynamic method calls to the relationship.*/
  // public __call(method: string, parameters: any[]) {
  //   try {
  //     var result = super.__call(method, parameters);
  //     if (method === "withoutGlobalScopes") {
  //       this.macroBuffer.push(compact("method", "parameters"));
  //     }
  //     return result;
  //   }
  //   catch (e: BadMethodCallException) {
  //     this.macroBuffer.push(compact("method", "parameters"));
  //     return this;
  //   }
  // }
}
