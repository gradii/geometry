/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Builder } from 'Illuminate/Database/Eloquent/Builder';
import { Collection } from 'Illuminate/Database/Eloquent/Collection';
import { Model } from 'Illuminate/Database/Eloquent/Model';
import { Expression } from 'Illuminate/Database/Query/Expression';
import { Relation } from './relation';

export class HasOneOrMany extends Relation {
  /*The foreign key of the parent model.*/
  protected foreignKey: string;
  /*The local key of the parent model.*/
  protected localKey: string;
  /*The count of self joins.*/
  protected static selfJoinCount: number = 0;

  /*Create a new has one or many relationship instance.*/
  public constructor(query: Builder, parent: Model, foreignKey: string, localKey: string) {
    this.localKey   = localKey;
    this.foreignKey = foreignKey;
    super(query, parent);
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    if (HasOneOrMany.constraints) {
      this.query.where(this.foreignKey, '=', this.getParentKey());
      this.query.whereNotNull(this.foreignKey);
    }
  }

  /*Add the constraints for a relationship query.*/
  public getRelationQuery(query: Builder, parent: Builder, columns: any[] | any = ['*']) {
    if (parent.getQuery().from == query.getQuery().from) {
      return this.getRelationQueryForSelfRelation(query, parent, columns);
    }
    return super.getRelationQuery(query, parent, columns);
  }

  /*Add the constraints for a relationship query on the same table.*/
  public getRelationQueryForSelfRelation(query: Builder, parent: Builder,
                                         columns: any[] | any = ['*']) {
    query.select(columns);
    query.from(query.getModel().getTable() + ' as ' + (hash = this.getRelationCountHash()));
    query.getModel().setTable(hash);
    let key = this.wrap(this.getQualifiedParentKeyName());
    return query.where(hash + '.' + this.getPlainForeignKey(), '=', new Expression(key));
  }

  /*Get a relationship join table hash.*/
  public getRelationCountHash() {
    return 'laravel_reserved_' + HasOneOrMany.selfJoinCount++;
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    this.query.whereIn(this.foreignKey, this.getKeys(models, this.localKey));
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
    let dictionary = this.buildDictionary(results);
    for (let model of models) {
      let key = model.getAttribute(this.localKey);
      if (dictionary[key] !== undefined) {
        let value = this.getRelationValue(dictionary, key, type);
        model.setRelation(relation, value);
      }
    }
    return models;
  }

  /*Get the value of a relationship by one or many type.*/
  protected getRelationValue(dictionary: any[], key: string, type: string) {
    let value = dictionary[key];
    return type == 'one' ? reset(value) : this.related.newCollection(value);
  }

  /*Build model dictionary keyed by the relation's foreign key.*/
  protected buildDictionary(results: Collection) {
    let dictionary = [];
    let foreign    = this.getPlainForeignKey();
    for (let result of results) {
      dictionary[result[foreign]].push(result);
    }
    return dictionary;
  }

  /*Attach a model instance to the parent model.*/
  public save(model: Model) {
    model.setAttribute(this.getPlainForeignKey(), this.getParentKey());
    return model.save() ? model : false;
  }

  /*Attach a collection of models to the parent instance.*/
  public saveMany(models: Traversable | any[]) {
    for (let model of models) {
      this.save(model);
    }
    return models;
  }

  /*Find a model by its primary key or return new instance of the related model.*/
  public findOrNew(id: any, columns: any[] = ['*']) {
    if (isBlank(instance = this.find(id, columns))) {
      let instance = this.related.newInstance();
      instance.setAttribute(this.getPlainForeignKey(), this.getParentKey());
    }
    return instance;
  }

  /*Get the first related model record matching the attributes or instantiate it.*/
  public firstOrNew(attributes: any[]) {
    if (isBlank(instance = this.where(attributes).first())) {
      let instance = this.related.newInstance(attributes);
      instance.setAttribute(this.getPlainForeignKey(), this.getParentKey());
    }
    return instance;
  }

  /*Get the first related record matching the attributes or create it.*/
  public firstOrCreate(attributes: any[]) {
    if (isBlank(instance = this.where(attributes).first())) {
      let instance = this.create(attributes);
    }
    return instance;
  }

  /*Create or update a related record matching the attributes, and fill it with values.*/
  public updateOrCreate(attributes: any[], values: any[] = []) {
    let instance = this.firstOrNew(attributes);
    instance.fill(values);
    instance.save();
    return instance;
  }

  /*Create a new instance of the related model.*/
  public create(attributes: any[]) {
    let instance = this.related.newInstance(attributes);
    instance.setAttribute(this.getPlainForeignKey(), this.getParentKey());
    instance.save();
    return instance;
  }

  /*Create an array of new instances of the related model.*/
  public createMany(records: any[]) {
    let instances = [];
    for (let record of records) {
      instances.push(this.create(record));
    }
    return instances;
  }

  /*Perform an update on all the related models.*/
  public update(attributes: any[]) {
    if (this.related.usesTimestamps()) {
      attributes[this.relatedUpdatedAt()] = this.related.freshTimestampString();
    }
    return this.query.update(attributes);
  }

  /*Get the key for comparing against the parent key in "has" query.*/
  public getHasCompareKey() {
    return this.getForeignKey();
  }

  /*Get the foreign key for the relationship.*/
  public getForeignKey() {
    return this.foreignKey;
  }

  /*Get the plain foreign key.*/
  public getPlainForeignKey() {
    let segments = this.getForeignKey().split('.');
    return segments[count(segments) - 1];
  }

  /*Get the key value of the parent's local key.*/
  public getParentKey() {
    return this.parent.getAttribute(this.localKey);
  }

  /*Get the fully qualified parent key name.*/
  public getQualifiedParentKeyName() {
    return this.parent.getTable() + '.' + this.localKey;
  }
}
