/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Builder } from 'Illuminate/Database/Eloquent/Builder';
import { Collection } from 'Illuminate/Database/Eloquent/Collection';
import { Model } from 'Illuminate/Database/Eloquent/Model';
import { ModelNotFoundException } from 'Illuminate/Database/Eloquent/ModelNotFoundException';
import { Arr } from 'Illuminate/Support/Arr';
import { Collection, Collection as BaseCollection } from 'Illuminate/Support/Collection';
import { Str } from 'Illuminate/Support/Str';
import { Relation } from './relation';

export class BelongsToMany extends Relation {
  /*The intermediate table for the relation.*/
  protected table: string;
  /*The foreign key of the parent model.*/
  protected foreignKey: string;
  /*The associated key of the relation.*/
  protected otherKey: string;
  /*The "name" of the relationship.*/
  protected relationName: string;
  /*The pivot table columns to retrieve.*/
  protected pivotColumns: any[] = [];
  /*Any pivot table restrictions for where clauses.*/
  protected pivotWheres: any[] = [];
  /*Any pivot table restrictions for whereIn clauses.*/
  protected pivotWhereIns: any[] = [];
  /*The custom pivot table column for the created_at timestamp.*/
  protected pivotCreatedAt: string;
  /*The custom pivot table column for the updated_at timestamp.*/
  protected pivotUpdatedAt: string;
  /*The count of self joins.*/
  protected static selfJoinCount: number = 0;

  /*Create a new belongs to many relationship instance.*/
  public constructor(query: Builder, parent: Model, table: string, foreignKey: string,
                     otherKey: string, relationName: string = null) {
    this.table        = table;
    this.otherKey     = otherKey;
    this.foreignKey   = foreignKey;
    this.relationName = relationName;
    super.__construct(query, parent);
  }

  /*Get the results of the relationship.*/
  public getResults() {
    return this.get();
  }

  /*Set a where clause for a pivot table column.*/
  public wherePivot(column: string, operator: string = null, value: any = null,
                    boolean: string = 'and') {
    this.pivotWheres.push(func_get_args());
    return this.where(this.table + '.' + column, operator, value, boolean);
  }

  /*Set a "where in" clause for a pivot table column.*/
  public wherePivotIn(column: string, values: any, boolean: string = 'and', not: boolean = false) {
    this.pivotWhereIns.push(func_get_args());
    return this.whereIn(this.table + '.' + column, values, boolean, not);
  }

  /*Set an "or where" clause for a pivot table column.*/
  public orWherePivot(column: string, operator: string = null, value: any = null) {
    return this.wherePivot(column, operator, value, 'or');
  }

  /*Set an "or where in" clause for a pivot table column.*/
  public orWherePivotIn(column: string, values: any) {
    return this.wherePivotIn(column, values, 'or');
  }

  /*Execute the query and get the first result.*/
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

  /*Execute the query as a "select" statement.*/
  public get(columns: any[] = ['*']) {
    let columns = this.query.getQuery().columns ? [] : columns;
    let select  = this.getSelectColumns(columns);
    let builder = this.query.applyScopes();
    let models  = builder.addSelect(select).getModels();
    this.hydratePivotRelation(models);
    if (count(models) > 0) {
      let models = builder.eagerLoadRelations(models);
    }
    return this.related.newCollection(models);
  }

  /*Get a paginator for the "select" statement.*/
  public paginate(perPage: number = null, columns: any[] = ['*'], pageName: string = 'page',
                  page: number | null = null) {
    this.query.addSelect(this.getSelectColumns(columns));
    let paginator = this.query.paginate(perPage, columns, pageName, page);
    this.hydratePivotRelation(paginator.items());
    return paginator;
  }

  /*Paginate the given query into a simple paginator.*/
  public simplePaginate(perPage: number = null, columns: any[] = ['*'],
                        pageName: string = 'page', page: number | null = null) {
    this.query.addSelect(this.getSelectColumns(columns));
    let paginator = this.query.simplePaginate(perPage, columns, pageName, page);
    this.hydratePivotRelation(paginator.items());
    return paginator;
  }

