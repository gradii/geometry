import { Scope } from '../../src/fedaco/scope';
import { DatabaseConfig } from '../../src/database-config';
import { Model } from '../../src/fedaco/model';

describe('test database eloquent global scopes', () => {
  beforeEach(() => {
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.bootEloquent();
  });
  afterAll(() => {
    Model.unsetConnectionResolver();
  });
  it('global scope is applied', () => {
    const model = new EloquentGlobalScopesTestModel();
    const query = model.newQuery();
    expect(query.toSql()).toBe('select * from "table" where "active" = ?');
    expect(query.getBindings()).toEqual([1]);
  });
  it('global scope can be removed', () => {
    const model = new EloquentGlobalScopesTestModel();
    const query = model.newQuery().withoutGlobalScope(ActiveScope);
    expect(query.toSql()).toBe('select * from "table"');
    expect(query.getBindings()).toEqual([]);
  });
  it('closure global scope is applied', () => {
    const model = new EloquentClosureGlobalScopesTestModel();
    const query = model.newQuery();
    expect(query.toSql()).toBe('select * from "table" where "active" = ? order by "name" asc');
    expect(query.getBindings()).toEqual([1]);
  });
  it('closure global scope can be removed', () => {
    const model = new EloquentClosureGlobalScopesTestModel();
    const query = model.newQuery().withoutGlobalScope('active_scope');
    expect(query.toSql()).toBe('select * from "table" order by "name" asc');
    expect(query.getBindings()).toEqual([]);
  });
  it('global scope can be removed after the query is executed', () => {
    const model = new EloquentClosureGlobalScopesTestModel();
    const query = model.newQuery();
    expect(query.toSql()).toBe('select * from "table" where "active" = ? order by "name" asc');
    expect(query.getBindings()).toEqual([1]);
    query.withoutGlobalScope('active_scope');
    expect(query.toSql()).toBe('select * from "table" order by "name" asc');
    expect(query.getBindings()).toEqual([]);
  });
  it('all global scopes can be removed', () => {
    const model = new EloquentClosureGlobalScopesTestModel();
    let query = model.newQuery().withoutGlobalScopes();
    expect(query.toSql()).toBe('select * from "table"');
    expect(query.getBindings()).toEqual([]);
    query = EloquentClosureGlobalScopesTestModel.withoutGlobalScopes();
    expect(query.toSql()).toBe('select * from "table"');
    expect(query.getBindings()).toEqual([]);
  });
  it('global scopes with or where conditions are nested', () => {
    const model = new EloquentClosureGlobalScopesWithOrTestModel();
    let query = model.newQuery();
    expect(query.toSql()).toBe(
      'select "email", "password" from "table" where ("email" = ? or "email" = ?) and "active" = ? order by "name" asc');
    expect(query.getBindings()).toEqual(['taylor@gmail.com', 'someone@else.com', 1]);
    query = model.newQuery().where('col1', 'val1').orWhere('col2', 'val2');
    expect(query.toSql()).toBe(
      'select "email", "password" from "table" where ("col1" = ? or "col2" = ?) and ("email" = ? or "email" = ?) and "active" = ? order by "name" asc');
    expect(query.getBindings()).toEqual(['val1', 'val2', 'taylor@gmail.com', 'someone@else.com', 1]);
  });
  it('regular scopes with or where conditions are nested', () => {
    const query = EloquentClosureGlobalScopesTestModel.withoutGlobalScopes().where('foo', 'foo').orWhere('bar',
      'bar').approved();
    expect(query.toSql()).toBe(
      'select * from "table" where ("foo" = ? or "bar" = ?) and ("approved" = ? or "should_approve" = ?)');
    expect(query.getBindings()).toEqual(['foo', 'bar', 1, 0]);
  });
  it('scopes starting with or boolean are preserved', () => {
    const query = EloquentClosureGlobalScopesTestModel.withoutGlobalScopes().where('foo', 'foo').orWhere('bar',
      'bar').orApproved();
    expect(query.toSql()).toBe(
      'select * from "table" where ("foo" = ? or "bar" = ?) or ("approved" = ? or "should_approve" = ?)');
    expect(query.getBindings()).toEqual(['foo', 'bar', 1, 0]);
  });
  it('has query where both models have global scopes', () => {
    const query     = EloquentGlobalScopesWithRelationModel.has('related').where('bar', 'baz');
    const subQuery  = 'select * from "table" where "table2"."id" = "table"."related_id" and "foo" = ? and "active" = ?';
    const mainQuery = 'select * from "table2" where exists (' + subQuery + ') and "bar" = ? and "active" = ? order by "name" asc';
    expect(query.toSql()).toEqual(mainQuery);
    expect(query.getBindings()).toEqual(['bar', 1, 'baz', 1]);
  });
});

export class EloquentClosureGlobalScopesTestModel extends Model {
  _table: any = 'table';

  public static boot() {
    EloquentClosureGlobalScopesTestModel.addGlobalScope(query => {
      query.orderBy('name');
    });
    EloquentClosureGlobalScopesTestModel.addGlobalScope('active_scope', query => {
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

  public related() {
    return this.hasMany(EloquentGlobalScopesTestModel, 'related_id').where('foo', 'bar');
  }
}

export class EloquentClosureGlobalScopesWithOrTestModel extends EloquentClosureGlobalScopesTestModel {
  public static boot() {
    EloquentClosureGlobalScopesWithOrTestModel.addGlobalScope('or_scope', query => {
      query.where('email', 'taylor@gmail.com').orWhere('email', 'someone@else.com');
    });
    EloquentClosureGlobalScopesWithOrTestModel.addGlobalScope(query => {
      query.select('email', 'password');
    });
    super.boot();
  }
}

export class EloquentGlobalScopesTestModel extends Model {
  _table: any = 'table';

  public static boot() {
    EloquentGlobalScopesTestModel.addGlobalScope(new ActiveScope());
    super.boot();
  }
}

export class ActiveScope implements Scope {
  public apply(builder, model) {
    return builder.where('active', 1);
  }
}
