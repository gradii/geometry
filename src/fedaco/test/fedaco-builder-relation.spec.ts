/* tslint:disable:max-line-length */
import { Model } from '../src/fedaco/model';
import { ConnectionResolverInterface } from '../src/interface/connection-resolver-interface';
import { ConnectionInterface } from '../src/query-builder/connection-interface';
import { MysqlGrammar } from '../src/query-builder/grammar/mysql-grammar';
import { Processor } from '../src/query-builder/processor';
import { QueryBuilder } from '../src/query-builder/query-builder';
import {
  FedacoBuilderTestModelCloseRelatedStub, FedacoBuilderTestModelParentStub
} from './model/fedaco-builder-test-model-parent-stub';
import { FedacoBuilderTestModelSelfRelatedStub } from './model/fedaco-builder-test-model-self-related-stub';

describe('fedaco builder relation', () => {

  class Conn implements ConnectionInterface {
    getQueryGrammar(): any {

    }

    getDatabaseName(): string {
      return 'default-database';
    }

    getPostProcessor(): any {

    }

    query(): QueryBuilder {
      return new QueryBuilder(
        this,
        new MysqlGrammar(),
        new Processor()
      );
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

  beforeAll(() => {
    const connection = new Conn();

    const resolver: ConnectionResolverInterface = {
      getDefaultConnection(): any {
      },
      setDefaultConnection(name: string): any {
      },
      connection() {
        return connection;
      }
    };
    (Model as typeof Model).setConnectionResolver(resolver);
  });

  it('testWithCount', () => {
    const model1 = new FedacoBuilderTestModelParentStub();

    const builder1 = model1.newQuery().withCount('foo');
    const result = builder1.toSql();

    expect(result.result).toBe(
      'SELECT `fedaco_builder_test_model_parent_stubs`.*, (SELECT count(*) FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id`) AS `foo_count` FROM `fedaco_builder_test_model_parent_stubs`');
  });

  it('testWithCountAndSelect', () => {
    const model1 = new FedacoBuilderTestModelParentStub();

    const builder1 = model1.newQuery().select('id').withCount('foo');
    const result = builder1.toSql();

    expect(result.result).toBe(
      'SELECT `id`, (SELECT count(*) FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id`) AS `foo_count` FROM `fedaco_builder_test_model_parent_stubs`');
  });

  it('testWithCountAndMergedWheres', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().select('id').withCount({
      'activeFoo': q => {
        q.where('bam', '>', 'qux');
      }
    });

    const result = builder.toSql();

    expect(result.result).toBe(
      'SELECT `id`, (SELECT count(*) FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id` AND `bam` > ? AND `active` = ?) AS `active_foo_count` FROM `fedaco_builder_test_model_parent_stubs`');
    expect(builder.getBindings()).toEqual(['qux', true]);
  });

  it('testWithCountAndGlobalScope', () => {
    const model = new FedacoBuilderTestModelParentStub();

    FedacoBuilderTestModelCloseRelatedStub.addGlobalScope('withCount', query => {
      return query.addSelect('id');
    });
    const builder = model.newQuery().select('id').withCount(['foo']);

    FedacoBuilderTestModelCloseRelatedStub.addGlobalScope('withCount', query => {
    });
    const result = builder.toSql();

    expect(result.result).toBe(
      'SELECT `id`, (SELECT count(*) FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id`) AS `foo_count` FROM `fedaco_builder_test_model_parent_stubs`');

  });

  it('testWithCountAndConstraintsAndHaving', () => {
    const model = new FedacoBuilderTestModelParentStub();
    // @ts-ignore
    const builder = model.newQuery().where('bar', 'baz');
    builder.withCount({
      'foo': q => {
        q.where('bam', '>', 'qux');
      }
    }).having('foo_count', '>=', 1);

    const result = builder.toSql();


    expect(result.result).toBe(
      'SELECT `fedaco_builder_test_model_parent_stubs`.*, (SELECT count(*) FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id` AND `bam` > ?) AS `foo_count` FROM `fedaco_builder_test_model_parent_stubs` WHERE `bar` = ? HAVING `foo_count` >= ?');

    expect(result.bindings).toEqual(['qux', 'baz', 1]);

  });

  it('testWithCountAndRename', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().withCount('foo as foo_bar');

    const result = builder.toSql();

    expect(result.result).toBe(
      'SELECT `fedaco_builder_test_model_parent_stubs`.*, (SELECT count(*) FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id`) AS `foo_bar` FROM `fedaco_builder_test_model_parent_stubs`');

  });

  it('testWithCountMultipleAndPartialRename', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().withCount(['foo as foo_bar', 'foo']);

    const result = builder.toSql();

    expect(result.result).toBe(
      'SELECT `fedaco_builder_test_model_parent_stubs`.*, (SELECT count(*) FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id`) AS `foo_bar`, (SELECT count(*) FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id`) AS `foo_count` FROM `fedaco_builder_test_model_parent_stubs`');
  });
  it('testHasWithConstraintsAndHavingInSubquery', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().where('bar', 'baz');
    builder.whereHas('foo', q => {
      q.having('bam', '>', 'qux');
    }).where('quux', 'quuux');

    const result = builder.toSql();

    expect(result.result).toBe(
      'SELECT * FROM `fedaco_builder_test_model_parent_stubs` WHERE `bar` = ? AND EXISTS (SELECT * FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id` HAVING `bam` > ?) AND `quux` = ?');

    expect(result.bindings).toEqual(['baz', 'qux', 'quuux']);
  });

  it('testHasWithConstraintsWithOrWhereAndHavingInSubquery', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().where('name', 'larry');
    builder.whereHas('address', q => {
      q.where(q => {
        q.where('zipcode', '90210');
        q.orWhere('zipcode', '90220');
      });
      q.having('street', '=', 'fooside dr');
    }).where('age', 29);

    const result = builder.toSql();

    expect(result.result).toBe(
      'SELECT * FROM `fedaco_builder_test_model_parent_stubs` WHERE `name` = ? AND EXISTS (SELECT * FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id` AND (`zipcode` = ? OR `zipcode` = ?) HAVING `street` = ?) AND `age` = ?');

    expect(result.bindings).toEqual(['larry', '90210', '90220', 'fooside dr', 29]);
  });

  it('testHasWithConstraintsAndJoinAndHavingInSubquery', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().where('bar', 'baz');
    builder.whereHas('foo', q => {
      q.join('quuuux', j => {
        j.where('quuuuux', '=', 'quuuuuux');
      });
      q.having('bam', '>', 'qux');
    }).where('quux', 'quuux');

    const result = builder.toSql();

    expect(result.result).toBe(
      'SELECT * FROM `fedaco_builder_test_model_parent_stubs` WHERE `bar` = ? AND EXISTS (SELECT * FROM `fedaco_builder_test_model_close_related_stubs` INNER JOIN `quuuux` ON `quuuuux` = ? WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id` HAVING `bam` > ?) AND `quux` = ?');

    expect(result.bindings).toEqual(['baz', 'quuuuuux', 'qux', 'quuux']);
  });

  it('testHasWithConstraintsAndHavingInSubqueryWithCount', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().where('bar', 'baz');
    builder.whereHas('foo', q => {
      q.having('bam', '>', 'qux');
    }, '>=', 2).where('quux', 'quuux');

    const result = builder.toSql();

    expect(result.result).toBe(
      'SELECT * FROM `fedaco_builder_test_model_parent_stubs` WHERE `bar` = ? AND (SELECT count(*) FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id` HAVING `bam` > ?) >= 2 AND `quux` = ?');

    expect(result.bindings).toEqual(['baz', 'qux', 'quuux']);

  });

  it('testWithCountAndConstraintsWithBindingInSelectSub', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery();
    builder.withCount({
      'foo': q => {
        q.selectSub(
          model.newQuery()
            .where('bam', '=', 3)
            .selectRaw('count(0)'),
          'bam_3_count'
        );
      }
    });

    const result = builder.toSql();

    expect(result.result).toBe(
      'SELECT `fedaco_builder_test_model_parent_stubs`.*, (SELECT count(*) FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id`) AS `foo_count` FROM `fedaco_builder_test_model_parent_stubs`');

    expect(result.bindings).toEqual([]);
  });

  it('testHasNestedWithConstraints', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().whereHas('foo', q => {
      q.whereHas('bar', q => {
        q.where('baz', 'bam');
      });
    }).toSql();
    const result = model.newQuery().whereHas('foo.bar', q => {
      q.where('baz', 'bam');
    }).toSql();
    expect(builder.result).toBe(result.result);
  });

  it('testHasNested', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().whereHas('foo', q => {
      q.has('bar');
    });
    const result = model.newQuery().has('foo.bar').toSql();
    expect(result).toEqual(builder.toSql());
  });
  it('testOrHasNested', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().whereHas('foo', q => {
      q.has('bar');
    }).orWhereHas('foo', q => {
      q.has('baz');
    });
    const result = model.newQuery().has('foo.bar').orHas('foo.baz').toSql();

    expect(builder.toSql().result).toBe(
      'SELECT * FROM `fedaco_builder_test_model_parent_stubs` WHERE EXISTS (SELECT * FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id` AND EXISTS (SELECT * FROM `fedaco_builder_test_model_far_related_stubs` WHERE `fedaco_builder_test_model_close_related_stubs`.`id` = `fedaco_builder_test_model_far_related_stubs`.`fedaco_builder_test_model_close_related_stub_id`)) OR EXISTS (SELECT * FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id` AND EXISTS (SELECT * FROM `fedaco_builder_test_model_far_related_stubs` WHERE `fedaco_builder_test_model_close_related_stubs`.`id` = `fedaco_builder_test_model_far_related_stubs`.`fedaco_builder_test_model_close_related_stub_id`))'
    );
    expect(builder.toSql().result).toBe(result.result);
  });
  it('testSelfHasNested', () => {
    const model = new FedacoBuilderTestModelSelfRelatedStub();
    const nestedSql = model.newQuery().whereHas('parentFoo', q => {
      q.has('childFoo');
    }).toSql();
    const dotSql = model.newQuery().has('parentFoo.childFoo').toSql();
    const alias = 'self_alias_hash';
    const aliasRegex = /\b(laravel_reserved_\d)(\b|$)/ig;
    const nestedSqlStr = nestedSql.result.replace(aliasRegex, alias);
    const dotSqlStr = dotSql.result.replace(aliasRegex, alias);
    expect(dotSqlStr).toBe(nestedSqlStr);
  });

  it('testSelfHasNestedUsesAlias', () => {
    const model = new FedacoBuilderTestModelSelfRelatedStub();
    let sql = model.newQuery().has('parentFoo.childFoo').toSql().result;
    const alias = 'self_alias_hash';
    const aliasRegex = /\b(laravel_reserved_\d)(\b|$)/ig;
    sql = sql.replace(aliasRegex, alias);
    expect(sql).toContain('`self_alias_hash`.`id` = `self_related_stubs`.`parent_id`',)
  });

  it('testDoesntHave', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().doesntHave('foo');

    const result = builder.toSql();

    expect(result.result).toBe('SELECT * FROM `fedaco_builder_test_model_parent_stubs` WHERE NOT EXISTS (SELECT * FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id`)')
  });

  it('testDoesntHaveNested', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().doesntHave('foo.bar');

    const result = builder.toSql();

    expect(result.result).toBe('SELECT * FROM `fedaco_builder_test_model_parent_stubs` WHERE NOT EXISTS (SELECT * FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id` AND EXISTS (SELECT * FROM `fedaco_builder_test_model_far_related_stubs` WHERE `fedaco_builder_test_model_close_related_stubs`.`id` = `fedaco_builder_test_model_far_related_stubs`.`fedaco_builder_test_model_close_related_stub_id`))')
  });

  it('testOrDoesntHave', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().where('bar', 'baz').orDoesntHave('foo');

    const result = builder.toSql();

    expect(result.result).toBe('SELECT * FROM `fedaco_builder_test_model_parent_stubs` WHERE `bar` = ? OR NOT EXISTS (SELECT * FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id`)')
    expect(builder.getBindings()).toEqual(['baz'])
  });

  it('testWhereDoesntHave', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().whereDoesntHave('foo', query => {
      query.where('bar', 'baz')
    });

    const result = builder.toSql();

    expect(result.result).toBe('SELECT * FROM `fedaco_builder_test_model_parent_stubs` WHERE NOT EXISTS (SELECT * FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id` AND `bar` = ?)')
    expect(builder.getBindings()).toEqual(['baz'])
  });

  it('testOrWhereDoesntHave', () => {
    const model = new FedacoBuilderTestModelParentStub();
    const builder = model.newQuery().where('bar', 'baz').orWhereDoesntHave('foo', query => {
      query.where('qux', 'quux')
    });

    const result = builder.toSql();

    expect(result.result).toBe('SELECT * FROM `fedaco_builder_test_model_parent_stubs` WHERE `bar` = ? OR NOT EXISTS (SELECT * FROM `fedaco_builder_test_model_close_related_stubs` WHERE `fedaco_builder_test_model_parent_stubs`.`foo_id` = `fedaco_builder_test_model_close_related_stubs`.`id` AND `qux` = ?)')
    expect(builder.getBindings()).toEqual(['baz', 'quux'])
  });


});
