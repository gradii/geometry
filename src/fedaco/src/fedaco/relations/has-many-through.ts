/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Builder } from 'Illuminate/Database/Eloquent/Builder';
import { ModelNotFoundException } from 'Illuminate/Database/Eloquent/ModelNotFoundException';
import { SoftDeletes } from 'Illuminate/Database/Eloquent/SoftDeletes';
import { Expression } from 'Illuminate/Database/Query/Expression';
import { Collection } from '../../define/collection';
import { Model } from '../model';
import { Relation } from './relation';

export class HasManyThrough extends Relation {
  /*The distance parent model instance.*/
  protected farParent: Model;
  /*The near key on the relationship.*/
  protected firstKey: string;
  /*The far key on the relationship.*/
  protected secondKey: string;
  /*The local key on the relationship.*/
  protected localKey: string;

  /*Create a new has many through relationship instance.*/
  public constructor(query: Builder, farParent: Model, parent: Model, firstKey: string,
                     secondKey: string, localKey: string) {
    this.localKey  = localKey;
    this.firstKey  = firstKey;
    this.secondKey = secondKey;
    this.farParent = farParent;
    super(query, parent);
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    let parentTable = this.parent.getTable();
    let localValue  = this.farParent[this.localKey];
    this.setJoin();
    if (HasManyThrough.constraints) {
      this.query.where(parentTable + '.' + this.firstKey, '=', localValue);
    }
  }

  /*Add the constraints for a relationship query.*/
  public getRelationQuery(query: Builder, parent: Builder, columns: any[] | any = ['*']) {
    let parentTable = this.parent.getTable();
    this.setJoin(query);
    query.select(columns);
    let key = this.wrap(parentTable + '.' + this.firstKey);
    return query.where(this.getHasCompareKey(), '=', new Expression(key));
  }

  /*Set the join clause on the query.*/
  protected setJoin(query: Builder | null = null) {
    let query      = query || this.query;
    let foreignKey = this.related.getTable() + '.' + this.secondKey;
    query.join(this.parent.getTable(), this.getQualifiedParentKeyName(), '=', foreignKey);
    if (this.parentSoftDeletes()) {
      query.whereNull(this.parent.getQualifiedDeletedAtColumn());
    }
  }

  /*Determine whether close parent of the relation uses Soft Deletes.*/
  public parentSoftDeletes() {
    return in_array(SoftDeletes, class_uses_recursive(get_class(this.parent)));
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    let table = this.parent.getTable();
    this.query.whereIn(table + '.' + this.firstKey, this.getKeys(models, this.localKey));
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    for (let model of models) {
      model.setRelation(relation, this.related.newCollection());
    }
    return models;
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    let dictionary = this.buildDictionary(results);
    for (let model of models) {
      let key = model.getKey();
      if (dictionary[key] !== undefined) {
        let value = this.related.newCollection(dictionary[key]);
        model.setRelation(relation, value);
      }
    }
    return models;
  }

  /*Build model dictionary keyed by the relation's foreign key.*/
  protected buildDictionary(results: Collection) {
    let dictionary = [];
    let foreign    = this.firstKey;
    for (let result of results) {
      dictionary[result[foreign]].push(result);
    }
    return dictionary;
  }

  /*Get the results of the relationship.*/
  public getResults() {
    return this.get();
  }

  /*Execute the query and get the first related model.*/
  public first(columns: any[] = ['*']) {
    let results = this.take(1).get(columns);
    return count(results) > 0 ? results.first() : null;
  }

  /*Execute the query and get the first result or throw an exception.*/
  public firstOrFail(columns: any[] = ['*']) {
    if (!isBlank(model = this.first(columns))) {
      return model;
    }
    throw new ModelNotFoundException().setModel(get_class(this.parent));
  }

  /*Find a related model by its primary key.*/
  public find(id: any, columns: any[] = ['*']) {
    if (is_array(id)) {
      return this.findMany(id, columns);
    }
    this.where(this.getRelated().getQualifiedKeyName(), '=', id);
    return this.first(columns);
  }

  /*Find multiple related models by their primary keys.*/
  public findMany(ids: any, columns: any[] = ['*']) {
    if (empty(ids)) {
      return this.getRelated().newCollection();
    }
    this.whereIn(this.getRelated().getQualifiedKeyName(), ids);
    return this.get(columns);
  }

  /*Find a related model by its primary key or throw an exception.*/
  public findOrFail(id: any, columns: any[] = ['*']) {
    let result = this.find(id, columns);
    if (is_array(id)) {
      if (count(result) == count(array_unique(id))) {
        return result;
      }
    } else if (!isBlank(result)) {
      return result;
    }
    throw new ModelNotFoundException().setModel(get_class(this.parent));
  }

  /*Get the first related model record matching the attributes or instantiate it.*/
  public firstOrNew(attributes: any[]) {
    if (isBlank(instance = this.where(attributes).first())) {
      let instance = this.related.newInstance(attributes);
    }
    return instance;
  }

  /*Create or update a related record matching the attributes, and fill it with values.*/
  public updateOrCreate(attributes: any[], values: any[] = []) {
    let instance = this.firstOrNew(attributes);
    instance.fill(values).save();
    return instance;
  }

  /*Execute the query as a "select" statement.*/
  public get(columns: any[] = ['*']) {
    let columns = this.query.getQuery().columns ? [] : columns;
    let select  = this.getSelectColumns(columns);
    let builder = this.query.applyScopes();
    let models  = builder.addSelect(select).getModels();
    if (count(models) > 0) {
      let models = builder.eagerLoadRelations(models);
    }
    return this.related.newCollection(models);
  }

  /*Set the select clause for the relation query.*/
  protected getSelectColumns(columns: any[] = ['*']) {
    if (columns == ['*']) {
      let columns = [this.related.getTable() + '.*'];
    }
    return [...columns, ...[this.parent.getTable() + '.' + this.firstKey]];
  }

  /*Get a paginator for the "select" statement.*/
  public paginate(perPage: number = null, columns: any[] = ['*'], pageName: string = 'page',
                  page: number                                                     = null) {
    this.query.addSelect(this.getSelectColumns(columns));
    return this.query.paginate(perPage, columns, pageName, page);
  }

  /*Paginate the given query into a simple paginator.*/
  public simplePaginate(perPage: number                                = null, columns: any[]         = ['*'],
                        pageName: string = 'page', page: number | null = null) {
    this.query.addSelect(this.getSelectColumns(columns));
    return this.query.simplePaginate(perPage, columns, pageName, page);
  }

  /*Get the key for comparing against the parent key in "has" query.*/
  public getHasCompareKey() {
    return this.farParent.getQualifiedKeyName();
  }

  /*Get the qualified foreign key on the related model.*/
  public getForeignKey() {
    return this.related.getTable() + '.' + this.secondKey;
  }

  /*Get the qualified foreign key on the "through" model.*/
  public getThroughKey() {
    return this.parent.getTable() + '.' + this.firstKey;
  }
}
