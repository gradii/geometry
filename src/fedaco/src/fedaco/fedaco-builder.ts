/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  isAnyEmpty,
  isArray,
  isBlank,
  isFunction
} from '@gradii/check-type';
import { mixinBuildQueries } from '../query-builder/mixins/build-query';
import { QueryBuilder } from '../query-builder/query-builder';
import { Model } from './model';
import { Scope } from './scope';
import { tap } from 'ramda';


export class FedacoBuilder extends mixinBuildQueries(class {
}) {

  /*All of the globally registered builder macros.*/
  protected static macros: any[] = [];
  /*The model being queried.*/
  protected _model: Model;
  /*The relationships that should be eager loaded.*/
  protected _eagerLoad: any[] = [];
  /*All of the locally registered builder macros.*/
  protected _localMacros: any[] = [];
  /*A replacement for the typical delete function.*/
  protected _onDelete: Function;
  /*The methods that should be returned from query builder.*/
  protected _passthru: any[] = [
    'insert', 'insertOrIgnore', 'insertGetId', 'insertUsing', 'getBindings',
    'toSql', 'dump', 'dd', 'exists', 'doesntExist',
    'count', 'min', 'max', 'avg', 'average', 'sum', 'getConnection', 'raw',
    'getGrammar'
  ];
  /*Applied global scopes.*/
  protected _scopes: any[] = [];
  /*Removed global scopes.*/
  protected _removedScopes: any[] = [];

  public constructor(protected _query: QueryBuilder) {
    super();
  }

  getQuery() {
    return this._query;
  }

  /**
   * Find a model by its primary key.
   */
  public find(id: any, columns: any[] = ['*']) {
    if (isArray(id)) {
      return this.findMany(id, columns);
    }
    return this.whereKey(id).first(columns);
  }

  /*Get the model instance being queried.*/
  public getModel() {
    return this._model;
  }

  /*Set a model instance for the model being queried.*/
  public setModel(model: Model) {
    this._model = model;
    this._query.from(model.getTable());
    return this;
  }

  /**
   * Execute the query as a "select" statement.
   */
  public get(columns: any[] | string = ['*']) {
    // var builder = this.applyScopes();
    // if (count(models = builder.getModels(columns)) > 0) {
    //   var models = builder.eagerLoadRelations(models);
    // }
    // return builder.getModel().newCollection(models);
  }

  /**
   * Find multiple models by their primary keys.
   */
  public findMany(ids: any[], columns: any[] = ['*']) {
    if (isAnyEmpty(ids)) {
      return [];
    }
    return this.whereKey(ids).get(columns);
  }


  /*Find a model by its primary key or throw an exception.*/
  public findOrFail(id: any, columns: any[] = ['*']) {
    const result = this.find(id, columns);

    if (isArray(id)) {
      if ((result as any[]).length === id.length) {
        return result;
      }
    } else if (!isBlank(result)) {
      return result;
    }
    throw new Error(`ModelNotFoundException No query results for model  ${this._model.constructor.name} ${JSON.stringify(id)});`);
  }

  /**
   * Add a where clause on the primary key to the query.
   */
  public whereKey(id: any) {
    if (isArray(id)) {
      this._query.whereIn(this._model.getQualifiedKeyName(), id);
      return this;
    }
    return this.where(this._model.getQualifiedKeyName(), '=', id);
  }

  /**
   * Add a basic where clause to the query.
   */
  public where(column: Function | string | any[], operator: any = null, value: any = null,
               conjunction: 'and' | 'or'                                           = 'and') {
    if (isFunction(column) && isBlank(operator)) {
      const query = this._model.newQueryWithoutRelationships();
      column(query);
      this._query.addNestedWhereQuery(query.getQuery(), conjunction);
    } else {
      this._query.where.apply(this, arguments);
    }
    return this;
  }

  /*Register a new global scope.*/
  public withGlobalScope(identifier: string, scope: Scope | Function) {
    // this._scopes[identifier] = scope;
    // if (method_exists(scope, 'extend')) {
    //   scope.extend(this);
    // }
    return this;
  }

  /*Remove a registered global scope.*/
  public withoutGlobalScope(scope: Scope | string) {
    // if (!isString(scope)) {
    //   var scope = get_class(scope);
    // }
    // delete this._scopes[scope];
    // this._removedScopes.push(scope);
    return this;
  }

  /*Remove all or passed registered global scopes.*/
  public withoutGlobalScopes(scopes: any[] | null = null) {
    // if (!isArray(scopes)) {
    //   scopes = array_keys(this._scopes);
    // }
    // for (let scope of scopes) {
    //   this.withoutGlobalScope(scope);
    // }
    return this;
  }

  /*Create a new instance of the model being queried.*/
  public newModelInstance(attributes: any[] = []) {
    return this._model
      .newInstance(attributes)
      .setConnection(this._query.getConnection().getName());
  }


  /*Find a model by its primary key or return fresh model instance.*/
  public findOrNew(id: any, columns: any[] = ['*']) {
    const model = this.find(id, columns);
    if (!isBlank(model)) {
      return model;
    }
    return this.newModelInstance();
  }

  /*Get the first record matching the attributes or instantiate it.*/
  public firstOrNew(attributes: any, values: any = {}) {
    const instance = this.where(attributes).first();
    if (!isBlank(instance)) {
      return instance;
    }
    return this.newModelInstance({...attributes, ...values});
  }

  /*Get the first record matching the attributes or create it.*/
  public firstOrCreate(attributes: any, values: any = {}) {
    const instance = this.where(attributes).first();
    if (!isBlank(instance)) {
      return instance;
    }
    return tap(instance => {
        instance.save();
      }, this.newModelInstance({...attributes, ...values})
    );
  }

  /*Create or update a record matching the attributes, and fill it with values.*/
  public updateOrCreate(attributes: any[], values: any[] = []) {
    return tap(instance => {
      instance.fill(values).save();
    }, this.firstOrNew(attributes));
  }


}
