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

export class BelongsTo extends Relation {
  /*The foreign key of the parent model.*/
  protected foreignKey: string;
  /*The associated key on the parent model.*/
  protected otherKey: string;
  /*The name of the relationship.*/
  protected relation: string;
  /*The count of self joins.*/
  protected static selfJoinCount: number = 0;

  /*Create a new belongs to relationship instance.*/
  public constructor(query: Builder, parent: Model, foreignKey: string, otherKey: string,
                     relation: string) {
    this.otherKey   = otherKey;
    this.relation   = relation;
    this.foreignKey = foreignKey;
    super(query, parent);
  }

  /*Get the results of the relationship.*/
  public getResults() {
    return this.query.first();
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    if (BelongsTo.constraints) {
      let table = this.related.getTable();
      this.query.where(table + '.' + this.otherKey, '=', this.parent[this.foreignKey]);
    }
  }

  /*Add the constraints for a relationship query.*/
  public getRelationQuery(query: Builder, parent: Builder, columns: any[] | any = ['*']) {
    if (parent.getQuery().from == query.getQuery().from) {
      return this.getRelationQueryForSelfRelation(query, parent, columns);
    }
    query.select(columns);
    let otherKey = this.wrap(query.getModel().getTable() + '.' + this.otherKey);
    return query.where(this.getQualifiedForeignKey(), '=', new Expression(otherKey));
  }

  /*Add the constraints for a relationship query on the same table.*/
  public getRelationQueryForSelfRelation(query: Builder, parent: Builder,
                                         columns: any[] | any = ['*']) {
    query.select(columns);
    query.from(query.getModel().getTable() + ' as ' + (hash = this.getRelationCountHash()));
    query.getModel().setTable(hash);
    let key = this.wrap(this.getQualifiedForeignKey());
    return query.where(hash + '.' + query.getModel().getKeyName(), '=', new Expression(key));
  }

  /*Get a relationship join table hash.*/
  public getRelationCountHash() {
    return 'laravel_reserved_' + BelongsTo.selfJoinCount++;
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    let key = this.related.getTable() + '.' + this.otherKey;
    this.query.whereIn(key, this.getEagerModelKeys(models));
  }

  /*Gather the keys from an array of related models.*/
  protected getEagerModelKeys(models: any[]) {
    let keys = [];
    for (let model of models) {
      if (!isBlank(value = model[this.foreignKey])) {
        keys.push(value);
      }
    }
    if (count(keys) === 0) {
      return [this.related.getIncrementing() && this.related.getKeyType() === 'int' ? 0 : null];
    }
    return array_values(array_unique(keys));
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
    let foreign    = this.foreignKey;
    let other      = this.otherKey;
    let dictionary = [];
    for (let result of results) {
      dictionary[result.getAttribute(other)] = result;
    }
    for (let model of models) {
      if (dictionary[model.foreign] !== undefined) {
        model.setRelation(relation, dictionary[model.foreign]);
      }
    }
    return models;
  }

  /*Associate the model instance to the given parent.*/
  public associate(model: Model | number) {
    let otherKey = model instanceof Model ? model.getAttribute(this.otherKey) : model;
    this.parent.setAttribute(this.foreignKey, otherKey);
    if (model instanceof Model) {
      this.parent.setRelation(this.relation, model);
    }
    return this.parent;
  }

  /*Dissociate previously associated model from the given parent.*/
  public dissociate() {
    this.parent.setAttribute(this.foreignKey, null);
    return this.parent.setRelation(this.relation, null);
  }

  /*Update the parent model on the relationship.*/
  public update(attributes: any[]) {
    let instance = this.getResults();
    return instance.fill(attributes).save();
  }

  /*Get the foreign key of the relationship.*/
  public getForeignKey() {
    return this.foreignKey;
  }

  /*Get the fully qualified foreign key of the relationship.*/
  public getQualifiedForeignKey() {
    return this.parent.getTable() + '.' + this.foreignKey;
  }

  /*Get the associated key of the relationship.*/
  public getOtherKey() {
    return this.otherKey;
  }

  /*Get the name of the relationship.*/
  public getRelation() {
    return this.relation;
  }

  /*Get the fully qualified associated key of the relationship.*/
  public getQualifiedOtherKeyName() {
    return this.related.getTable() + '.' + this.otherKey;
  }
}
