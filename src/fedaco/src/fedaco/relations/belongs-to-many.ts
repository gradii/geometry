/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isArray, isBlank, isObject } from '@gradii/check-type';
import { uniq } from 'ramda';
import { Collection } from '../../define/collection';
import { FedacoBuilder } from '../fedaco-builder';
import { Model } from '../model';
import { mixinInteractsWithDictionary } from './concerns/interacts-with-dictionary';
import { mixinInteractsWithPivotTable } from './concerns/interacts-with-pivot-table';
// import { Builder } from 'Illuminate/Database/Eloquent/Builder';
// import { Collection } from 'Illuminate/Database/Eloquent/Collection';
// import { Model } from 'Illuminate/Database/Eloquent/Model';
// import { ModelNotFoundException } from 'Illuminate/Database/Eloquent/ModelNotFoundException';
// import { Collection, Collection as BaseCollection } from 'Illuminate/Support/Collection';
// import { Str } from 'Illuminate/Support/Str';
import { Relation } from './relation';

export class BelongsToMany extends mixinInteractsWithDictionary(
  mixinInteractsWithPivotTable(
    Relation
  )
) {
  /*The intermediate table for the relation.*/
  protected table: string;
  /*The foreign key of the parent model.*/
  protected foreignPivotKey: string;
  /*The associated key of the relation.*/
  protected relatedPivotKey: string;
  /*The key name of the parent model.*/
  protected parentKey: string;
  /*The key name of the related model.*/
  protected relatedKey: string;
  /*The "name" of the relationship.*/
  protected relationName: string;
  /*The pivot table columns to retrieve.*/
  /*protected*/
  _pivotColumns: any[] = [];
  /*Any pivot table restrictions for where clauses.*/
  protected pivotWheres: any[] = [];
  /*Any pivot table restrictions for whereIn clauses.*/
  protected pivotWhereIns: any[] = [];
  /*Any pivot table restrictions for whereNull clauses.*/
  protected pivotWhereNulls: any[] = [];
  /*The default values for the pivot columns.*/
  protected pivotValues: any[] = [];
  /*Indicates if timestamps are available on the pivot table.*/
  public _withTimestamps: boolean = false;
  /*The custom pivot table column for the created_at timestamp.*/
  protected pivotCreatedAt: string;
  /*The custom pivot table column for the updated_at timestamp.*/
  protected pivotUpdatedAt: string;
  /*The class name of the custom pivot model to use for the relationship.*/
  protected _using: string;
  /*The name of the accessor to use for the "pivot" relationship.*/
  protected accessor: string = 'pivot';

  /*Create a new belongs to many relationship instance.*/
  public constructor(query: FedacoBuilder,
                     parent: Model,
                     table: string,
                     foreignPivotKey: string,
                     relatedPivotKey: string,
                     parentKey: string,
                     relatedKey: string,
                     relationName: string | null = null) {
    super(query, parent);
    this.parentKey       = parentKey;
    this.relatedKey      = relatedKey;
    this.relationName    = relationName;
    this.relatedPivotKey = relatedPivotKey;
    this.foreignPivotKey = foreignPivotKey;
    this.table           = table;
  }

  /*Attempt to resolve the intermediate table name from the given string.*/
  // protected resolveTableName(table: string) {
  //   if (!Str.contains(table, '\\') || !class_exists(table)) {
  //     return table;
  //   }
  //   let model = new table();
  //   if (!model instanceof Model) {
  //     return table;
  //   }
  //   if (in_array(AsPivot, class_uses_recursive(model))) {
  //     this.using(table);
  //   }
  //   return model.getTable();
  // }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    this.performJoin();
    if (BelongsToMany.constraints) {
      this.addWhereConstraints();
    }
  }

  /*Set the join clause for the relation query.*/
  protected performJoin(query: FedacoBuilder | null = null) {
    query = query || this._query;
    query.join(this.table, this.getQualifiedRelatedKeyName(), '=',
      this.getQualifiedRelatedPivotKeyName());
    return this;
  }

  /*Set the where clause for the relation query.*/
  protected addWhereConstraints() {
    this._query.where(
      this.getQualifiedForeignPivotKeyName(),
      '=',
      this._parent[this.parentKey]
    );
    return this;
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    let whereIn = this.whereInMethod(this._parent, this.parentKey);
    this._query[whereIn](this.getQualifiedForeignPivotKeyName(),
      this.getKeys(models, this.parentKey));
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
    let dictionary = this.buildDictionary(results);
    for (let model of models) {
      let key = this.getDictionaryKey(model[this.parentKey]);
      if (dictionary[key] !== undefined) {
        model.setRelation(relation, this._related.newCollection(dictionary[key]));
      }
    }
    return models;
  }

  /*Build model dictionary keyed by the relation's foreign key.*/
  protected buildDictionary(results: Collection) {
    let dictionary = {};
    for (let result of results) {
      let value = this.getDictionaryKey(result[this.accessor][this.foreignPivotKey]);
      dictionary[value].push(result);
    }
    return dictionary;
  }

  // /*Get the class being used for pivot models.*/
  // public getPivotClass() {
  //   return this._using ?? Pivot;
  // }

  /*Specify the custom pivot model to use for the relationship.*/
  // public using(clazz: string) {
  //   this._using = clazz;
  //   return this;
  // }

  /*Specify the custom pivot accessor to use for the relationship.*/
  public as(accessor: string) {
    this.accessor = accessor;
    return this;
  }

  /*Set a where clause for a pivot table column.*/
  public wherePivot(column: string,
                    operator: any       = null,
                    value: any          = null,
                    conjunction: string = 'and') {
    this.pivotWheres.push(arguments);
    return this.getQuery().where(this.qualifyPivotColumn(column), operator, value, conjunction);
  }

  /*Set a "where between" clause for a pivot table column.*/
  public wherePivotBetween(column: string, values: any[],
                           conjunction: string = 'and',
                           not: boolean        = false) {
    return this.getQuery().whereBetween(this.qualifyPivotColumn(column), values, conjunction, not);
  }

  /*Set a "or where between" clause for a pivot table column.*/
  public orWherePivotBetween(column: string, values: any[]) {
    return this.wherePivotBetween(column, values, 'or');
  }

  /*Set a "where pivot not between" clause for a pivot table column.*/
  public wherePivotNotBetween(column: string, values: any[], conjunction: string = 'and') {
    return this.wherePivotBetween(column, values, conjunction, true);
  }

  /*Set a "or where not between" clause for a pivot table column.*/
  public orWherePivotNotBetween(column: string, values: any[]) {
    return this.wherePivotBetween(column, values, 'or', true);
  }

  /*Set a "where in" clause for a pivot table column.*/
  public wherePivotIn(column: string, values: any, conjunction: string = 'and',
                      not: boolean                                     = false) {
    this.pivotWhereIns.push(arguments);
    return this.whereIn(this.qualifyPivotColumn(column), values, conjunction, not);
  }

  /*Set an "or where" clause for a pivot table column.*/
  public orWherePivot(column: string, operator: any = null, value: any = null) {
    return this.wherePivot(column, operator, value, 'or');
  }

  /*Set a where clause for a pivot table column.

  In addition, new pivot records will receive this value.*/
  public withPivotValue(column: string | any[] | object, value: any = null) {
    if (isObject(column)) {
      for (let [name, val] of Object.entries(column)) {
        this.withPivotValue(name, val);
      }
      return this;
    }
    if (isBlank(value)) {
      throw new Error('InvalidArgumentException The provided value may not be null.');
    }
    this.pivotValues.push([column, value]);
    return this.wherePivot(column, '=', value);
  }

  /*Set an "or where in" clause for a pivot table column.*/
  public orWherePivotIn(column: string, values: any) {
    return this.wherePivotIn(column, values, 'or');
  }

  /*Set a "where not in" clause for a pivot table column.*/
  public wherePivotNotIn(column: string, values: any, conjunction: string = 'and') {
    return this.wherePivotIn(column, values, conjunction, true);
  }

  /*Set an "or where not in" clause for a pivot table column.*/
  public orWherePivotNotIn(column: string, values: any) {
    return this.wherePivotNotIn(column, values, 'or');
  }

  /*Set a "where null" clause for a pivot table column.*/
  public wherePivotNull(column: string, conjunction: string = 'and', not: boolean = false) {
    this.pivotWhereNulls.push(arguments);
    return this.whereNull(this.qualifyPivotColumn(column), conjunction, not);
  }

  /*Set a "where not null" clause for a pivot table column.*/
  public wherePivotNotNull(column: string, conjunction: string = 'and') {
    return this.wherePivotNull(column, conjunction, true);
  }

  /*Set a "or where null" clause for a pivot table column.*/
  public orWherePivotNull(column: string, not: boolean = false) {
    return this.wherePivotNull(column, 'or', not);
  }

  /*Set a "or where not null" clause for a pivot table column.*/
  public orWherePivotNotNull(column: string) {
    return this.orWherePivotNull(column, true);
  }

  /*Add an "order by" clause for a pivot table column.*/
  public orderByPivot(column: string, direction: string = 'asc') {
    return this.orderBy(this.qualifyPivotColumn(column), direction);
  }

  /*Find a related model by its primary key or return a new instance of the related model.*/
  public findOrNew(id: any, columns: any[] = ['*']) {
    let instance = this.find(id, columns);
    if (isBlank(instance)) {
      instance = this._related.newInstance();
    }
    return instance;
  }

  /*Get the first related model record matching the attributes or instantiate it.*/
  public firstOrNew(attributes: any = {}, values: any[] = []) {
    let instance = this._related.newQuery().where(attributes).first();
    if (isBlank(instance)) {
      instance = this._related.newInstance([...attributes, ...values]);
    }
    return instance;
  }

  /*Get the first related record matching the attributes or create it.*/
  public firstOrCreate(attributes: any[] = [],
                       values: any[]     = [],
                       joining: any[]    = [],
                       touch: boolean    = true) {
    let instance = this._related.newQuery().where(attributes).first();
    if (isBlank(instance)) {
      instance = this.create([...attributes, ...values], joining, touch);
    }
    return instance;
  }

  /*Create or update a related record matching the attributes, and fill it with values.*/
  public updateOrCreate(attributes: any[],
                        values: any[]  = [],
                        joining: any[] = [],
                        touch: boolean = true) {
    const instance = this._related.newQuery().where(attributes).first() as Model;
    if (isBlank(instance)) {
      return this.create([...attributes, ...values], joining, touch);
    }
    instance.fill(values);
    instance.save({
      'touch': false
    });
    return instance;
  }

  /*Find a related model by its primary key.*/
  public find(id: any, columns: any[] = ['*']) {
    if (!(id instanceof Model && (isArray(id) /*|| id instanceof Arrayable*/))) {
      return this.findMany(id, columns);
    }
    return this.where(this.getRelated().getQualifiedKeyName(), '=', this.parseId(id)).first(
      columns);
  }

  /*Find multiple related models by their primary keys.*/
  public findMany(ids: any[], columns: any[] = ['*']) {
    if (!ids.length) {
      return this.getRelated().newCollection();
    }
    return this.whereIn(this.getRelated().getQualifiedKeyName(), this.parseIds(ids)).get(columns);
  }

  /*Find a related model by its primary key or throw an exception.*/
  public findOrFail(id: any, columns: any[] = ['*']) {
    const result = this.find(id, columns);
    // var id     = id instanceof Arrayable ? id.toArray() : id;
    if (isArray(id)) {
      if (result.length === uniq(id).length) {
        return result;
      }
    } else if (!isBlank(result)) {
      return result;
    }
    throw new Error(`ModelNotFoundException().setModel(get_class(this._related), id);`);
  }

  /*Add a basic where clause to the query, and return the first result.*/
  public firstWhere(column: Function | string | any[],
                    operator: any             = null,
                    value: any                = null,
                    conjunction: 'and' | 'or' = 'and') {
    return this.where(column, operator, value, conjunction).first();
  }

  /*Execute the query and get the first result.*/
  public first(columns: any[] = ['*']) {
    const results = this.take(1).get(columns);
    return results.length > 0 ? results.first() : null;
  }

  /*Execute the query and get the first result or throw an exception.*/
  public firstOrFail(columns: any[] = ['*']) {
    const model = this.first(columns);
    if (!isBlank(model)) {
      return model;
    }
    throw new Error(`ModelNotFoundException().setModel(get_class(this._related))`);
  }

  /*Get the results of the relationship.*/
  public getResults() {
    return !isBlank(this._parent[this.parentKey]) ? this.get() : this._related.newCollection();
  }

  /*Execute the query as a "select" statement.*/
  public get(columns: any[] = ['*']) {
    // First we'll add the proper select columns onto the query so it is run with
    // the proper columns. Then, we will get the results and hydrate our pivot
    // models with the result of those columns as a separate model relation.
    let builder = this._query.applyScopes();
    columns     = builder.getQuery()._columns.length ? [] : columns;
    let models  = builder.addSelect(this.shouldSelect(columns)).getModels();
    this.hydratePivotRelation(models);
    if (models.length > 0) {
      models = builder.eagerLoadRelations(models);
    }
    return this._related.newCollection(models);
  }

  /*Get the select columns for the relation query.*/
  protected shouldSelect(columns: any[] = ['*']) {
    if (columns == ['*']) {
      columns = [`${this._related.getTable()}.*`];
    }
    return [...columns, ...this.aliasedPivotColumns()];
  }

  /*Get the pivot columns for the relation.

  "pivot_" is prefixed ot each column for easy removal later.*/
  protected aliasedPivotColumns() {
    let defaults = [this.foreignPivotKey, this.relatedPivotKey];
    return uniq([...defaults, ...this._pivotColumns].map(column => {
      return this.qualifyPivotColumn(column) + ' as pivot_' + column;
    }));
  }

  // /*Get a paginator for the "select" statement.*/
  // public paginate(perPage: number | null = null, columns: any[] = ['*'], pageName: string = 'page',
  //                 page: number | null                                                     = null) {
  //   this._query.addSelect(this.shouldSelect(columns));
  //   return tap(paginator => {
  //     this.hydratePivotRelation(paginator.items());
  //   }, this._query.paginate(perPage, columns, pageName, page));
  // }
  //
  // /*Paginate the given query into a simple paginator.*/
  // public simplePaginate(perPage: number | null                         = null, columns: any[]  = ['*'],
  //                       pageName: string = 'page', page: number | null = null) {
  //   this._query.addSelect(this.shouldSelect(columns));
  //   return tap(this._query.simplePaginate(perPage, columns, pageName, page), paginator => {
  //     this.hydratePivotRelation(paginator.items());
  //   });
  // }

  // /*Paginate the given query into a cursor paginator.*/
  // public cursorPaginate(perPage: number | null                               = null, columns: any[] = ['*'],
  //                       cursorName: string = 'cursor', cursor: string | null = null) {
  //   this._query.addSelect(this.shouldSelect(columns));
  //   return tap(this._query.cursorPaginate(perPage, columns, cursorName, cursor), paginator => {
  //     this.hydratePivotRelation(paginator.items());
  //   });
  // }

  // /*Chunk the results of the query.*/
  // public chunk(count: number, callback: Function) {
  //   return this.prepareQueryBuilder()
  //     .chunk(count, (results, page) => {
  //       this.hydratePivotRelation(results.all());
  //       return callback(results, page);
  //     });
  // }
  //
  // /*Chunk the results of a query by comparing numeric IDs.*/
  // public chunkById(count: number,
  //                  callback: Function,
  //                  column: string | null = null,
  //                  alias: string | null  = null) {
  //   this.prepareQueryBuilder();
  //   column = column ?? this.getRelated().qualifyColumn(this.getRelatedKeyName());
  //   alias  = alias ?? this.getRelatedKeyName();
  //   return this._query.chunkById(count, results => {
  //     this.hydratePivotRelation(results.all());
  //     return callback(results);
  //   }, column, alias);
  // }

  // /*Execute a callback over each item while chunking.*/
  // public each(callback: Function, count: number = 1000) {
  //   return this._query.chunk(count, results => {
  //     for (let [key, value] of Object.entries(results)) {
  //       if (callback(value, key) === false) {
  //         return false;
  //       }
  //     }
  //   });
  // }

  // /*Query lazily, by chunks of the given size.*/
  // public lazy(chunkSize: number = 1000) {
  //   return this.prepareQueryBuilder().lazy(chunkSize).map(model => {
  //     this.hydratePivotRelation([model]);
  //     return model;
  //   });
  // }
  //
  // /*Query lazily, by chunking the results of a query by comparing IDs.*/
  // public lazyById(chunkSize             = 1000,
  //                 column: string | null = null,
  //                 alias: string | null  = null) {
  //   column = column ?? this.getRelated().qualifyColumn(this.getRelatedKeyName());
  //   alias  = alias ?? this.getRelatedKeyName();
  //   return this.prepareQueryBuilder().lazyById(chunkSize, column, alias).map(model => {
  //     this.hydratePivotRelation([model]);
  //     return model;
  //   });
  // }

  // /*Get a lazy collection for the given query.*/
  // public cursor() {
  //   return this.prepareQueryBuilder().cursor().map(model => {
  //     this.hydratePivotRelation([model]);
  //     return model;
  //   });
  // }

  /*Prepare the query builder for query execution.*/
  protected prepareQueryBuilder() {
    return this._query.addSelect(this.shouldSelect());
  }

  /*Hydrate the pivot table relationship on the models.*/
  protected hydratePivotRelation(models: any[]) {
    for (let model of models) {
      model.setRelation(this.accessor, this.newExistingPivot(this.migratePivotAttributes(model)));
    }
  }

  /*Get the pivot attributes from a model.*/
  protected migratePivotAttributes(model: Model) {
    let values: any = {};
    for (let [key, value] of Object.entries(model.getAttributes())) {
      if (key.startsWith('pivot_')) {
        values[key.substr(6)] = value;
        delete model.key;
      }
    }
    return values;
  }

  /*If we're touching the parent model, touch.*/
  public touchIfTouching() {
    if (this.touchingParent()) {
      this.getParent().touch();
    }
    if (this.getParent().touches(this.relationName)) {
      this.touch();
    }
  }

  /*Determine if we should touch the parent on sync.*/
  protected touchingParent() {
    return this.getRelated().touches(this.guessInverseRelation());
  }

  /*Attempt to guess the name of the inverse of the relation.*/
  protected guessInverseRelation() {
    return Str.camel(Str.pluralStudly(class_basename(this.getParent())));
  }

  /*Touch all of the related models for the relationship.

  E.g.: Touch all roles associated with this user.*/
  public touch() {
    let key     = this.getRelated().getKeyName();
    let columns = {};
    const ids   = this.allRelatedIds();
    if (ids.length > 0) {
      this.getRelated().newQueryWithoutRelationships().whereIn(key, ids).update(columns);
    }
  }

  /*Get all of the IDs for the related models.*/
  public allRelatedIds() {
    return this.newPivotQuery().pluck(this.relatedPivotKey);
  }

  /*Save a new model and attach it to the parent model.*/
  public save(model: Model, pivotAttributes: any[] = [], touch: boolean = true) {
    model.save({
      'touch': false
    });
    this.attach(model, pivotAttributes, touch);
    return model;
  }

  /*Save an array of new models and attach them to the parent model.*/
  public saveMany(models: Collection | any[], pivotAttributes: any[] = []) {
    for (let [key, model] of Object.entries(models)) {
      this.save(model, /*cast type array*/ pivotAttributes[key] ?? [], false);
    }
    this.touchIfTouching();
    return models;
  }

  /*Create a new instance of the related model.*/
  public create(attributes: any[] = [], joining: any[] = [], touch: boolean = true) {
    const instance = this._related.newInstance(attributes);
    instance.save({
      'touch': false
    });
    this.attach(instance, joining, touch);
    return instance;
  }

  /*Create an array of new instances of the related models.*/
  public createMany(records: any[], joinings: any[] = []) {
    let instances = [];
    for (let [key, record] of Object.entries(records)) {
      instances.push(this.create(record, /*cast type array*/ joinings[key] ?? [], false));
    }
    this.touchIfTouching();
    return instances;
  }

  /*Add the constraints for a relationship query.*/
  public getRelationExistenceQuery(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                   columns: any[] | any = ['*']) {
    if (parentQuery.getQuery().from == query.getQuery().from) {
      return this.getRelationExistenceQueryForSelfJoin(query, parentQuery, columns);
    }
    this.performJoin(query);
    return super.getRelationExistenceQuery(query, parentQuery, columns);
  }

  /*Add the constraints for a relationship query on the same table.*/
  public getRelationExistenceQueryForSelfJoin(query: FedacoBuilder,
                                              parentQuery: FedacoBuilder,
                                              columns: any[] | any = ['*']) {
    query.select(columns);
    const hash = this.getRelationCountHash();
    query.from(`${this._related.getTable()} as ${hash}`);
    this._related.setTable(hash);
    this.performJoin(query);
    return super.getRelationExistenceQuery(query, parentQuery, columns);
  }

  /*Get the key for comparing against the parent key in "has" query.*/
  public getExistenceCompareKey() {
    return this.getQualifiedForeignPivotKeyName();
  }

  /*Specify that the pivot table has creation and update timestamps.*/
  public withTimestamps(createdAt: any = null, updatedAt: any = null) {
    this._withTimestamps = true;
    this.pivotCreatedAt  = createdAt;
    this.pivotUpdatedAt  = updatedAt;
    return this.withPivot(this.createdAt(), this.updatedAt());
  }

  /*Get the name of the "created at" column.*/
  public createdAt() {
    return this.pivotCreatedAt || this._parent.getCreatedAtColumn();
  }

  /*Get the name of the "updated at" column.*/
  public updatedAt() {
    return this.pivotUpdatedAt || this._parent.getUpdatedAtColumn();
  }

  /*Get the foreign key for the relation.*/
  public getForeignPivotKeyName() {
    return this.foreignPivotKey;
  }

  /*Get the fully qualified foreign key for the relation.*/
  public getQualifiedForeignPivotKeyName() {
    return this.qualifyPivotColumn(this.foreignPivotKey);
  }

  /*Get the "related key" for the relation.*/
  public getRelatedPivotKeyName() {
    return this.relatedPivotKey;
  }

  /*Get the fully qualified "related key" for the relation.*/
  public getQualifiedRelatedPivotKeyName() {
    return this.qualifyPivotColumn(this.relatedPivotKey);
  }

  /*Get the parent key for the relationship.*/
  public getParentKeyName() {
    return this.parentKey;
  }

  /*Get the fully qualified parent key name for the relation.*/
  public getQualifiedParentKeyName() {
    return this._parent.qualifyColumn(this.parentKey);
  }

  /*Get the related key for the relationship.*/
  public getRelatedKeyName() {
    return this.relatedKey;
  }

  /*Get the fully qualified related key name for the relation.*/
  public getQualifiedRelatedKeyName() {
    return this._related.qualifyColumn(this.relatedKey);
  }

  /*Get the intermediate table for the relationship.*/
  public getTable() {
    return this.table;
  }

  /*Get the relationship name for the relationship.*/
  public getRelationName() {
    return this.relationName;
  }

  /*Get the name of the pivot accessor for this relationship.*/
  public getPivotAccessor() {
    return this.accessor;
  }

  /*Get the pivot columns for this relationship.*/
  public getPivotColumns() {
    return this._pivotColumns;
  }

  /*Qualify the given column name by the pivot table.*/
  public qualifyPivotColumn(column: string) {
    return column.includes('.') ? column : `${this.table}.${column}`;
  }
}
