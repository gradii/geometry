import { isFunction } from '@gradii/check-type';
import { DatabaseManager } from '../src/database-manager';
import { FedacoBuilder } from '../src/fedaco/fedaco-builder';
import { Model } from '../src/fedaco/model';
import { onlyTrashed, withTrashed } from '../src/fedaco/scopes/soft-deleting-scope';
import { ConnectionResolverInterface } from '../src/interface/connection-resolver-interface';
import { ConnectionInterface } from '../src/query-builder/connection-interface';
import { MysqlGrammar } from '../src/query-builder/grammar/mysql-grammar';
import { SqliteGrammar } from '../src/query-builder/grammar/sqlite-grammar';
import { Processor } from '../src/query-builder/processor';
import { QueryBuilder } from '../src/query-builder/query-builder';
import { FedacoBuilderTestHigherOrderWhereScopeStub } from './model/fedaco-builder-test-higher-order-where-scope-stub';
import { FedacoBuilderTestModelParentStub } from './model/fedaco-builder-test-model-parent-stub';
import { FedacoBuilderTestNestedStub } from './model/fedaco-builder-test-nested-stub';
import { FedacoBuilderTestScopeStub } from './model/fedaco-builder-test-scope-stub';
import { StubModel } from './model/stub-model';

describe('fedaco builder', () => {
  let model: Model, builder: FedacoBuilder;

  class Conn implements ConnectionInterface {
    getQueryGrammar(): any {

    }

    getDatabaseName(): string {
      return 'default-database';
    }

    getPostProcessor(): any {

    }

    query(): QueryBuilder {
      return undefined;
    }

    async select() {
      return await Promise.resolve();
    }

    async insert() {
    }

    async update() {
    }

    async delete() {
    }

    async statement() {
    }

    async affectingStatement() {
    }

    getName() {
      return '';
    }
  }

  function resolveModel(model: Model) {
    // model.
    // (model.constructor as typeof Model)._connectionResolver                    = new ResolveConnection();
    (model.constructor as typeof Model).resolver = new DatabaseManager();
  }

  function getModel() {
    const _model = new Model();

    resolveModel(_model);

    jest.spyOn(_model, 'getKeyName').mockReturnValue('foo');
    jest.spyOn(_model, 'getTable').mockReturnValue('foo_table');
    jest.spyOn(_model, 'getQualifiedKeyName').mockReturnValue('foo_table.foo');
    return _model;
  }

  function getStubModel() {
    const _model = new StubModel();

    resolveModel(_model);

    // jest.spyOn(_model, 'getKeyName').mockReturnValue('foo');
    jest.spyOn(_model, 'getTable').mockReturnValue('stub');
    // jest.spyOn(_model, 'getQualifiedKeyName').mockReturnValue('foo_table.foo');
    return _model;
  }

  function getBuilder() {
    return new FedacoBuilder(new QueryBuilder(
      new Conn(),
      new MysqlGrammar(),
      new Processor()
    ));
  }

  function mockConnectionForModel<T extends typeof Model>(modelClazz: any,
                                                          database) {
    const grammar    = new SqliteGrammar();
    const processor  = new Processor();
    const connection = new Conn();// m::mock(ConnectionInterface::class, ['getQueryGrammar' => $grammar, 'getPostProcessor' => $processor]);
    jest.spyOn(connection, 'getQueryGrammar').mockReturnValue(grammar);
    jest.spyOn(connection, 'getPostProcessor').mockReturnValue(processor);

    jest.spyOn(connection, 'query').mockImplementation(() =>
      new QueryBuilder(connection, grammar, processor));
    jest.spyOn(connection, 'getDatabaseName').mockReturnValue('database');

    const resolver: ConnectionResolverInterface = {
      getDefaultConnection(): any {
      },
      setDefaultConnection(name: string): any {
      },
      connection() {
        return connection;
      }
    };
    (modelClazz as typeof Model).setConnectionResolver(resolver);
  }

  beforeEach(() => {
    model          = getModel();
    builder        = getBuilder();
    // @ts-ignore
    builder._model = model;
  });

  it('testFindMethod', async () => {
    let spySelect, spyFirst, result;
    spySelect = jest.spyOn(builder.getQuery(), 'where');
    // @ts-ignore
    spyFirst  = jest.spyOn(builder, 'first').mockReturnValue({name: 'baz'});
    result    = await builder.find('bar', ['column']);
    expect(spySelect).toBeCalledWith('foo_table.foo', '=', 'bar', 'and');
    expect(spyFirst).toBeCalledWith(['column']);
    expect(result).toStrictEqual({name: 'baz'});
  });

  it('testFindManyMethod', async () => {
    let spy1, spy2, result;
    builder = getBuilder();
    builder.setModel(getModel());
    spy1 = jest.spyOn(builder.getQuery(), 'whereIn');
    // @ts-ignore
    spy2 = jest.spyOn(builder, 'get').mockReturnValue(['baz']);

    result = await builder.findMany(['one', 'two'], ['column']);
    expect(spy1).toHaveBeenCalledWith('foo_table.foo', ['one', 'two']);
    expect(spy2).toHaveBeenCalledWith(['column']);
    expect(result).toEqual(['baz']);

    builder = getBuilder();
    builder.setModel(getModel());
    spy1 = jest.spyOn(builder.getQuery(), 'whereIn');
    spy2 = jest.spyOn(builder, 'get').mockReturnValue(Promise.resolve(['baz' as unknown as Model]));

    result = await builder.findMany([], ['column']);
    expect(spy1).toBeCalledTimes(0);
    expect(spy2).toBeCalledTimes(0);
    expect(result).toStrictEqual([]);
  });

  it('testFindOrNewMethodModelFound', async () => {
    let spy1, spy2, spy3, result, expected;
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);
    const modelQuery = builder.getModel().newQuery();

    spy1 = jest.spyOn(builder.getQuery(), 'where');
    // @ts-ignore
    spy2 = jest.spyOn(modelQuery, 'findOrNew').mockReturnValue('baz');
    // @ts-ignore
    spy3 = jest.spyOn(builder, 'first').mockReturnValue('baz');

    expected = await modelQuery.findOrNew('bar', ['column']);
    result   = await builder.find('bar', ['column']);

    expect(builder.getModel()['findOrNew']).toBe(builder.getModel()['findOrNew']);

    expect(spy1).toBeCalledWith('foo_table.foo', '=', 'bar', 'and');
    expect(spy2).toBeCalledTimes(1);
    expect(spy3).toBeCalledWith(['column']);
    expect(result).toBe(expected);
  });

  it('testFindOrNewMethodModelNotFound', async () => {
    let spy1, spy2, spy3, result, findResult;
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);
    const modelQuery = builder.getModel().newQuery();

    spy1 = jest.spyOn(builder.getQuery(), 'where');
    spy2 = jest.spyOn(modelQuery, 'findOrNew').mockReturnValue(Promise.resolve(getModel()));
    spy3 = jest.spyOn(builder, 'first').mockReturnValue(undefined);

    result     = await modelQuery.findOrNew('bar', ['column']);
    findResult = await builder.find('bar', ['column']);
    expect(spy1).toBeCalledWith('foo_table.foo', '=', 'bar', 'and');
    expect(spy2).toBeCalledTimes(1);
    expect(spy3).toBeCalledWith(['column']);
    expect(findResult).toBe(undefined);
    expect(result instanceof Model).toBe(true);
  });

  it('testFindOrFailMethodThrowsModelNotFoundException', async () => {
    let spy1, spy3;
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);

    spy1 = jest.spyOn(builder.getQuery(), 'where');
    spy3 = jest.spyOn(builder, 'first').mockReturnValue(undefined);
    await expect(async () => {
      await builder.findOrFail('bar', ['column']);
    }).rejects.toThrowError('ModelNotFoundException');

    expect(spy1).toBeCalledWith('foo_table.foo', '=', 'bar', 'and');
    expect(spy3).toBeCalledWith(['column']);
  });

  it('testFindOrFailMethodWithManyThrowsModelNotFoundException', async () => {
    let spy1, spy3;
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);

    spy1 = jest.spyOn(builder.getQuery(), 'whereIn').mockReturnValue(undefined);
    // @ts-ignore
    spy3 = jest.spyOn(builder, 'get').mockReturnValue([1]);

    await expect(async () => {
      await builder.findOrFail([1, 2], ['column']);
    }).rejects.toThrowError('ModelNotFoundException');

    expect(spy1).toBeCalledWith('foo_table.foo', [1, 2]);
    expect(spy3).toBeCalledWith(['column']);
    expect(spy3).lastReturnedWith([1]);
  });

  xit('testFindOrFailMethodWithManyUsingCollectionThrowsModelNotFoundException', () => {
    let spy1, spy3;
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);

    spy1 = jest.spyOn(builder.getQuery(), 'whereIn').mockReturnValue(undefined);
    // @ts-ignore
    spy3 = jest.spyOn(builder, 'get').mockReturnValue([1]);

    expect(() => {
      builder.findOrFail([1, 2], ['column']);
    }).toThrowError('ModelNotFoundException');

    expect(spy1).toBeCalledWith('foo_table.foo', [1, 2]);
    expect(spy3).toBeCalledWith(['column']);
    expect(spy3).lastReturnedWith([1]);
  });

  it('testFirstOrFailMethodThrowsModelNotFoundException', async () => {
    let spy1, spy3;
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);

    spy1 = jest.spyOn(builder, 'first').mockReturnValue(undefined);

    await expect(async () => {
      await builder.firstOrFail(['column']);
    }).rejects.toThrowError('ModelNotFoundException');

    expect(spy1).toBeCalledWith(['column']);
    expect(spy1).toReturnWith(undefined);
  });

  it('testFindWithMany', async () => {
    let spy1, spy3, result;
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);

    // @ts-ignore
    spy1 = jest.spyOn(builder, 'get').mockReturnValue('baz');
    spy3 = jest.spyOn(builder.getQuery(), 'whereIn');

    result = await builder.find([1, 2], ['column']);

    expect(spy1).toBeCalledWith(['column']);
    expect(spy1).toReturnWith('baz');
    expect(spy3).toBeCalledTimes(1);
    expect(spy3).toBeCalledWith('foo_table.foo', [1, 2]);
    expect(result).toBe('baz');
  });

  xit('testFindWithManyUsingCollection', () => {
    let spy1, spy3, result;
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);

    const ids = [1, 2];

    // @ts-ignore
    spy1 = jest.spyOn(builder, 'get').mockReturnValue('baz');
    spy3 = jest.spyOn(builder.getQuery(), 'whereIn');

    result = builder.find(ids, ['column']);

    expect(spy1).toBeCalledWith(['column']);
    expect(spy1).toReturnWith('baz');
    expect(spy3).toBeCalledTimes(1);
    expect(spy3).toBeCalledWith('foo_table.foo', [1, 2]);
    expect(result).toBe('baz');
  });

  it('testFirstMethod', async () => {
    let spy1, spy2, spy3, result;
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);

    // @ts-ignore
    spy1 = jest.spyOn(builder, 'get').mockReturnValue(['bar']);
    // @ts-ignore
    spy2 = jest.spyOn(builder, 'take').mockReturnThis();

    result = await builder.first();

    expect(spy1).toBeCalledWith(['*']);
    // expect(spy1).toReturnWith('baz');
    expect(spy2).toBeCalledWith(1);
    expect(result).toBe('bar');
  });

  it('testQualifyColumn', () => {
    let spy1, spy2, spy3, result;
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);

    spy1 = jest.spyOn(builder.getQuery(), 'from');

    builder.setModel(getStubModel());

    result = builder.qualifyColumn('column');

    expect(spy1).toBeCalledWith('stub');
    expect(result).toBe('stub.column');
  });

  it('testGetMethodLoadsModelsAndHydratesEagerRelations', async () => {
    let spy1, spy2, spy3, spy4, results;
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);

    // @ts-ignore
    spy1 = jest.spyOn(builder, 'getModels').mockReturnValue(['bar']);
    spy2 = jest.spyOn(builder, 'applyScopes').mockReturnThis();
    // @ts-ignore
    spy3 = jest.spyOn(builder, 'eagerLoadRelations').mockReturnValue(['bar', 'baz']);
    // spy4 = jest.spyOn(builder.getModel(), 'newCollection')//.mockReturnValue(['bar', 'baz']);

    results = await builder.get(['foo']);

    expect(spy1).toBeCalledWith(['foo']);
    expect(spy1).toReturnWith(['bar']);
    expect(spy2).toReturnWith(builder);
    expect(spy3).toReturnWith(['bar', 'baz']);
    expect(results).toEqual(['bar', 'baz']);
  });

  // public testGetMethodDoesntHydrateEagerRelationsWhenNoResultsAreReturned() {
  //     var builder = m.mock(Builder + "[getModels,eagerLoadRelations]", [this.getMockQueryBuilder()]);
  //     builder.shouldReceive("applyScopes").andReturnSelf()
  //     builder.shouldReceive("getModels")._with(["foo"]).andReturn([])
  //     builder.shouldReceive("eagerLoadRelations").never()
  //     builder.setModel(this.getMockModel())
  //     builder.getModel().shouldReceive("newCollection")._with([]).andReturn(new Collection([]))
  //     var results = builder.get(["foo"]);
  //     this.assertEquals([], results.all())
  //   }

  // public testValueMethodWithModelFound() {
  //     var builder = m.mock(Builder + "[first]", [this.getMockQueryBuilder()]);
  //     var mockModel = new stdClass();
  //     mockModel.name = "foo"
  //     builder.shouldReceive("first")._with(["name"]).andReturn(mockModel)
  //     this.assertSame("foo", builder.value("name"))
  //   }
  // public testValueMethodWithModelNotFound() {
  //     var builder = m.mock(Builder + "[first]", [this.getMockQueryBuilder()]);
  //     builder.shouldReceive("first")._with(["name"]).andReturn(null)
  //     this.assertNull(builder.value("name"))
  //   }
  // public testChunkWithLastChunkComplete() {
  //     var builder = m.mock(Builder + "[forPage,get]", [this.getMockQueryBuilder()]);
  //     builder.getQuery().orders.push({
  //       "column": "foobar",
  //       "direction": "asc"
  //     });
  //     var chunk1 = new Collection(["foo1", "foo2"]);
  //     var chunk2 = new Collection(["foo3", "foo4"]);
  //     var chunk3 = new Collection([]);
  //     builder.shouldReceive("forPage").once()._with(1, 2).andReturnSelf()
  //     builder.shouldReceive("forPage").once()._with(2, 2).andReturnSelf()
  //     builder.shouldReceive("forPage").once()._with(3, 2).andReturnSelf()
  //     builder.shouldReceive("get").times(3).andReturn(chunk1, chunk2, chunk3)
  //     var callbackAssertor = m.mock(stdClass);
  //     callbackAssertor.shouldReceive("doSomething").once()._with(chunk1)
  //     callbackAssertor.shouldReceive("doSomething").once()._with(chunk2)
  //     callbackAssertor.shouldReceive("doSomething").never()._with(chunk3)
  //     builder.chunk(2, results => {
  //       callbackAssertor.doSomething(results)
  //     })
  //   }
  // public testChunkWithLastChunkPartial() {
  //     var builder = m.mock(Builder + "[forPage,get]", [this.getMockQueryBuilder()]);
  //     builder.getQuery().orders.push({
  //       "column": "foobar",
  //       "direction": "asc"
  //     });
  //     var chunk1 = new Collection(["foo1", "foo2"]);
  //     var chunk2 = new Collection(["foo3"]);
  //     builder.shouldReceive("forPage").once()._with(1, 2).andReturnSelf()
  //     builder.shouldReceive("forPage").once()._with(2, 2).andReturnSelf()
  //     builder.shouldReceive("get").times(2).andReturn(chunk1, chunk2)
  //     var callbackAssertor = m.mock(stdClass);
  //     callbackAssertor.shouldReceive("doSomething").once()._with(chunk1)
  //     callbackAssertor.shouldReceive("doSomething").once()._with(chunk2)
  //     builder.chunk(2, results => {
  //       callbackAssertor.doSomething(results)
  //     })
  //   }
  // public testChunkCanBeStoppedByReturningFalse() {
  //     var builder = m.mock(Builder + "[forPage,get]", [this.getMockQueryBuilder()]);
  //     builder.getQuery().orders.push({
  //       "column": "foobar",
  //       "direction": "asc"
  //     });
  //     var chunk1 = new Collection(["foo1", "foo2"]);
  //     var chunk2 = new Collection(["foo3"]);
  //     builder.shouldReceive("forPage").once()._with(1, 2).andReturnSelf()
  //     builder.shouldReceive("forPage").never()._with(2, 2)
  //     builder.shouldReceive("get").times(1).andReturn(chunk1)
  //     var callbackAssertor = m.mock(stdClass);
  //     callbackAssertor.shouldReceive("doSomething").once()._with(chunk1)
  //     callbackAssertor.shouldReceive("doSomething").never()._with(chunk2)
  //     builder.chunk(2, results => {
  //       callbackAssertor.doSomething(results)
  //       return false;
  //     })
  //   }
  // public testChunkWithCountZero() {
  //     var builder = m.mock(Builder + "[forPage,get]", [this.getMockQueryBuilder()]);
  //     builder.getQuery().orders.push({
  //       "column": "foobar",
  //       "direction": "asc"
  //     });
  //     var chunk = new Collection([]);
  //     builder.shouldReceive("forPage").once()._with(1, 0).andReturnSelf()
  //     builder.shouldReceive("get").times(1).andReturn(chunk)
  //     var callbackAssertor = m.mock(stdClass);
  //     callbackAssertor.shouldReceive("doSomething").never()
  //     builder.chunk(0, results => {
  //       callbackAssertor.doSomething(results)
  //     })
  //   }
  // public testChunkPaginatesUsingIdWithLastChunkComplete() {
  //     var builder = m.mock(Builder + "[forPageAfterId,get]", [this.getMockQueryBuilder()]);
  //     builder.getQuery().orders.push({
  //       "column": "foobar",
  //       "direction": "asc"
  //     });
  //     var chunk1 = new Collection([
  //       //cast type object
  //       {
  //         "someIdField": 1
  //       },
  //       //cast type object
  //       {
  //         "someIdField": 2
  //       }]);
  //     var chunk2 = new Collection([
  //       //cast type object
  //       {
  //         "someIdField": 10
  //       },
  //       //cast type object
  //       {
  //         "someIdField": 11
  //       }]);
  //     var chunk3 = new Collection([]);
  //     builder.shouldReceive("forPageAfterId").once()._with(2, 0, "someIdField").andReturnSelf()
  //     builder.shouldReceive("forPageAfterId").once()._with(2, 2, "someIdField").andReturnSelf()
  //     builder.shouldReceive("forPageAfterId").once()._with(2, 11, "someIdField").andReturnSelf()
  //     builder.shouldReceive("get").times(3).andReturn(chunk1, chunk2, chunk3)
  //     var callbackAssertor = m.mock(stdClass);
  //     callbackAssertor.shouldReceive("doSomething").once()._with(chunk1)
  //     callbackAssertor.shouldReceive("doSomething").once()._with(chunk2)
  //     callbackAssertor.shouldReceive("doSomething").never()._with(chunk3)
  //     builder.chunkById(2, results => {
  //       callbackAssertor.doSomething(results)
  //     }, "someIdField")
  //   }
  // public testChunkPaginatesUsingIdWithLastChunkPartial() {
  //     var builder = m.mock(Builder + "[forPageAfterId,get]", [this.getMockQueryBuilder()]);
  //     builder.getQuery().orders.push({
  //       "column": "foobar",
  //       "direction": "asc"
  //     });
  //     var chunk1 = new Collection([
  //       //cast type object
  //       {
  //         "someIdField": 1
  //       },
  //       //cast type object
  //       {
  //         "someIdField": 2
  //       }]);
  //     var chunk2 = new Collection([
  //       //cast type object
  //       {
  //         "someIdField": 10
  //       }]);
  //     builder.shouldReceive("forPageAfterId").once()._with(2, 0, "someIdField").andReturnSelf()
  //     builder.shouldReceive("forPageAfterId").once()._with(2, 2, "someIdField").andReturnSelf()
  //     builder.shouldReceive("get").times(2).andReturn(chunk1, chunk2)
  //     var callbackAssertor = m.mock(stdClass);
  //     callbackAssertor.shouldReceive("doSomething").once()._with(chunk1)
  //     callbackAssertor.shouldReceive("doSomething").once()._with(chunk2)
  //     builder.chunkById(2, results => {
  //       callbackAssertor.doSomething(results)
  //     }, "someIdField")
  //   }
  // public testChunkPaginatesUsingIdWithCountZero() {
  //     var builder = m.mock(Builder + "[forPageAfterId,get]", [this.getMockQueryBuilder()]);
  //     builder.getQuery().orders.push({
  //       "column": "foobar",
  //       "direction": "asc"
  //     });
  //     var chunk = new Collection([]);
  //     builder.shouldReceive("forPageAfterId").once()._with(0, 0, "someIdField").andReturnSelf()
  //     builder.shouldReceive("get").times(1).andReturn(chunk)
  //     var callbackAssertor = m.mock(stdClass);
  //     callbackAssertor.shouldReceive("doSomething").never()
  //     builder.chunkById(0, results => {
  //       callbackAssertor.doSomething(results)
  //     }, "someIdField")
  //   }
  // public testPluckReturnsTheMutatedAttributesOfAModel() {
  //     var builder = this.getBuilder();
  //     builder.getQuery().shouldReceive("pluck")._with("name", "").andReturn(new BaseCollection(["bar", "baz"]))
  //     builder.setModel(this.getMockModel())
  //     builder.getModel().shouldReceive("hasGetMutator")._with("name").andReturn(true)
  //     builder.getModel().shouldReceive("newFromBuilder")._with({
  //       "name": "bar"
  //     }).andReturn(new EloquentBuilderTestPluckStub({
  //       "name": "bar"
  //     }))
  //     builder.getModel().shouldReceive("newFromBuilder")._with({
  //       "name": "baz"
  //     }).andReturn(new EloquentBuilderTestPluckStub({
  //       "name": "baz"
  //     }))
  //     this.assertEquals(["foo_bar", "foo_baz"], builder.pluck("name").all())
  //   }
  // public testPluckReturnsTheCastedAttributesOfAModel() {
  //     var builder = this.getBuilder();
  //     builder.getQuery().shouldReceive("pluck")._with("name", "").andReturn(new BaseCollection(["bar", "baz"]))
  //     builder.setModel(this.getMockModel())
  //     builder.getModel().shouldReceive("hasGetMutator")._with("name").andReturn(false)
  //     builder.getModel().shouldReceive("hasCast")._with("name").andReturn(true)
  //     builder.getModel().shouldReceive("newFromBuilder")._with({
  //       "name": "bar"
  //     }).andReturn(new EloquentBuilderTestPluckStub({
  //       "name": "bar"
  //     }))
  //     builder.getModel().shouldReceive("newFromBuilder")._with({
  //       "name": "baz"
  //     }).andReturn(new EloquentBuilderTestPluckStub({
  //       "name": "baz"
  //     }))
  //     this.assertEquals(["foo_bar", "foo_baz"], builder.pluck("name").all())
  //   }
  // public testPluckReturnsTheDateAttributesOfAModel() {
  //     var builder = this.getBuilder();
  //     builder.getQuery().shouldReceive("pluck")._with("created_at", "").andReturn(new BaseCollection(["2010-01-01 00:00:00", "2011-01-01 00:00:00"]))
  //     builder.setModel(this.getMockModel())
  //     builder.getModel().shouldReceive("hasGetMutator")._with("created_at").andReturn(false)
  //     builder.getModel().shouldReceive("hasCast")._with("created_at").andReturn(false)
  //     builder.getModel().shouldReceive("getDates").andReturn(["created_at"])
  //     builder.getModel().shouldReceive("newFromBuilder")._with({
  //       "created_at": "2010-01-01 00:00:00"
  //     }).andReturn(new EloquentBuilderTestPluckDatesStub({
  //       "created_at": "2010-01-01 00:00:00"
  //     }))
  //     builder.getModel().shouldReceive("newFromBuilder")._with({
  //       "created_at": "2011-01-01 00:00:00"
  //     }).andReturn(new EloquentBuilderTestPluckDatesStub({
  //       "created_at": "2011-01-01 00:00:00"
  //     }))
  //     this.assertEquals(["date_2010-01-01 00:00:00", "date_2011-01-01 00:00:00"], builder.pluck("created_at").all())
  //   }
  // public testPluckWithoutModelGetterJustReturnsTheAttributesFoundInDatabase() {
  //     var builder = this.getBuilder();
  //     builder.getQuery().shouldReceive("pluck")._with("name", "").andReturn(new BaseCollection(["bar", "baz"]))
  //     builder.setModel(this.getMockModel())
  //     builder.getModel().shouldReceive("hasGetMutator")._with("name").andReturn(false)
  //     builder.getModel().shouldReceive("hasCast")._with("name").andReturn(false)
  //     builder.getModel().shouldReceive("getDates").andReturn(["created_at"])
  //     this.assertEquals(["bar", "baz"], builder.pluck("name").all())
  //   }
  // public testLocalMacrosAreCalledOnBuilder() {
  //     delete _SERVER["__test.builder"]
  //     var builder = new Builder(new BaseBuilder(m.mock(ConnectionInterface), m.mock(Grammar), m.mock(Processor)));
  //     builder.macro("fooBar", builder => {
  //       _SERVER["__test.builder"] = builder
  //       return builder;
  //     })
  //     var result = builder.fooBar();
  //     this.assertTrue(builder.hasMacro("fooBar"))
  //     this.assertEquals(builder, result)
  //     this.assertEquals(builder, _SERVER["__test.builder"])
  //     delete _SERVER["__test.builder"]
  //   }
  // public testGlobalMacrosAreCalledOnBuilder() {
  //     Builder.macro("foo", bar => {
  //       return bar;
  //     })
  //     Builder.macro("bam", [Builder, "getQuery"])
  //     var builder = this.getBuilder();
  //     this.assertTrue(Builder.hasGlobalMacro("foo"))
  //     this.assertEquals(builder.foo("bar"), "bar")
  //     this.assertEquals(builder.bam(), builder.getQuery())
  //   }
  // public testMissingStaticMacrosThrowsProperException() {
  //     this.expectException(BadMethodCallException)
  //     this.expectExceptionMessage("Call to undefined method Illuminate\\Database\\Eloquent\\Builder::missingMacro()")
  //     Builder.missingMacro()
  //   }
  // public testGetModelsProperlyHydratesModels() {
  //     var builder = m.mock(Builder + "[get]", [this.getMockQueryBuilder()]);
  //     records.push({
  //       "name": "taylor",
  //       "age": 26
  //     });
  //     records.push({
  //       "name": "dayle",
  //       "age": 28
  //     });
  //     builder.getQuery().shouldReceive("get").once()._with(["foo"]).andReturn(new BaseCollection(records))
  //     var model = m.mock(Model + "[getTable,hydrate]");
  //     model.shouldReceive("getTable").once().andReturn("foo_table")
  //     builder.setModel(model)
  //     model.shouldReceive("hydrate").once()._with(records).andReturn(new Collection(["hydrated"]))
  //     var models = builder.getModels(["foo"]);
  //     this.assertEquals(models, ["hydrated"])
  //   }

  it('testEagerLoadRelationsLoadTopLevelRelationships', async () => {
    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);
    // var builder = m.mock(Builder + '[eagerLoadRelation]', [this.getMockQueryBuilder()]);
    const nop1 = () => {
    };
    const nop2 = () => {
    };
    builder.setEagerLoads({
      'foo'    : nop1,
      'foo.bar': nop2
    });
    // @ts-ignore
    const spy1 = jest.spyOn(builder, 'eagerLoadRelation').mockReturnValue(['foo']);

    const results = await builder.eagerLoadRelations(['models']);

    expect(spy1).toBeCalledWith(['models'], 'foo', nop1);
    expect(spy1).toReturnWith(['foo']);
    expect(results).toEqual(['foo']);
  });

  it('testRelationshipEagerLoadProcess', async () => {
    let spy1, spy2, spy3, spy4, results, _SERVER = {};

    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);
    builder.setEagerLoads({
      'orders': query => {
        global['__eloquent.constrain'] = query;
      }
    });

    const relation = new class {
      addEagerConstraints() {
      }

      initRelation() {
      }

      getEager() {
      }

      match() {
      }

      getRelation() {
      }
    };

    // @ts-ignore
    spy1 = jest.spyOn(builder, 'getRelation').mockReturnValue(relation);
    spy2 = jest.spyOn(builder, 'applyScopes');//.mockReturnThis();
    spy3 = jest.spyOn(builder, 'eagerLoadRelations');//.mockReturnValue(['bar', 'baz']);

    const spy11 = jest.spyOn(relation, 'addEagerConstraints');
    // @ts-ignore
    const spy12 = jest.spyOn(relation, 'initRelation').mockReturnValue(['models']);
    // @ts-ignore
    const spy13 = jest.spyOn(relation, 'getEager').mockReturnValue(['results']);
    // @ts-ignore
    const spy14 = jest.spyOn(relation, 'match').mockReturnValue(['models.matched']);
    const spy15 = jest.spyOn(builder, 'getRelation');

    results = await builder.eagerLoadRelations(['models']);

    expect(spy11).toBeCalledWith(['models']);
    expect(spy12).toBeCalledWith(['models'], 'orders');
    // expect(spy12).toReturnWith(['models']);
    // expect(spy13).toReturnWith(['results']);
    expect(spy14).toBeCalledWith(['models'], ['results'], 'orders');
    // expect(spy14).toReturnWith(['models.matched']);
    expect(spy15).toBeCalledWith('orders');
    expect(spy15).toReturnWith(relation);

    expect(results).toEqual(['models.matched']);
    expect(relation).toEqual(global['__eloquent.constrain']);
  });

  it('testGetRelationProperlySetsNestedRelationships', () => {
    let spy1, spy2, spy3;

    builder = getBuilder();
    model   = getModel();
    builder.setModel(model);
    builder.setEagerLoads({
      orders                : null,
      'orders.lines'        : null,
      'orders.lines.details': null
    });

    const relation = new class {
      getQuery(): any {
      }
    };

    spy1 = jest.spyOn(model.constructor.prototype, 'getRelationMethod').mockReturnValue(relation);
    // @ts-ignore
    spy2 = jest.spyOn(builder, 'relationsNestedUnder');
    spy3 = jest.spyOn(relation, 'getQuery').mockReturnValue({
      with() {
      }
    });

    builder.getRelation('orders');

    expect(spy2).toHaveBeenCalled();
    expect(spy2).toReturnWith({
      'lines'        : null,
      'lines.details': null
    });
  });

  it('testGetRelationProperlySetsNestedRelationshipsWithSimilarNames', () => {
    let spy1, spy2, spy3, spy4;
    builder = getBuilder();
    builder.setModel(getModel());

    builder.setEagerLoads({
      'orders'                    : null,
      'ordersGroups'              : null,
      'ordersGroups.lines'        : null,
      'ordersGroups.lines.details': null
    });

    const relation   = new class {
      getQuery(): any {
      }
    };
    const groupQuery = new class {
      with() {
      }
    };

    spy1 = jest.spyOn(model.constructor.prototype, 'getRelationMethod').mockReturnValue(relation);
    // @ts-ignore
    spy2 = jest.spyOn(builder, 'relationsNestedUnder');
    spy3 = jest.spyOn(relation, 'getQuery').mockReturnValue(groupQuery);
    spy4 = jest.spyOn(groupQuery, 'with');

    builder.getRelation('orders');
    builder.getRelation('ordersGroups');

    expect(spy3).toBeCalled();
    expect(spy4).toBeCalledWith({
      'lines'        : null,
      'lines.details': null
    });
  });

  it('testGetRelationThrowsException', () => {
    builder = getBuilder();
    builder.setModel(getModel());
    try {
      builder.getRelation('invalid');
    } catch (e) {
      expect(e.message).toBe('RelationNotFoundException Model invalid');
    }
  });

  it('testEagerLoadParsingSetsProperRelationships', () => {
    let eagers;
    builder = getBuilder();
    builder.setModel(getModel());
    builder.with(['orders', 'orders.lines']);
    eagers = builder.getEagerLoads();
    expect(Object.keys(eagers)).toEqual(['orders', 'orders.lines']);

    builder = getBuilder();
    builder.with('orders', 'orders.lines');
    eagers = builder.getEagerLoads();
    expect(Object.keys(eagers)).toEqual(['orders', 'orders.lines']);
    expect(isFunction(eagers['orders'])).toBeTruthy();
    expect(isFunction(eagers['orders.lines'])).toBeTruthy();

    builder = getBuilder();
    builder.with(['orders.lines']);
    eagers = builder.getEagerLoads();
    expect(Object.keys(eagers)).toEqual(['orders', 'orders.lines']);
    expect(isFunction(eagers['orders'])).toBeTruthy();
    expect(isFunction(eagers['orders.lines'])).toBeTruthy();

    builder = getBuilder();
    builder.with({
      'orders': () => {
        return 'foo';
      }
    });
    eagers = builder.getEagerLoads();
    expect(eagers['orders']()).toBe('foo');

    builder = getBuilder();
    builder.with({
      'orders.lines': () => {
        return 'foo';
      }
    });
    eagers = builder.getEagerLoads();
    expect(isFunction(eagers['orders'])).toBe(true);
    expect(eagers['orders']()).toBe(undefined);
    expect(eagers['orders.lines']()).toBe('foo');
  });

  it('testQueryPassThru', async () => {
    // builder = getBuilder();
    // builder.getQuery().shouldReceive('foobar').once().andReturn('foo');
    // this.assertInstanceOf(Builder, builder.foobar());
    let spy1, spy2, spy3, result;

    builder = getBuilder();
    // @ts-ignore
    spy1    = jest.spyOn(builder.getQuery(), 'insert').mockReturnValue('foo');
    result  = await builder.insert(['bar']);
    expect(spy1).toBeCalledWith(['bar']);
    expect(spy1).toReturnWith('foo');
    expect(result).toEqual({'bindings': [], 'result': 'foo'});


    builder = getBuilder();
    spy1    = jest.spyOn(builder.getQuery(), 'insertOrIgnore').mockReturnValue('foo');
    result  = await builder.insertOrIgnore(['bar']);
    expect(spy1).toBeCalledWith(['bar']);
    expect(spy1).toReturnWith('foo');
    expect(result).toEqual({'bindings': [], 'result': 'foo'});


    builder = getBuilder();
    spy1    = jest.spyOn(builder.getQuery(), 'insertGetId').mockReturnValue('foo');
    result  = await builder.insertGetId(['bar']);
    expect(spy1).toBeCalledWith(['bar']);
    expect(spy1).toReturnWith('foo');
    expect(result).toEqual({'bindings': [], 'result': 'foo'});


    builder = getBuilder();
    spy1    = jest.spyOn(builder.getQuery(), 'insertUsing').mockReturnValue('foo');
    result  = await builder.insertUsing(['bar'], 'baz');
    expect(spy1).toBeCalledWith(['bar'], 'baz');
    expect(spy1).toReturnWith('foo');
    expect(result).toEqual({'bindings': [], 'result': 'foo'});


    // builder      = getBuilder();
    // spy1         = jest.spyOn(builder.getQuery(), 'raw');
    // result = await builder.raw('bar');
    // expect(spy1).toBeCalledWith('bar');
    // expect(spy1).toReturnWith('foo');
    // expect(result).toBe('foo');


    builder = getBuilder();
    spy1    = jest.spyOn(builder.getQuery(), 'getGrammar');
    result  = await builder.getGrammar();
    expect(spy1).toBeCalled();
  });

  it('testQueryScopes', () => {
    let result;
    builder = getBuilder();
    const m = new FedacoBuilderTestScopeStub();
    builder.setModel(m);

    const spy1 = jest.spyOn(builder.getQuery(), 'from');
    const spy2 = jest.spyOn(builder.getQuery(), 'where');

    result = builder.whereScope('approved');

    expect(spy2).toBeCalledWith('foo', '=', 'bar', 'and');
    expect(builder).toBe(result);
  });

  // it('testQueryScopes with no such method', () => {
  //   let result;
  //   builder = getBuilder();
  //   const m = new FedacoBuilderTestScopeStub();
  //   builder.setModel(m);
  //
  //   const spy1 = jest.spyOn(builder.getQuery(), 'from');
  //   const spy2 = jest.spyOn(builder.getQuery(), 'where');
  //
  //   // @ts-ignore
  //   result = builder.approved();
  //
  //   expect(spy2).toBeCalledWith('foo', 'bar', null, 'and');
  //   expect(builder).toBe(result);
  // });

  it('testNestedWhere', () => {
    builder = getBuilder();
    model   = getModel();

    const spy1 = jest.spyOn(builder.getQuery(), 'from');
    const spy2 = jest.spyOn(builder.getQuery(), 'addNestedWhereQuery').mockReturnThis();
    const spy3 = jest.spyOn(model, 'newQueryWithoutRelationships').mockReturnValue({
      // @ts-ignore
      foo     : jest.fn(),
      getQuery: jest.fn()
    });

    builder.setModel(model);

    const result = builder.where(query => {
      query.foo();
    });
    expect(spy1).toBeCalled();
    expect(spy2).toBeCalled();
    expect(spy2).toBeCalledWith(undefined, 'and');
    expect(result).toBe(builder);
  });

  it('testRealNestedWhereWithScopes', () => {
    const model1 = new FedacoBuilderTestNestedStub();
    mockConnectionForModel(FedacoBuilderTestNestedStub, 'SQLite');
    const query = model1.newQuery()
      .where('foo', '=', 'bar')
      .where((q: FedacoBuilder) => {
        q.where('baz', '>', 9000);
      });

    const data = query.toSql();
    expect(data.result).toBe(
      'SELECT * FROM "nest_table" WHERE "foo" = ? AND ("baz" > ?) AND "nest_table"."deleted_at" IS NULL');
    expect(data.bindings).toEqual(['bar', 9000]);
  });

  it('testRealNestedWhereWithScopesMacro', () => {
    const model1 = new FedacoBuilderTestNestedStub();
    mockConnectionForModel(FedacoBuilderTestNestedStub, 'SQLite');
    const query = model1.newQuery()
      .where('foo', '=', 'bar')
      .where(q => {
        q.where('baz', '>', 9000).pipe(
          onlyTrashed()
        );
      }).pipe(
        withTrashed()
      );
    const data  = query.toSql();
    expect(data.result).toBe(
      'SELECT * FROM "nest_table" WHERE "foo" = ? AND ("baz" > ? AND "nest_table"."deleted_at" IS NOT NULL)');
    expect(data.bindings).toEqual(['bar', 9000]);
  });

  it('testRealNestedWhereWithMultipleScopesAndOneDeadScope', () => {
    const model1 = new FedacoBuilderTestNestedStub();
    mockConnectionForModel(FedacoBuilderTestNestedStub, 'SQLite');
    const query = model1.newQuery()
      .scope('empty')
      .where('foo', '=', 'bar')
      .scope('empty')
      .where(q => {
        q.scope('empty').where('baz', '>', 9000);
      });
    const data  = query.toSql();
    expect(data.result).toBe(
      'SELECT * FROM "nest_table" WHERE "foo" = ? AND ("baz" > ?) AND "nest_table"."deleted_at" IS NULL');
    expect(data.bindings).toEqual(['bar', 9000]);
  });

  it('testRealQueryHigherOrderOrWhereScopes', () => {
    const model1 = new FedacoBuilderTestHigherOrderWhereScopeStub();
    mockConnectionForModel(FedacoBuilderTestHigherOrderWhereScopeStub, 'SQLite');
    const query = model1.newQuery()
      .scope('one')
      .orWhere(
        (q) => {
          q.scope('two');
        }
      );

    const data = query.toSql();
    expect(data.result).toBe('SELECT * FROM "nest_table" WHERE "one" = ? OR ("two" = ?)');
    expect(data.bindings).toEqual(['foo', 'bar']);
  });

  it('testRealQueryChainedHigherOrderOrWhereScopes', () => {
    const model1 = new FedacoBuilderTestHigherOrderWhereScopeStub();
    mockConnectionForModel(FedacoBuilderTestHigherOrderWhereScopeStub, 'SQLite');
    const query = model1.newQuery()
      .scope('one')
      .orWhere(
        q => {
          q.scope('two');
        }
      )
      .orWhere(
        q => {
          q.scope('three');
        }
      );

    const data = query.toSql();
    expect(data.result).toBe(
      'SELECT * FROM "nest_table" WHERE "one" = ? OR ("two" = ?) OR ("three" = ?)');
    expect(data.bindings).toEqual(['foo', 'bar', 'baz']);
  });

  it('testSimpleWhere', () => {
    let spy1, result;
    builder = getBuilder();
    spy1    = jest.spyOn(builder.getQuery(), 'where');
    result  = builder.where('foo', '=', 'bar');
    expect(spy1).toBeCalledWith('foo', '=', 'bar', 'and');
    expect(builder).toBe(result);
  });

  it('testPostgresOperatorsWhere', () => {
    let spy1, result;
    builder = getBuilder();
    spy1    = jest.spyOn(builder.getQuery(), 'where');
    result  = builder.where('foo', '@>', 'bar');
    expect(spy1).toBeCalledWith('foo', '@>', 'bar', 'and');
    expect(builder).toBe(result);
  });

  it('testDeleteOverride', () => {
    builder = getBuilder();
    builder.onDelete(builder => {
      return {
        'foo': builder
      };
    });

    expect(builder.delete()).toEqual({'foo': builder});
  });

  it('testWithCount', () => {
    const model1 = new FedacoBuilderTestModelParentStub();
    builder      = model1.newQuery().withCount('foo');
    const result = builder.toSql();

    expect(result.result).toBe(
      'select "eloquent_builder_test_model_parent_stubs".*, (select count(*) from "eloquent_builder_test_model_close_related_stubs" where "eloquent_builder_test_model_parent_stubs"."foo_id" = "eloquent_builder_test_model_close_related_stubs"."id") as "foo_count" from "eloquent_builder_test_model_parent_stubs"');
  });

  // public testWithCountAndSelect() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.select("id").withCount("foo");
  //     this.assertSame("select \"id\", (select count(*) from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\") as \"foo_count\" from \"eloquent_builder_test_model_parent_stubs\"", builder.toSql())
  //   }
  // public testWithCountAndMergedWheres() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.select("id").withCount({
  //       "activeFoo": q => {
  //         q.where("bam", ">", "qux")
  //       }
  //     });
  //     this.assertSame("select \"id\", (select count(*) from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\" and \"bam\" > ? and \"active\" = ?) as \"active_foo_count\" from \"eloquent_builder_test_model_parent_stubs\"", builder.toSql())
  //     this.assertEquals(["qux", true], builder.getBindings())
  //   }
  // public testWithCountAndGlobalScope() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     EloquentBuilderTestModelCloseRelatedStub.addGlobalScope("withCount", query => {
  //       return query.addSelect("id");
  //     })
  //     var builder = model.select("id").withCount(["foo"]);
  //     EloquentBuilderTestModelCloseRelatedStub.addGlobalScope("withCount", query => {
  //     })
  //     this.assertSame("select \"id\", (select count(*) from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\") as \"foo_count\" from \"eloquent_builder_test_model_parent_stubs\"", builder.toSql())
  //   }
  // public testWithCountAndConstraintsAndHaving() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.where("bar", "baz");
  //     builder.withCount({
  //       "foo": q => {
  //         q.where("bam", ">", "qux")
  //       }
  //     }).having("foo_count", ">=", 1)
  //     this.assertSame("select \"eloquent_builder_test_model_parent_stubs\".*, (select count(*) from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\" and \"bam\" > ?) as \"foo_count\" from \"eloquent_builder_test_model_parent_stubs\" where \"bar\" = ? having \"foo_count\" >= ?", builder.toSql())
  //     this.assertEquals(["qux", "baz", 1], builder.getBindings())
  //   }
  // public testWithCountAndRename() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.withCount("foo as foo_bar");
  //     this.assertSame("select \"eloquent_builder_test_model_parent_stubs\".*, (select count(*) from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\") as \"foo_bar\" from \"eloquent_builder_test_model_parent_stubs\"", builder.toSql())
  //   }
  // public testWithCountMultipleAndPartialRename() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.withCount(["foo as foo_bar", "foo"]);
  //     this.assertSame("select \"eloquent_builder_test_model_parent_stubs\".*, (select count(*) from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\") as \"foo_bar\", (select count(*) from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\") as \"foo_count\" from \"eloquent_builder_test_model_parent_stubs\"", builder.toSql())
  //   }
  // public testHasWithConstraintsAndHavingInSubquery() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.where("bar", "baz");
  //     builder.whereHas("foo", q => {
  //       q.having("bam", ">", "qux")
  //     }).where("quux", "quuux")
  //     this.assertSame("select * from \"eloquent_builder_test_model_parent_stubs\" where \"bar\" = ? and exists (select * from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\" having \"bam\" > ?) and \"quux\" = ?", builder.toSql())
  //     this.assertEquals(["baz", "qux", "quuux"], builder.getBindings())
  //   }
  // public testHasWithConstraintsWithOrWhereAndHavingInSubquery() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.where("name", "larry");
  //     builder.whereHas("address", q => {
  //       q.where("zipcode", "90210")
  //       q.orWhere("zipcode", "90220")
  //       q.having("street", "=", "fooside dr")
  //     }).where("age", 29)
  //     this.assertSame("select * from \"eloquent_builder_test_model_parent_stubs\" where \"name\" = ? and exists (select * from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\" and (\"zipcode\" = ? or \"zipcode\" = ?) having \"street\" = ?) and \"age\" = ?", builder.toSql())
  //     this.assertEquals(["larry", "90210", "90220", "fooside dr", 29], builder.getBindings())
  //   }
  // public testHasWithConstraintsAndJoinAndHavingInSubquery() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.where("bar", "baz");
  //     builder.whereHas("foo", q => {
  //       q.join("quuuux", j => {
  //         j.where("quuuuux", "=", "quuuuuux")
  //       })
  //       q.having("bam", ">", "qux")
  //     }).where("quux", "quuux")
  //     this.assertSame("select * from \"eloquent_builder_test_model_parent_stubs\" where \"bar\" = ? and exists (select * from \"eloquent_builder_test_model_close_related_stubs\" inner join \"quuuux\" on \"quuuuux\" = ? where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\" having \"bam\" > ?) and \"quux\" = ?", builder.toSql())
  //     this.assertEquals(["baz", "quuuuuux", "qux", "quuux"], builder.getBindings())
  //   }
  // public testHasWithConstraintsAndHavingInSubqueryWithCount() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.where("bar", "baz");
  //     builder.whereHas("foo", q => {
  //       q.having("bam", ">", "qux")
  //     }, ">=", 2).where("quux", "quuux")
  //     this.assertSame("select * from \"eloquent_builder_test_model_parent_stubs\" where \"bar\" = ? and (select count(*) from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\" having \"bam\" > ?) >= 2 and \"quux\" = ?", builder.toSql())
  //     this.assertEquals(["baz", "qux", "quuux"], builder.getBindings())
  //   }
  // public testWithCountAndConstraintsWithBindingInSelectSub() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.newQuery();
  //     builder.withCount({
  //       "foo": q => {
  //         q.selectSub(model.newQuery().where("bam", "=", 3).selectRaw("count(0)"), "bam_3_count")
  //       }
  //     })
  //     this.assertSame("select \"eloquent_builder_test_model_parent_stubs\".*, (select count(*) from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\") as \"foo_count\" from \"eloquent_builder_test_model_parent_stubs\"", builder.toSql())
  //     this.assertSame([], builder.getBindings())
  //   }
  // public testHasNestedWithConstraints() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.whereHas("foo", q => {
  //       q.whereHas("bar", q => {
  //         q.where("baz", "bam")
  //       })
  //     }).toSql();
  //     var result = model.whereHas("foo.bar", q => {
  //       q.where("baz", "bam")
  //     }).toSql();
  //     this.assertEquals(builder, result)
  //   }
  // public testHasNested() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.whereHas("foo", q => {
  //       q.has("bar")
  //     });
  //     var result = model.has("foo.bar").toSql();
  //     this.assertEquals(builder.toSql(), result)
  //   }
  // public testOrHasNested() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.whereHas("foo", q => {
  //       q.has("bar")
  //     }).orWhereHas("foo", q => {
  //       q.has("baz")
  //     });
  //     var result = model.has("foo.bar").orHas("foo.baz").toSql();
  //     this.assertEquals(builder.toSql(), result)
  //   }
  // public testSelfHasNested() {
  //     var model = new EloquentBuilderTestModelSelfRelatedStub();
  //     var nestedSql = model.whereHas("parentFoo", q => {
  //       q.has("childFoo")
  //     }).toSql();
  //     var dotSql = model.has("parentFoo.childFoo").toSql();
  //     var alias = "self_alias_hash";
  //     var aliasRegex = "/\\b(laravel_reserved_\\d)(\\b|$)/i";
  //     var nestedSql = preg_replace(aliasRegex, alias, nestedSql);
  //     var dotSql = preg_replace(aliasRegex, alias, dotSql);
  //     this.assertEquals(nestedSql, dotSql)
  //   }
  // public testSelfHasNestedUsesAlias() {
  //     var model = new EloquentBuilderTestModelSelfRelatedStub();
  //     var sql = model.has("parentFoo.childFoo").toSql();
  //     var alias = "self_alias_hash";
  //     var aliasRegex = "/\\b(laravel_reserved_\\d)(\\b|$)/i";
  //     var sql = preg_replace(aliasRegex, alias, sql);
  //     this.assertStringContainsString("\"self_alias_hash\".\"id\" = \"self_related_stubs\".\"parent_id\"", sql)
  //   }
  // public testDoesntHave() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.doesntHave("foo");
  //     this.assertSame("select * from \"eloquent_builder_test_model_parent_stubs\" where not exists (select * from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\")", builder.toSql())
  //   }
  // public testDoesntHaveNested() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.doesntHave("foo.bar");
  //     this.assertSame("select * from \"eloquent_builder_test_model_parent_stubs\" where not exists (select * from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\" and exists (select * from \"eloquent_builder_test_model_far_related_stubs\" where \"eloquent_builder_test_model_close_related_stubs\".\"id\" = \"eloquent_builder_test_model_far_related_stubs\".\"eloquent_builder_test_model_close_related_stub_id\"))", builder.toSql())
  //   }
  // public testOrDoesntHave() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.where("bar", "baz").orDoesntHave("foo");
  //     this.assertSame("select * from \"eloquent_builder_test_model_parent_stubs\" where \"bar\" = ? or not exists (select * from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\")", builder.toSql())
  //     this.assertEquals(["baz"], builder.getBindings())
  //   }
  // public testWhereDoesntHave() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.whereDoesntHave("foo", query => {
  //       query.where("bar", "baz")
  //     });
  //     this.assertSame("select * from \"eloquent_builder_test_model_parent_stubs\" where not exists (select * from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\" and \"bar\" = ?)", builder.toSql())
  //     this.assertEquals(["baz"], builder.getBindings())
  //   }
  // public testOrWhereDoesntHave() {
  //     var model = new EloquentBuilderTestModelParentStub();
  //     var builder = model.where("bar", "baz").orWhereDoesntHave("foo", query => {
  //       query.where("qux", "quux")
  //     });
  //     this.assertSame("select * from \"eloquent_builder_test_model_parent_stubs\" where \"bar\" = ? or not exists (select * from \"eloquent_builder_test_model_close_related_stubs\" where \"eloquent_builder_test_model_parent_stubs\".\"foo_id\" = \"eloquent_builder_test_model_close_related_stubs\".\"id\" and \"qux\" = ?)", builder.toSql())
  //     this.assertEquals(["baz", "quux"], builder.getBindings())
  //   }
  // public testWhereKeyMethodWithInt() {
  //     var model = this.getMockModel();
  //     var builder = this.getBuilder().setModel(model);
  //     var keyName = model.getQualifiedKeyName();
  //     var int = 1;
  //     builder.getQuery().shouldReceive("where").once()._with(keyName, "=", int)
  //     builder.whereKey(int)
  //   }
  // public testWhereKeyMethodWithArray() {
  //     var model = this.getMockModel();
  //     var builder = this.getBuilder().setModel(model);
  //     var keyName = model.getQualifiedKeyName();
  //     var array = [1, 2, 3];
  //     builder.getQuery().shouldReceive("whereIn").once()._with(keyName, array)
  //     builder.whereKey(array)
  //   }
  // public testWhereKeyMethodWithCollection() {
  //     var model = this.getMockModel();
  //     var builder = this.getBuilder().setModel(model);
  //     var keyName = model.getQualifiedKeyName();
  //     var collection = new Collection([1, 2, 3]);
  //     builder.getQuery().shouldReceive("whereIn").once()._with(keyName, collection)
  //     builder.whereKey(collection)
  //   }
  // public testWhereKeyNotMethodWithInt() {
  //     var model = this.getMockModel();
  //     var builder = this.getBuilder().setModel(model);
  //     var keyName = model.getQualifiedKeyName();
  //     var int = 1;
  //     builder.getQuery().shouldReceive("where").once()._with(keyName, "!=", int)
  //     builder.whereKeyNot(int)
  //   }
  // public testWhereKeyNotMethodWithArray() {
  //     var model = this.getMockModel();
  //     var builder = this.getBuilder().setModel(model);
  //     var keyName = model.getQualifiedKeyName();
  //     var array = [1, 2, 3];
  //     builder.getQuery().shouldReceive("whereNotIn").once()._with(keyName, array)
  //     builder.whereKeyNot(array)
  //   }
  // public testWhereKeyNotMethodWithCollection() {
  //     var model = this.getMockModel();
  //     var builder = this.getBuilder().setModel(model);
  //     var keyName = model.getQualifiedKeyName();
  //     var collection = new Collection([1, 2, 3]);
  //     builder.getQuery().shouldReceive("whereNotIn").once()._with(keyName, collection)
  //     builder.whereKeyNot(collection)
  //   }
  // public testWhereIn() {
  //     var model = new EloquentBuilderTestNestedStub();
  //     this.mockConnectionForModel(model, "")
  //     var query = model.newQuery().withoutGlobalScopes().whereIn("foo", model.newQuery().select("id"));
  //     var expected = "select * from \"table\" where \"foo\" in (select \"id\" from \"table\" where \"table\".\"deleted_at\" is null)";
  //     this.assertEquals(expected, query.toSql())
  //   }
  // public testLatestWithoutColumnWithCreatedAt() {
  //     var model = this.getMockModel();
  //     model.shouldReceive("getCreatedAtColumn").andReturn("foo")
  //     var builder = this.getBuilder().setModel(model);
  //     builder.getQuery().shouldReceive("latest").once()._with("foo")
  //     builder.latest()
  //   }
  // public testLatestWithoutColumnWithoutCreatedAt() {
  //     var model = this.getMockModel();
  //     model.shouldReceive("getCreatedAtColumn").andReturn(null)
  //     var builder = this.getBuilder().setModel(model);
  //     builder.getQuery().shouldReceive("latest").once()._with("created_at")
  //     builder.latest()
  //   }
  // public testLatestWithColumn() {
  //     var model = this.getMockModel();
  //     var builder = this.getBuilder().setModel(model);
  //     builder.getQuery().shouldReceive("latest").once()._with("foo")
  //     builder.latest("foo")
  //   }
  // public testOldestWithoutColumnWithCreatedAt() {
  //     var model = this.getMockModel();
  //     model.shouldReceive("getCreatedAtColumn").andReturn("foo")
  //     var builder = this.getBuilder().setModel(model);
  //     builder.getQuery().shouldReceive("oldest").once()._with("foo")
  //     builder.oldest()
  //   }
  // public testOldestWithoutColumnWithoutCreatedAt() {
  //     var model = this.getMockModel();
  //     model.shouldReceive("getCreatedAtColumn").andReturn(null)
  //     var builder = this.getBuilder().setModel(model);
  //     builder.getQuery().shouldReceive("oldest").once()._with("created_at")
  //     builder.oldest()
  //   }
  // public testOldestWithColumn() {
  //     var model = this.getMockModel();
  //     var builder = this.getBuilder().setModel(model);
  //     builder.getQuery().shouldReceive("oldest").once()._with("foo")
  //     builder.oldest("foo")
  //   }
  // public testUpdate() {
  //     Carbon.setTestNow(now = "2017-10-10 10:10:10")
  //     var query = new BaseBuilder(m.mock(ConnectionInterface), new Grammar(), m.mock(Processor));
  //     var builder = new Builder(query);
  //     var model = new EloquentBuilderTestStub();
  //     this.mockConnectionForModel(model, "")
  //     builder.setModel(model)
  //     builder.getConnection().shouldReceive("update").once()._with("update \"table\" set \"foo\" = ?, \"table\".\"updated_at\" = ?", ["bar", now]).andReturn(1)
  //     var result = builder.update({
  //       "foo": "bar"
  //     });
  //     this.assertEquals(1, result)
  //     Carbon.setTestNow(null)
  //   }
  // public testUpdateWithTimestampValue() {
  //     var query = new BaseBuilder(m.mock(ConnectionInterface), new Grammar(), m.mock(Processor));
  //     var builder = new Builder(query);
  //     var model = new EloquentBuilderTestStub();
  //     this.mockConnectionForModel(model, "")
  //     builder.setModel(model)
  //     builder.getConnection().shouldReceive("update").once()._with("update \"table\" set \"foo\" = ?, \"table\".\"updated_at\" = ?", ["bar", null]).andReturn(1)
  //     var result = builder.update({
  //       "foo": "bar",
  //       "updated_at": null
  //     });
  //     this.assertEquals(1, result)
  //   }
  // public testUpdateWithoutTimestamp() {
  //     var query = new BaseBuilder(m.mock(ConnectionInterface), new Grammar(), m.mock(Processor));
  //     var builder = new Builder(query);
  //     var model = new EloquentBuilderTestStubWithoutTimestamp();
  //     this.mockConnectionForModel(model, "")
  //     builder.setModel(model)
  //     builder.getConnection().shouldReceive("update").once()._with("update \"table\" set \"foo\" = ?", ["bar"]).andReturn(1)
  //     var result = builder.update({
  //       "foo": "bar"
  //     });
  //     this.assertEquals(1, result)
  //   }
  // public testUpdateWithAlias() {
  //     Carbon.setTestNow(now = "2017-10-10 10:10:10")
  //     var query = new BaseBuilder(m.mock(ConnectionInterface), new Grammar(), m.mock(Processor));
  //     var builder = new Builder(query);
  //     var model = new EloquentBuilderTestStub();
  //     this.mockConnectionForModel(model, "")
  //     builder.setModel(model)
  //     builder.getConnection().shouldReceive("update").once()._with("update \"table\" as \"alias\" set \"foo\" = ?, \"alias\".\"updated_at\" = ?", ["bar", now]).andReturn(1)
  //     var result = builder.from("table as alias").update({
  //       "foo": "bar"
  //     });
  //     this.assertEquals(1, result)
  //     Carbon.setTestNow(null)
  //   }
  // public testWithCastsMethod() {
  //     var builder = new Builder(this.getMockQueryBuilder());
  //     var model = this.getMockModel();
  //     builder.setModel(model)
  //     model.shouldReceive("mergeCasts")._with({
  //       "foo": "bar"
  //     }).once()
  //     builder.withCasts({
  //       "foo": "bar"
  //     })
  //   }

});