  /*Chunk the results of the query.*/
  public chunk(count: number, callback: callable) {
    this.query.addSelect(this.getSelectColumns());
    return this.query.chunk(count, results => {
      this.hydratePivotRelation(results.all());
      return callback(results);
    });
  }

  /*Hydrate the pivot table relationship on the models.*/
  protected hydratePivotRelation(models: any[]) {
    for (let model of models) {
      let pivot = this.newExistingPivot(this.cleanPivotAttributes(model));
      model.setRelation('pivot', pivot);
    }
  }

  /*Get the pivot attributes from a model.*/
  protected cleanPivotAttributes(model: Model) {
    let values = [];
    for (let [key, value] of Object.entries(model.getAttributes())) {
      if (strpos(key, 'pivot_') === 0) {
        values[substr(key, 6)] = value;
        delete model.key;
      }
    }
    return values;
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    this.setJoin();
    if (BelongsToMany.constraints) {
      this.setWhere();
    }
  }

  /*Add the constraints for a relationship query.*/
  public getRelationQuery(query: Builder, parent: Builder, columns: any[] | any = ['*']) {
    if (parent.getQuery().from == query.getQuery().from) {
      return this.getRelationQueryForSelfJoin(query, parent, columns);
    }
    this.setJoin(query);
    return super.getRelationQuery(query, parent, columns);
  }

  /*Add the constraints for a relationship query on the same table.*/
  public getRelationQueryForSelfJoin(query: Builder, parent: Builder,
                                     columns: any[] | any = ['*']) {
    query.select(columns);
    query.from(this.related.getTable() + ' as ' + (hash = this.getRelationCountHash()));
    this.related.setTable(hash);
    this.setJoin(query);
    return super.getRelationQuery(query, parent, columns);
  }

  /*Get a relationship join table hash.*/
  public getRelationCountHash() {
    return 'laravel_reserved_' + BelongsToMany.selfJoinCount++;
  }

  /*Set the select clause for the relation query.*/
  protected getSelectColumns(columns: any[] = ['*']) {
    if (columns == ['*']) {
      let columns = [this.related.getTable() + '.*'];
    }
    return [...columns, ...this.getAliasedPivotColumns()];
  }

  /*Get the pivot columns for the relation.*/
  protected getAliasedPivotColumns() {
    let defaults = [this.foreignKey, this.otherKey];
    let columns  = [];
    for (let column of [...defaults, ...this.pivotColumns]) {
      columns.push(this.table + '.' + column + ' as pivot_' + column);
    }
    return array_unique(columns);
  }

  /*Determine whether the given column is defined as a pivot column.*/
  protected hasPivotColumn(column: string) {
    return in_array(column, this.pivotColumns);
  }

  /*Set the join clause for the relation query.*/
  protected setJoin(query: Builder | null = null) {
    let query     = query || this.query;
    let baseTable = this.related.getTable();
    let key       = baseTable + '.' + this.related.getKeyName();
    query.join(this.table, key, '=', this.getOtherKey());
    return this;
  }

