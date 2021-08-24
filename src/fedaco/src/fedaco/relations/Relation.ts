/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Builder } from 'Illuminate/Database/Eloquent/Builder';
import { Collection } from 'Illuminate/Database/Eloquent/Collection';
import { Model } from 'Illuminate/Database/Eloquent/Model';
import { Expression } from 'Illuminate/Database/Query/Expression';
import { Arr } from 'Illuminate/Support/Arr';
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
  /*An array to map class names to their morph names in database.*/
  protected static morphMap: any[] = [];

  /*Create a new relation instance.*/
  public constructor(query: Builder, parent: Model) {
    this.query   = query;
    this.parent  = parent;
    this.related = query.getModel();
    this.addConstraints();
    super();
  }

  /*Set the base constraints on the relation query.*/
  public abstract addConstraints(): void;

  /*Set the constraints for an eager load of the relation.*/
  public abstract addEagerConstraints(models: any[]);

  /*Initialize the relation on a set of models.*/
  public abstract initRelation(models: any[], relation: string);

  /*Match the eagerly loaded results to their parents.*/
  public abstract match(models: any[], results: Collection, relation: string);

  /*Get the results of the relationship.*/
  public abstract getResults(): Model | Model[];

  /*Get the relationship for eager loading.*/
  public getEager() {
    return this.get();
  }

  /*Touch all of the related models for the relationship.*/
  public touch() {
    let column = this.getRelated().getUpdatedAtColumn();
    this.rawUpdate({});
  }

  /*Run a raw update against the base query.*/
  public rawUpdate(attributes: any[] = []) {
    return this.query.update(attributes);
  }

  /*Add the constraints for a relationship count query.*/
  public getRelationCountQuery(query: Builder, parent: Builder) {
    return this.getRelationQuery(query, parent, new Expression('count(*)'));
  }

  /*Add the constraints for a relationship query.*/
  public getRelationQuery(query: Builder, parent: Builder, columns: any[] | any = ['*']) {
    query.select(columns);
    let key = this.wrap(this.getQualifiedParentKeyName());
    return query.where(this.getHasCompareKey(), '=', new Expression(key));
  }

  /*Run a callback with constraints disabled on the relation.*/
  public static noConstraints(callback: Function) {
    let previous         = Relation.constraints;
    Relation.constraints = false;
    try {
      let results = call_user_func(callback);
    } finally {
      Relation.constraints = previous;
    }
    return results;
  }

  /*Get all of the primary keys for an array of models.*/
  protected getKeys(models: any[], key: string = null) {
    return array_unique(array_values(array_map(value => {
      return key ? value.getAttribute(key) : value.getKey();
    }, models)));
  }

  /*Get the underlying query for the relation.*/
  public getQuery() {
    return this.query;
  }

  /*Get the base query builder driving the Eloquent builder.*/
  public getBaseQuery() {
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

  /*Wrap the given value with the parent query's grammar.*/
  public wrap(value: string) {
    return this.parent.newQueryWithoutScopes().getQuery().getGrammar().wrap(value);
  }

  /*Set or get the morph map for polymorphic relations.*/
  public static morphMap(map: any[] | null = null, merge: boolean = true) {
    let map = Relation.buildMorphMapFromModels(map);
    if (is_array(map)) {
      Relation.morphMap = merge && Relation.morphMap ? [...Relation.morphMap, ...map] : map;
    }
    return Relation.morphMap;
  }

  /*Builds a table-keyed array from model class names.*/
  protected static buildMorphMapFromModels(models: string[] | null = null) {
    if (isBlank(models) || Arr.isAssoc(models)) {
      return models;
    }
    let tables = array_map(model => {
      return new model().getTable();
    }, models);
    return array_combine(tables, models);
  }

  // /*Handle dynamic method calls to the relationship.*/
  // public __call(method: string, parameters: any[]) {
  //   let result = call_user_func_array([this.query, method], parameters);
  //   if (result === this.query) {
  //     return this;
  //   }
  //   return result;
  // }
  //
  // /*Force a clone of the underlying query builder when cloning.*/
  // public __clone() {
  //   this.query = ();
  // }
}
