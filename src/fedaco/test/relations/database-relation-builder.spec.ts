import { BadMethodCallException } from 'BadMethodCallException';
import { ConnectionInterface } from 'Illuminate/Database/ConnectionInterface';
import { ConnectionResolverInterface } from 'Illuminate/Database/ConnectionResolverInterface';
import { Builder } from 'Illuminate/Database/Eloquent/Builder';
import { Collection } from 'Illuminate/Database/Eloquent/Collection';
import { Model } from 'Illuminate/Database/Eloquent/Model';
import { ModelNotFoundException } from 'Illuminate/Database/Eloquent/ModelNotFoundException';
import { RelationNotFoundException } from 'Illuminate/Database/Eloquent/RelationNotFoundException';
import { Builder as BaseBuilder } from 'Illuminate/Database/Query/Builder';
import { Grammar } from 'Illuminate/Database/Query/Grammars/Grammar';
import { Processor } from 'Illuminate/Database/Query/Processors/Processor';
import { Carbon } from 'Illuminate/Support/Carbon';
import { Collection as BaseCollection } from 'Illuminate/Support/Collection';
import { Mockery as m } from 'Mockery';

describe('test database eloquent builder', () => {
  it('tear down', () => {
    m.close();
  });

  it('find method', () => {
    var builder = m.mock(Builder + '[first]', [this.getMockQueryBuilder()]);
    builder.setModel(this.getMockModel());
    builder.getQuery().shouldReceive('where').once()._with('foo_table.foo', '=', 'bar');
    builder.shouldReceive('first')._with(['column']).andReturn('baz');
    var result = builder.find('bar', ['column']);
    expect(result).toBe('baz');
  });

  it('find many method', () => {
    var builder = m.mock(Builder + '[get]', [this.getMockQueryBuilder()]);
    builder.setModel(this.getMockModel());
    builder.getQuery().shouldReceive('whereIn').once()._with('foo_table.foo', ['one', 'two']);
    builder.shouldReceive('get')._with(['column']).andReturn(['baz']);
    var result = builder.findMany(['one', 'two'], ['column']);
    expect(result).toEqual(['baz']);
    var builder = m.mock(Builder + '[get]', [this.getMockQueryBuilder()]);
    var model = this.getMockModel();
    model.shouldReceive('newCollection').once().withNoArgs().andReturn('emptycollection');
    builder.setModel(model);
    builder.getQuery().shouldNotReceive('whereIn');
    builder.shouldNotReceive('get');
    var result = builder.findMany([], ['column']);
    expect(result).toBe('emptycollection');
    var builder = m.mock(Builder + '[get]', [this.getMockQueryBuilder()]);
    var model = this.getMockModel();
    model.shouldReceive('newCollection').once().withNoArgs().andReturn('emptycollection');
    builder.setModel(model);
    builder.getQuery().shouldNotReceive('whereIn');
    builder.shouldNotReceive('get');
    var result = builder.findMany(collect(), ['column']);
    expect(result).toBe('emptycollection');
  });
  it('find or new method model found', () => {
    var model = this.getMockModel();
    model.shouldReceive('findOrNew').once().andReturn('baz');
    var builder = m.mock(Builder + '[first]', [this.getMockQueryBuilder()]);
    builder.setModel(model);
    builder.getQuery().shouldReceive('where').once()._with('foo_table.foo', '=', 'bar');
    builder.shouldReceive('first')._with(['column']).andReturn('baz');
    var expected = model.findOrNew('bar', ['column']);
    var result = builder.find('bar', ['column']);
    expect(result).toEqual(expected);
  });
  it('find or new method model not found', () => {
    var model = this.getMockModel();
    model.shouldReceive('findOrNew').once().andReturn(m.mock(Model));
    var builder = m.mock(Builder + '[first]', [this.getMockQueryBuilder()]);
    builder.setModel(model);
    builder.getQuery().shouldReceive('where').once()._with('foo_table.foo', '=', 'bar');
    builder.shouldReceive('first')._with(['column']).andReturn(null);
    var result = model.findOrNew('bar', ['column']);
    var findResult = builder.find('bar', ['column']);
    expect(findResult).toNull();
    expect(result).toInstanceOf(Model);
  });
  it('find or fail method throws model not found exception', () => {
    this.expectException(ModelNotFoundException);
    var builder = m.mock(Builder + '[first]', [this.getMockQueryBuilder()]);
    builder.setModel(this.getMockModel());
    builder.getQuery().shouldReceive('where').once()._with('foo_table.foo', '=', 'bar');
    builder.shouldReceive('first')._with(['column']).andReturn(null);
    builder.findOrFail('bar', ['column']);
  });
  it('find or fail method with many throws model not found exception', () => {
    this.expectException(ModelNotFoundException);
    var builder = m.mock(Builder + '[get]', [this.getMockQueryBuilder()]);
    builder.setModel(this.getMockModel());
    builder.getQuery().shouldReceive('whereIn').once()._with('foo_table.foo', [1, 2]);
    builder.shouldReceive('get')._with(['column']).andReturn(new Collection([1]));
    builder.findOrFail([1, 2], ['column']);
  });
  it('find or fail method with many using collection throws model not found exception', () => {
    this.expectException(ModelNotFoundException);
    var builder = m.mock(Builder + '[get]', [this.getMockQueryBuilder()]);
    builder.setModel(this.getMockModel());
    builder.getQuery().shouldReceive('whereIn').once()._with('foo_table.foo', [1, 2]);
    builder.shouldReceive('get')._with(['column']).andReturn(new Collection([1]));
    builder.findOrFail(new Collection([1, 2]), ['column']);
  });
  it('first or fail method throws model not found exception', () => {
    this.expectException(ModelNotFoundException);
    var builder = m.mock(Builder + '[first]', [this.getMockQueryBuilder()]);
    builder.setModel(this.getMockModel());
    builder.shouldReceive('first')._with(['column']).andReturn(null);
    builder.firstOrFail(['column']);
  });
  it('find with many', () => {
    var builder = m.mock(Builder + '[get]', [this.getMockQueryBuilder()]);
    builder.getQuery().shouldReceive('whereIn').once()._with('foo_table.foo', [1, 2]);
    builder.setModel(this.getMockModel());
    builder.shouldReceive('get')._with(['column']).andReturn('baz');
    var result = builder.find([1, 2], ['column']);
    expect(result).toBe('baz');
  });
  it('find with many using collection', () => {
    var ids = collect([1, 2]);
    var builder = m.mock(Builder + '[get]', [this.getMockQueryBuilder()]);
    builder.getQuery().shouldReceive('whereIn').once()._with('foo_table.foo', [1, 2]);
    builder.setModel(this.getMockModel());
    builder.shouldReceive('get')._with(['column']).andReturn('baz');
    var result = builder.find(ids, ['column']);
    expect(result).toBe('baz');
  });
  it('first method', () => {
    var builder = m.mock(Builder + '[get,take]', [this.getMockQueryBuilder()]);
    builder.shouldReceive('take')._with(1).andReturnSelf();
    builder.shouldReceive('get')._with(['*']).andReturn(new Collection(['bar']));
    var result = builder.first();
    expect(result).toBe('bar');
  });
  it('qualify column', () => {
    var builder = new Builder(m.mock(BaseBuilder));
    builder.shouldReceive('from')._with('stub');
    builder.setModel(new EloquentModelStub());
    expect(builder.qualifyColumn('column')).toBe('stub.column');
  });
  it('get method loads models and hydrates eager relations', () => {
    var builder = m.mock(Builder + '[getModels,eagerLoadRelations]', [this.getMockQueryBuilder()]);
    builder.shouldReceive('applyScopes').andReturnSelf();
    builder.shouldReceive('getModels')._with(['foo']).andReturn(['bar']);
    builder.shouldReceive('eagerLoadRelations')._with(['bar']).andReturn(['bar', 'baz']);
    builder.setModel(this.getMockModel());
    builder.getModel().shouldReceive('newCollection')._with(['bar', 'baz']).andReturn(new Collection(['bar', 'baz']));
    var results = builder.get(['foo']);
    expect(results.all()).toEqual(['bar', 'baz']);
  });
  it('get method doesnt hydrate eager relations when no results are returned', () => {
    var builder = m.mock(Builder + '[getModels,eagerLoadRelations]', [this.getMockQueryBuilder()]);
    builder.shouldReceive('applyScopes').andReturnSelf();
    builder.shouldReceive('getModels')._with(['foo']).andReturn([]);
    builder.shouldReceive('eagerLoadRelations').never();
    builder.setModel(this.getMockModel());
    builder.getModel().shouldReceive('newCollection')._with([]).andReturn(new Collection([]));
    var results = builder.get(['foo']);
    expect(results.all()).toEqual([]);
  });
  it('value method with model found', () => {
    var builder = m.mock(Builder + '[first]', [this.getMockQueryBuilder()]);
    var mockModel = new stdClass();
    mockModel.name = 'foo';
    builder.shouldReceive('first')._with(['name']).andReturn(mockModel);
    expect(builder.value('name')).toBe('foo');
  });
  it('value method with model not found', () => {
    var builder = m.mock(Builder + '[first]', [this.getMockQueryBuilder()]);
    builder.shouldReceive('first')._with(['name']).andReturn(null);
    expect(builder.value('name')).toNull();
  });
  it('chunk with last chunk complete', () => {
    var builder = m.mock(Builder + '[forPage,get]', [this.getMockQueryBuilder()]);
    builder.getQuery().orders.push({
      'column': 'foobar',
      'direction': 'asc'
    });
    var chunk1 = new Collection(['foo1', 'foo2']);
    var chunk2 = new Collection(['foo3', 'foo4']);
    var chunk3 = new Collection([]);
    builder.shouldReceive('forPage').once()._with(1, 2).andReturnSelf();
    builder.shouldReceive('forPage').once()._with(2, 2).andReturnSelf();
    builder.shouldReceive('forPage').once()._with(3, 2).andReturnSelf();
    builder.shouldReceive('get').times(3).andReturn(chunk1, chunk2, chunk3);
    var callbackAssertor = m.mock(stdClass);
    callbackAssertor.shouldReceive('doSomething').once()._with(chunk1);
    callbackAssertor.shouldReceive('doSomething').once()._with(chunk2);
    callbackAssertor.shouldReceive('doSomething').never()._with(chunk3);
    builder.chunk(2, results => {
      callbackAssertor.doSomething(results);
    });
  });
  it('chunk with last chunk partial', () => {
    var builder = m.mock(Builder + '[forPage,get]', [this.getMockQueryBuilder()]);
    builder.getQuery().orders.push({
      'column': 'foobar',
      'direction': 'asc'
    });
    var chunk1 = new Collection(['foo1', 'foo2']);
    var chunk2 = new Collection(['foo3']);
    builder.shouldReceive('forPage').once()._with(1, 2).andReturnSelf();
    builder.shouldReceive('forPage').once()._with(2, 2).andReturnSelf();
    builder.shouldReceive('get').times(2).andReturn(chunk1, chunk2);
    var callbackAssertor = m.mock(stdClass);
    callbackAssertor.shouldReceive('doSomething').once()._with(chunk1);
    callbackAssertor.shouldReceive('doSomething').once()._with(chunk2);
    builder.chunk(2, results => {
      callbackAssertor.doSomething(results);
    });
  });
  it('chunk can be stopped by returning false', () => {
    var builder = m.mock(Builder + '[forPage,get]', [this.getMockQueryBuilder()]);
    builder.getQuery().orders.push({
      'column': 'foobar',
      'direction': 'asc'
    });
    var chunk1 = new Collection(['foo1', 'foo2']);
    var chunk2 = new Collection(['foo3']);
    builder.shouldReceive('forPage').once()._with(1, 2).andReturnSelf();
    builder.shouldReceive('forPage').never()._with(2, 2);
    builder.shouldReceive('get').times(1).andReturn(chunk1);
    var callbackAssertor = m.mock(stdClass);
    callbackAssertor.shouldReceive('doSomething').once()._with(chunk1);
    callbackAssertor.shouldReceive('doSomething').never()._with(chunk2);
    builder.chunk(2, results => {
      callbackAssertor.doSomething(results);
      return false;
    });
  });
  it('chunk with count zero', () => {
    var builder = m.mock(Builder + '[forPage,get]', [this.getMockQueryBuilder()]);
    builder.getQuery().orders.push({
      'column': 'foobar',
      'direction': 'asc'
    });
    var chunk = new Collection([]);
    builder.shouldReceive('forPage').once()._with(1, 0).andReturnSelf();
    builder.shouldReceive('get').times(1).andReturn(chunk);
    var callbackAssertor = m.mock(stdClass);
    callbackAssertor.shouldReceive('doSomething').never();
    builder.chunk(0, results => {
      callbackAssertor.doSomething(results);
    });
  });
  it('chunk paginates using id with last chunk complete', () => {
    var builder = m.mock(Builder + '[forPageAfterId,get]', [this.getMockQueryBuilder()]);
    builder.getQuery().orders.push({
      'column': 'foobar',
      'direction': 'asc'
    });
    var chunk1 = new Collection([/*cast type object*/ {
      'someIdField': 1
    }, /*cast type object*/ {
      'someIdField': 2
    }]);
    var chunk2 = new Collection([/*cast type object*/ {
      'someIdField': 10
    }, /*cast type object*/ {
      'someIdField': 11
    }]);
    var chunk3 = new Collection([]);
    builder.shouldReceive('forPageAfterId').once()._with(2, 0, 'someIdField').andReturnSelf();
    builder.shouldReceive('forPageAfterId').once()._with(2, 2, 'someIdField').andReturnSelf();
    builder.shouldReceive('forPageAfterId').once()._with(2, 11, 'someIdField').andReturnSelf();
    builder.shouldReceive('get').times(3).andReturn(chunk1, chunk2, chunk3);
    var callbackAssertor = m.mock(stdClass);
    callbackAssertor.shouldReceive('doSomething').once()._with(chunk1);
    callbackAssertor.shouldReceive('doSomething').once()._with(chunk2);
    callbackAssertor.shouldReceive('doSomething').never()._with(chunk3);
    builder.chunkById(2, results => {
      callbackAssertor.doSomething(results);
    }, 'someIdField');
  });
  it('chunk paginates using id with last chunk partial', () => {
    var builder = m.mock(Builder + '[forPageAfterId,get]', [this.getMockQueryBuilder()]);
    builder.getQuery().orders.push({
      'column': 'foobar',
      'direction': 'asc'
    });
    var chunk1 = new Collection([/*cast type object*/ {
      'someIdField': 1
    }, /*cast type object*/ {
      'someIdField': 2
    }]);
    var chunk2 = new Collection([/*cast type object*/ {
      'someIdField': 10
    }]);
    builder.shouldReceive('forPageAfterId').once()._with(2, 0, 'someIdField').andReturnSelf();
    builder.shouldReceive('forPageAfterId').once()._with(2, 2, 'someIdField').andReturnSelf();
    builder.shouldReceive('get').times(2).andReturn(chunk1, chunk2);
    var callbackAssertor = m.mock(stdClass);
    callbackAssertor.shouldReceive('doSomething').once()._with(chunk1);
    callbackAssertor.shouldReceive('doSomething').once()._with(chunk2);
    builder.chunkById(2, results => {
      callbackAssertor.doSomething(results);
    }, 'someIdField');
  });
  it('chunk paginates using id with count zero', () => {
    var builder = m.mock(Builder + '[forPageAfterId,get]', [this.getMockQueryBuilder()]);
    builder.getQuery().orders.push({
      'column': 'foobar',
      'direction': 'asc'
    });
    var chunk = new Collection([]);
    builder.shouldReceive('forPageAfterId').once()._with(0, 0, 'someIdField').andReturnSelf();
    builder.shouldReceive('get').times(1).andReturn(chunk);
    var callbackAssertor = m.mock(stdClass);
    callbackAssertor.shouldReceive('doSomething').never();
    builder.chunkById(0, results => {
      callbackAssertor.doSomething(results);
    }, 'someIdField');
  });
  it('pluck returns the mutated attributes of a model', () => {
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('pluck')._with('name', '').andReturn(new BaseCollection(['bar', 'baz']));
    builder.setModel(this.getMockModel());
    builder.getModel().shouldReceive('hasGetMutator')._with('name').andReturn(true);
    builder.getModel().shouldReceive('newFromBuilder')._with({
      'name': 'bar'
    }).andReturn(new EloquentBuilderTestPluckStub({
      'name': 'bar'
    }));
    builder.getModel().shouldReceive('newFromBuilder')._with({
      'name': 'baz'
    }).andReturn(new EloquentBuilderTestPluckStub({
      'name': 'baz'
    }));
    expect(builder.pluck('name').all()).toEqual(['foo_bar', 'foo_baz']);
  });
  it('pluck returns the casted attributes of a model', () => {
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('pluck')._with('name', '').andReturn(new BaseCollection(['bar', 'baz']));
    builder.setModel(this.getMockModel());
    builder.getModel().shouldReceive('hasGetMutator')._with('name').andReturn(false);
    builder.getModel().shouldReceive('hasCast')._with('name').andReturn(true);
    builder.getModel().shouldReceive('newFromBuilder')._with({
      'name': 'bar'
    }).andReturn(new EloquentBuilderTestPluckStub({
      'name': 'bar'
    }));
    builder.getModel().shouldReceive('newFromBuilder')._with({
      'name': 'baz'
    }).andReturn(new EloquentBuilderTestPluckStub({
      'name': 'baz'
    }));
    expect(builder.pluck('name').all()).toEqual(['foo_bar', 'foo_baz']);
  });
  it('pluck returns the date attributes of a model', () => {
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('pluck')._with('created_at', '').andReturn(new BaseCollection(['2010-01-01 00:00:00', '2011-01-01 00:00:00']));
    builder.setModel(this.getMockModel());
    builder.getModel().shouldReceive('hasGetMutator')._with('created_at').andReturn(false);
    builder.getModel().shouldReceive('hasCast')._with('created_at').andReturn(false);
    builder.getModel().shouldReceive('getDates').andReturn(['created_at']);
    builder.getModel().shouldReceive('newFromBuilder')._with({
      'created_at': '2010-01-01 00:00:00'
    }).andReturn(new EloquentBuilderTestPluckDatesStub({
      'created_at': '2010-01-01 00:00:00'
    }));
    builder.getModel().shouldReceive('newFromBuilder')._with({
      'created_at': '2011-01-01 00:00:00'
    }).andReturn(new EloquentBuilderTestPluckDatesStub({
      'created_at': '2011-01-01 00:00:00'
    }));
    expect(builder.pluck('created_at').all()).toEqual(['date_2010-01-01 00:00:00', 'date_2011-01-01 00:00:00']);
  });
  it('pluck without model getter just returns the attributes found in database', () => {
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('pluck')._with('name', '').andReturn(new BaseCollection(['bar', 'baz']));
    builder.setModel(this.getMockModel());
    builder.getModel().shouldReceive('hasGetMutator')._with('name').andReturn(false);
    builder.getModel().shouldReceive('hasCast')._with('name').andReturn(false);
    builder.getModel().shouldReceive('getDates').andReturn(['created_at']);
    expect(builder.pluck('name').all()).toEqual(['bar', 'baz']);
  });
  it('local macros are called on builder', () => {
    delete _SERVER['__test.builder'];
    var builder = new Builder(new BaseBuilder(m.mock(ConnectionInterface), m.mock(Grammar), m.mock(Processor)));
    builder.macro('fooBar', builder => {
      _SERVER['__test.builder'] = builder;
      return builder;
    });
    var result = builder.fooBar();
    expect(builder.hasMacro('fooBar')).toBeTruthy();
    expect(result).toEqual(builder);
    expect(_SERVER['__test.builder']).toEqual(builder);
    delete _SERVER['__test.builder'];
  });
  it('global macros are called on builder', () => {
    Builder.macro('foo', bar => {
      return bar;
    });
    Builder.macro('bam', [Builder, 'getQuery']);
    var builder = this.getBuilder();
    expect(Builder.hasGlobalMacro('foo')).toBeTruthy();
    expect('bar').toEqual(builder.foo('bar'));
    expect(builder.getQuery()).toEqual(builder.bam());
  });
  it('missing static macros throws proper exception', () => {
    this.expectException(BadMethodCallException);
    this.expectExceptionMessage('Call to undefined method Illuminate\\Database\\Eloquent\\Builder::missingMacro()');
    Builder.missingMacro();
  });
  it('get models properly hydrates models', () => {
    var builder = m.mock(Builder + '[get]', [this.getMockQueryBuilder()]);
    records.push({
      'name': 'taylor',
      'age': 26
    });
    records.push({
      'name': 'dayle',
      'age': 28
    });
    builder.getQuery().shouldReceive('get').once()._with(['foo']).andReturn(new BaseCollection(records));
    var model = m.mock(Model + '[getTable,hydrate]');
    model.shouldReceive('getTable').once().andReturn('foo_table');
    builder.setModel(model);
    model.shouldReceive('hydrate').once()._with(records).andReturn(new Collection(['hydrated']));
    var models = builder.getModels(['foo']);
    expect(['hydrated']).toEqual(models);
  });
  it('eager load relations load top level relationships', () => {
    var builder = m.mock(Builder + '[eagerLoadRelation]', [this.getMockQueryBuilder()]);
    var nop1 = () => {
    };
    var nop2 = () => {
    };
    builder.setEagerLoads({
      'foo': nop1,
      'foo.bar': nop2
    });
    builder.shouldAllowMockingProtectedMethods().shouldReceive('eagerLoadRelation')._with(['models'], 'foo', nop1).andReturn(['foo']);
    var results = builder.eagerLoadRelations(['models']);
    expect(results).toEqual(['foo']);
  });
  it('relationship eager load process', () => {
    var builder = m.mock(Builder + '[getRelation]', [this.getMockQueryBuilder()]);
    builder.setEagerLoads({
      'orders': query => {
        _SERVER['__eloquent.constrain'] = query;
      }
    });
    var relation = m.mock(stdClass);
    relation.shouldReceive('addEagerConstraints').once()._with(['models']);
    relation.shouldReceive('initRelation').once()._with(['models'], 'orders').andReturn(['models']);
    relation.shouldReceive('getEager').once().andReturn(['results']);
    relation.shouldReceive('match').once()._with(['models'], ['results'], 'orders').andReturn(['models.matched']);
    builder.shouldReceive('getRelation').once()._with('orders').andReturn(relation);
    var results = builder.eagerLoadRelations(['models']);
    expect(results).toEqual(['models.matched']);
    expect(_SERVER['__eloquent.constrain']).toEqual(relation);
    delete _SERVER['__eloquent.constrain'];
  });
  it('get relation properly sets nested relationships', () => {
    var builder = this.getBuilder();
    builder.setModel(this.getMockModel());
    builder.getModel().shouldReceive('newInstance->orders').once().andReturn(relation = m.mock(stdClass));
    var relationQuery = m.mock(stdClass);
    relation.shouldReceive('getQuery').andReturn(relationQuery);
    relationQuery.shouldReceive('with').once()._with({
      'lines': null,
      'lines.details': null
    });
    builder.setEagerLoads({
      'orders': null,
      'orders.lines': null,
      'orders.lines.details': null
    });
    builder.getRelation('orders');
  });
  it('get relation properly sets nested relationships with similar names', () => {
    var builder = this.getBuilder();
    builder.setModel(this.getMockModel());
    builder.getModel().shouldReceive('newInstance->orders').once().andReturn(relation = m.mock(stdClass));
    builder.getModel().shouldReceive('newInstance->ordersGroups').once().andReturn(groupsRelation = m.mock(stdClass));
    var relationQuery = m.mock(stdClass);
    relation.shouldReceive('getQuery').andReturn(relationQuery);
    var groupRelationQuery = m.mock(stdClass);
    groupsRelation.shouldReceive('getQuery').andReturn(groupRelationQuery);
    groupRelationQuery.shouldReceive('with').once()._with({
      'lines': null,
      'lines.details': null
    });
    builder.setEagerLoads({
      'orders': null,
      'ordersGroups': null,
      'ordersGroups.lines': null,
      'ordersGroups.lines.details': null
    });
    builder.getRelation('orders');
    builder.getRelation('ordersGroups');
  });
  it('get relation throws exception', () => {
    this.expectException(RelationNotFoundException);
    var builder = this.getBuilder();
    builder.setModel(this.getMockModel());
    builder.getRelation('invalid');
  });
  it('eager load parsing sets proper relationships', () => {
    var builder = this.getBuilder();
    builder._with(['orders', 'orders.lines']);
    var eagers = builder.getEagerLoads();
    expect(array_keys(eagers)).toEqual(['orders', 'orders.lines']);
    expect(eagers['orders']).toInstanceOf(Closure);
    expect(eagers['orders.lines']).toInstanceOf(Closure);
    var builder = this.getBuilder();
    builder._with('orders', 'orders.lines');
    var eagers = builder.getEagerLoads();
    expect(array_keys(eagers)).toEqual(['orders', 'orders.lines']);
    expect(eagers['orders']).toInstanceOf(Closure);
    expect(eagers['orders.lines']).toInstanceOf(Closure);
    var builder = this.getBuilder();
    builder._with(['orders.lines']);
    var eagers = builder.getEagerLoads();
    expect(array_keys(eagers)).toEqual(['orders', 'orders.lines']);
    expect(eagers['orders']).toInstanceOf(Closure);
    expect(eagers['orders.lines']).toInstanceOf(Closure);
    var builder = this.getBuilder();
    builder._with({
      'orders': () => {
        return 'foo';
      }
    });
    var eagers = builder.getEagerLoads();
    expect(eagers['orders']()).toBe('foo');
    var builder = this.getBuilder();
    builder._with({
      'orders.lines': () => {
        return 'foo';
      }
    });
    var eagers = builder.getEagerLoads();
    expect(eagers['orders']).toInstanceOf(Closure);
    expect(eagers['orders']()).toNull();
    expect(eagers['orders.lines']()).toBe('foo');
  });
  it('query pass thru', () => {
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('foobar').once().andReturn('foo');
    expect(builder.foobar()).toInstanceOf(Builder);
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('insert').once()._with(['bar']).andReturn('foo');
    expect(builder.insert(['bar'])).toBe('foo');
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('insertOrIgnore').once()._with(['bar']).andReturn('foo');
    expect(builder.insertOrIgnore(['bar'])).toBe('foo');
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('insertGetId').once()._with(['bar']).andReturn('foo');
    expect(builder.insertGetId(['bar'])).toBe('foo');
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('insertUsing').once()._with(['bar'], 'baz').andReturn('foo');
    expect(builder.insertUsing(['bar'], 'baz')).toBe('foo');
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('raw').once()._with('bar').andReturn('foo');
    expect(builder.raw('bar')).toBe('foo');
    var builder = this.getBuilder();
    var grammar = new Grammar();
    builder.getQuery().shouldReceive('getGrammar').once().andReturn(grammar);
    expect(builder.getGrammar()).toEqual(grammar);
  });
  it('query scopes', () => {
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('from');
    builder.getQuery().shouldReceive('where').once()._with('foo', 'bar');
    builder.setModel(model = new EloquentBuilderTestScopeStub());
    var result = builder.approved();
    expect(result).toEqual(builder);
  });
  it('nested where', () => {
    var nestedQuery = m.mock(Builder);
    var nestedRawQuery = this.getMockQueryBuilder();
    nestedQuery.shouldReceive('getQuery').once().andReturn(nestedRawQuery);
    var model = this.getMockModel().makePartial();
    model.shouldReceive('newQueryWithoutRelationships').once().andReturn(nestedQuery);
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('from');
    builder.setModel(model);
    builder.getQuery().shouldReceive('addNestedWhereQuery').once()._with(nestedRawQuery, 'and');
    nestedQuery.shouldReceive('foo').once();
    var result = builder.where(query => {
      query.foo();
    });
    expect(result).toEqual(builder);
  });
  it('real nested where with scopes', () => {
    var model = new EloquentBuilderTestNestedStub();
    this.mockConnectionForModel(model, 'SQLite');
    var query = model.newQuery().where('foo', '=', 'bar').where(query => {
      query.where('baz', '>', 9000);
    });
    expect(query.toSql()).toBe('select * from "table" where "foo" = ? and ("baz" > ?) and "table"."deleted_at" is null');
    expect(query.getBindings()).toEqual(['bar', 9000]);
  });
  it('real nested where with scopes macro', () => {
    var model = new EloquentBuilderTestNestedStub();
    this.mockConnectionForModel(model, 'SQLite');
    var query = model.newQuery().where('foo', '=', 'bar').where(query => {
      query.where('baz', '>', 9000).onlyTrashed();
    }).withTrashed();
    expect(query.toSql()).toBe('select * from "table" where "foo" = ? and ("baz" > ? and "table"."deleted_at" is not null)');
    expect(query.getBindings()).toEqual(['bar', 9000]);
  });
  it('real nested where with multiple scopes and one dead scope', () => {
    var model = new EloquentBuilderTestNestedStub();
    this.mockConnectionForModel(model, 'SQLite');
    var query = model.newQuery().empty().where('foo', '=', 'bar').empty().where(query => {
      query.empty().where('baz', '>', 9000);
    });
    expect(query.toSql()).toBe('select * from "table" where "foo" = ? and ("baz" > ?) and "table"."deleted_at" is null');
    expect(query.getBindings()).toEqual(['bar', 9000]);
  });
  it('real query higher order or where scopes', () => {
    var model = new EloquentBuilderTestHigherOrderWhereScopeStub();
    this.mockConnectionForModel(model, 'SQLite');
    var query = model.newQuery().one().orWhere.two();
    expect(query.toSql()).toBe('select * from "table" where "one" = ? or ("two" = ?)');
  });
  it('real query chained higher order or where scopes', () => {
    var model = new EloquentBuilderTestHigherOrderWhereScopeStub();
    this.mockConnectionForModel(model, 'SQLite');
    var query = model.newQuery().one().orWhere.two().orWhere.three();
    expect(query.toSql()).toBe('select * from "table" where "one" = ? or ("two" = ?) or ("three" = ?)');
  });
  it('simple where', () => {
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('where').once()._with('foo', '=', 'bar');
    var result = builder.where('foo', '=', 'bar');
    expect(builder).toEqual(result);
  });
  it('postgres operators where', () => {
    var builder = this.getBuilder();
    builder.getQuery().shouldReceive('where').once()._with('foo', '@>', 'bar');
    var result = builder.where('foo', '@>', 'bar');
    expect(builder).toEqual(result);
  });
  it('delete override', () => {
    var builder = this.getBuilder();
    builder.onDelete(builder => {
      return {
        'foo': builder
      };
    });
    expect(builder.delete()).toEqual({
      'foo': builder
    });
  });
  it('with count', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.withCount('foo');
    expect(builder.toSql()).toBe('select "eloquent_builder_test_model_parent_stubs".*, (select count(*) from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id") as "foo_count" from "eloquent_builder_test_model_parent_stubs"');
  });
  it('with count and select', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.select('id').withCount('foo');
    expect(builder.toSql()).toBe('select "id", (select count(*) from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id") as "foo_count" from "eloquent_builder_test_model_parent_stubs"');
  });
  it('with count and merged wheres', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.select('id').withCount({
      'activeFoo': q => {
        q.where('bam', '>', 'qux');
      }
    });
    expect(builder.toSql()).toBe('select "id", (select count(*) from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id" and "bam" > ? and "active" = ?) as "active_foo_count" from "eloquent_builder_test_model_parent_stubs"');
    expect(builder.getBindings()).toEqual(['qux', true]);
  });
  it('with count and global scope', () => {
    var model = new EloquentBuilderTestModelParentStub();
    EloquentBuilderTestModelCloseRelatedStub.addGlobalScope('withCount', query => {
      return query.addSelect('id');
    });
    var builder = model.select('id').withCount(['foo']);
    EloquentBuilderTestModelCloseRelatedStub.addGlobalScope('withCount', query => {
    });
    expect(builder.toSql()).toBe('select "id", (select count(*) from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id") as "foo_count" from "eloquent_builder_test_model_parent_stubs"');
  });
  it('with count and constraints and having', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.where('bar', 'baz');
    builder.withCount({
      'foo': q => {
        q.where('bam', '>', 'qux');
      }
    }).having('foo_count', '>=', 1);
    expect(builder.toSql()).toBe('select "eloquent_builder_test_model_parent_stubs".*, (select count(*) from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id" and "bam" > ?) as "foo_count" from "eloquent_builder_test_model_parent_stubs" where "bar" = ? having "foo_count" >= ?');
    expect(builder.getBindings()).toEqual(['qux', 'baz', 1]);
  });
  it('with count and rename', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.withCount('foo as foo_bar');
    expect(builder.toSql()).toBe('select "eloquent_builder_test_model_parent_stubs".*, (select count(*) from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id") as "foo_bar" from "eloquent_builder_test_model_parent_stubs"');
  });
  it('with count multiple and partial rename', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.withCount(['foo as foo_bar', 'foo']);
    expect(builder.toSql()).toBe('select "eloquent_builder_test_model_parent_stubs".*, (select count(*) from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id") as "foo_bar", (select count(*) from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id") as "foo_count" from "eloquent_builder_test_model_parent_stubs"');
  });
  it('has with constraints and having in subquery', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.where('bar', 'baz');
    builder.whereHas('foo', q => {
      q.having('bam', '>', 'qux');
    }).where('quux', 'quuux');
    expect(builder.toSql()).toBe('select * from "eloquent_builder_test_model_parent_stubs" where "bar" = ? and exists (select * from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id" having "bam" > ?) and "quux" = ?');
    expect(builder.getBindings()).toEqual(['baz', 'qux', 'quuux']);
  });
  it('has with constraints with or where and having in subquery', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.where('name', 'larry');
    builder.whereHas('address', q => {
      q.where('zipcode', '90210');
      q.orWhere('zipcode', '90220');
      q.having('street', '=', 'fooside dr');
    }).where('age', 29);
    expect(builder.toSql()).toBe('select * from "eloquent_builder_test_model_parent_stubs" where "name" = ? and exists (select * from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id" and ("zipcode" = ? or "zipcode" = ?) having "street" = ?) and "age" = ?');
    expect(builder.getBindings()).toEqual(['larry', '90210', '90220', 'fooside dr', 29]);
  });
  it('has with constraints and join and having in subquery', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.where('bar', 'baz');
    builder.whereHas('foo', q => {
      q.join('quuuux', j => {
        j.where('quuuuux', '=', 'quuuuuux');
      });
      q.having('bam', '>', 'qux');
    }).where('quux', 'quuux');
    expect(builder.toSql()).toBe('select * from "eloquent_builder_test_model_parent_stubs" where "bar" = ? and exists (select * from "eloquent_builder_test_model_close_related_stubs" inner join "quuuux" on "quuuuux" = ? where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id" having "bam" > ?) and "quux" = ?');
    expect(builder.getBindings()).toEqual(['baz', 'quuuuuux', 'qux', 'quuux']);
  });
  it('has with constraints and having in subquery with count', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.where('bar', 'baz');
    builder.whereHas('foo', q => {
      q.having('bam', '>', 'qux');
    }, '>=', 2).where('quux', 'quuux');
    expect(builder.toSql()).toBe('select * from "eloquent_builder_test_model_parent_stubs" where "bar" = ? and (select count(*) from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id" having "bam" > ?) >= 2 and "quux" = ?');
    expect(builder.getBindings()).toEqual(['baz', 'qux', 'quuux']);
  });
  it('with count and constraints with binding in select sub', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.newQuery();
    builder.withCount({
      'foo': q => {
        q.selectSub(model.newQuery().where('bam', '=', 3).selectRaw('count(0)'), 'bam_3_count');
      }
    });
    expect(builder.toSql()).toBe('select "eloquent_builder_test_model_parent_stubs".*, (select count(*) from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id") as "foo_count" from "eloquent_builder_test_model_parent_stubs"');
    expect(builder.getBindings()).toEqual([]);
  });
  it('has nested with constraints', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.whereHas('foo', q => {
      q.whereHas('bar', q => {
        q.where('baz', 'bam');
      });
    }).toSql();
    var result = model.whereHas('foo.bar', q => {
      q.where('baz', 'bam');
    }).toSql();
    expect(result).toEqual(builder);
  });
  it('has nested', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.whereHas('foo', q => {
      q.has('bar');
    });
    var result = model.has('foo.bar').toSql();
    expect(result).toEqual(builder.toSql());
  });
  it('or has nested', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.whereHas('foo', q => {
      q.has('bar');
    }).orWhereHas('foo', q => {
      q.has('baz');
    });
    var result = model.has('foo.bar').orHas('foo.baz').toSql();
    expect(result).toEqual(builder.toSql());
  });
  it('self has nested', () => {
    var model = new EloquentBuilderTestModelSelfRelatedStub();
    var nestedSql = model.whereHas('parentFoo', q => {
      q.has('childFoo');
    }).toSql();
    var dotSql = model.has('parentFoo.childFoo').toSql();
    var alias = 'self_alias_hash';
    var aliasRegex = '/\\b(laravel_reserved_\\d)(\\b|$)/i';
    var nestedSql = preg_replace(aliasRegex, alias, nestedSql);
    var dotSql = preg_replace(aliasRegex, alias, dotSql);
    expect(dotSql).toEqual(nestedSql);
  });
  it('self has nested uses alias', () => {
    var model = new EloquentBuilderTestModelSelfRelatedStub();
    var sql = model.has('parentFoo.childFoo').toSql();
    var alias = 'self_alias_hash';
    var aliasRegex = '/\\b(laravel_reserved_\\d)(\\b|$)/i';
    var sql = preg_replace(aliasRegex, alias, sql);
    expect(sql).toStringContainsString('"self_alias_hash"."id" = "self_related_stubs"."parent_id"');
  });
  it('doesnt have', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.doesntHave('foo');
    expect(builder.toSql()).toBe('select * from "eloquent_builder_test_model_parent_stubs" where not exists (select * from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id")');
  });
  it('doesnt have nested', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.doesntHave('foo.bar');
    expect(builder.toSql()).toBe('select * from "eloquent_builder_test_model_parent_stubs" where not exists (select * from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id" and exists (select * from "eloquent_builder_test_model_far_related_stubs" where "eloquent_builder_test_model_close_related_stubs"."id" = "eloquent_builder_test_model_far_related_stubs"."eloquent_builder_test_model_close_related_stub_id"))');
  });
  it('or doesnt have', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.where('bar', 'baz').orDoesntHave('foo');
    expect(builder.toSql()).toBe('select * from "eloquent_builder_test_model_parent_stubs" where "bar" = ? or not exists (select * from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id")');
    expect(builder.getBindings()).toEqual(['baz']);
  });
  it('where doesnt have', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.whereDoesntHave('foo', query => {
      query.where('bar', 'baz');
    });
    expect(builder.toSql()).toBe('select * from "eloquent_builder_test_model_parent_stubs" where not exists (select * from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id" and "bar" = ?)');
    expect(builder.getBindings()).toEqual(['baz']);
  });
  it('or where doesnt have', () => {
    var model = new EloquentBuilderTestModelParentStub();
    var builder = model.where('bar', 'baz').orWhereDoesntHave('foo', query => {
      query.where('qux', 'quux');
    });
    expect(builder.toSql()).toBe('select * from "eloquent_builder_test_model_parent_stubs" where "bar" = ? or not exists (select * from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id" and "qux" = ?)');
    expect(builder.getBindings()).toEqual(['baz', 'quux']);
  });
  it('where key method with int', () => {
    var model = this.getMockModel();
    var builder = this.getBuilder().setModel(model);
    var keyName = model.getQualifiedKeyName();
    var int = 1;
    builder.getQuery().shouldReceive('where').once()._with(keyName, '=', int);
    builder.whereKey(int);
  });
  it('where key method with array', () => {
    var model = this.getMockModel();
    var builder = this.getBuilder().setModel(model);
    var keyName = model.getQualifiedKeyName();
    var array = [1, 2, 3];
    builder.getQuery().shouldReceive('whereIn').once()._with(keyName, array);
    builder.whereKey(array);
  });
  it('where key method with collection', () => {
    var model = this.getMockModel();
    var builder = this.getBuilder().setModel(model);
    var keyName = model.getQualifiedKeyName();
    var collection = new Collection([1, 2, 3]);
    builder.getQuery().shouldReceive('whereIn').once()._with(keyName, collection);
    builder.whereKey(collection);
  });
  it('where key not method with int', () => {
    var model = this.getMockModel();
    var builder = this.getBuilder().setModel(model);
    var keyName = model.getQualifiedKeyName();
    var int = 1;
    builder.getQuery().shouldReceive('where').once()._with(keyName, '!=', int);
    builder.whereKeyNot(int);
  });
  it('where key not method with array', () => {
    var model = this.getMockModel();
    var builder = this.getBuilder().setModel(model);
    var keyName = model.getQualifiedKeyName();
    var array = [1, 2, 3];
    builder.getQuery().shouldReceive('whereNotIn').once()._with(keyName, array);
    builder.whereKeyNot(array);
  });
  it('where key not method with collection', () => {
    var model = this.getMockModel();
    var builder = this.getBuilder().setModel(model);
    var keyName = model.getQualifiedKeyName();
    var collection = new Collection([1, 2, 3]);
    builder.getQuery().shouldReceive('whereNotIn').once()._with(keyName, collection);
    builder.whereKeyNot(collection);
  });
  it('where in', () => {
    var model = new EloquentBuilderTestNestedStub();
    this.mockConnectionForModel(model, '');
    var query = model.newQuery().withoutGlobalScopes().whereIn('foo', model.newQuery().select('id'));
    var expected = 'select * from "table" where "foo" in (select "id" from "table" where "table"."deleted_at" is null)';
    expect(query.toSql()).toEqual(expected);
  });
  it('latest without column with created at', () => {
    var model = this.getMockModel();
    model.shouldReceive('getCreatedAtColumn').andReturn('foo');
    var builder = this.getBuilder().setModel(model);
    builder.getQuery().shouldReceive('latest').once()._with('foo');
    builder.latest();
  });
  it('latest without column without created at', () => {
    var model = this.getMockModel();
    model.shouldReceive('getCreatedAtColumn').andReturn(null);
    var builder = this.getBuilder().setModel(model);
    builder.getQuery().shouldReceive('latest').once()._with('created_at');
    builder.latest();
  });
  it('latest with column', () => {
    var model = this.getMockModel();
    var builder = this.getBuilder().setModel(model);
    builder.getQuery().shouldReceive('latest').once()._with('foo');
    builder.latest('foo');
  });
  it('oldest without column with created at', () => {
    var model = this.getMockModel();
    model.shouldReceive('getCreatedAtColumn').andReturn('foo');
    var builder = this.getBuilder().setModel(model);
    builder.getQuery().shouldReceive('oldest').once()._with('foo');
    builder.oldest();
  });
  it('oldest without column without created at', () => {
    var model = this.getMockModel();
    model.shouldReceive('getCreatedAtColumn').andReturn(null);
    var builder = this.getBuilder().setModel(model);
    builder.getQuery().shouldReceive('oldest').once()._with('created_at');
    builder.oldest();
  });
  it('oldest with column', () => {
    var model = this.getMockModel();
    var builder = this.getBuilder().setModel(model);
    builder.getQuery().shouldReceive('oldest').once()._with('foo');
    builder.oldest('foo');
  });
  it('update', () => {
    Carbon.setTestNow(now = '2017-10-10 10:10:10');
    var query = new BaseBuilder(m.mock(ConnectionInterface), new Grammar(), m.mock(Processor));
    var builder = new Builder(query);
    var model = new EloquentBuilderTestStub();
    this.mockConnectionForModel(model, '');
    builder.setModel(model);
    builder.getConnection().shouldReceive('update').once()._with('update "table" set "foo" = ?, "table"."updated_at" = ?', ['bar', now]).andReturn(1);
    var result = builder.update({
      'foo': 'bar'
    });
    expect(result).toEqual(1);
    Carbon.setTestNow(null);
  });
  it('update with timestamp value', () => {
    var query = new BaseBuilder(m.mock(ConnectionInterface), new Grammar(), m.mock(Processor));
    var builder = new Builder(query);
    var model = new EloquentBuilderTestStub();
    this.mockConnectionForModel(model, '');
    builder.setModel(model);
    builder.getConnection().shouldReceive('update').once()._with('update "table" set "foo" = ?, "table"."updated_at" = ?', ['bar', null]).andReturn(1);
    var result = builder.update({
      'foo': 'bar',
      'updated_at': null
    });
    expect(result).toEqual(1);
  });
  it('update without timestamp', () => {
    var query = new BaseBuilder(m.mock(ConnectionInterface), new Grammar(), m.mock(Processor));
    var builder = new Builder(query);
    var model = new EloquentBuilderTestStubWithoutTimestamp();
    this.mockConnectionForModel(model, '');
    builder.setModel(model);
    builder.getConnection().shouldReceive('update').once()._with('update "table" set "foo" = ?', ['bar']).andReturn(1);
    var result = builder.update({
      'foo': 'bar'
    });
    expect(result).toEqual(1);
  });
  it('update with alias', () => {
    Carbon.setTestNow(now = '2017-10-10 10:10:10');
    var query = new BaseBuilder(m.mock(ConnectionInterface), new Grammar(), m.mock(Processor));
    var builder = new Builder(query);
    var model = new EloquentBuilderTestStub();
    this.mockConnectionForModel(model, '');
    builder.setModel(model);
    builder.getConnection().shouldReceive('update').once()._with('update "table" as "alias" set "foo" = ?, "alias"."updated_at" = ?', ['bar', now]).andReturn(1);
    var result = builder.from('table as alias').update({
      'foo': 'bar'
    });
    expect(result).toEqual(1);
    Carbon.setTestNow(null);
  });
  it('with casts method', () => {
    var builder = new Builder(this.getMockQueryBuilder());
    var model = this.getMockModel();
    builder.setModel(model);
    model.shouldReceive('mergeCasts')._with({
      'foo': 'bar'
    }).once();
    builder.withCasts({
      'foo': 'bar'
    });
  });
  it('mock connection for model', () => {
    var grammarClass = 'Illuminate\\Database\\Query\\Grammars\\' + database + 'Grammar';
    var processorClass = 'Illuminate\\Database\\Query\\Processors\\' + database + 'Processor';
    var grammar = new grammarClass();
    var processor = new processorClass();
    var connection = m.mock(ConnectionInterface, {
      'getQueryGrammar': grammar,
      'getPostProcessor': processor
    });
    connection.shouldReceive('query').andReturnUsing(() => {
      return new BaseBuilder(connection, grammar, processor);
    });
    var resolver = m.mock(ConnectionResolverInterface, {
      'connection': connection
    });
    var clazz = get_class(model);
    clazz.setConnectionResolver(resolver);
  });
  it('get builder', () => {
    return new Builder(this.getMockQueryBuilder());
  });
  it('get mock model', () => {
    var model = m.mock(Model);
    model.shouldReceive('getKeyName').andReturn('foo');
    model.shouldReceive('getTable').andReturn('foo_table');
    model.shouldReceive('getQualifiedKeyName').andReturn('foo_table.foo');
    return model;
  });
  it('get mock query builder', () => {
    var query = m.mock(BaseBuilder);
    query.shouldReceive('from')._with('foo_table');
    return query;
  });
});

