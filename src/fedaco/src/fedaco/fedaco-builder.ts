/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isAnyEmpty, isArray, isBlank, isFunction, isNumber, isString } from '@gradii/check-type';
import { nth, omit, pluck, tap } from 'ramda';
import { wrap } from '../helper/arr';
import { mixinBuildQueries } from '../query-builder/mixins/build-query';
import { QueryBuilder } from '../query-builder/query-builder';
import { SqlNode } from '../query/sql-node';
import { mixinForwardCallToQueryBuilder } from './mixins/forward-call-to-query-builder';
import { mixinGuardsAttributes } from './mixins/guards-attributes';
import { mixinQueriesRelationShips } from './mixins/queries-relationships';
import { Model } from './model';
import { BelongsToMany } from './relations/belongs-to-many';
import { Relation } from './relations/relation';
import { Scope } from './scope';


// @NoSuchMethodProxy()
export class FedacoBuilder extends mixinGuardsAttributes(
  mixinQueriesRelationShips(
    mixinBuildQueries(
      mixinForwardCallToQueryBuilder(class {
      })
    )
  )) {

  /*All of the globally registered builder macros.*/
  protected static macros: any[] = [];
  /*The model being queried.*/
  protected _model: Model;
  /*The relationships that should be eager loaded.*/
  protected _eagerLoad: { [key: string]: Function } = {};
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
  protected _scopes: any = {};
  /*Removed global scopes.*/
  protected _removedScopes: any[] = [];


  public constructor(protected _query: QueryBuilder) {
    super();
  }

  /*Create and return an un-saved model instance.*/
  public make(attributes: any[] = []) {
    return this.newModelInstance(attributes);
  }

  /*Register a new global scope.*/
  public withGlobalScope(identifier: string, scope: Scope | Function) {
    // this.scopes[identifier] = scope;
    // if (method_exists(scope, "extend")) {
    //   scope.extend(this);
    // }
    return this;
  }

  /*Remove a registered global scope.*/
  public withoutGlobalScope(scope: Scope | string) {
    // if (!is_string(scope)) {
    //   var scope = get_class(scope);
    // }
    // delete this.scopes[scope];
    // this.removedScopes.push(scope);
    return this;
  }

  /*Remove all or passed registered global scopes.*/
  public withoutGlobalScopes(scopes: any[] | null = null) {
    // if (!is_array(scopes)) {
    //   var scopes = array_keys(this.scopes);
    // }
    // for (let scope of scopes) {
    //   this.withoutGlobalScope(scope);
    // }
    return this;
  }

  /*Get an array of global scopes that were removed from the query.*/
  public removedScopes() {
    return this.removedScopes;
  }

  /**
   * Add a where clause on the primary key to the query.
   */
  public whereKey(id: any) {
    if (id instanceof Model) {
      id = id.getKey();
    }
    if (isArray(id)) {
      this._query.whereIn(this._model.getQualifiedKeyName(), id);
      return this;
    }
    if (id != null && this._model.getKeyType() === 'string') {
      id = `${id}`;
    }
    return this.where(this._model.getQualifiedKeyName(), '=', id);
  }

  /*Add a where clause on the primary key to the query.*/
  public whereKeyNot(id: any) {
    if (id instanceof Model) {
      id = id.getKey();
    }
    if (isArray(id)) {
      this._query.whereNotIn(this._model.getQualifiedKeyName(), id);
      return this;
    }
    if (id !== null && this._model.getKeyType() === 'string') {
      id = `${id}`;
    }
    return this.where(this._model.getQualifiedKeyName(), '!=', id);
  }


  /**
   * Add a basic where clause to the query.
   */
  public where(column: Function | string | any[] | SqlNode | any,
               operator: any                          = null,
               value: any = null, conjunction: string = 'and') {
    if (isFunction(column) && isBlank(operator)) {
      const query = this._model.newQueryWithoutRelationships();
      column(query);
      this._query.addNestedWhereQuery(query.getQuery(), conjunction);
    } else {
      this._query.where(column as any[] | any, operator, value, conjunction);
    }
    return this;
  }

  /*Add a basic where clause to the query, and return the first result.*/
  public firstWhere(column: Function | string | any[] | SqlNode, operator: any = null,
                    value: any                                                 = null,
                    conjunction: string                                        = 'and') {
    return this.where(column, operator, value, conjunction).first();
  }

  /*Add an "or where" clause to the query.*/
  public orWhere(column: Function | any[] | string | SqlNode, operator: any = null,
                 value: any                                                 = null) {
    [value, operator] = this._query._prepareValueAndOperator(value, operator,
      arguments.length === 2);
    return this.where(column, operator, value, 'or');
  }

  /*Add an "order by" clause for a timestamp to the query.*/
  public latest(column: string = null) {
    if (isBlank(column)) {
      column = this._model.getCreatedAtColumn() ?? 'created_at';
    }
    this._query.latest(column);
    return this;
  }

  /*Add an "order by" clause for a timestamp to the query.*/
  public oldest(column: string = null) {
    if (isBlank(column)) {
      column = this._model.getCreatedAtColumn() ?? 'created_at';
    }
    this._query.oldest(column);
    return this;
  }

  /*Create a collection of models from plain arrays.*/
  public hydrate(items: any[]) {
    let instance = this.newModelInstance();
    return instance.newCollection(items.map(item => {
      let model = instance.newFromBuilder(item);
      if (items.length > 1) {
        // model.preventsLazyLoading = Model.preventsLazyLoading();
      }
      return model;
    }));
  }

  /*Create a collection of models from a raw query.*/
  public async fromQuery(query: string, bindings: any[] = []) {
    return this.hydrate(await this._query.getConnection().select(query, bindings));
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

    if (isArray(id) && isArray(result)) {
      if (result.length === id.length) {
        return result;
      }
    } else if (!isBlank(result)) {
      return result;
    }
    throw new Error(
      `ModelNotFoundException No query results for model  ${this._model.constructor.name} ${JSON.stringify(
        id)});`);
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
  public async firstOrNew(attributes: any, values: any = {}): Promise<Model> {
    const instance = await this.where(attributes).first() as Model;
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
    return tap(model => {
        model.save();
      }, this.newModelInstance({...attributes, ...values})
    );
  }

  /*Create or update a record matching the attributes, and fill it with values.*/
  public async updateOrCreate(attributes: any[], values: any[] = []) {
    const instance = await this.firstOrNew(attributes);
    await instance.fill(values).save();
    return instance;
  }

  /*Execute the query and get the first result or throw an exception.*/
  public firstOrFail(columns: any[] = ['*']) {
    const model = this.first(columns);
    if (!isBlank(model)) {
      return model;
    }
    throw new Error(
      `ModelNotFoundException No query results for model  ${this._model.constructor.name});`);
  }

  /*Execute the query and get the first result or call a callback.*/
  public firstOr(columns: Function | any[] = ['*'], callback: Function | null = null) {
    if (isFunction(columns)) {
      callback = columns;
      columns  = ['*'];
    }
    const model = this.first(columns);
    if (!isBlank(model)) {
      return model;
    }
    return callback();
  }

  // /*Execute the query and get the first result if it's the sole matching record.*/
  // public sole(columns: any[] | string = ['*']) {
  //   try {
  //     return this.baseSole(columns);
  //   } catch (exception: RecordsNotFoundException) {
  //     throw new ModelNotFoundException().setModel(get_class(this.model));
  //   }
  // }

  /*Get a single column's value from the first result of a query.*/
  public async value(column: string) {
    const result: Model = await this.first([column]) as Model;
    if (result) {
      return result[column];
    }
  }

  /**
   * Execute the query as a "select" statement.
   */
  public async get(columns: string[] | string = ['*']): Promise<Model[]> {
    const builder = this.applyScopes();
    let models    = await builder.getModels(columns);
    if (models.length > 0) {
      models = await builder.eagerLoadRelations(models);
    }
    return models;
  }

  /*Get the hydrated models without eager loading.*/
  public async getModels(columns: any[] | string = ['*']) {
    return this._model.newQuery().hydrate(await this._query.get(columns));
  }

  /*Eager load the relationships for the models.*/
  public async eagerLoadRelations(models: any[]) {
    for (let [name, constraints] of Object.entries(this._eagerLoad)) {
      if (name.indexOf('.') > -1) {
        models = await this.eagerLoadRelation(models, name, constraints);
      }
    }
    return models;
  }

  /*Eagerly load the relationship on a set of models.*/
  protected async eagerLoadRelation(models: any[], name: string, constraints: Function) {
    const relation = this.getRelation(name);
    relation.addEagerConstraints(models);
    constraints(relation);
    return relation.match(relation.initRelation(models, name), await relation.getEager(), name);
  }

  /*Get the relation instance for the given relation name.*/
  public getRelation(name: string): Relation {
    const relation = Relation.noConstraints(() => {
      try {
        return this.getModel().newInstance().name();
      } catch (e) {
        throw new Error(`RelationNotFoundException`); // (this.getModel(), name);
      }
    });
    const nested   = this.relationsNestedUnder(name);
    if (nested.length > 0) {
      relation.getQuery().with(nested);
    }
    return relation;
  }

  /*Get the deeply nested relations for a given top-level relation.*/
  protected relationsNestedUnder(relation: string) {
    const nested: any = {};
    for (let [name, constraints] of Object.entries(this._eagerLoad)) {
      if (this.isNestedUnder(relation, name)) {
        nested[name.substr((relation + '.').length)] = constraints;
      }
    }
    return nested;
  }

  /*Determine if the relationship is nested.*/
  protected isNestedUnder(relation: string, name: string) {
    return name.includes('.') && name.startsWith(relation + '.');
  }

  // /*Get a lazy collection for the given query.*/
  // public cursor() {
  //   return this.applyScopes().query.cursor().map(record => {
  //     return this.newModelInstance().newFromBuilder(record);
  //   });
  // }

  /*Add a generic "order by" clause if the query doesn't already have one.*/
  protected enforceOrderBy() {
    if (!this._query._orders.length && !this._query._unionOrders.length) {
      this.orderBy(this._model.getQualifiedKeyName(), 'asc');
    }
  }

  // /*Get an array with the values of a given column.*/
  // public pluck(column: string | Expression, key: string | null = null) {
  //   let results = this.toBase().pluck(column, key);
  //   if (!this.model.hasGetMutator(column) && !this.model.hasCast(column) && !in_array(column,
  //     this.model.getDates())) {
  //     return results;
  //   }
  //   return results.map(value => {
  //     return this.model.newFromBuilder({})[column];
  //   });
  // }

  // /*Paginate the given query.*/
  // public paginate(perPage: number | null = null, columns: any[] = ['*'], pageName: string = 'page', page: number | null = null) {
  //   let page = page || Paginator.resolveCurrentPage(pageName);
  //   let perPage = perPage || this.model.getPerPage();
  //   let results = (total = this.toBase().getCountForPagination()) ? this.forPage(page, perPage).get(columns) : this.model.newCollection();
  //   return this.paginator(results, total, perPage, page, {
  //     'path': Paginator.resolveCurrentPath(),
  //     'pageName': pageName
  //   });
  // }
  // /*Paginate the given query into a simple paginator.*/
  // public simplePaginate(perPage: number | null = null, columns: any[] = ['*'], pageName: string = 'page', page: number | null = null) {
  //   let page = page || Paginator.resolveCurrentPage(pageName);
  //   let perPage = perPage || this.model.getPerPage();
  //   this.skip((page - 1) * perPage).take(perPage + 1);
  //   return this.simplePaginator(this.get(columns), perPage, page, {
  //     'path': Paginator.resolveCurrentPath(),
  //     'pageName': pageName
  //   });
  // }
  // /*Paginate the given query into a cursor paginator.*/
  // public cursorPaginate(perPage: number | null = null, columns: any[] = ['*'], cursorName: string = 'cursor', cursor: Cursor | string | null = null) {
  //   let perPage = perPage || this.model.getPerPage();
  //   return this.paginateUsingCursor(perPage, columns, cursorName, cursor);
  // }
  // /*Ensure the proper order by required for cursor pagination.*/
  // protected ensureOrderForCursorPagination(shouldReverse: boolean = false) {
  //   let orders = collect(this._query.orders);
  //   if (orders.count() === 0) {
  //     this.enforceOrderBy();
  //   }
  //   if (shouldReverse) {
  //     this._query.orders = collect(this._query.orders).map(order => {
  //       order['direction'] = order['direction'] === 'asc' ? 'desc' : 'asc';
  //       return order;
  //     }).toArray();
  //   }
  //   return collect(this._query.orders);
  // }
  /*Save a new model and return the instance.*/
  public create(attributes: any[] = []) {
    return tap(instance => {
      instance.save();
    }, this.newModelInstance(attributes));
  }

  /*Save a new model and return the instance. Allow mass-assignment.*/
  public forceCreate(attributes: any[]) {
    return this._model.unguarded(() => {
      return this.newModelInstance().create(attributes);
    });
  }

  /*Update records in the database.*/
  public update(values: any) {
    return this.toBase().update(this.addUpdatedAtColumn(values));
  }

  /*Insert new records or update the existing ones.*/
  public upsert(values: any[], uniqueBy: any[] | string, update: any[] | null = null) {
    if (!values.length) {
      return 0;
    }
    if (!isArray(values)) {
      values = [values];
    }
    if (isBlank(update)) {
      update = Object.keys(values);
    }
    return this.toBase().upsert(this._addTimestampsToUpsertValues(values), uniqueBy,
      this._addUpdatedAtToUpsertColumns(update));
  }

  /*Increment a column's value by a given amount.*/
  public increment(column: string, amount: number | number = 1, extra: any[] = []) {
    return this.toBase().increment(column, amount, this.addUpdatedAtColumn(extra));
  }

  /*Decrement a column's value by a given amount.*/
  public decrement(column: string, amount: number | number = 1, extra: any[] = []) {
    return this.toBase().decrement(column, amount, this.addUpdatedAtColumn(extra));
  }

  /*Add the "updated at" column to an array of values.*/
  protected addUpdatedAtColumn(values: any[]) {
    if (!this._model.usesTimestamps() || isBlank(this._model.getUpdatedAtColumn())) {
      return values;
    }
    let column = this._model.getUpdatedAtColumn();
    values     = {
      [column]: this._model.freshTimestampString(), ...values
    };
    // let segments            = preg_split('/\\s+as\\s+/i', this._query.from);
    // let qualifiedColumn     = end(segments) + '.' + column;
    // values[qualifiedColumn] = values[column];
    // delete values[column];
    return values;
  }

  /*Add timestamps to the inserted values.*/
  _addTimestampsToUpsertValues(values: any[]) {
    if (!this._model.usesTimestamps()) {
      return values;
    }
    let timestamp = this._model.freshTimestampString();
    let columns   = [
      this._model.getCreatedAtColumn(),
      this._model.getUpdatedAtColumn()
    ];
    for (let row of values) {
      for (let column of columns) {
        row[column] = timestamp;
      }
    }
    return values;
  }

  /*Add the "updated at" column to the updated columns.*/
  protected _addUpdatedAtToUpsertColumns(update: string[]) {
    if (!this._model.usesTimestamps()) {
      return update;
    }
    let column = this._model.getUpdatedAtColumn();
    if (!isBlank(column) && !update.includes(column)) {
      update.push(column);
    }
    return update;
  }

  /*Delete records from the database.*/
  public delete() {
    if (this._onDelete !== undefined) {
      return this._onDelete.call(this, this);
    }
    return this.toBase().delete();
  }

  /*Run the default delete function on the builder.

  Since we do not apply scopes here, the row will actually be deleted.*/
  public forceDelete() {
    return this._query.delete();
  }

  /*Register a replacement for the default delete function.*/
  public onDelete(callback: Function) {
    this._onDelete = callback;
  }

  /*Determine if the given model has a scope.*/
  public hasNamedScope(scope: string) {
    return this._model && this._model.hasNamedScope(scope);
  }

  /*Call the given local model scopes.*/
  public scopes(scopes: any[] | string) {
    let builder = this;
    for (let [scope, parameters] of Object.entries(wrap(scopes))) {
      if (isNumber(scope)) {
        [scope, parameters] = [parameters, []];
      }
      builder = builder.callNamedScope(scope, wrap(parameters));
    }
    return builder;
  }

  /*Apply the scopes to the Eloquent builder instance and return it.*/
  public applyScopes(): FedacoBuilder {
    if (!this._scopes.length) {
      return this;
    }
    const builder = this.clone();
    for (const [identifier, scope] of Object.entries(this._scopes)) {
      if (builder._scopes[identifier] == null) {
        continue;
      }
      builder.callScope((_builder: this) => {
        if (isFunction(scope)) {
          scope(_builder);
        }
        if (scope instanceof Scope) {
          scope.apply(_builder, this.getModel());
        }
      });
    }
    return builder;
  }

  /*Apply the given scope on the current builder instance.*/
  protected callScope(scope: Function, parameters: any[] = []) {
    parameters.unshift(this);
    let query              = this.getQuery();
    let originalWhereCount = !query._wheres.length ? 0 : query._wheres.length;
    let result             = scope(...parameters) ?? this;
    if (/*cast type array*/ query._wheres.length > originalWhereCount) {
      this.addNewWheresWithinGroup(query, originalWhereCount);
    }
    return result;
  }

  /*Apply the given named scope on the current builder instance.*/
  protected callNamedScope(scope: string, parameters: any[] = []) {
    return this.callScope((parameters: any[]) => {
      return this._model.callNamedScope(scope, parameters);
    }, parameters);
  }

  /*Nest where conditions by slicing them at the given where count.*/
  protected addNewWheresWithinGroup(query: QueryBuilder, originalWhereCount: number) {
    let allWheres = query._wheres;
    query._wheres = [];
    this._groupWhereSliceForScope(query, allWheres.slice(0, originalWhereCount));
    this._groupWhereSliceForScope(query, allWheres.slice(originalWhereCount));
  }

  /*Slice where conditions at the given offset and add them to the query as a nested condition.*/
  protected _groupWhereSliceForScope(query: QueryBuilder, whereSlice: any[]) {
    let whereBooleans = pluck('boolean', whereSlice);
    if (whereBooleans.includes('or')) {
      query._wheres.push(this._createNestedWhere(whereSlice, nth(0, whereBooleans)));
    } else {
      query._wheres = [...query._wheres, ...whereSlice];
    }
  }

  /*Create a where array with nested where conditions.*/
  protected _createNestedWhere(whereSlice: any[], conjunction: string = 'and') {
    let whereGroup     = this.getQuery().forNestedWhere();
    whereGroup._wheres = whereSlice;
    return {
      'type'   : 'Nested',
      'query'  : whereGroup,
      'boolean': conjunction
    };
  }

  public with(...relations: string[]): this;
  public with(relations: string[]): this;
  public with(relations: string, callback?: Function): this;
  public with(relations: string[] | string, callback?: Function | string) {
    let eagerLoad;
    if (isFunction(callback)) {
      eagerLoad = this.parseWithRelations([{[relations as string]: callback}]);
    } else {
      // @ts-ignore
      eagerLoad = this.parseWithRelations(isString(relations) ? arguments : relations);
    }
    this._eagerLoad = {...this._eagerLoad, ...eagerLoad};
    return this;
  }

  /*Prevent the specified relations from being eager loaded.*/
  public without(relations: any) {
    this._eagerLoad = omit(isString(relations) ? arguments : relations,
      this._eagerLoad);
    return this;
  }

  /*Set the relationships that should be eager loaded while removing any previously added eager loading specifications.*/
  public withOnly(relations: any) {
    this._eagerLoad = {};
    return this.with(relations);
  }

  /*Create a new instance of the model being queried.*/
  public newModelInstance(attributes: any[] = []) {
    return this._model.newInstance(attributes).setConnection(this._query.getConnection().getName());
  }

  /*Parse a list of relations into individuals.*/
  protected parseWithRelations(relations: any[]): { [key: string]: any } {
    let results = [];
    for (let [name, constraints] of Object.entries(relations)) {
      // if (isNumber(name)) {
      //   name                = constraints;
      //   [name, constraints] = name.includes(':') ?
      //     this.createSelectWithConstraint(name) :
      //     [
      //       name, () => {
      //     }
      //     ];
      // }
      results       = this.addNestedWiths(name, results);
      results[name] = constraints;
    }
    return results;
  }

  /*Create a constraint to select the given columns for the relation.*/
  protected createSelectWithConstraint(name: string) {
    return [
      name.split(':')[0], (query: any) => {
        query.select(name.split(':')[1].split(',').map(column => {
          if (column.includes('.')) {
            return column;
          }
          return query instanceof BelongsToMany ? query.getRelated().getTable() + '.' + column : column;
        }));
      }
    ];
  }

  /*Parse the nested relationships in a relation.*/
  protected addNestedWiths(name: string, results: any) {
    let progress = [];
    for (let segment of name.split('.')) {
      progress.push(segment);
      const last = progress.join('.');
      if (!(results[last] !== undefined)) {
        results[last] = () => {
        };
      }
    }
    return results;
  }

  /*Apply query-time casts to the model instance.*/
  public withCasts(casts: any[]) {
    this._model.mergeCasts(casts);
    return this;
  }

  /*Get the underlying query builder instance.*/
  public getQuery(): QueryBuilder {
    return this._query;
  }

  /*Set the underlying query builder instance.*/
  public setQuery(query: QueryBuilder) {
    this._query = query;
    return this;
  }

  /*Get a base query builder instance.*/
  public toBase() {
    return this.applyScopes().getQuery();
  }

  /*Get the relationships being eagerly loaded.*/
  public getEagerLoads() {
    return this._eagerLoad;
  }

  /*Set the relationships being eagerly loaded.*/
  public setEagerLoads(eagerLoad: any) {
    this._eagerLoad = eagerLoad;
    return this;
  }

  /*Get the default key name of the table.*/
  protected defaultKeyName() {
    return this.getModel().getKeyName();
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

  /*Qualify the given column name by the model's table.*/
  public qualifyColumn(column: string) {
    return this._model.qualifyColumn(column);
  }

  /*Qualify the given columns with the model's table.*/
  public qualifyColumns(columns: any[]) {
    return this._model.qualifyColumns(columns);
  }

  // /*Get the given macro by name.*/
  // public getMacro(name: string) {
  //   return Arr.get(this.localMacros, name);
  // }
  // /*Checks if a macro is registered.*/
  // public hasMacro(name: string) {
  //   return this.localMacros[name] !== undefined;
  // }
  // /*Get the given global macro by name.*/
  // public static getGlobalMacro(name: string) {
  //   return Arr.get(Builder.macros, name);
  // }
  // /*Checks if a global macro is registered.*/
  // public static hasGlobalMacro(name: string) {
  //   return Builder.macros[name] !== undefined;
  // }
  // /*Dynamically access builder proxies.*/
  // public __get(key: string) {
  //   if (key === 'orWhere') {
  //     return new HigherOrderBuilderProxy(this, key);
  //   }
  //   throw new Exception('"Property [{$key}] does not exist on the Eloquent builder instance."');
  // }
  // /*Dynamically handle calls into the query instance.*/
  // public __call(method: string, parameters: any[]) {
  //   if (method === 'macro') {
  //     this.localMacros[parameters[0]] = parameters[1];
  //     return;
  //   }
  //   if (this.hasMacro(method)) {
  //     array_unshift(parameters, this);
  //     return this.localMacros[method](());
  //   }
  //   if (Builder.hasGlobalMacro(method)) {
  //     let callable = Builder.macros[method];
  //     if (callable instanceof Closure) {
  //       let callable = callable.bindTo(this, Builder);
  //     }
  //     return callable(());
  //   }
  //   if (this.hasNamedScope(method)) {
  //     return this.callNamedScope(method, parameters);
  //   }
  //   this.forwardCallTo(this.query, method, parameters);
  //   return this;
  // }
  // /*Dynamically handle calls into the query instance.*/
  // public static __callStatic(method: string, parameters: any[]) {
  //   if (method === 'macro') {
  //     Builder.macros[parameters[0]] = parameters[1];
  //     return;
  //   }
  //   if (method === 'mixin') {
  //     return Builder.registerMixin(parameters[0], parameters[1] ?? true);
  //   }
  //   if (!Builder.hasGlobalMacro(method)) {
  //     Builder.throwBadMethodCallException(method);
  //   }
  //   let callable = Builder.macros[method];
  //   if (callable instanceof Closure) {
  //     let callable = callable.bindTo(null, Builder);
  //   }
  //   return callable(());
  // }
  // /*Register the given mixin with the builder.*/
  // protected static registerMixin(mixin: string, replace: boolean) {
  //   let methods = new ReflectionClass(mixin).getMethods(ReflectionMethod.IS_PUBLIC | ReflectionMethod.IS_PROTECTED);
  //   for (let method of methods) {
  //     if (replace || !Builder.hasGlobalMacro(method.name)) {
  //       method.setAccessible(true);
  //       Builder.macro(method.name, method.invoke(mixin));
  //     }
  //   }
  // }


  // no need to use use group
  // protected addNewWheresWithinGroup(query: FedacoBuilder, originalWhereCount: number) {
  //   const allWheres = query.wheres;
  //   query.wheres = [];
  //   this.groupWhereSliceForScope(query, array_slice(allWheres, 0, originalWhereCount));
  //   this.groupWhereSliceForScope(query, array_slice(allWheres, originalWhereCount));
  // }

  // __noSuchMethod__(methodName, args) {
  //
  //   const query = this.getQuery();
  //   if (query[methodName]) {
  //     return query[methodName](...args);
  //   }
  //   throw new Error('no method found');
  // }


  clone(): FedacoBuilder {
    return new FedacoBuilder(this._query.clone());
  }
}
