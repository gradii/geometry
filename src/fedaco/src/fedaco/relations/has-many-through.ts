/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isArray, isBlank } from '@gradii/check-type';
import { uniq } from 'ramda';
import { Collection } from '../../define/collection';
import { FedacoBuilder } from '../fedaco-builder';
import { Model } from '../model';
import { mixinInteractsWithDictionary } from './concerns/interacts-with-dictionary';
import { Relation } from './relation';

export class HasManyThrough extends mixinInteractsWithDictionary(
  Relation
) {
  /*The "through" parent model instance.*/
  protected throughParent: Model;
  /*The far parent model instance.*/
  protected farParent: Model;
  /*The near key on the relationship.*/
  protected firstKey: string;
  /*The far key on the relationship.*/
  protected secondKey: string;
  /*The local key on the relationship.*/
  protected localKey: string;
  /*The local key on the intermediary model.*/
  protected secondLocalKey: string;

  /*Create a new has many through relationship instance.*/
  public constructor(query: FedacoBuilder,
                     farParent: Model,
                     throughParent: Model,
                     firstKey: string,
                     secondKey: string,
                     localKey: string,
                     secondLocalKey: string) {
    super(query, throughParent);
    this.localKey       = localKey;
    this.firstKey       = firstKey;
    this.secondKey      = secondKey;
    this.farParent      = farParent;
    this.throughParent  = throughParent;
    this.secondLocalKey = secondLocalKey;
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    // @ts-ignore
    let localValue = this.farParent[this.localKey];
    this.performJoin();
    if (HasManyThrough.constraints) {
      this._query.where(this.getQualifiedFirstKeyName(), '=', localValue);
    }
  }

  /*Set the join clause on the query.*/
  protected performJoin(query: FedacoBuilder | null = null) {
    query      = query || this._query;
    let farKey = this.getQualifiedFarKeyName();
    query.join(this.throughParent.getTable(), this.getQualifiedParentKeyName(), '=', farKey);
    if (this.throughParentSoftDeletes()) {
      query.withGlobalScope('SoftDeletableHasManyThrough', (q: FedacoBuilder | null) => {
        // @ts-ignore
        q.whereNull(this.throughParent.getQualifiedDeletedAtColumn());
      });
    }
  }

  /*Get the fully qualified parent key name.*/
  public getQualifiedParentKeyName() {
    return this._parent.qualifyColumn(this.secondLocalKey);
  }

  /*Determine whether "through" parent of the relation uses Soft Deletes.*/
  public throughParentSoftDeletes() {
    // @ts-ignore
    return this.throughParent.isTypeofSoftDeletes;
    // return in_array(SoftDeletes, class_uses_recursive(this.throughParent));
  }

  /*Indicate that trashed "through" parents should be included in the query.*/
  public withTrashedParents() {
    this._query.withoutGlobalScope('SoftDeletableHasManyThrough');
    return this;
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    const whereIn = this.whereInMethod(this.farParent, this.localKey);
    this._query[whereIn](this.getQualifiedFirstKeyName(), this.getKeys(models, this.localKey));
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    for (let model of models) {
      model.setRelation(relation, this._related.newCollection());
    }
    return models;
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    const dictionary = this.buildDictionary(results);
    for (let model of models) {
      const key = this._getDictionaryKey(model.getAttribute(this.localKey));
      if (dictionary[key] !== undefined) {
        model.setRelation(relation, this._related.newCollection(dictionary[key]));
      }
    }
    return models;
  }

  /*Build model dictionary keyed by the relation's foreign key.*/
  protected buildDictionary(results: Collection) {
    const dictionary = {};
    for (let result of results) {
      if (!dictionary[result.laravel_through_key]) {
        dictionary[result.laravel_through_key] = [];
      }
      dictionary[result.laravel_through_key].push(result);
    }
    return dictionary;
  }

  /*Get the first related model record matching the attributes or instantiate it.*/
  public firstOrNew(attributes: any[]) {
    let instance = this.where(attributes).first();
    if (isBlank(instance)) {
      instance = this._related.newInstance(attributes);
    }
    return instance;
  }

  /*Create or update a related record matching the attributes, and fill it with values.*/
  public updateOrCreate(attributes: any[], values: any[] = []) {
    let instance = this.firstOrNew(attributes);
    instance.fill(values).save();
    return instance;
  }

  /*Add a basic where clause to the query, and return the first result.*/
  public firstWhere(column: Function | string | any[],
                    operator: any   = null,
                    value: any      = null,
                    conjunction: string = 'and') {
    return this.where(column, operator, value, conjunction).first();
  }

  /*Execute the query and get the first related model.*/
  public first(columns: any[] = ['*']) {
    const results = this.take(1).get(columns);
    return results.length > 0 ? results.first() : null;
  }

  /*Execute the query and get the first result or throw an exception.*/
  public firstOrFail(columns: any[] = ['*']) {
    let model = this.first(columns);
    if (!isBlank(model)) {
      return model;
    }
    throw new Error(`ModelNotFoundException().setModel(get_class(this._related))`);
  }

  /*Find a related model by its primary key.*/
  public find(id: any, columns: any[] = ['*']) {
    if (is_array(id) || id instanceof Arrayable) {
      return this.findMany(id, columns);
    }
    return this.where(this.getRelated().getQualifiedKeyName(), '=', id).first(columns);
  }

  /*Find multiple related models by their primary keys.*/
  public findMany(ids: any[], columns: any[] = ['*']) {
    // let ids = ids instanceof Arrayable ? ids.toArray() : ids;
    if (!ids.length) {
      return this.getRelated().newCollection();
    }
    return this.whereIn(this.getRelated().getQualifiedKeyName(), ids).get(columns);
  }

  /*Find a related model by its primary key or throw an exception.*/
  public findOrFail(id: any | any[], columns: any[] = ['*']) {
    let result = this.find(id, columns);
    // let id     = id instanceof Arrayable ? id.toArray() : id;
    if (isArray(id)) {
      if (result.length === uniq(id).length) {
        return result;
      }
    } else if (!isBlank(result)) {
      return result;
    }
    throw new Error(`ModelNotFoundException().setModel(get_class(this._related), id)`);
  }

  /*Get the results of the relationship.*/
  public getResults() {
    // @ts-ignore
    return !isBlank(this.farParent[this.localKey]) ? this.get() : this._related.newCollection();
  }

  /*Execute the query as a "select" statement.*/
  public get(columns: any[] = ['*']) {
    const builder = this.prepareQueryBuilder(columns);
    let models    = builder.getModels();
    if (models.length > 0) {
      models = builder.eagerLoadRelations(models);
    }
    return this._related.newCollection(models);
  }

  // /*Get a paginator for the "select" statement.*/
  // public paginate(perPage: number | null = null, columns: any[] = ['*'], pageName: string = 'page',
  //                 page: number                                                            = null) {
  //   this._query.addSelect(this.shouldSelect(columns));
  //   return this._query.paginate(perPage, columns, pageName, page);
  // }
  //
  // /*Paginate the given query into a simple paginator.*/
  // public simplePaginate(perPage: number | null                         = null, columns: any[] = ['*'],
  //                       pageName: string = 'page', page: number | null = null) {
  //   this._query.addSelect(this.shouldSelect(columns));
  //   return this._query.simplePaginate(perPage, columns, pageName, page);
  // }

  /*Set the select clause for the relation query.*/
  protected shouldSelect(columns: any[] = ['*']) {
    if (columns.includes('*')) {
      columns = [this._related.getTable() + '.*'];
    }
    return [...columns, ...[this.getQualifiedFirstKeyName() + ' as laravel_through_key']];
  }

  /*Chunk the results of the query.*/
  public chunk(count: number, callback: Function) {
    return this.prepareQueryBuilder().chunk(count, callback);
  }

  /*Chunk the results of a query by comparing numeric IDs.*/
  public chunkById(count: number, callback: Function, column: string | null = null,
                   alias: string | null                                     = null) {
    column = column ?? this.getRelated().getQualifiedKeyName();
    alias  = alias ?? this.getRelated().getKeyName();
    return this.prepareQueryBuilder().chunkById(count, callback, column, alias);
  }

  // /*Get a generator for the given query.*/
  // public cursor() {
  //   return this.prepareQueryBuilder().cursor();
  // }

  /*Execute a callback over each item while chunking.*/
  public each(callback: Function, count: number = 1000) {
    return this.chunk(count, results => {
      for (let [key, value] of Object.entries(results)) {
        if (callback(value, key) === false) {
          return false;
        }
      }
    });
  }

  // /*Query lazily, by chunks of the given size.*/
  // public lazy(chunkSize: number = 1000) {
  //   return this.prepareQueryBuilder().lazy(chunkSize);
  // }
  //
  // /*Query lazily, by chunking the results of a query by comparing IDs.*/
  // public lazyById(chunkSize = 1000, column: string | null = null, alias: string | null = null) {
  //   column = column ?? this.getRelated().getQualifiedKeyName();
  //   alias  = alias ?? this.getRelated().getKeyName();
  //   return this.prepareQueryBuilder().lazyById(chunkSize, column, alias);
  // }

  /*Prepare the query builder for query execution.*/
  protected prepareQueryBuilder(columns: any[] = ['*']) {
    let builder = this._query.applyScopes();
    return builder.addSelect(this.shouldSelect(builder.getQuery()._columns.length ? [] : columns));
  }

  /*Add the constraints for a relationship query.*/
  public getRelationExistenceQuery(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                   columns: any[] | any = ['*']) {
    if (parentQuery.getQuery()._from === query.getQuery()._from) {
      return this.getRelationExistenceQueryForSelfRelation(query, parentQuery, columns);
    }
    if (parentQuery.getQuery()._from === this.throughParent.getTable()) {
      return this.getRelationExistenceQueryForThroughSelfRelation(query, parentQuery, columns);
    }
    this.performJoin(query);
    return query.select(columns).whereColumn(
      this.getQualifiedLocalKeyName(), '=',
      this.getQualifiedFirstKeyName()
    );
  }

  /*Add the constraints for a relationship query on the same table.*/
  public getRelationExistenceQueryForSelfRelation(this: Model & this,
                                                  query: FedacoBuilder,
                                                  parentQuery: FedacoBuilder,
                                                  columns: any[] | any = ['*']) {
    const hash = this.getRelationCountHash();
    query.from(`${query.getModel().getTable()} as ${hash}`);
    query.join(this.throughParent.getTable(), this.getQualifiedParentKeyName(), '=',
      hash + '.' + this.secondKey);
    if (this.throughParentSoftDeletes()) {
      query.whereNull(this.throughParent.getQualifiedDeletedAtColumn());
    }
    query.getModel().setTable(hash);
    return query.select(columns).whereColumn(parentQuery.getQuery().from + '.' + this.localKey, '=',
      this.getQualifiedFirstKeyName());
  }

  /*Add the constraints for a relationship query on the same table as the through parent.*/
  public getRelationExistenceQueryForThroughSelfRelation(query: FedacoBuilder,
                                                         parentQuery: FedacoBuilder,
                                                         columns: any[] | any = ['*']) {
    const hash = this.getRelationCountHash();
    let table  = `${this.throughParent.getTable()} as ${hash}`;
    query.join(table, `${hash}.${this.secondLocalKey}`, '=', this.getQualifiedFarKeyName());
    if (this.throughParentSoftDeletes()) {
      query.whereNull(`${hash}.${this.throughParent.getDeletedAtColumn()}`);
    }
    return query.select(columns).whereColumn(
      `${parentQuery.getQuery().from}.${this.localKey}`, '=',
      `${hash}.${this.firstKey}`);
  }

  /*Get the qualified foreign key on the related model.*/
  public getQualifiedFarKeyName() {
    return this.getQualifiedForeignKeyName();
  }

  /*Get the foreign key on the "through" model.*/
  public getFirstKeyName() {
    return this.firstKey;
  }

  /*Get the qualified foreign key on the "through" model.*/
  public getQualifiedFirstKeyName() {
    return this.throughParent.qualifyColumn(this.firstKey);
  }

  /*Get the foreign key on the related model.*/
  public getForeignKeyName() {
    return this.secondKey;
  }

  /*Get the qualified foreign key on the related model.*/
  public getQualifiedForeignKeyName() {
    return this._related.qualifyColumn(this.secondKey);
  }

  /*Get the local key on the far parent model.*/
  public getLocalKeyName() {
    return this.localKey;
  }

  /*Get the qualified local key on the far parent model.*/
  public getQualifiedLocalKeyName() {
    return this.farParent.qualifyColumn(this.localKey);
  }

  /*Get the local key on the intermediary model.*/
  public getSecondLocalKeyName() {
    return this.secondLocalKey;
  }
}