export class EloquentBuilderTestStub extends Model {
  protected table: any = 'table';
}

export class EloquentBuilderTestScopeStub extends Model {
  public scopeApproved(query) {
    query.where('foo', 'bar');
  }
}

export class EloquentBuilderTestHigherOrderWhereScopeStub extends Model {
  protected table: any = 'table';

  public scopeOne(query) {
    query.where('one', 'foo');
  }

  public scopeTwo(query) {
    query.where('two', 'bar');
  }

  public scopeThree(query) {
    query.where('three', 'baz');
  }
}

export class EloquentBuilderTestNestedStub extends Model {
  protected table: any = 'table';

  public scopeEmpty(query) {
    return query;
  }
}

export class EloquentBuilderTestPluckStub {
  protected attributes: any;

  public constructor(attributes) {
    this.attributes = attributes;
  }

  public __get(key) {
    return 'foo_' + this.attributes[key];
  }
}

export class EloquentBuilderTestPluckDatesStub extends Model {
  protected attributes: any;

  public constructor(attributes) {
    this.attributes = attributes;
  }

  protected asDateTime(value) {
    return 'date_' + value;
  }
}

export class EloquentBuilderTestModelParentStub extends Model {
  public foo() {
    return this.belongsTo(EloquentBuilderTestModelCloseRelatedStub);
  }

