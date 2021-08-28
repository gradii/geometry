/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { ModelNotFoundException } from 'Illuminate/Database/Eloquent/ModelNotFoundException';
import { Collection } from '../../define/collection';
import { FedacoBuilder } from '../fedaco-builder';
import { SoftDeletes } from '../mixins/soft-deletes';
import { Model } from '../model';
import { Relation } from './relation';

export class HasManyThrough extends Relation {
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
  public constructor(query: FedacoBuilder, farParent: Model, throughParent: Model, firstKey: string,
                     secondKey: string, localKey: string, secondLocalKey: string) {
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
    var localValue = this.farParent[this.localKey];
    this.performJoin();
    if (HasManyThrough.constraints) {
      this.query.where(this.getQualifiedFirstKeyName(), '=', localValue);
    }
  }

  /*Set the join clause on the query.*/
  protected performJoin(query: FedacoBuilder | null = null) {
    var query  = query || this.query;
    var farKey = this.getQualifiedFarKeyName();
    query.join(this.throughParent.getTable(), this.getQualifiedParentKeyName(), '=', farKey);
    if (this.throughParentSoftDeletes()) {
      query.withGlobalScope('SoftDeletableHasManyThrough', (query: FedacoBuilder | null) => {
        query.whereNull(this.throughParent.getQualifiedDeletedAtColumn());
      });
    }
  }

  /*Get the fully qualified parent key name.*/
  public getQualifiedParentKeyName() {
    return this.parent.qualifyColumn(this.secondLocalKey);
  }

  /*Determine whether "through" parent of the relation uses Soft Deletes.*/
  public throughParentSoftDeletes() {
    return in_array(SoftDeletes, class_uses_recursive(this.throughParent));
  }

  /*Indicate that trashed "through" parents should be included in the query.*/
  public withTrashedParents() {
    this.query.withoutGlobalScope('SoftDeletableHasManyThrough');
    return this;
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    var whereIn = this.whereInMethod(this.farParent, this.localKey);
    this.query[whereIn](this.getQualifiedFirstKeyName(), this.getKeys(models, this.localKey));
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
    var dictionary = this.buildDictionary(results);
    for (let model of models) {
      if (dictionary[key = this.getDictionaryKey(
        model.getAttribute(this.localKey))] !== undefined) {
        model.setRelation(relation, this.related.newCollection(dictionary[key]));
      }
    }
    return models;
  }

  /*Build model dictionary keyed by the relation's foreign key.*/
  protected buildDictionary(results: Collection) {
    var dictionary = [];
    for (let result of results) {
      dictionary[result.laravel_through_key].push(result);
    }
    return dictionary;
  }

  /*Get the first related model record matching the attributes or instantiate it.*/
  public firstOrNew(attributes: any[]) {
    if (isBlank(instance = this.where(attributes).first())) {
      var instance = this.related.newInstance(attributes);
    }
    return instance;
  }

  /*Create or update a related record matching the attributes, and fill it with values.*/
  public updateOrCreate(attributes: any[], values: any[] = []) {
    var instance = this.firstOrNew(attributes);
    instance.fill(values).save();
    return instance;
  }

  /*Add a basic where clause to the query, and return the first result.*/
  public firstWhere(column: Function | string | any[], operator: any = null, value: any = null,
                    boolean: string = 'and') {
    return this.where(column, operator, value, boolean).first();
  }

  /*Execute the query and get the first related model.*/
  public first(columns: any[] = ['*']) {
    var results = this.take(1).get(columns);
    return count(results) > 0 ? results.first() : null;
  }

  /*Execute the query and get the first result or throw an exception.*/
  public firstOrFail(columns: any[] = ['*']) {
    if (!isBlank(model = this.first(columns))) {
      return model;
    }
    throw new ModelNotFoundException().setModel(get_class(this.related));
  }

  /*Find a related model by its primary key.*/
  public find(id: any, columns: any[] = ['*']) {
    if (is_array(id) || id instanceof Arrayable) {
      return this.findMany(id, columns);
    }
    return this.where(this.getRelated().getQualifiedKeyName(), '=', id).first(columns);
  }

  /*Find multiple related models by their primary keys.*/
  public findMany(ids: Arrayable | any[], columns: any[] = ['*']) {
    var ids = ids instanceof Arrayable ? ids.toArray() : ids;
    if (empty(ids)) {
      return this.getRelated().newCollection();
    }
    return this.whereIn(this.getRelated().getQualifiedKeyName(), ids).get(columns);
  }

  /*Find a related model by its primary key or throw an exception.*/
  public findOrFail(id: any, columns: any[] = ['*']) {
    var result = this.find(id, columns);
    var id     = id instanceof Arrayable ? id.toArray() : id;
    if (is_array(id)) {
      if (count(result) === count(array_unique(id))) {
        return result;
      }
    } else if (!isBlank(result)) {
      return result;
    }
    throw new ModelNotFoundException().setModel(get_class(this.related), id);
  }

