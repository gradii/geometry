/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { FedacoBuilder } from '../fedaco-builder';
import { Model } from '../model';
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
  public constructor(query: FedacoBuilder, parent: Model, foreignKey: string, otherKey: string,
                     relation: string) {
    super(query, parent);
    this.otherKey   = otherKey;
    this.relation   = relation;
    this.foreignKey = foreignKey;
  }

  /*Get the results of the relationship.*/
  public getResults() {
    if (isBlank(this.child[this.foreignKey])) {
      return this.getDefaultFor(this.parent);
    }
    return this.query.first() || this.getDefaultFor(this.parent);
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    if (BelongsTo.constraints) {
      var table = this.related.getTable();
      this.query.where(table + '.' + this.ownerKey, '=', this.child[this.foreignKey]);
    }
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    var key     = this.related.getTable() + '.' + this.ownerKey;
    var whereIn = this.whereInMethod(this.related, this.ownerKey);
    this.query[whereIn](key, this.getEagerModelKeys(models));
  }

  /*Gather the keys from an array of related models.*/
  protected getEagerModelKeys(models: any[]) {
    var keys = [];
    for (let model of models) {
      if (!isBlank(value = model[this.foreignKey])) {
        keys.push(value);
      }
    }
    sort(keys);
    return array_values(array_unique(keys));
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
    var foreign    = this.foreignKey;
    var owner      = this.ownerKey;
    var dictionary = [];
    for (let result of results) {
      var attribute         = this.getDictionaryKey(result.getAttribute(owner));
      dictionary[attribute] = result;
    }
    for (let model of models) {
      var attribute = this.getDictionaryKey(model[foreign]);
      if (dictionary[attribute] !== undefined) {
        model.setRelation(relation, dictionary[attribute]);
      }
    }
    return models;
  }

  /*Associate the model instance to the given parent.*/
  public associate(model: Model | number | string) {
    var ownerKey = model instanceof Model ? model.getAttribute(this.ownerKey) : model;
    this.child.setAttribute(this.foreignKey, ownerKey);
    if (model instanceof Model) {
      this.child.setRelation(this.relationName, model);
    } else {
      this.child.unsetRelation(this.relationName);
    }
    return this.child;
  }

  /*Dissociate previously associated model from the given parent.*/
  public dissociate() {
    this.child.setAttribute(this.foreignKey, null);
    return this.child.setRelation(this.relationName, null);
  }

  /*Alias of "dissociate" method.*/
  public disassociate() {
    return this.dissociate();
  }

  /*Add the constraints for a relationship query.*/
  public getRelationExistenceQuery(query: Builder, parentQuery: Builder,
                                   columns: any[] | any = ['*']) {
    if (parentQuery.getQuery().from == query.getQuery().from) {
      return this.getRelationExistenceQueryForSelfRelation(query, parentQuery, columns);
    }
    return query.select(columns).whereColumn(this.getQualifiedForeignKeyName(), '=',
      query.qualifyColumn(this.ownerKey));
  }

  /*Add the constraints for a relationship query on the same table.*/
  public getRelationExistenceQueryForSelfRelation(query: Builder, parentQuery: Builder,
                                                  columns: any[] | any = ['*']) {
    query.select(columns).from(
      query.getModel().getTable() + ' as ' + (hash = this.getRelationCountHash()));
    query.getModel().setTable(hash);
    return query.whereColumn(hash + '.' + this.ownerKey, '=', this.getQualifiedForeignKeyName());
  }

  /*Determine if the related model has an auto-incrementing ID.*/
  protected relationHasIncrementingId() {
    return this.related.getIncrementing() && in_array(this.related.getKeyType(),
      ['int', 'integer']);
  }

  /*Make a new related instance for the given model.*/
  protected newRelatedInstanceFor(parent: Model) {
    return this.related.newInstance();
  }

  /*Get the child of the relationship.*/
  public getChild() {
    return this.child;
  }

  /*Get the foreign key of the relationship.*/
  public getForeignKeyName() {
    return this.foreignKey;
  }

  /*Get the fully qualified foreign key of the relationship.*/
  public getQualifiedForeignKeyName() {
    return this.child.qualifyColumn(this.foreignKey);
  }

  /*Get the key value of the child's foreign key.*/
  public getParentKey() {
    return this.child[this.foreignKey];
  }

  /*Get the associated key of the relationship.*/
  public getOwnerKeyName() {
    return this.ownerKey;
  }

  /*Get the fully qualified associated key of the relationship.*/
  public getQualifiedOwnerKeyName() {
    return this.related.qualifyColumn(this.ownerKey);
  }

  /*Get the value of the model's associated key.*/
  protected getRelatedKeyFrom(model: Model) {
    return model[this.ownerKey];
  }

  /*Get the name of the relationship.*/
  public getRelationName() {
    return this.relationName;
  }
}
