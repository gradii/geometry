/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
// import { Builder } from 'Illuminate/Database/Eloquent/Builder';
// import { Collection } from 'Illuminate/Database/Eloquent/Collection';
// import { Model } from 'Illuminate/Database/Eloquent/Model';
// import { Expression } from 'Illuminate/Database/Query/Expression';
// import { Arr } from 'Illuminate/Support/Arr';
import { mixinForwardCallToQueryBuilder } from '../mixins/forward-call-to-query-builder';

export class Relation extends mixinForwardCallToQueryBuilder(class {
}) {
  /*The Eloquent query builder instance.*/
  protected query: Builder;
  /*The parent model instance.*/
  protected parent: Model;
  /*The related model instance.*/
  protected related: Model;
  /*Indicates if the relation is adding constraints.*/
  protected static constraints: boolean = true;
  /*An array to map class names to their morph names in the database.*/
  public static morphMap: any[] = [];
  /*The count of self joins.*/
  protected static selfJoinCount: number = 0;

  /*Create a new relation instance.*/
  public constructor(query: Builder, parent: Model) {
    this.query   = query;
    this.parent  = parent;
    this.related = query.getModel();
    this.addConstraints();
  }

  /*Run a callback with constraints disabled on the relation.*/
  public static noConstraints(callback: Function) {
    var previous         = Relation.constraints;
    Relation.constraints = false;
    try {
      return callback();
    } finally {
      Relation.constraints = previous;
    }
  }

  /*Set the base constraints on the relation query.*/
  public abstract addConstraints();

  /*Set the constraints for an eager load of the relation.*/
  public abstract addEagerConstraints(models: any[]);

  /*Initialize the relation on a set of models.*/
  public abstract initRelation(models: any[], relation: string);

  /*Match the eagerly loaded results to their parents.*/
  public abstract match(models: any[], results: Collection, relation: string);

  /*Get the results of the relationship.*/
  public abstract getResults();

  /*Get the relationship for eager loading.*/
  public getEager() {
    return this.get();
  }

  /*Execute the query and get the first result if it's the sole matching record.*/
  public sole(columns: any[] | string = ['*']) {
    var result = this.take(2).get(columns);
    if (result.isEmpty()) {
      throw new ModelNotFoundException().setModel(get_class(this.related));
    }
    if (result.count() > 1) {
      throw new MultipleRecordsFoundException();
    }
    return result.first();
  }

  /*Execute the query as a "select" statement.*/
  public get(columns: any[] = ['*']) {
    return this.query.get(columns);
  }

  /*Touch all of the related models for the relationship.*/
  public touch() {
    var model = this.getRelated();
    if (!model.isIgnoringTouch()) {
      this.rawUpdate({});
    }
  }

  /*Run a raw update against the base query.*/
  public rawUpdate(attributes: any[] = []) {
    return this.query.withoutGlobalScopes().update(attributes);
  }

  /*Add the constraints for a relationship count query.*/
  public getRelationExistenceCountQuery(query: Builder, parentQuery: Builder) {
    return this.getRelationExistenceQuery(query, parentQuery,
      new Expression('count(*)')).setBindings([], 'select');
  }

  /*Add the constraints for an internal relationship existence query.

  Essentially, these queries compare on column names like whereColumn.*/
  public getRelationExistenceQuery(query: Builder, parentQuery: Builder,
                                   columns: any[] | any = ['*']) {
    return query.select(columns).whereColumn(this.getQualifiedParentKeyName(), '=',
      this.getExistenceCompareKey());
  }

  /*Get a relationship join table hash.*/
  public getRelationCountHash(incrementJoinCount: boolean = true) {
    return 'laravel_reserved_' + (incrementJoinCount ? Relation.selfJoinCount++ : Relation.selfJoinCount);
  }

  /*Get all of the primary keys for an array of models.*/
  protected getKeys(models: any[], key: string | null = null) {
    return collect(models).map(value => {
      return key ? value.getAttribute(key) : value.getKey();
    }).values().unique(null, true).sort().all();
  }

  /*Get the query builder that will contain the relationship constraints.*/
  protected getRelationQuery() {
    return this.query;
  }

  /*Get the underlying query for the relation.*/
  public getQuery() {
    return this.query;
  }

  /*Get the base query builder driving the Eloquent builder.*/
  public getBaseQuery() {
    return this.toBase();
  }

  /*Get a base query builder instance.*/
  public toBase() {
    return this.query.getQuery();
  }

  /*Get the parent model of the relation.*/
  public getParent() {
    return this.parent;
  }

  /*Get the fully qualified parent key name.*/
  public getQualifiedParentKeyName() {
    return this.parent.getQualifiedKeyName();
  }

  /*Get the related model of the relation.*/
  public getRelated() {
    return this.related;
  }

  /*Get the name of the "created at" column.*/
  public createdAt() {
    return this.parent.getCreatedAtColumn();
  }

  /*Get the name of the "updated at" column.*/
  public updatedAt() {
    return this.parent.getUpdatedAtColumn();
  }

  /*Get the name of the related model's "updated at" column.*/
  public relatedUpdatedAt() {
    return this.related.getUpdatedAtColumn();
  }

  /*Get the name of the "where in" method for eager loading.*/
  protected whereInMethod(model: Model, key: string) {
    return model.getKeyName() === last(key.split('.')) && in_array(model.getKeyType(),
      ['int', 'integer']) ? 'whereIntegerInRaw' : 'whereIn';
  }

  /*Set or get the morph map for polymorphic relations.*/
  public static morphMap(map: any[] | null = null, merge: boolean = true) {
    var map = Relation.buildMorphMapFromModels(map);
    if (is_array(map)) {
      Relation.morphMap = merge && Relation.morphMap ? map + Relation.morphMap : map;
    }
    return Relation.morphMap;
  }

  /*Builds a table-keyed array from model class names.*/
  protected static buildMorphMapFromModels(models: string[] | null = null) {
    if (isBlank(models) || Arr.isAssoc(models)) {
      return models;
    }
    return array_combine(array_map(model => {
      return new model().getTable();
    }, models), models);
  }

  /*Get the model associated with a custom polymorphic type.*/
  public static getMorphedModel(alias: string) {
    return Relation.morphMap[alias] ?? null;
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
