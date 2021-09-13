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
import {
  InteractsWithDictionary, mixinInteractsWithDictionary
} from './concerns/interacts-with-dictionary';
import { Relation } from './relation';

export interface HasManyThrough extends InteractsWithDictionary, Relation {
  /*Set the base constraints on the relation query.*/
  addConstraints();

  /*Set the join clause on the query.*/
  _performJoin(query?: FedacoBuilder | null);

  /*Get the fully qualified parent key name.*/
  getQualifiedParentKeyName();

  /*Determine whether "through" parent of the relation uses Soft Deletes.*/
  throughParentSoftDeletes();

  /*Indicate that trashed "through" parents should be included in the query.*/
  withTrashedParents();

  /*Set the constraints for an eager load of the relation.*/
  addEagerConstraints(models: any[]);

  /*Initialize the relation on a set of models.*/
  initRelation(models: any[], relation: string);

  /*Match the eagerly loaded results to their parents.*/
  match(this: Model & this, models: any[], results: Collection, relation: string);

  /*Build model dictionary keyed by the relation's foreign key.*/
  _buildDictionary(results: Collection): {
    [key: string]: any[];
  };

  /*Get the first related model record matching the attributes or instantiate it.*/
  firstOrNew(attributes: any[]): Promise<Model>;

  /*Create or update a related record matching the attributes, and fill it with values.*/
  updateOrCreate(attributes: any[], values?: any[]): Promise<Model>;

  /*Add a basic where clause to the query, and return the first result.*/
  firstWhere(column: Function | string | any[], operator?: any, value?: any,
             conjunction?: string): Promise<Model>;

  /*Execute the query and get the first related model.*/
  first(columns?: any[]): Promise<Model>;

  /*Execute the query and get the first result or throw an exception.*/
  firstOrFail(columns?: any[]): Promise<Model>;

  /*Find a related model by its primary key.*/
  find(id: any, columns?: any[]): Promise<Model | Model[]>;

  /*Find multiple related models by their primary keys.*/
  findMany(ids: any[], columns?: any[]): Promise<Model[]>;

  /*Find a related model by its primary key or throw an exception.*/
  findOrFail(id: any | any[], columns?: any[]): Promise<Model | Model[]>;

  /*Get the results of the relationship.*/
  getResults(): Promise<Model | Model[]>;

  /*Execute the query as a "select" statement.*/
  get(columns?: any[]): Promise<Model | Model[]>;

  // /*Get a paginator for the "select" statement.*/
  // paginate(perPage: number | null = null, columns: any[] = ['*'], pageName: string = 'page',
  //                 page: number                                                            = null) {
  //   this._query.addSelect(this.shouldSelect(columns));
  //   return this._query.paginate(perPage, columns, pageName, page);
  // }
  //
  // /*Paginate the given query into a simple paginator.*/
  // simplePaginate(perPage: number | null                         = null, columns: any[] = ['*'],
  //                       pageName: string = 'page', page: number | null = null) {
  //   this._query.addSelect(this.shouldSelect(columns));
  //   return this._query.simplePaginate(perPage, columns, pageName, page);
  // }
  /*Set the select clause for the relation query.*/
  _shouldSelect(columns?: any[]);

  // /*Chunk the results of the query.*/
  // chunk(count: number, callback: Function) {
  //   return this.prepareQueryBuilder().chunk(count, callback);
  // }
  //
  // /*Chunk the results of a query by comparing numeric IDs.*/
  // chunkById(count: number, callback: Function, column: string | null = null,
  //                  alias: string | null                                     = null) {
  //   column = column ?? this.getRelated().getQualifiedKeyName();
  //   alias  = alias ?? this.getRelated().getKeyName();
  //   return this.prepareQueryBuilder().chunkById(count, callback, column, alias);
  // }
  // /*Get a generator for the given query.*/
  // cursor() {
  //   return this.prepareQueryBuilder().cursor();
  // }
  // /*Execute a callback over each item while chunking.*/
  // each(callback: Function, count: number = 1000) {
  //   return this.chunk(count, results => {
  //     for (let [key, value] of Object.entries(results)) {
  //       if (callback(value, key) === false) {
  //         return false;
  //       }
  //     }
  //   });
  // }
  // /*Query lazily, by chunks of the given size.*/
  // lazy(chunkSize: number = 1000) {
  //   return this.prepareQueryBuilder().lazy(chunkSize);
  // }
  //
  // /*Query lazily, by chunking the results of a query by comparing IDs.*/
  // lazyById(chunkSize = 1000, column: string | null = null, alias: string | null = null) {
  //   column = column ?? this.getRelated().getQualifiedKeyName();
  //   alias  = alias ?? this.getRelated().getKeyName();
  //   return this.prepareQueryBuilder().lazyById(chunkSize, column, alias);
  // }
  /*Prepare the query builder for query execution.*/
  _prepareQueryBuilder(columns?: any[]): FedacoBuilder;