  /*Get the results of the relationship.*/
  public getResults() {
    return !isBlank(this.farParent[this.localKey]) ? this.get() : this.related.newCollection();
  }

  /*Execute the query as a "select" statement.*/
  public get(columns: any[] = ['*']) {
    var builder = this.prepareQueryBuilder(columns);
    var models  = builder.getModels();
    if (count(models) > 0) {
      var models = builder.eagerLoadRelations(models);
    }
    return this.related.newCollection(models);
  }

  /*Get a paginator for the "select" statement.*/
  public paginate(perPage: number | null = null, columns: any[] = ['*'], pageName: string = 'page',
                  page: number = null) {
    this.query.addSelect(this.shouldSelect(columns));
    return this.query.paginate(perPage, columns, pageName, page);
  }

  /*Paginate the given query into a simple paginator.*/
  public simplePaginate(perPage: number | null = null, columns: any[] = ['*'],
                        pageName: string = 'page', page: number | null = null) {
    this.query.addSelect(this.shouldSelect(columns));
    return this.query.simplePaginate(perPage, columns, pageName, page);
  }

  /*Set the select clause for the relation query.*/
  protected shouldSelect(columns: any[] = ['*']) {
    if (columns == ['*']) {
      var columns = [this.related.getTable() + '.*'];
    }
    return [...columns, ...[this.getQualifiedFirstKeyName() + ' as laravel_through_key']];
  }

  /*Chunk the results of the query.*/
  public chunk(count: number, callback: callable) {
    return this.prepareQueryBuilder().chunk(count, callback);
  }

  /*Chunk the results of a query by comparing numeric IDs.*/
  public chunkById(count: number, callback: callable, column: string | null = null,
                   alias: string | null = null) {
    var column = column ?? this.getRelated().getQualifiedKeyName();
    var alias  = alias ?? this.getRelated().getKeyName();
    return this.prepareQueryBuilder().chunkById(count, callback, column, alias);
  }

  /*Get a generator for the given query.*/
  public cursor() {
    return this.prepareQueryBuilder().cursor();
  }

  /*Execute a callback over each item while chunking.*/
  public each(callback: callable, count: number = 1000) {
    return this.chunk(count, results => {
      for (let [key, value] of Object.entries(results)) {
        if (callback(value, key) === false) {
          return false;
        }
      }
    });
  }

  /*Query lazily, by chunks of the given size.*/
  public lazy(chunkSize: number = 1000) {
    return this.prepareQueryBuilder().lazy(chunkSize);
  }

  /*Query lazily, by chunking the results of a query by comparing IDs.*/
  public lazyById(chunkSize = 1000, column: string | null = null, alias: string | null = null) {
    var column = column ?? this.getRelated().getQualifiedKeyName();
    var alias  = alias ?? this.getRelated().getKeyName();
    return this.prepareQueryBuilder().lazyById(chunkSize, column, alias);
  }

  /*Prepare the query builder for query execution.*/
  protected prepareQueryBuilder(columns: any[] = ['*']) {
    var builder = this.query.applyScopes();
    return builder.addSelect(this.shouldSelect(builder.getQuery().columns ? [] : columns));
  }

  /*Add the constraints for a relationship query.*/
  public getRelationExistenceQuery(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                   columns: any[] | any = ['*']) {
    if (parentQuery.getQuery().from === query.getQuery().from) {
      return this.getRelationExistenceQueryForSelfRelation(query, parentQuery, columns);
    }
    if (parentQuery.getQuery().from === this.throughParent.getTable()) {
      return this.getRelationExistenceQueryForThroughSelfRelation(query, parentQuery, columns);
    }
    this.performJoin(query);
    return query.select(columns).whereColumn(this.getQualifiedLocalKeyName(), '=',
      this.getQualifiedFirstKeyName());
  }

  /*Add the constraints for a relationship query on the same table.*/
  public getRelationExistenceQueryForSelfRelation(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                                  columns: any[] | any = ['*']) {
    query.from(query.getModel().getTable() + ' as ' + (hash = this.getRelationCountHash()));
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
    var table = this.throughParent.getTable() + ' as ' + (hash = this.getRelationCountHash());
    query.join(table, hash + '.' + this.secondLocalKey, '=', this.getQualifiedFarKeyName());
    if (this.throughParentSoftDeletes()) {
      query.whereNull(hash + '.' + this.throughParent.getDeletedAtColumn());
    }
    return query.select(columns).whereColumn(parentQuery.getQuery().from + '.' + this.localKey, '=',
      hash + '.' + this.firstKey);
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
    return this.related.qualifyColumn(this.secondKey);
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
