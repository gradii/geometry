/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Collection } from '../../define/collection';
import { Model } from '../model';
import { Relation } from './relation';
import { FedacoBuilder } from '../fedaco-builder';

export class HasOneOrMany extends Relation {
  /*The foreign key of the parent model.*/
  protected foreignKey: string;
  /*The local key of the parent model.*/
  protected localKey: string;

  /*Create a new has one or many relationship instance.*/
  public constructor(query: FedacoBuilder, parent: Model, foreignKey: string, localKey: string) {
    super(query, parent);
    this.localKey   = localKey;
    this.foreignKey = foreignKey;
  }

  /*Create and return an un-saved instance of the related model.*/
  public make(attributes: any[] = []) {
    return tap(this.related.newInstance(attributes), instance => {
      this.setForeignAttributesForCreate(instance);
    });
  }

  /*Create and return an un-saved instance of the related models.*/
  public makeMany(records: iterable) {
    var instances = this.related.newCollection();
    for (let record of records) {
      instances.push(this.make(record));
    }
    return instances;
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    if (HasOneOrMany.constraints) {
      var query = this.getRelationQuery();
      query.where(this.foreignKey, '=', this.getParentKey());
      query.whereNotNull(this.foreignKey);
    }
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    var whereIn = this.whereInMethod(this.parent, this.localKey);
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
    var dictionary = this.buildDictionary(results);
    for (let model of models) {
      if (dictionary[key = this.getDictionaryKey(
        model.getAttribute(this.localKey))] !== undefined) {
        model.setRelation(relation, this.getRelationValue(dictionary, key, type));
      }
    }
    return models;
  }

  /*Get the value of a relationship by one or many type.*/
  protected getRelationValue(dictionary: any[], key: string, type: string) {
    var value = dictionary[key];
    return type === 'one' ? reset(value) : this.related.newCollection(value);
  }

  /*Build model dictionary keyed by the relation's foreign key.*/
  protected buildDictionary(results: Collection) {
    var foreign = this.getForeignKeyName();
    return results.mapToDictionary(result => {
      return {};
    }).all();
  }

  /*Find a model by its primary key or return a new instance of the related model.*/
  public findOrNew(id: any, columns: any[] = ['*']) {
    if (isBlank(instance = this.find(id, columns))) {
      var instance = this.related.newInstance();
      this.setForeignAttributesForCreate(instance);
    }
    return instance;
  }

  /*Get the first related model record matching the attributes or instantiate it.*/
  public firstOrNew(attributes: any[] = [], values: any[] = []) {
    if (isBlank(instance = this.where(attributes).first())) {
      var instance = this.related.newInstance([...attributes, ...values]);
      this.setForeignAttributesForCreate(instance);
    }
    return instance;
  }

  /*Get the first related record matching the attributes or create it.*/
  public firstOrCreate(attributes: any[] = [], values: any[] = []) {
    if (isBlank(instance = this.where(attributes).first())) {
      var instance = this.create([...attributes, ...values]);
    }
    return instance;
  }

  /*Create or update a related record matching the attributes, and fill it with values.*/
  public updateOrCreate(attributes: any[], values: any[] = []) {
    return tap(this.firstOrNew(attributes), instance => {
      instance.fill(values);
      instance.save();
    });
  }

  /*Attach a model instance to the parent model.*/
  public save(model: Model) {
    this.setForeignAttributesForCreate(model);
    return model.save() ? model : false;
  }

  /*Attach a collection of models to the parent instance.*/
  public saveMany(models: iterable) {
    for (let model of models) {
      this.save(model);
    }
    return models;
  }

  /*Create a new instance of the related model.*/
  public create(attributes: any[] = []) {
    return tap(this.related.newInstance(attributes), instance => {
      this.setForeignAttributesForCreate(instance);
      instance.save();
    });
  }

  /*Create a Collection of new instances of the related model.*/
  public createMany(records: iterable) {
    var instances = this.related.newCollection();
    for (let record of records) {
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
    if (query.getQuery().from == parentQuery.getQuery().from) {
      return this.getRelationExistenceQueryForSelfRelation(query, parentQuery, columns);
    }
    return super.getRelationExistenceQuery(query, parentQuery, columns);
  }

  /*Add the constraints for a relationship query on the same table.*/
  public getRelationExistenceQueryForSelfRelation(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                                  columns: any[] | any = ['*']) {
    query.from(query.getModel().getTable() + ' as ' + (hash = this.getRelationCountHash()));
    query.getModel().setTable(hash);
    return query.select(columns).whereColumn(this.getQualifiedParentKeyName(), '=',
      hash + '.' + this.getForeignKeyName());
  }

  /*Get the key for comparing against the parent key in "has" query.*/
  public getExistenceCompareKey() {
    return this.getQualifiedForeignKeyName();
  }

  /*Get the key value of the parent's local key.*/
  public getParentKey() {
    return this.parent.getAttribute(this.localKey);
  }

  /*Get the fully qualified parent key name.*/
  public getQualifiedParentKeyName() {
    return this.parent.qualifyColumn(this.localKey);
  }

  /*Get the plain foreign key.*/
  public getForeignKeyName() {
    var segments = this.getQualifiedForeignKeyName().split('.');
    return end(segments);
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
