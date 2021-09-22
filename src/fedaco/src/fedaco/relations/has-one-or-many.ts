/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { last, tap } from 'ramda';
import { Collection } from '../../define/collection';
import { FedacoBuilder } from '../fedaco-builder';
import { Model } from '../model';
import { mixinInteractsWithDictionary } from './concerns/interacts-with-dictionary';
import { Relation } from './relation';

export class HasOneOrMany extends mixinInteractsWithDictionary<any>(Relation) {
  /*The foreign key of the parent model.*/
  protected foreignKey: string;
  /*The local key of the parent model.*/
  protected localKey: string;

  /*Create a new has one or many relationship instance.*/
  public constructor(query: FedacoBuilder, parent: Model, foreignKey: string, localKey: string) {
    super(query, parent);
    this.localKey   = localKey;
    this.foreignKey = foreignKey;
    this.addConstraints();
  }

  /*Create and return an un-saved instance of the related model.*/
  public make(attributes: any[] = []) {
    return tap(instance => {
      this.setForeignAttributesForCreate(instance);
    }, this._related.newInstance(attributes));
  }

  /*Create and return an un-saved instance of the related models.*/
  public makeMany(records: []) {
    const instances = this._related.newCollection();
    for (const record of records) {
      instances.push(this.make(record));
    }
    return instances;
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    if (HasOneOrMany.constraints) {
      const query = this.getRelationQuery();
      query.where(this.foreignKey, '=', this.getParentKey());
      query.whereNotNull(this.foreignKey);
    }
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    const whereIn = this.whereInMethod(this._parent, this.localKey);
    this.getRelationQuery()[whereIn](this.foreignKey, this.getKeys(models, this.localKey));
  }

  /*Match the eagerly loaded results to their single parents.*/
  public matchOne(models: any[], results: Collection, relation: string) {
    return this.matchOneOrMany(models, results, relation, 'one');
  }

  /*Match the eagerly loaded results to their many parents.*/
  public matchMany(models: any[], results: Collection, relation: string) {
    return this.matchOneOrMany(models, results, relation, 'many');
  }

  /*Match the eagerly loaded results to their many parents.*/
  protected matchOneOrMany(models: any[], results: Collection, relation: string, type: string) {
    const dictionary = this.buildDictionary(results);
    for (const model of models) {
      const key = this.getDictionaryKey(model.getAttribute(this.localKey));
      if (dictionary[key] !== undefined) {
        model.setRelation(relation, this.getRelationValue(dictionary, key, type));
      }
    }
    return models;
  }

  /*Get the value of a relationship by one or many type.*/
  protected getRelationValue(dictionary: any[], key: string, type: string) {
    const value = dictionary[key];
    return type === 'one' ? value : this._related.newCollection(value);
  }

  /*Build model dictionary keyed by the relation's foreign key.*/
  protected buildDictionary(results: Collection) {
    const foreign = this.getForeignKeyName();
    return results.reduce((prev: any, result) => {
      // @ts-ignore
      const key = this.getDictionaryKey(result[foreign]);
      if (!prev[key]) {
        prev[key] = [];
      }
      prev[key].push(result);
      return prev;
    }, {});
  }

  /*Find a model by its primary key or return a new instance of the related model.*/
  public findOrNew(id: any, columns: any[] = ['*']) {
    let instance = this.find(id, columns);
    if (isBlank(instance)) {
      instance = this._related.newInstance();
      this.setForeignAttributesForCreate(instance);
    }
    return instance;
  }

  /*Get the first related model record matching the attributes or instantiate it.*/
  public firstOrNew(attributes: any[] = [], values: any[] = []) {
    let instance = this.where(attributes).first() as Model;
    if (isBlank(instance)) {
      instance = this._related.newInstance([...attributes, ...values]);
      this.setForeignAttributesForCreate(instance);
    }
    return instance;
  }

  /*Get the first related record matching the attributes or create it.*/
  public firstOrCreate(attributes: any[] = [], values: any[] = []) {
    let instance = this.where(attributes).first();
    if (isBlank(instance)) {
      instance = this.create([...attributes, ...values]);
    }
    return instance;
  }

  /*Create or update a related record matching the attributes, and fill it with values.*/
  public updateOrCreate(attributes: any[], values: any[] = []) {
    return tap(instance => {
      instance.fill(values);
      instance.save();
    }, this.firstOrNew(attributes));
  }

  /*Attach a model instance to the parent model.*/
  public save(model: Model) {
    this.setForeignAttributesForCreate(model);
    return model.save() ? model : false;
  }

  /*Attach a collection of models to the parent instance.*/
  public saveMany(models: any[]) {
    for (const model of models) {
      this.save(model);
    }
    return models;
  }

  /*Create a new instance of the related model.*/
  public create(attributes: any[] = []) {
    return tap(instance => {
      this.setForeignAttributesForCreate(instance);
      instance.save();
    }, this._related.newInstance(attributes));
  }

  /*Create a Collection of new instances of the related model.*/
  public createMany(records: any[]) {
    const instances = this._related.newCollection();
    for (const record of records) {
      instances.push(this.create(record));
    }
    return instances;
  }

  /*Set the foreign ID for creating a related model.*/
  protected setForeignAttributesForCreate(model: Model) {
    model.setAttribute(this.getForeignKeyName(), this.getParentKey());
  }

  /*Add the constraints for a relationship query.*/
  public getRelationExistenceQuery(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                   columns: any[] | any = ['*']) {
    // if (query.getQuery()._from == parentQuery.getQuery()._from) {
    // refactor try to use get table
    if (query.getModel().getTable() == parentQuery.getModel().getTable()) {
      return this.getRelationExistenceQueryForSelfRelation(query, parentQuery, columns);
    }
    return super.getRelationExistenceQuery(query, parentQuery, columns);
  }

  /*Add the constraints for a relationship query on the same table.*/
  public getRelationExistenceQueryForSelfRelation(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                                  columns: any[] | any = ['*']) {
    const hash = this.getRelationCountHash();
    query.from(`${query.getModel().getTable()} as ${hash}`);
    query.getModel().setTable(hash);
    return query.select(columns).whereColumn(
      this.getQualifiedParentKeyName(),
      '=',
      `${hash}.${this.getForeignKeyName()}`);
  }

  /*Get the key for comparing against the parent key in "has" query.*/
  public getExistenceCompareKey() {
    return this.getQualifiedForeignKeyName();
  }

  /*Get the key value of the parent's local key.*/
  public getParentKey() {
    return this._parent.getAttribute(this.localKey);
  }

  /*Get the fully qualified parent key name.*/
  public getQualifiedParentKeyName() {
    return this._parent.qualifyColumn(this.localKey);
  }

  /*Get the plain foreign key.*/
  public getForeignKeyName() {
    const segments = this.getQualifiedForeignKeyName().split('.');
    return last(segments);
  }

  /*Get the foreign key for the relationship.*/
  public getQualifiedForeignKeyName() {
    return this.foreignKey;
  }

  /*Get the local key for the relationship.*/
  public getLocalKeyName() {
    return this.localKey;
  }
}