  /*Set the where clause for the relation query.*/
  protected setWhere() {
    let foreign = this.getForeignKey();
    this.query.where(foreign, '=', this.parent.getKey());
    return this;
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    this.query.whereIn(this.getForeignKey(), this.getKeys(models));
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
      if (dictionary[key = model.getKey()] !== undefined) {
        let collection = this.related.newCollection(dictionary[key]);
        model.setRelation(relation, collection);
      }
    }
    return models;
  }

  /*Build model dictionary keyed by the relation's foreign key.*/
  protected buildDictionary(results: Collection) {
    let foreign    = this.foreignKey;
    let dictionary = [];
    for (let result of results) {
      dictionary[result.pivot.foreign].push(result);
    }
    return dictionary;
  }

  /*Touch all of the related models for the relationship.

  E.g.: Touch all roles associated with this user.*/
  public touch() {
    let key     = this.getRelated().getKeyName();
    let columns = this.getRelatedFreshUpdate();
    let ids     = this.getRelatedIds();
    if (count(ids) > 0) {
      this.getRelated().newQuery().whereIn(key, ids).update(columns);
    }
  }

  /*Get all of the IDs for the related models.*/
  public getRelatedIds() {
    let related = this.getRelated();
    let fullKey = related.getQualifiedKeyName();
    return this.getQuery().select(fullKey).pluck(related.getKeyName());
  }

  /*Save a new model and attach it to the parent model.*/
  public save(model: Model, joining: any[] = [], touch: boolean = true) {
    model.save({
      'touch': false
    });
    this.attach(model.getKey(), joining, touch);
    return model;
  }

  /*Save an array of new models and attach them to the parent model.*/
  public saveMany(models: Collection | any[], joinings: any[] = []) {
    for (let [key, model] of Object.entries(models)) {
      this.save(model, /*cast type array*/ Arr.get(joinings, key), false);
    }
    this.touchIfTouching();
    return models;
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

  /*Find a related model by its primary key or return new instance of the related model.*/
  public findOrNew(id: any, columns: any[] = ['*']) {
    if (isBlank(instance = this.find(id, columns))) {
      let instance = this.getRelated().newInstance();
    }
    return instance;
  }

  /*Get the first related model record matching the attributes or instantiate it.*/
  public firstOrNew(attributes: any[]) {
    if (isBlank(instance = this.where(attributes).first())) {
      let instance = this.related.newInstance(attributes);
    }
    return instance;
  }

  /*Get the first related record matching the attributes or create it.*/
  public firstOrCreate(attributes: any[], joining: any[] = [], touch: boolean = true) {
    if (isBlank(instance = this.where(attributes).first())) {
      let instance = this.create(attributes, joining, touch);
    }
    return instance;
  }

  /*Create or update a related record matching the attributes, and fill it with values.*/
  public updateOrCreate(attributes: any[], values: any[] = [], joining: any[] = [],
                        touch: boolean = true) {
    if (isBlank(instance = this.where(attributes).first())) {
      return this.create(values, joining, touch);
    }
    instance.fill(values);
    instance.save({
      'touch': false
    });
    return instance;
  }

  /*Create a new instance of the related model.*/
  public create(attributes: any[], joining: any[] = [], touch: boolean = true) {
    let instance = this.related.newInstance(attributes);
    instance.save({
      'touch': false
    });
    this.attach(instance.getKey(), joining, touch);
    return instance;
  }

  /*Create an array of new instances of the related models.*/
  public createMany(records: any[], joinings: any[] = []) {
    let instances = [];
    for (let [key, record] of Object.entries(records)) {
      instances.push(this.create(record, /*cast type array*/ Arr.get(joinings, key), false));
    }
    this.touchIfTouching();
    return instances;
  }

  /*Toggles a model (or models) from the parent.

  Each existing model is detached, and non existing ones are attached.*/
  public toggle(ids: any, touch: boolean = true) {
    let changes = {
      'attached': [],
      'detached': []
    };
    if (ids instanceof Model) {
      let ids = ids.getKey();
    }
    if (ids instanceof Collection) {
      let ids = ids.modelKeys();
    }
    let current = this.newPivotQuery().pluck(this.otherKey).all();
    let records = this.formatRecordsList(/*cast type array*/ ids);
    let detach  = array_values(array_intersect(current, array_keys(records)));
    if (count(detach) > 0) {
      this.detach(detach, false);
      changes['detached'] = this.castKeys(detach);
    }
    let attach = array_diff_key(records, array_flip(detach));
    if (count(attach) > 0) {
      this.attach(attach, [], false);
      changes['attached'] = array_keys(attach);
    }
    if (touch && (count(changes['attached']) || count(changes['detached']))) {
      this.touchIfTouching();
    }
    return changes;
  }

  /*Sync the intermediate tables with a list of IDs without detaching.*/
  public syncWithoutDetaching(ids: Collection | any[]) {
    return this.sync(ids, false);
  }

  /*Sync the intermediate tables with a list of IDs or collection of models.*/
  public sync(ids: Collection | Collection | any[], detaching: boolean = true) {
    let changes = {
      'attached': [],
      'detached': [],
      'updated' : []
    };
    if (ids instanceof Collection) {
      let ids = ids.modelKeys();
    }
    if (ids instanceof BaseCollection) {
      let ids = ids.toArray();
    }
    let current = this.newPivotQuery().pluck(this.otherKey).all();
    let records = this.formatRecordsList(ids);
    let detach  = array_diff(current, array_keys(records));
    if (detaching && count(detach) > 0) {
      this.detach(detach);
      changes['detached'] = this.castKeys(detach);
    }
    let changes = [...changes, ...this.attachNew(records, current, false)];
    if (count(changes['attached']) || count(changes['updated'])) {
      this.touchIfTouching();
    }
    return changes;
  }

  /*Format the sync/toggle list so that it is keyed by ID.*/
  protected formatRecordsList(records: any[]) {
    let results = [];
    for (let [id, attributes] of Object.entries(records)) {
      if (!is_array(attributes)) {
        const [id, attributes] = [attributes, []];
      }
      results[id] = attributes;
    }
    return results;
  }

  /*Attach all of the IDs that aren't in the current array.*/
  protected attachNew(records: any[], current: any[], touch: boolean = true) {
    let changes = {
      'attached': [],
      'updated' : []
    };
    for (let [id, attributes] of Object.entries(records)) {
      if (!in_array(id, current)) {
        this.attach(id, attributes, touch);
        changes['attached'].push(is_numeric(id) ? /*cast type int*/ id : /*cast type string*/ id);
      } else if (count(attributes) > 0 && this.updateExistingPivot(id, attributes, touch)) {
        changes['updated'].push(is_numeric(id) ? /*cast type int*/ id : /*cast type string*/ id);
      }
    }
    return changes;
  }

  /*Cast the given keys to integers if they are numeric and string otherwise.*/
  protected castKeys(keys: any[]) {
    return /*cast type array*/ array_map(v => {
      return is_numeric(v) ? /*cast type int*/ v : /*cast type string*/ v;
    }, keys);
  }

  /*Update an existing pivot record on the table.*/
  public updateExistingPivot(id: any, attributes: any[], touch: boolean = true) {
    if (in_array(this.updatedAt(), this.pivotColumns)) {
      let attributes = this.setTimestampsOnAttach(attributes, true);
    }
    let updated = this.newPivotStatementForId(id).update(attributes);
    if (touch) {
      this.touchIfTouching();
    }
    return updated;
  }

  /*Attach a model to the parent.*/
  public attach(id: any, attributes: any[] = [], touch: boolean = true) {
    if (id instanceof Model) {
      let id = id.getKey();
    }
    if (id instanceof Collection) {
      let id = id.modelKeys();
    }
    let query = this.newPivotStatement();
    query.insert(this.createAttachRecords(/*cast type array*/ id, attributes));
    if (touch) {
      this.touchIfTouching();
    }
  }

  /*Create an array of records to insert into the pivot table.*/
  protected createAttachRecords(ids: any[], attributes: any[]) {
    let records = [];
    let timed   = this.hasPivotColumn(this.createdAt()) || this.hasPivotColumn(this.updatedAt());
    for (let [key, value] of Object.entries(ids)) {
      records.push(this.attacher(key, value, attributes, timed));
    }
    return records;
  }

  /*Create a full attachment record payload.*/
  protected attacher(key: number, value: any, attributes: any[], timed: boolean) {
    const [id, extra] = this.getAttachId(key, value, attributes);
    let record        = this.createAttachRecord(id, timed);
    return [...record, ...extra];
  }

  /*Get the attach record ID and extra attributes.*/
  protected getAttachId(key: any, value: any, attributes: any[]) {
    if (is_array(value)) {
      return [key, [...value, ...attributes]];
    }
    return [value, attributes];
  }

  /*Create a new pivot attachment record.*/
  protected createAttachRecord(id: number, timed: boolean) {
    record[this.foreignKey] = this.parent.getKey();
    record[this.otherKey]   = id;
    if (timed) {
      let record = this.setTimestampsOnAttach(record);
    }
    return record;
  }

  /*Set the creation and update timestamps on an attach record.*/
  protected setTimestampsOnAttach(record: any[], exists: boolean = false) {
    let fresh = this.parent.freshTimestamp();
    if (!exists && this.hasPivotColumn(this.createdAt())) {
      record[this.createdAt()] = fresh;
    }
    if (this.hasPivotColumn(this.updatedAt())) {
      record[this.updatedAt()] = fresh;
    }
    return record;
  }

  /*Detach models from the relationship.*/
  public detach(ids: any = [], touch: boolean = true) {
    if (ids instanceof Model) {
      let ids = ids.getKey();
    }
    if (ids instanceof Collection) {
      let ids = ids.modelKeys();
    }
    let query = this.newPivotQuery();
    let ids   = /*cast type array*/ ids;
    if (count(ids) > 0) {
      query.whereIn(this.otherKey, ids);
    }
    let results = query.delete();
    if (touch) {
      this.touchIfTouching();
    }
    return results;
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
    return Str.camel(Str.plural(class_basename(this.getParent())));
  }

  /*Create a new query builder for the pivot table.*/
  protected newPivotQuery() {
    let query = this.newPivotStatement();
    for (let whereArgs of this.pivotWheres) {
      call_user_func_array([query, 'where'], whereArgs);
    }
    for (let whereArgs of this.pivotWhereIns) {
      call_user_func_array([query, 'whereIn'], whereArgs);
    }
    return query.where(this.foreignKey, this.parent.getKey());
  }

  /*Get a new plain query builder for the pivot table.*/
  public newPivotStatement() {
    return this.query.getQuery().newQuery().from(this.table);
  }

  /*Get a new pivot statement for a given "other" ID.*/
  public newPivotStatementForId(id: any) {
    return this.newPivotQuery().where(this.otherKey, id);
  }

  /*Create a new pivot model instance.*/
  public newPivot(attributes: any[] = [], exists: boolean = false) {
    let pivot = this.related.newPivot(this.parent, attributes, this.table, exists);
    return pivot.setPivotKeys(this.foreignKey, this.otherKey);
  }

  /*Create a new existing pivot model instance.*/
  public newExistingPivot(attributes: any[] = []) {
    return this.newPivot(attributes, true);
  }

  /*Set the columns on the pivot table to retrieve.*/
  public withPivot(columns: any[] | any) {
    let columns       = is_array(columns) ? columns : func_get_args();
    this.pivotColumns = [...this.pivotColumns, ...columns];
    return this;
  }

  /*Specify that the pivot table has creation and update timestamps.*/
  public withTimestamps(createdAt: any = null, updatedAt: any = null) {
    this.pivotCreatedAt = createdAt;
    this.pivotUpdatedAt = updatedAt;
    return this.withPivot(this.createdAt(), this.updatedAt());
  }

  /*Get the name of the "created at" column.*/
  public createdAt() {
    return this.pivotCreatedAt || this.parent.getCreatedAtColumn();
  }

  /*Get the name of the "updated at" column.*/
  public updatedAt() {
    return this.pivotUpdatedAt || this.parent.getUpdatedAtColumn();
  }

  /*Get the related model's updated at column name.*/
  public getRelatedFreshUpdate() {
    return {};
  }

  /*Get the key for comparing against the parent key in "has" query.*/
  public getHasCompareKey() {
    return this.getForeignKey();
  }

  /*Get the fully qualified foreign key for the relation.*/
  public getForeignKey() {
    return this.table + '.' + this.foreignKey;
  }

  /*Get the fully qualified "other key" for the relation.*/
  public getOtherKey() {
    return this.table + '.' + this.otherKey;
  }

  /*Get the intermediate table for the relationship.*/
  public getTable() {
    return this.table;
  }

  /*Get the relationship name for the relationship.*/
  public getRelationName() {
    return this.relationName;
  }
}
