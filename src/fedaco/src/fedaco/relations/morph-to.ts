/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { tap } from 'ramda';
import { Collection } from '../../define/collection';
import { Model } from '../model';
import { BelongsTo } from './belongs-to';
import { FedacoBuilder } from '../fedaco-builder';
import { isBlank } from '@gradii/check-type';

export class MorphTo extends BelongsTo {
  /*The type of the polymorphic relation.*/
  protected morphType: string;
  /*The models whose relations are being eager loaded.*/
  protected models: Collection;
  /*All of the models keyed by ID.*/
  protected dictionary: any[] = [];
  /*A buffer of dynamic calls to query macros.*/
  protected macroBuffer: any[] = [];
  /*A map of relations to load for each individual morph type.*/
  protected morphableEagerLoads: any[] = [];
  /*A map of relationship counts to load for each individual morph type.*/
  protected morphableEagerLoadCounts: any[] = [];
  /*A map of constraints to apply for each individual morph type.*/
  protected morphableConstraints: any[] = [];

  /*Create a new morph to relationship instance.*/
  public constructor(query: FedacoBuilder, parent: Model, foreignKey: string, ownerKey: string,
                     type: string, relation: string) {
    super(query, parent, foreignKey, ownerKey, relation);
    this.morphType = type;
  }