  /*Add the constraints for a relationship query.*/
  getRelationExistenceQuery(query: FedacoBuilder, parentQuery: FedacoBuilder,
                            columns?: any[] | any): FedacoBuilder;

  /*Add the constraints for a relationship query on the same table.*/
  getRelationExistenceQueryForSelfRelation(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                           columns?: any[] | any);

  /*Add the constraints for a relationship query on the same table as the through parent.*/
  getRelationExistenceQueryForThroughSelfRelation(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                                  columns?: any[] | any);

  /*Get the qualified foreign key on the related model.*/
  getQualifiedFarKeyName();

  /*Get the foreign key on the "through" model.*/
  getFirstKeyName();

  /*Get the qualified foreign key on the "through" model.*/
  getQualifiedFirstKeyName();

  /*Get the foreign key on the related model.*/
  getForeignKeyName();

  /*Get the qualified foreign key on the related model.*/
  getQualifiedForeignKeyName();

  /*Get the local key on the far parent model.*/
  getLocalKeyName();

  /*Get the qualified local key on the far parent model.*/
  getQualifiedLocalKeyName();

  /*Get the local key on the intermediary model.*/
  getSecondLocalKeyName();

}

export class HasManyThrough extends mixinInteractsWithDictionary(
  Relation
) {
  /*The "through" parent model instance.*/
  _throughParent: Model;
  /*The far parent model instance.*/
  _farParent: Model;
  /*The near key on the relationship.*/
  _firstKey: string;
  /*The far key on the relationship.*/
  _secondKey: string;
  /*The local key on the relationship.*/
  _localKey: string;
  /*The local key on the intermediary model.*/
  _secondLocalKey: string;

  /*Create a new has many through relationship instance.*/
  public constructor(query: FedacoBuilder,
                     farParent: Model,
                     throughParent: Model,
                     firstKey: string,
                     secondKey: string,
                     localKey: string,
                     secondLocalKey: string) {
    super(query, throughParent);
    this._localKey       = localKey;
    this._firstKey       = firstKey;
    this._secondKey      = secondKey;
    this._farParent      = farParent;
    this._throughParent  = throughParent;
    this._secondLocalKey = secondLocalKey;
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    // @ts-ignore
    let localValue = this._farParent[this._localKey];
    this._performJoin();
    if (HasManyThrough.constraints) {
      this._query.where(this.getQualifiedFirstKeyName(), '=', localValue);
    }
  }

  /*Set the join clause on the query.*/
  _performJoin(query: FedacoBuilder | null = null) {
    query      = query || this._query;
    let farKey = this.getQualifiedFarKeyName();
    query.join(this._throughParent.getTable(), this.getQualifiedParentKeyName(), '=', farKey);
    if (this.throughParentSoftDeletes()) {
      query.withGlobalScope('SoftDeletableHasManyThrough', (q: FedacoBuilder | null) => {
        // @ts-ignore
        q.whereNull(this._throughParent.getQualifiedDeletedAtColumn());
      });
    }
  }

  /*Get the fully qualified parent key name.*/
  public getQualifiedParentKeyName() {
    return this._parent.qualifyColumn(this._secondLocalKey);
  }

  /*Determine whether "through" parent of the relation uses Soft Deletes.*/
  public throughParentSoftDeletes() {
    // @ts-ignore
    return this._throughParent.isTypeofSoftDeletes;
    // return in_array(SoftDeletes, class_uses_recursive(this.throughParent));
  }

  /*Indicate that trashed "through" parents should be included in the query.*/
  public withTrashedParents() {
    this._query.withoutGlobalScope('SoftDeletableHasManyThrough');
    return this;
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    const whereIn = this.whereInMethod(this._farParent, this._localKey);
    this._query[whereIn](this.getQualifiedFirstKeyName(), this.getKeys(models, this._localKey));
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    for (let model of models) {
      model.setRelation(relation, this._related.newCollection());
    }
    return models;
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(this: Model & this, models: any[], results: Collection, relation: string) {
    const dictionary = this._buildDictionary(results);
    for (let model of models) {
      const key = this._getDictionaryKey(model.getAttribute(this._localKey));
      if (dictionary[key] !== undefined) {
        model.setRelation(relation, this._related.newCollection(dictionary[key]));
      }
    }
    return models;
  }

  /*Build model dictionary keyed by the relation's foreign key.*/
  _buildDictionary(results: Collection): { [key: string]: any[] } {
    const dictionary: any = {};
    for (let result of results) {
      if (!dictionary[result.laravel_through_key]) {
        dictionary[result.laravel_through_key] = [];
      }
      dictionary[result.laravel_through_key].push(result);
    }
    return dictionary;
  }

  /*Get the first related model record matching the attributes or instantiate it.*/
  public async firstOrNew(attributes: any[]): Promise<Model> {
    let instance = await this.where(attributes).first() as Model;
    if (isBlank(instance)) {
      instance = this._related.newInstance(attributes);
    }
    return instance;
  }

  /*Create or update a related record matching the attributes, and fill it with values.*/
  public async updateOrCreate(attributes: any[], values: any[] = []) {
    let instance = await this.firstOrNew(attributes) as Model;
    instance.fill(values).save();
    return instance;
  }

  /*Add a basic where clause to the query, and return the first result.*/
  public firstWhere(column: Function | string | any[],
                    operator: any       = null,
                    value: any          = null,
                    conjunction: string = 'and') {
    return this.where(column, operator, value, conjunction).first();
  }

  /*Execute the query and get the first related model.*/
  public async first(columns: any[] = ['*']): Promise<Model> {
    const results = await this.take(1).get(columns);
    return results.length > 0 ? (results as Model[])[0] : null;
  }

  /*Execute the query and get the first result or throw an exception.*/
  public async firstOrFail(columns: any[] = ['*']) {
    let model = await this.first(columns);
    if (!isBlank(model)) {
      return model;
    }
    throw new Error(`ModelNotFoundException().setModel(get_class(this._related))`);
  }

  /*Find a related model by its primary key.*/
  public async find(id: any, columns: any[] = ['*']): Promise<Model | Model[]> {
    if (isArray(id)) {
      return this.findMany(id, columns);
    }
    return await this
      .where(this.getRelated().getQualifiedKeyName(), '=', id)
      .first(columns) as Model;
  }

  /*Find multiple related models by their primary keys.*/
  public async findMany(ids: any[], columns: any[] = ['*']): Promise<Model[]> {
    // let ids = ids instanceof Arrayable ? ids.toArray() : ids;
    if (!ids.length) {
      return this.getRelated().newCollection();
    }
    return await this.whereIn(this.getRelated().getQualifiedKeyName(), ids).get(columns) as Model[];
  }

  /*Find a related model by its primary key or throw an exception.*/
  public async findOrFail(id: any | any[], columns: any[] = ['*']): Promise<Model | Model[]> {
    let result = await this.find(id, columns);
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
  public async getResults(): Promise<Model | Model[]> {
    // @ts-ignore
    return !isBlank(this._farParent[this._localKey]) ?
      await this.get() :
      this._related.newCollection();
  }

  /*Execute the query as a "select" statement.*/
  public async get(columns: any[] = ['*']): Promise<Model | Model[]> {
    const builder = this._prepareQueryBuilder(columns);
    let models    = await builder.getModels();
    if (models.length > 0) {
      models = await builder.eagerLoadRelations(models);
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
  _shouldSelect(columns: any[] = ['*']) {
    if (columns.includes('*')) {
      columns = [this._related.getTable() + '.*'];
    }
    return [...columns, ...[this.getQualifiedFirstKeyName() + ' as laravel_through_key']];
  }

  // /*Chunk the results of the query.*/
  // public chunk(count: number, callback: Function) {
  //   return this.prepareQueryBuilder().chunk(count, callback);
  // }
  //
  // /*Chunk the results of a query by comparing numeric IDs.*/
  // public chunkById(count: number, callback: Function, column: string | null = null,
  //                  alias: string | null                                     = null) {
  //   column = column ?? this.getRelated().getQualifiedKeyName();
  //   alias  = alias ?? this.getRelated().getKeyName();
  //   return this.prepareQueryBuilder().chunkById(count, callback, column, alias);
  // }

  // /*Get a generator for the given query.*/
  // public cursor() {
  //   return this.prepareQueryBuilder().cursor();
  // }

  // /*Execute a callback over each item while chunking.*/
  // public each(callback: Function, count: number = 1000) {
  //   return this.chunk(count, results => {
  //     for (let [key, value] of Object.entries(results)) {
  //       if (callback(value, key) === false) {
  //         return false;
  //       }
  //     }
  //   });
  // }

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
  _prepareQueryBuilder(columns: any[] = ['*']): FedacoBuilder {
    let builder = this._query.applyScopes();
    builder.addSelect(this._shouldSelect(builder.getQuery()._columns.length ? [] : columns));
    return builder;
  }

  /*Add the constraints for a relationship query.*/
  public getRelationExistenceQuery(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                   columns: any[] | any = ['*']): FedacoBuilder {
    // todo fixme
    if (parentQuery.getModel().getTable() === query.getModel().getTable()) {
      return this.getRelationExistenceQueryForSelfRelation(query, parentQuery, columns);
    }
    // todo fixme
    if (parentQuery.getModel().getTable() === this._throughParent.getTable()) {
      return this.getRelationExistenceQueryForThroughSelfRelation(query, parentQuery, columns);
    }
    this._performJoin(query);
    return query.select(columns).whereColumn(
      this.getQualifiedLocalKeyName(), '=',
      this.getQualifiedFirstKeyName()
    );
  }

  /*Add the constraints for a relationship query on the same table.*/
  public getRelationExistenceQueryForSelfRelation(query: FedacoBuilder,
                                                  parentQuery: FedacoBuilder,
                                                  columns: any[] | any = ['*']) {
    const hash = this.getRelationCountHash();
    query.from(`${query.getModel().getTable()} as ${hash}`);
    query.join(this._throughParent.getTable(), this.getQualifiedParentKeyName(), '=',
      hash + '.' + this._secondKey);
    if (this.throughParentSoftDeletes()) {
      query.whereNull(this._throughParent.getQualifiedDeletedAtColumn());
    }
    query.getModel().setTable(hash);
    return query.select(columns).whereColumn(
      parentQuery.getQuery().from + '.' + this._localKey, '=',
      this.getQualifiedFirstKeyName());
  }

  /*Add the constraints for a relationship query on the same table as the through parent.*/
  public getRelationExistenceQueryForThroughSelfRelation(query: FedacoBuilder,
                                                         parentQuery: FedacoBuilder,
                                                         columns: any[] | any = ['*']) {
    const hash = this.getRelationCountHash();
    let table  = `${this._throughParent.getTable()} as ${hash}`;
    query.join(table, `${hash}.${this._secondLocalKey}`, '=', this.getQualifiedFarKeyName());
    if (this.throughParentSoftDeletes()) {
      query.whereNull(`${hash}.${this._throughParent.getDeletedAtColumn()}`);
    }
    return query.select(columns).whereColumn(
      `${parentQuery.getQuery().from}.${this._localKey}`, '=',
      `${hash}.${this._firstKey}`);
  }

  /*Get the qualified foreign key on the related model.*/
  public getQualifiedFarKeyName() {
    return this.getQualifiedForeignKeyName();
  }

  /*Get the foreign key on the "through" model.*/
  public getFirstKeyName(): string {
    return this._firstKey;
  }

  /*Get the qualified foreign key on the "through" model.*/
  public getQualifiedFirstKeyName(): string {
    return this._throughParent.qualifyColumn(this._firstKey);
  }

  /*Get the foreign key on the related model.*/
  public getForeignKeyName(): string {
    return this._secondKey;
  }

  /*Get the qualified foreign key on the related model.*/
  public getQualifiedForeignKeyName(): string {
    return this._related.qualifyColumn(this._secondKey);
  }

  /*Get the local key on the far parent model.*/
  public getLocalKeyName(): string {
    return this._localKey;
  }

  /*Get the qualified local key on the far parent model.*/
  public getQualifiedLocalKeyName(): string {
    return this._farParent.qualifyColumn(this._localKey);
  }

  /*Get the local key on the intermediary model.*/
  public getSecondLocalKeyName(): string {
    return this._secondLocalKey;
  }
}
