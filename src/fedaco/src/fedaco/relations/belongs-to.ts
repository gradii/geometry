/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { uniq } from 'ramda';
import { Collection } from '../../define/collection';
import { BaseModel } from '../base-model';
import { FedacoBuilder } from '../fedaco-builder';
import { Model } from '../model';
import { mixinComparesRelatedModels } from './concerns/compares-related-models';
import { mixinInteractsWithDictionary } from './concerns/interacts-with-dictionary';
import { mixinSupportsDefaultModels } from './concerns/supports-default-models';
import { Relation } from './relation';

export interface BelongsTo extends Relation {
}

export class BelongsTo extends mixinComparesRelatedModels<any>(
  mixinInteractsWithDictionary(
    mixinSupportsDefaultModels(
      Relation
    )
  )
) {
  /*The child model instance of the relation.*/
  protected child: Model;
  /*The foreign key of the parent model.*/
  protected _foreignKey: string;
  /*The associated key on the parent model.*/
  protected ownerKey: string;
  /*The name of the relationship.*/
  protected relationName: string;

  /*Create a new belongs to relationship instance.*/
  public constructor(query: FedacoBuilder,
                     child: Model,
                     foreignKey: string,
                     ownerKey: string,
                     relationName: string) {
    super(query, child);
    this.ownerKey     = ownerKey;
    this.relationName = relationName;
    this._foreignKey  = foreignKey;
    this.child        = child;
    this.addConstraints();
  }

  /*Get the results of the relationship.*/
  public getResults() {
    if (isBlank(this.child.getAttribute(this._foreignKey))) {
      return this._getDefaultFor(this._parent);
    }
    return this._query.first() || this._getDefaultFor(this._parent);
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    if ((this.constructor as typeof BelongsTo).constraints) {
      const table = this._related.getTable();
      this._query.where(
        `${table}.${this.ownerKey}`,
        '=',
        this.child[this._foreignKey]);
    }
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(this: Model & this, models: any[]) {
    const key     = `${this.related.getTable()}.${this.ownerKey}`;
    const whereIn = this.whereInMethod(this.related, this.ownerKey);
    this._query[whereIn](key, this.getEagerModelKeys(models));
  }

  /*Gather the keys from an array of related models.*/
  protected getEagerModelKeys(models: any[]) {
    const keys = [];
    for (const model of models) {
      const value = model[this._foreignKey];
      if (!isBlank(value)) {
        keys.push(value);
      }
    }
    keys.sort();
    return uniq(keys);
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    for (const model of models) {
      model.setRelation(relation, this.getDefaultFor(model));
    }
    return models;
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    const foreign    = this._foreignKey;
    const owner      = this.ownerKey;
    const dictionary = [];
    for (const result of results) {
      const attribute       = this._getDictionaryKey(result.getAttribute(owner));
      dictionary[attribute] = result;
    }
    for (const model of models) {
      const attribute = this._getDictionaryKey(model[foreign]);
      if (dictionary[attribute] !== undefined) {
        model.setRelation(relation, dictionary[attribute]);
      }
    }
    return models;
  }

  /*Associate the model instance to the given parent.*/
  public associate(model: Model | number | string) {
    const ownerKey = model instanceof BaseModel ?
      model.getAttribute(this.ownerKey) : model;
    this.child.setAttribute(this._foreignKey, ownerKey);
    if (model instanceof BaseModel) {
      this.child.setRelation(this.relationName, model);
    } else {
      this.child.unsetRelation(this.relationName);
    }
    return this.child;
  }

  /*Dissociate previously associated model from the given parent.*/
  public dissociate() {
    this.child.setAttribute(this._foreignKey, null);
    return this.child.setRelation(this.relationName, null);
  }

  /*Alias of "dissociate" method.*/
  public disassociate() {
    return this.dissociate();
  }

  /*Add the constraints for a relationship query.*/
  public getRelationExistenceQuery(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                   columns: any[] | any = ['*']) {
    // todo check
    if (parentQuery.getModel().getTable() == query.getModel().getTable()) {
      return this.getRelationExistenceQueryForSelfRelation(query, parentQuery, columns);
    }
    return query.select(columns).whereColumn(
      this.getQualifiedForeignKeyName(), '=', query.qualifyColumn(this.ownerKey)
    );
  }

  /*Add the constraints for a relationship query on the same table.*/
  public getRelationExistenceQueryForSelfRelation(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                                  columns: any[] | any = ['*']) {
    const hash = this.getRelationCountHash();
    query.select(columns).from(query.getModel().getTable() + ' as ' + hash);
    query.getModel().setTable(hash);
    return query.whereColumn(`${hash}.${this.ownerKey}`, '=', this.getQualifiedForeignKeyName());
  }

  /*Determine if the related model has an auto-incrementing ID.*/
  protected relationHasIncrementingId() {
    return this.related.getIncrementing() && ['int', 'integer'].includes(this.related.getKeyType());
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
    return this._foreignKey;
  }

  /*Get the fully qualified foreign key of the relationship.*/
  public getQualifiedForeignKeyName() {
    return this.child.qualifyColumn(this._foreignKey);
  }

  /*Get the key value of the child's foreign key.*/
  public getParentKey() {
    return this.child[this._foreignKey];
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