  // /*{@inheritdoc}*/
  // public select(columns = ['*']) {
  //   this.macroBuffer.push({
  //     'method'    : 'select',
  //     'parameters': [columns]
  //   });
  //   return super.select(columns);
  // }
  //
  // /*{@inheritdoc}*/
  // public selectRaw(expression, bindings = []) {
  //   this.macroBuffer.push({
  //     'method'    : 'selectRaw',
  //     'parameters': [expression, bindings]
  //   });
  //   return super.selectRaw(expression, bindings);
  // }
  //
  // /*{@inheritdoc}*/
  // public selectSub(query, as) {
  //   this.macroBuffer.push({
  //     'method'    : 'selectSub',
  //     'parameters': [query, as]
  //   });
  //   return super.selectSub(query, as);
  // }
  //
  // /*{@inheritdoc}*/
  // public addSelect(column) {
  //   this.macroBuffer.push({
  //     'method'    : 'addSelect',
  //     'parameters': [column]
  //   });
  //   return super.addSelect(column);
  // }
  //
  // /*Set the constraints for an eager load of the relation.*/
  // public addEagerConstraints(models: any[]) {
  //   this.buildDictionary(this.models = models);
  // }
  //
  // /*Build a dictionary with the models.*/
  // protected buildDictionary(models: Collection) {
  //   for (let model of models) {
  //     if (model[this.morphType]) {
  //       let morphTypeKey  = this.getDictionaryKey(model[this.morphType]);
  //       let foreignKeyKey = this.getDictionaryKey(model[this._foreignKey]);
  //       this.dictionary[morphTypeKey][foreignKeyKey].push(model);
  //     }
  //   }
  // }
  //
  // /*Get the results of the relationship.
  //
  // Called via eager load method of Eloquent query builder.*/
  // public getEager() {
  //   for (let type of Object.keys(this.dictionary)) {
  //     // @ts-ignore todo fixme
  //     this.matchToMorphParents(type, this.getResultsByType(type));
  //   }
  //   return this.models;
  // }
  //
  // /*Get all of the relation results for a type.*/
  // protected getResultsByType(clazz: typeof Model) {
  //   let instance = this.createModelByType(clazz);
  //   let ownerKey = this.ownerKey ?? instance.getKeyName();
  //   let query    = this.replayMacros(instance.newQuery()).mergeConstraintsFrom(
  //     this.getQuery())._with([
  //     ...this.getQuery().getEagerLoads(), ...this.morphableEagerLoads[get_class(instance)] ?? []
  //   ]).withCount(/*cast type array*/ this.morphableEagerLoadCounts[get_class(instance)] ?? []);
  //   if (callback = this.morphableConstraints[get_class(instance)] ?? null) {
  //     callback(query);
  //   }
  //   let whereIn = this.whereInMethod(instance, ownerKey);
  //   return query[whereIn](instance.getTable() + '.' + ownerKey,
  //     this.gatherKeysByType(type, instance.getKeyType())).get();
  // }
  //
  // /*Gather all of the foreign keys for a given type.*/
  // protected gatherKeysByType(type: string, keyType: string) {
  //   return keyType !== 'string' ? array_keys(this.dictionary[type]) : array_map(modelId => {
  //     return /*cast type string*/ modelId;
  //   }, array_filter(array_keys(this.dictionary[type])));
  // }
  //
  // /*Create a new model instance by type.*/
  // public createModelByType(clazz: typeof Model) {
  //   // let clazz = Model.getActualClassNameForMorph(type);
  //   return tap(instance => {
  //     if (!instance.getConnectionName()) {
  //       instance.setConnection(this.getConnection().getName());
  //     }
  //   }, new clazz());
  // }
  //
  // /*Match the eagerly loaded results to their parents.*/
  // public match(models: any[], results: Collection, relation: string) {
  //   return models;
  // }
  //
  // /*Match the results for a given type to their parents.*/
  // protected matchToMorphParents(type: string, results: Collection) {
  //   for (let result of results) {
  //     let ownerKey = !isBlank(this.ownerKey) ? this.getDictionaryKey(
  //       result[this.ownerKey]) : result.getKey();
  //     if (this.dictionary[type][ownerKey] !== undefined) {
  //       for (let model of this.dictionary[type][ownerKey]) {
  //         model.setRelation(this.relationName, result);
  //       }
  //     }
  //   }
  // }
  //
  // /*Associate the model instance to the given parent.*/
  // public associate(model: Model) {
  //   if (model instanceof Model) {
  //     let foreignKey = this.ownerKey && model[this.ownerKey] ? this.ownerKey : model.getKeyName();
  //   }
  //   this._parent.setAttribute(this._foreignKey, model instanceof Model ? model[foreignKey] : null);
  //   this._parent.setAttribute(this.morphType, model instanceof Model ? model.getMorphClass() : null);
  //   return this._parent.setRelation(this.relationName, model);
  // }
  //
  // /*Dissociate previously associated model from the given parent.*/
  // public dissociate() {
  //   this._parent.setAttribute(this._foreignKey, null);
  //   this._parent.setAttribute(this.morphType, null);
  //   return this._parent.setRelation(this.relationName, null);
  // }
  //
  // /*Touch all of the related models for the relationship.*/
  // public touch() {
  //   if (!isBlank(this.child[this._foreignKey])) {
  //     super.touch();
  //   }
  // }
  //
  // /*Make a new related instance for the given model.*/
  // protected newRelatedInstanceFor(parent: Model) {
  //   return parent[this.getRelationName()]().getRelated().newInstance();
  // }
  //
  // /*Get the foreign key "type" name.*/
  // public getMorphType() {
  //   return this.morphType;
  // }
  //
  // /*Get the dictionary used by the relationship.*/
  // public getDictionary() {
  //   return this.dictionary;
  // }
  //
  // /*Specify which relations to load for a given morph type.*/
  // public morphWith(_with: any[]) {
  //   this.morphableEagerLoads = [...this.morphableEagerLoads, ..._with];
  //   return this;
  // }
  //
  // /*Specify which relationship counts to load for a given morph type.*/
  // public morphWithCount(withCount: any[]) {
  //   this.morphableEagerLoadCounts = [...this.morphableEagerLoadCounts, ...withCount];
  //   return this;
  // }
  //
  // /*Specify constraints on the query for a given morph type.*/
  // public constrain(callbacks: any[]) {
  //   this.morphableConstraints = [...this.morphableConstraints, ...callbacks];
  //   return this;
  // }
  //
  // /*Replay stored macro calls on the actual related instance.*/
  // protected replayMacros(query: FedacoBuilder) {
  //   for (let macro of this.macroBuffer) {
  //     query[macro['method']](());
  //   }
  //   return query;
  // }
  //
  // // /*Handle dynamic method calls to the relationship.*/
  // // public __call(method: string, parameters: any[]) {
  // //   try {
  // //     var result = super.__call(method, parameters);
  // //     if (method === "withoutGlobalScopes") {
  // //       this.macroBuffer.push(compact("method", "parameters"));
  // //     }
  // //     return result;
  // //   }
  // //   catch (e: BadMethodCallException) {
  // //     this.macroBuffer.push(compact("method", "parameters"));
  // //     return this;
  // //   }
  // // }
}
