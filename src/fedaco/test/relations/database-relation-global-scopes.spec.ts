import { HasManyColumn } from '../../src/annotation/relation-column/has-many.relation-column';
import { DatabaseConfig } from '../../src/database-config';
import { Model } from '../../src/fedaco/model';
import { Scope } from '../../src/fedaco/scope';
import { forwardRef } from '../../src/query-builder/forward-ref';

describe('test database eloquent global scopes', () => {
  beforeEach(() => {
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.bootEloquent();
    db.setAsGlobal();
  });
  afterAll(() => {
    Model.unsetConnectionResolver();
  });
  it('global scope is applied', () => {
    const model = new EloquentGlobalScopesTestModel();
    const query = model.newQuery();
    expect(query.toSql()).toEqual(
      {result: 'SELECT * FROM "_table" WHERE "active" = ?', bindings: [1]});
  });
  it('global scope can be removed', () => {
    const model = new EloquentGlobalScopesTestModel();
    const query = model.newQuery().withoutGlobalScope('active');
    expect(query.toSql()).toEqual({result: 'SELECT * FROM "_table"', bindings: []});
  });
  it('closure global scope is applied', () => {
    const model = new EloquentClosureGlobalScopesTestModel();
    const query = model.newQuery();
    expect(query.toSql()).toEqual(
      {result: 'SELECT * FROM "_table" WHERE "active" = ? ORDER BY "name" ASC', bindings: [1]});
  });
  it('closure global scope can be removed', () => {
    const model = new EloquentClosureGlobalScopesTestModel();
    const query = model.newQuery().withoutGlobalScope('active_scope');
    expect(query.toSql()).toEqual(
      {result: 'SELECT * FROM "_table" ORDER BY "name" ASC', bindings: []});
  });
  it('global scope can be removed after the query is executed', () => {
    const model = new EloquentClosureGlobalScopesTestModel();
    const query = model.newQuery();
    expect(query.toSql()).toEqual(
      {result: 'SELECT * FROM "_table" WHERE "active" = ? ORDER BY "name" ASC', bindings: [1]});
    query.withoutGlobalScope('active_scope');
    expect(query.toSql()).toEqual(
      {result: 'SELECT * FROM "_table" ORDER BY "name" ASC', bindings: []});
  });
  it('all global scopes can be removed', () => {
    const model = new EloquentClosureGlobalScopesTestModel();
    let query   = model.newQuery().withoutGlobalScopes();
    expect(query.toSql()).toEqual({result: 'SELECT * FROM "_table"', bindings: []});
    query = EloquentClosureGlobalScopesTestModel.createQuery().withoutGlobalScopes();
    expect(query.toSql()).toEqual({result: 'SELECT * FROM "_table"', bindings: []});
  });
  it('global scopes with or where conditions are nested', () => {
    const model = new EloquentClosureGlobalScopesWithOrTestModel();
    let query   = model.newQuery();
    expect(query.toSql()).toEqual(
      {
        result  : 'SELECT "email", "password" FROM "_table" WHERE "email" = ? OR "email" = ? AND "active" = ? ORDER BY "name" ASC',
        bindings: ['taylor@gmail.com', 'someone@else.com', 1]
      });
    query = model.newQuery().where('col1', 'val1').orWhere('col2', 'val2');
    expect(query.toSql()).toEqual(
      {
        result  : 'SELECT "email", "password" FROM "_table" WHERE "col1" = ? OR "col2" = ? AND "email" = ? OR "email" = ? AND "active" = ? ORDER BY "name" ASC',
        bindings: ['val1', 'val2', 'taylor@gmail.com', 'someone@else.com', 1]
      });
  });
  it('regular scopes with or where conditions are nested', () => {
    const query = EloquentClosureGlobalScopesTestModel.createQuery().withoutGlobalScopes().where(
      'foo', 'foo').orWhere('bar',
      'bar')._callNamedScope('approved');
    expect(query.toSql()).toEqual(
      {
        result  : 'SELECT * FROM "_table" WHERE "foo" = ? OR "bar" = ? AND "approved" = ? OR "should_approve" = ?',
        bindings: ['foo', 'bar', 1, 0]
      });
  });
  it('scopes starting with or boolean are preserved', () => {
    const query = EloquentClosureGlobalScopesTestModel.createQuery().withoutGlobalScopes().where(
      'foo', 'foo')
      .orWhere('bar', 'bar')
      ._callNamedScope('orApproved');
    expect(query.toSql()).toEqual(
      {
        result  : 'SELECT * FROM "_table" WHERE "foo" = ? OR "bar" = ? OR "approved" = ? OR "should_approve" = ?',
        bindings: ['foo', 'bar', 1, 0]
      });
  });
  it('has query where both models have global scopes', () => {
    const query     = EloquentGlobalScopesWithRelationModel.createQuery().has('related').where(
      'bar', 'baz');
    const subQuery  = 'SELECT * FROM "_table" WHERE "table2"."id" = "_table"."related_id" AND "foo" = ? AND "active" = ?';
    const mainQuery = 'SELECT * FROM "table2" WHERE EXISTS (' + subQuery + ') AND "bar" = ? AND "active" = ? ORDER BY "name" ASC';
    expect(query.toSql()).toEqual({result: mainQuery, bindings: ['bar', 1, 'baz', 1]});
  });
});

export class EloquentClosureGlobalScopesTestModel extends Model {
  _table: any = '_table';

  public boot() {
    (this.constructor as typeof EloquentClosureGlobalScopesTestModel).addGlobalScope('order_name',
      query => {
        query.orderBy('name');
      });
    (this.constructor as typeof EloquentClosureGlobalScopesTestModel).addGlobalScope('active_scope',
      query => {
        query.where('active', 1);
      });
    super.boot();
  }

  public scopeApproved(query) {
    return query.where('approved', 1).orWhere('should_approve', 0);
  }

  public scopeOrApproved(query) {
    return query.orWhere('approved', 1).orWhere('should_approve', 0);
  }
}

export class EloquentGlobalScopesWithRelationModel extends EloquentClosureGlobalScopesTestModel {
  _table: any = 'table2';

  @HasManyColumn({
    related   : forwardRef(() => EloquentGlobalScopesTestModel),
    foreignKey: 'related_id',
    onQuery   : (q => {
      q.where('foo', 'bar');
    })
  })
  public related;
}

export class EloquentClosureGlobalScopesWithOrTestModel extends EloquentClosureGlobalScopesTestModel {
  public boot() {
    EloquentClosureGlobalScopesWithOrTestModel.addGlobalScope('or_scope', query => {
      query.where('email', 'taylor@gmail.com').orWhere('email', 'someone@else.com');
    });
    EloquentClosureGlobalScopesWithOrTestModel.addGlobalScope('email_password', query => {
      query.select('email', 'password');
    });
    super.boot();
  }
}

export class EloquentGlobalScopesTestModel extends Model {
  _table: any = '_table';

  public boot() {
    EloquentGlobalScopesTestModel.addGlobalScope('active', new ActiveScope());
    super.boot();
  }
}

export class ActiveScope extends Scope {
  public apply(builder, model) {
    return builder.where('active', 1);
  }
}