  public address() {
    return this.belongsTo(EloquentBuilderTestModelCloseRelatedStub, 'foo_id');
  }

  public activeFoo() {
    return this.belongsTo(EloquentBuilderTestModelCloseRelatedStub, 'foo_id').where('active', true);
  }
}

export class EloquentBuilderTestModelCloseRelatedStub extends Model {
  public bar() {
    return this.hasMany(EloquentBuilderTestModelFarRelatedStub);
  }

  public baz() {
    return this.hasMany(EloquentBuilderTestModelFarRelatedStub);
  }
}

export class EloquentBuilderTestModelFarRelatedStub extends Model {
}

export class EloquentBuilderTestModelSelfRelatedStub extends Model {
  protected table: any = 'self_related_stubs';

  public parentFoo() {
    return this.belongsTo(EloquentBuilderTestModelSelfRelatedStub, 'parent_id', 'id', 'parent');
  }

  public childFoo() {
    return this.hasOne(EloquentBuilderTestModelSelfRelatedStub, 'parent_id', 'id');
  }

  public childFoos() {
    return this.hasMany(EloquentBuilderTestModelSelfRelatedStub, 'parent_id', 'id', 'children');
  }

  public parentBars() {
    return this.belongsToMany(EloquentBuilderTestModelSelfRelatedStub, 'self_pivot', 'child_id', 'parent_id', 'parent_bars');
  }

  public childBars() {
    return this.belongsToMany(EloquentBuilderTestModelSelfRelatedStub, 'self_pivot', 'parent_id', 'child_id', 'child_bars');
  }

  public bazes() {
    return this.hasMany(EloquentBuilderTestModelFarRelatedStub, 'foreign_key', 'id', 'bar');
  }
}

export class EloquentBuilderTestStubWithoutTimestamp extends Model {
  static UPDATED_AT = null;
  protected table: any = 'table';
}
