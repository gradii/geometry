/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isArray, isBlank, isObject } from '@gradii/check-type';
import { last, uniq } from 'ramda';
import { Collection } from '../../define/collection';
import { raw } from '../../query-builder/ast-factory';
import { FedacoBuilder } from '../fedaco-builder';
// import { Builder } from 'Illuminate/Database/Eloquent/Builder';
// import { Collection } from 'Illuminate/Database/Eloquent/Collection';
// import { Model } from 'Illuminate/Database/Eloquent/Model';
// import { Expression } from 'Illuminate/Database/Query/Expression';
// import { Arr } from 'Illuminate/Support/Arr';
import { mixinForwardCallToQueryBuilder } from '../mixins/forward-call-to-query-builder';
import { Model } from '../model';

export class Relation extends mixinForwardCallToQueryBuilder(class {
}) {
  /*The Eloquent query builder instance.*/
  _query: FedacoBuilder;
  /*The parent model instance.*/
  _parent: Model;
  /*The related model instance.*/
  _related: Model;
  /*Indicates if the relation is adding constraints.*/
  protected static constraints: boolean = true;
  /*An array to map class names to their morph names in the database.*/
  public static _morphMap: any[] = [];
  /*The count of self joins.*/
  protected static selfJoinCount: number = 0;

  /*Create a new relation instance.*/
  public constructor(query: FedacoBuilder, parent: Model) {
    super();
    this._query   = query;
    this._parent  = parent;
    this._related = query.getModel();
    this.addConstraints();
  }

  /*Run a callback with constraints disabled on the relation.*/
  public static noConstraints(callback: Function) {
    let previous         = Relation.constraints;
    Relation.constraints = false;
    try {
      return callback();
    } finally {
      Relation.constraints = previous;
    }
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    throw new Error('not implemented');
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    throw new Error('not implemented');
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    throw new Error('not implemented');
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    throw new Error('not implemented');
  }

  /*Get the results of the relationship.*/
  public getResults() {
    throw new Error('not implemented');
  }

  /*Get the relationship for eager loading.*/
  public getEager() {
    return this.get();
  }

  /*Execute the query and get the first result if it's the sole matching record.*/
  public sole(columns: any[] | string = ['*']) {
    let result = this.take(2).get(columns);
    if (!result.length) {
      throw new Error(`ModelNotFoundException().setModel(get_class(this._related))`);
    }
    if (result.length > 1) {
      throw new Error(`MultipleRecordsFoundException()`);
    }
    return result.pop();
  }

  /*Execute the query as a "select" statement.*/
  public get(columns: any[] = ['*']) {
    return this._query.get(columns);
  }

  /*Touch all of the related models for the relationship.*/
  public touch() {
    let model = this.getRelated();
    // if (!model.isIgnoringTouch()) {
    this.rawUpdate({
      [model.getUpdatedAtColumn()]: model.freshTimestampString()
    });
    // }
  }

  /*Run a raw update against the base query.*/
  public rawUpdate(attributes: any) {
    return this._query.withoutGlobalScopes().update(attributes);
  }

  /*Add the constraints for a relationship count query.*/
  public getRelationExistenceCountQuery(query: FedacoBuilder, parentQuery: FedacoBuilder) {
    return this.getRelationExistenceQuery(query, parentQuery,
      raw('count(*)')).setBindings([], 'select');
  }

  /*Add the constraints for an internal relationship existence query.

  Essentially, these queries compare on column names like whereColumn.*/
  public getRelationExistenceQuery(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                   columns: any[] | any = ['*']) {
    return query.select(columns)
      .whereColumn(
        this.getQualifiedParentKeyName(),
        '=',
        this.getExistenceCompareKey()
      );
  }

  /*Get a relationship join table hash.*/
  public getRelationCountHash(incrementJoinCount: boolean = true) {
    return 'laravel_reserved_' + (incrementJoinCount ? Relation.selfJoinCount++ : Relation.selfJoinCount);
  }

  /*Get all of the primary keys for an array of models.*/
  protected getKeys(models: any[], key: string | null = null) {
    return uniq(models.map(value => {
      return key ? value.getAttribute(key) : value.getKey();
    })).sort();
  }

  /*Get the query builder that will contain the relationship constraints.*/
  protected getRelationQuery() {
    return this._query;
  }

  /*Get the underlying query for the relation.*/
  public getQuery() {
    return this._query;
  }

  /*Get the base query builder driving the Eloquent builder.*/
  public getBaseQuery() {
    return this.toBase();
  }

  /*Get a base query builder instance.*/
  public toBase() {
    return this._query.getQuery();
  }

  /*Get the parent model of the relation.*/
  public getParent() {
    return this._parent;
  }

  /*Get the fully qualified parent key name.*/
  public getQualifiedParentKeyName() {
    return this._parent.getQualifiedKeyName();
  }

  /*Get the related model of the relation.*/
  public getRelated() {
    return this._related;
  }

  /*Get the name of the "created at" column.*/
  public createdAt() {
    return this._parent.getCreatedAtColumn();
  }

  /*Get the name of the "updated at" column.*/
  public updatedAt() {
    return this._parent.getUpdatedAtColumn();
  }

  /*Get the name of the related model's "updated at" column.*/
  public relatedUpdatedAt() {
    return this._related.getUpdatedAtColumn();
  }

  /*Get the name of the "where in" method for eager loading.*/
  protected whereInMethod(model: Model, key: string): 'whereIntegerInRaw' | 'whereIn' {
    return model.getKeyName() === last(key.split('.')) &&
    ['int', 'integer'].includes(model.getKeyType()) ? 'whereIntegerInRaw' : 'whereIn';
  }

  /*Set or get the morph map for polymorphic relations.*/
  public static morphMap(map: any[] | null = null, merge: boolean = true) {
    const map = Relation.buildMorphMapFromModels(map);
    if (isArray(map)) {
      Relation._morphMap = merge && Relation._morphMap ? map + Relation._morphMap : map;
    }
    return Relation._morphMap;
  }

  /*Builds a table-keyed array from model class names.*/
  protected static buildMorphMapFromModels(models: string[] | null = null) {
    if (isBlank(models) || isObject(models)) {
      return models;
    }
    return array_combine(array_map(model => {
      return new model().getTable();
    }, models), models);
  }

  /*Get the model associated with a custom polymorphic type.*/
  public static getMorphedModel(alias: string) {
    return Relation._morphMap[alias] ?? null;
  }

  // /*Handle dynamic method calls to the relationship.*/
  // public __call(method: string, parameters: any[]) {
  //   if (Relation.hasMacro(method)) {
  //     return this.macroCall(method, parameters);
  //   }
  //   var result = this.forwardCallTo(this.query, method, parameters);
  //   if (result === this.query) {
  //     return this;
  //   }
  //   return result;
  // }
  // /*Force a clone of the underlying query builder when cloning.*/
  // public __clone() {
  //   this.query = ();
  // }
}
