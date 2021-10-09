import { isArray, isNumber } from '@gradii/check-type';
import { format, formatISO, startOfSecond } from 'date-fns';
import { head } from 'ramda';
import { Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ArrayColumn } from '../src/annotation/column/array.column';
import { Column } from '../src/annotation/column/column';
import { CreatedAtColumn } from '../src/annotation/column/created-at.column';
import { PrimaryColumn } from '../src/annotation/column/primary.column';
import { UpdatedAtColumn } from '../src/annotation/column/updated-at.column';
import { BelongsToManyColumn } from '../src/annotation/relation-column/belongs-to-many.relation-column';
import { BelongsToColumn } from '../src/annotation/relation-column/belongs-to.relation-column';
import { HasManyColumn } from '../src/annotation/relation-column/has-many.relation-column';
import { HasOneColumn } from '../src/annotation/relation-column/has-one.relation-column';
import { MorphManyColumn } from '../src/annotation/relation-column/morph-many.relation-column';
import { MorphToColumn } from '../src/annotation/relation-column/morph-to.relation-column';
import { Table } from '../src/annotation/table/table';
import { DatabaseConfig } from '../src/database-config';
import { FedacoBuilder } from '../src/fedaco/fedaco-builder';
import { Model } from '../src/fedaco/model';
import { BelongsToMany } from '../src/fedaco/relations/belongs-to-many';
import { HasMany } from '../src/fedaco/relations/has-many';
import { Pivot } from '../src/fedaco/relations/pivot';
import { Relation } from '../src/fedaco/relations/relation';
import { forwardRef } from '../src/query-builder/forward-ref';
import { SchemaBuilder } from '../src/schema/schema-builder';
import { Post } from './fixtures/post.model';
import { User } from './fixtures/user.model';

function connection(connectionName = 'default') {
  return Model.getConnectionResolver().connection(connectionName);
}

function schema(connectionName = 'default'): SchemaBuilder {
  return connection(connectionName).getSchemaBuilder();
}

jest.setTimeout(100000);

async function createSchema() {
  await schema('default')
    .create('test_orders', table => {
      table.increments('id');
      table.string('item_type');
      table.integer('item_id');
      table.timestamps();
    });
  await schema('default').create('with_json', table => {
    table.increments('id');
    table.text('json').withDefault(JSON.stringify([]));
  });
  await schema('second_connection').create('test_items', table => {
    table.increments('id');
    table.timestamps();
  });
  await schema('default').create('users_with_space_in_colum_name', table => {
    table.increments('id');
    table.string('name').withNullable();
    table.string('email_address');
    table.timestamps();
  });

  for (const name of ['default', 'second_connection']) {
    const index = ['default', 'second_connection'].indexOf(name);
    await schema(name).create('users', function (table) {
      table.increments('id');
      table.string('name').withNullable();
      table.string('email');
      table.timestamp('birthday', 6).withNullable();
      table.timestamps();
    });

    await schema(name).create('friends', function (table) {
      table.integer('user_id');
      table.integer('friend_id');
      table.integer('friend_level_id').withNullable();
    });

    await schema(name).create('posts', function (table) {
      table.increments('id');
      table.integer('user_id');
      table.integer('parent_id').withNullable();
      table.string('name');
      table.timestamps();
    });

    await schema(name).create('comments', function (table) {
      table.increments('id');
      table.integer('post_id');
      table.string('content');
      table.timestamps();
    });

    await schema(name).create('friend_levels', function (table) {
      table.increments('id');
      table.string('level');
      table.timestamps();
    });

    await schema(name).create('photos', function (table) {
      table.increments('id');
      table.morphs('imageable');
      table.string('name');
      table.timestamps();
    });

    await schema(name).create('soft_deleted_users', function (table) {
      table.increments('id');
      table.string('name').withNullable();
      table.string('email');
      table.timestamps();
      table.softDeletes();
    });

    await schema(name).create('tags', function (table) {
      table.increments('id');
      table.string('name');
      table.timestamps();
    });

    await schema(name).create('taggables', function (table) {
      table.integer('tag_id');
      table.morphs('taggable');
      table.string('taxonomy').withNullable();
    });

    await schema(name).create('non_incrementing_users', table => {
      table.string('name').withNullable();
    });

  }
}

describe('test database eloquent integration', () => {
  beforeAll(async () => {
    const files = {
      'default': 'tmp/integration.sqlite',
      'second' : 'tmp/integration-second.sqlite'
    };
    // for (const it of Object.values(files)) {
    //   if (it !== ':memory:') {
    //     if (fs.existsSync(it)) {
    //       fs.unlinkSync(it);
    //     }
    //   }
    // }

    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': files.default
    });
    db.addConnection({
      'driver'  : 'sqlite',
      'database': files.second
    }, 'second_connection');
    db.bootEloquent();
    db.setAsGlobal();
    await createSchema();
  });

  afterEach(async () => {
    for (const it of ['test_orders', 'with_json', 'users_with_space_in_colum_name']) {
      await DatabaseConfig.table(it, undefined, 'default').truncate();
    }
    for (const it of ['test_items']) {
      await DatabaseConfig.table(it, undefined, 'second_connection').truncate();
    }
    for (const it of [
      'comments',
      'friend_levels',
      'friends',
      'non_incrementing_users',
      'photos',
      'posts',
      'soft_deleted_users',
      'taggables',
      'tags',
      'users',
    ]) {
      await DatabaseConfig.table(it, undefined, 'default').truncate();
      await DatabaseConfig.table(it, undefined, 'second_connection').truncate();
    }

    // [].forEach((connection, index) => {
    // });
    // Relation.morphMap([], false);
    // Model.unsetConnectionResolver();
  });

  it('basic create model', async () => {
    const model = await new EloquentTestUser().newQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });

    expect(model.id).toBe(1);
    expect(model.email).toBe('taylorotwell@gmail.com');
    await model.delete();
  });

  it('basic model retrieval', async () => {
    const factory = new EloquentTestUser();

    await factory.newQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });

    await factory.newQuery().create({
      'id'   : 2,
      'email': 'abigailotwell@gmail.com'
    });

    expect(await factory.newQuery().count()).toEqual(2);
    expect(
      await factory.newQuery().where('email', 'taylorotwell@gmail.com').doesntExist()).toBeFalsy();
    expect(
      await factory.newQuery().where('email', 'mohamed@laravel.com').doesntExist()).toBeTruthy();
    let model: EloquentTestUser = await factory.newQuery()
      .where('email', 'taylorotwell@gmail.com').first();
    expect(model.email).toBe('taylorotwell@gmail.com');
    expect(model.email !== undefined).toBeTruthy();
    const friends = await model.friends;
    expect(friends !== undefined).toBeTruthy();
    expect(friends).toEqual([]);
    model = await factory.newQuery().find(1);
    expect(model).toBeInstanceOf(EloquentTestUser);
    expect(model.id).toEqual(1);
    model = await factory.newQuery().find(2);
    expect(model).toBeInstanceOf(EloquentTestUser);
    expect(model.id).toEqual(2);
    const missing = await factory.newQuery().find(3);
    expect(missing).toBeUndefined();
    let collection = await factory.newQuery().find([]);
    expect(isArray(collection)).toBeTruthy();
    expect(collection.length).toBe(0);
    collection = await factory.newQuery().find([1, 2, 3]);
    expect(isArray(collection)).toBeTruthy();
    expect(collection.length).toBe(2);
    const models = await factory.newQuery().where('id', 1).get(); // .cursor();
    for (const m of models) {
      expect(m.id).toEqual(1);
      expect(m.getConnectionName()).toBe('default');
    }
    // let records = DB.table('users').where('id', 1).cursor();
    // for (let record of records) {
    //   expect(record.id).toEqual(1);
    // }
    // let records = DB.cursor('select * from users where id = ?', [1]);
    // for (let record of records) {
    //   expect(record.id).toEqual(1);
    // }
  });

  it('basic model collection retrieval', async () => {
    await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'id'   : 2,
      'email': 'abigailotwell@gmail.com'
    });
    const models = await new EloquentTestUser().newQuery().oldest('id').get();
    expect(models.length).toBe(2);
    expect(isArray(models)).toBeTruthy();
    expect(models[0]).toBeInstanceOf(EloquentTestUser);
    expect(models[1]).toBeInstanceOf(EloquentTestUser);
    expect(models[0].email).toBe('taylorotwell@gmail.com');
    expect(models[1].email).toBe('abigailotwell@gmail.com');
  });

  it('paginated model collection retrieval', async () => {
    await new EloquentTestUser().newQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await new EloquentTestUser().newQuery().create({
      'id'   : 2,
      'email': 'abigailotwell@gmail.com'
    });
    await new EloquentTestUser().newQuery().create({
      'id'   : 3,
      'email': 'foo@gmail.com'
    });
    // Paginator.currentPageResolver(() => {
    //   return 1;
    // });
    let models = await new EloquentTestUser().newQuery()
      .oldest('id').paginate(1, 2);
    expect(models.items.length).toBe(2);
    expect(models.items[0]).toBeInstanceOf(EloquentTestUser);
    expect(models.items[1]).toBeInstanceOf(EloquentTestUser);
    expect(models.items[0].email).toBe('taylorotwell@gmail.com');
    expect(models.items[1].email).toBe('abigailotwell@gmail.com');
    // Paginator.currentPageResolver(() => {
    //   return 2;
    // });
    models = await new EloquentTestUser().newQuery()
      .oldest('id').paginate(2, 2);
    expect(models.items.length).toBe(1);
    expect(models.items[0]).toBeInstanceOf(EloquentTestUser);
    expect(models.items[0].email).toBe('foo@gmail.com');
  });

  it('paginated model collection retrieval when no elements', async () => {
    // Paginator.currentPageResolver(() => {
    //   return 1;
    // });
    let models = await new EloquentTestUser().newQuery().oldest('id').paginate(1, 2);
    expect(models.items.length).toBe(0);
    // expect(models).toInstanceOf(LengthAwarePaginator);
    // Paginator.currentPageResolver(() => {
    //   return 2;
    // });
    models = await new EloquentTestUser().newQuery().oldest('id').paginate(2, 2);
    expect(models.items.length).toBe(0);
  });

  it('paginated model collection retrieval when no elements and default per page', async () => {
    const models = await new EloquentTestUser().newQuery().oldest('id').paginate();
    expect(models.items.length).toBe(0);
    // expect(models).toInstanceOf(LengthAwarePaginator);
  });

  it('count for pagination with grouping', async () => {
    await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'id'   : 2,
      'email': 'abigailotwell@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'id'   : 3,
      'email': 'foo@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'id'   : 4,
      'email': 'foo@gmail.com'
    });
    const query = EloquentTestUser.createQuery().groupBy('email').getQuery();
    expect(await query.getCountForPagination()).toEqual(3);
  });

  it('count for pagination with grouping and sub selects', async () => {
    const user1 = await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'id'   : 2,
      'email': 'abigailotwell@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'id'   : 3,
      'email': 'foo@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'id'   : 4,
      'email': 'foo@gmail.com'
    });
    const friendsRelation = user1.newRelation('friends') as BelongsToMany;
    await friendsRelation.create({
      'id'   : 5,
      'email': 'friend@gmail.com'
    });
    const query = await EloquentTestUser.createQuery().select({
      0              : 'id',
      'friends_count': await EloquentTestUser
        .createQuery()
        .whereColumn('friend_id', 'user_id')
        .count()
    }).groupBy('email').getQuery();
    expect(await query.getCountForPagination()).toEqual(4);
  });

  it('first or create', async () => {
    const user1 = await EloquentTestUser.createQuery().firstOrCreate({
      'email': 'taylorotwell@gmail.com'
    });
    expect(user1.email).toBe('taylorotwell@gmail.com');
    expect(user1.name).toBeUndefined();
    const user2 = await EloquentTestUser.createQuery().firstOrCreate({
      'email': 'taylorotwell@gmail.com'
    }, {
      'name': 'Taylor Otwell'
    });
    expect(user2.id).toEqual(user1.id);
    expect(user2.email).toBe('taylorotwell@gmail.com');
    expect(user2.name).toBeNull();
    const user3 = await EloquentTestUser.createQuery().firstOrCreate({
      'email': 'abigailotwell@gmail.com'
    }, {
      'name': 'Abigail Otwell'
    });
    expect(user1.id).not.toEqual(user3.id);
    expect(user3.email).toBe('abigailotwell@gmail.com');
    expect(user3.name).toBe('Abigail Otwell');
  });

  it('update or create', async () => {
    const user1 = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    const user2 = await EloquentTestUser.createQuery().updateOrCreate({
      'email': 'taylorotwell@gmail.com'
    }, {
      'name': 'Taylor Otwell'
    });
    expect(user2.id).toEqual(user1.id);
    expect(user2.email).toBe('taylorotwell@gmail.com');
    expect(user2.name).toBe('Taylor Otwell');
    const user3 = await EloquentTestUser.createQuery().updateOrCreate({
      'email': 'themsaid@gmail.com'
    }, {
      'name': 'Mohamed Said'
    });
    expect(user3.name).toBe('Mohamed Said');
    expect(await EloquentTestUser.createQuery().count()).toBe(2);
  });

  it('update or create on different connection', async () => {
    await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await EloquentTestUser.useConnection('second_connection').updateOrCreate({
      'email': 'taylorotwell@gmail.com'
    }, {
      'name': 'Taylor Otwell'
    });
    await EloquentTestUser.useConnection('second_connection').updateOrCreate({
      'email': 'themsaid@gmail.com'
    }, {
      'name': 'Mohamed Said'
    });
    expect(await EloquentTestUser.createQuery().count()).toBe(1);
    expect(await EloquentTestUser.useConnection('second_connection').count()).toBe(2);
  });

  it('check and create methods on multi connections', async () => {
    await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await EloquentTestUser.useConnection('second_connection')
      .find(
        EloquentTestUser.useConnection('second_connection').insert({
          'id'   : 2,
          'email': 'themsaid@gmail.com'
        })
      );
    let user1 = await EloquentTestUser.useConnection('second_connection').findOrNew(1);
    let user2 = await EloquentTestUser.useConnection('second_connection').findOrNew(2);
    expect(user1._exists).toBeFalsy();
    expect(user2._exists).toBeTruthy();
    expect(user1.getConnectionName()).toBe('second_connection');
    expect(user2.getConnectionName()).toBe('second_connection');
    user1 = await EloquentTestUser.useConnection('second_connection').firstOrNew({
      'email': 'taylorotwell@gmail.com'
    });
    user2 = await EloquentTestUser.useConnection('second_connection').firstOrNew({
      'email': 'themsaid@gmail.com'
    });
    expect(user1._exists).toBeFalsy();
    expect(user2._exists).toBeTruthy();
    expect(user1.getConnectionName()).toBe('second_connection');
    expect(user2.getConnectionName()).toBe('second_connection');
    expect(await EloquentTestUser.useConnection('second_connection').count()).toEqual(1);
    user1 = await EloquentTestUser.useConnection('second_connection').firstOrCreate({
      'email': 'taylorotwell@gmail.com'
    });
    user2 = await EloquentTestUser.useConnection('second_connection').firstOrCreate({
      'email': 'themsaid@gmail.com'
    });
    expect(user1.getConnectionName()).toBe('second_connection');
    expect(user2.getConnectionName()).toBe('second_connection');
    expect(await EloquentTestUser.useConnection('second_connection').count()).toEqual(2);
  });

  it('creating model with empty attributes', async () => {
    const model = await EloquentTestNonIncrementing.createQuery().create({});
    expect(model._exists).toBeFalsy();
    expect(model._wasRecentlyCreated).toBeFalsy();
  });

  it('chunk by id with non incrementing key', async () => {
    await EloquentTestNonIncrementingSecond.createQuery().create({
      'name': ' First'
    });
    await EloquentTestNonIncrementingSecond.createQuery().create({
      'name': ' Second'
    });
    await EloquentTestNonIncrementingSecond.createQuery().create({
      'name': ' Third'
    });
    let i     = 0;
    const spy = jest.fn(({results: users, page}) => {
      if (!i) {
        expect(users[0].name).toBe(' First');
        expect(users[1].name).toBe(' Second');
      } else {
        expect(users[0].name).toBe(' Third');
      }
      i++;
    });
    await EloquentTestNonIncrementingSecond.createQuery()
      .chunkById(2, 'name')
      .pipe(
        finalize(() => {
          expect(i).toEqual(2);
        }),
        tap(spy)
      )
      .toPromise();

    expect(spy).toBeCalled();
  });

  it('chunk by id with non incrementing key test signal', async () => {
    await EloquentTestNonIncrementingSecond.createQuery().create({
      'name': ' First'
    });
    await EloquentTestNonIncrementingSecond.createQuery().create({
      'name': ' Second'
    });
    await EloquentTestNonIncrementingSecond.createQuery().create({
      'name': ' Third'
    });
    let i        = 0;
    const spy    = jest.fn(({results: users, page}) => {
      if (!i) {
        // uncomment me test run successful.
        // try to comment me then test should hang on! works as expect
        signal.next();
        expect(users[0].name).toBe(' First');
        expect(users[1].name).toBe(' Second');
      } else {
        expect(users[0].name).toBe(' Third');
      }
      i++;
    });
    const signal = new Subject();
    await EloquentTestNonIncrementingSecond.createQuery()
      .chunkById(2, 'name', undefined, signal)
      .pipe(
        finalize(() => {
          expect(i).toEqual(2);
        }),
        tap(spy)
      )
      .toPromise();

    expect(spy).toBeCalled();
  });

  it('each by id with non incrementing key', async () => {
    await EloquentTestNonIncrementingSecond.createQuery().create({
      'name': ' First'
    });
    await EloquentTestNonIncrementingSecond.createQuery().create({
      'name': ' Second'
    });
    await EloquentTestNonIncrementingSecond.createQuery().create({
      'name': ' Third'
    });
    const users = [];
    await EloquentTestNonIncrementingSecond.createQuery()
      .eachById(2, 'name')
      .pipe(
        tap(({item: user, index: i}) => {
          users.push([user.name, i]);
        })
      ).toPromise();
    expect(users).toEqual([[' First', 0], [' Second', 1], [' Third', 2]]);
  });

  it('pluck', async () => {
    await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'id'   : 2,
      'email': 'abigailotwell@gmail.com'
    });
    const simple = await EloquentTestUser.createQuery()
      .oldest('id')
      .pluck('users.email');
    const keyed  = await EloquentTestUser.createQuery()
      .oldest('id')
      .pluck('users.email', 'users.id');
    expect(simple).toEqual(['taylorotwell@gmail.com', 'abigailotwell@gmail.com']);
    expect(keyed).toEqual({
      1: 'taylorotwell@gmail.com',
      2: 'abigailotwell@gmail.com'
    });
  });

  it('pluck with join', async () => {
    const user1 = await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    const user2 = await EloquentTestUser.createQuery().create({
      'id'   : 2,
      'email': 'abigailotwell@gmail.com'
    });
    await (user2.newRelation('posts') as HasMany).create({
      'id'  : 1,
      'name': 'First post'
    });
    await (user1.newRelation('posts') as HasMany).create({
      'id'  : 2,
      'name': 'Second post'
    });
    const query = EloquentTestUser.createQuery().join('posts', 'users.id', '=', 'posts.user_id');
    expect(await query.pluck('posts.name', 'posts.id')).toEqual({
      1: 'First post',
      2: 'Second post'
    });
    expect(await query.pluck('posts.name', 'users.id')).toEqual({
      2: 'First post',
      1: 'Second post'
    });
    expect(await query.pluck('posts.name', 'users.email AS user_email')).toEqual({
      'abigailotwell@gmail.com': 'First post',
      'taylorotwell@gmail.com' : 'Second post'
    });
  });

  it('pluck with column name containing a space', async () => {
    await EloquentTestUserWithSpaceInColumnName.createQuery().create({
      'id'           : 1,
      'email_address': 'taylorotwell@gmail.com'
    });
    await EloquentTestUserWithSpaceInColumnName.createQuery().create({
      'id'           : 2,
      'email_address': 'abigailotwell@gmail.com'
    });
    const simple = await EloquentTestUserWithSpaceInColumnName.createQuery().oldest('id').pluck(
      'users_with_space_in_colum_name.email_address');
    const keyed  = await EloquentTestUserWithSpaceInColumnName.createQuery().oldest('id').pluck(
      'email_address',
      'id');
    expect(simple).toEqual(['taylorotwell@gmail.com', 'abigailotwell@gmail.com']);
    expect(keyed).toEqual({
      1: 'taylorotwell@gmail.com',
      2: 'abigailotwell@gmail.com'
    });
  });

  it('find or fail', async () => {
    await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'id'   : 2,
      'email': 'abigailotwell@gmail.com'
    });
    const single   = await EloquentTestUser.createQuery().findOrFail(1);
    const multiple = await EloquentTestUser.createQuery().findOrFail([1, 2]);
    expect(single).toBeInstanceOf(EloquentTestUser);
    expect(single.email).toBe('taylorotwell@gmail.com');
    expect(isArray(multiple)).toBeTruthy();
    expect(multiple[0]).toBeInstanceOf(EloquentTestUser);
    expect(multiple[1]).toBeInstanceOf(EloquentTestUser);
  });

  it('find or fail with single id throws model not found exception', async () => {
    await expect(async () => {
      await EloquentTestUser.createQuery().findOrFail(1);
    }).rejects.toThrowError(
      'ModelNotFoundException No query results for model [EloquentTestUser] 1)');
  });

  it('find or fail with multiple ids throws model not found exception', async () => {
    await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await expect(async () => {
      await EloquentTestUser.createQuery().findOrFail([1, 2]);
    }).rejects.toThrowError(
      'ModelNotFoundException No query results for model [EloquentTestUser] [1, 2]');
  });

  // xit('find or fail with multiple ids using collection throws model not found exception', async () => {
  //   await EloquentTestUser.createQuery().create({
  //     'id'   : 1,
  //     'email': 'taylorotwell@gmail.com'
  //   });
  //   await expect(async () => {
  //     await EloquentTestUser.createQuery().findOrFail([1, 2]);
  //   }).rejects.toThrowError(
  //     'ModelNotFoundException No query results for model [EloquentTestUser] [1, 2]');
  // });

  it('one to one relationship', async () => {
    let user = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await user.newRelation('post').create({
      'name': 'First Post'
    });
    const post = await user.post;

    user = await post.user;
    expect((await user.post).name).not.toBeUndefined();
    expect(user).toBeInstanceOf(EloquentTestUser);
    expect(post).toBeInstanceOf(EloquentTestPost);
    expect(user.email).toBe('taylorotwell@gmail.com');
    expect(post.name).toBe('First Post');
  });

  it('isset loads in relationship if it isnt loaded already', async () => {
    const user = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await user.newRelation('post').create({
      'name': 'First Post'
    });
    expect((await user.post).name).not.toBeUndefined();
  });

  it('one to many relationship', async () => {
    const user = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await (user.newRelation('posts') as HasMany).create({
      'name': 'First Post'
    });
    await user.newRelation('posts').create({
      'name': 'Second Post'
    });
    const posts = await user.posts;
    const post2 = await user.newRelation('posts').where('name', 'Second Post').first();
    expect(isArray(posts)).toBeTruthy();
    expect(posts.length).toBe(2);
    expect(posts[0]).toBeInstanceOf(EloquentTestPost);
    expect(posts[1]).toBeInstanceOf(EloquentTestPost);
    expect(post2).toBeInstanceOf(EloquentTestPost);
    expect(post2.name).toBe('Second Post');
    expect(await post2.user).toBeInstanceOf(EloquentTestUser);
    expect((await post2.user).email).toBe('taylorotwell@gmail.com');
  });

  it('basic model hydration', async () => {
    let user = EloquentTestUser.initAttributes({
      'email': 'taylorotwell@gmail.com'
    });
    user.setConnection('second_connection');
    await user.save();
    user = EloquentTestUser.initAttributes({
      'email': 'abigailotwell@gmail.com'
    });
    user.setConnection('second_connection');
    await user.save();
    const models = await EloquentTestUser.useConnection('second_connection').fromQuery(
      'SELECT * FROM users WHERE email = ?', ['abigailotwell@gmail.com']);
    expect(isArray(models)).toBeTruthy();
    expect(models[0]).toBeInstanceOf(EloquentTestUser);
    expect(models[0].email).toBe('abigailotwell@gmail.com');
    expect(models[0].getConnectionName()).toBe('second_connection');
    expect(models.length).toBe(1);
  });

  it('has on self referencing belongs to many relationship', async () => {
    const user = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await user.newRelation('friends').create({
      'email': 'abigailotwell@gmail.com'
    });
    expect((await user.friends)[0].id !== undefined).toBeTruthy();
    const results = await EloquentTestUser.createQuery().has('friends').get();
    expect(results.length).toBe(1);
    expect(head(results).email).toBe('taylorotwell@gmail.com');
  });

  it('where has on self referencing belongs to many relationship', async () => {
    const user = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await user.newRelation('friends').create({
      'email': 'abigailotwell@gmail.com'
    });
    const results: EloquentTestUser[] = await EloquentTestUser.createQuery()
      .whereHas('friends', query => {
        query.where('email', 'abigailotwell@gmail.com');
      }).get();
    expect(results.length).toBe(1);
    expect(head(results).email).toBe('taylorotwell@gmail.com');
  });

  it('has on nested self referencing belongs to many relationship', async () => {
    const user   = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    const friend = await user.newRelation('friends').create({
      'email': 'abigailotwell@gmail.com'
    });
    await friend.newRelation('friends').create({
      'email': 'foo@gmail.com'
    });
    const results = await EloquentTestUser.createQuery().has('friends.friends').get();
    expect(results.length).toBe(1);
    expect(head(results).email).toBe('taylorotwell@gmail.com');
  });

  it('where has on nested self referencing belongs to many relationship', async () => {
    const user   = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    const friend = await user.newRelation('friends').create({
      'email': 'abigailotwell@gmail.com'
    });
    await friend.newRelation('friends').create({
      'email': 'foo@gmail.com'
    });
    const results: EloquentTestUser[] = await EloquentTestUser.createQuery()
      .whereHas('friends.friends', query => {
        query.where('email', 'foo@gmail.com');
      }).get();
    expect(results.length).toBe(1);
    expect(head(results).email).toBe('taylorotwell@gmail.com');
  });

  it('has on self referencing belongs to many relationship with where pivot', async () => {
    const user = await EloquentTestUser.createQuery().create({
      id     : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await user.newRelation('friends').create({
      id     : 2,
      'email': 'abigailotwell@gmail.com'
    });
    const results = await EloquentTestUser.createQuery().has('friendsOne').get();
    expect(results.length).toBe(1);
    expect(head(results).email).toBe('taylorotwell@gmail.com');
  });

  it('has on nested self referencing belongs to many relationship with where pivot', async () => {
    const user   = await EloquentTestUser.createQuery().create({
      id     : 1,
      'email': 'taylorotwell@gmail.com'
    });
    const friend = await user.newRelation('friends').create({
      id     : 2,
      'email': 'abigailotwell@gmail.com'
    });
    await friend.newRelation('friends').create({
      id     : 3,
      'email': 'foo@gmail.com'
    });
    const results = await EloquentTestUser.createQuery().has('friendsOne.friendsTwo').get();
    expect(results.length).toBe(1);
    expect(head(results).email).toBe('taylorotwell@gmail.com');
  });

  it('has on self referencing belongs to relationship', async () => {
    const parentPost = await EloquentTestPost.createQuery().create({
      'name'   : 'Parent Post',
      'user_id': 1
    });
    await EloquentTestPost.createQuery().create({
      'name'     : 'Child Post',
      'parent_id': parentPost.id,
      'user_id'  : 2
    });
    const results = await EloquentTestPost.createQuery().has('parentPost').get();
    expect(results.length).toBe(1);
    expect(head(results).name).toBe('Child Post');
  });

  it('aggregated values of datetime field', async () => {
    await EloquentTestUser.createQuery().create({
      'id'        : 1,
      'email'     : 'test1@test.test',
      'created_at': '2021-08-10 09:21:00',
      'updated_at': new Date()
    });
    await EloquentTestUser.createQuery().create({
      'id'        : 2,
      'email'     : 'test2@test.test',
      'created_at': '2021-08-01 12:00:00',
      'updated_at': new Date()
    });
    expect(await EloquentTestUser.createQuery().max('created_at')).toBe('2021-08-10 09:21:00');
    expect(await EloquentTestUser.createQuery().min('created_at')).toBe('2021-08-01 12:00:00');
  });

  it('where has on self referencing belongs to relationship', async () => {
    const parentPost = await EloquentTestPost.createQuery().create({
      'name'   : 'Parent Post',
      'user_id': 1
    });
    await EloquentTestPost.createQuery().create({
      'name'     : 'Child Post',
      'parent_id': parentPost.id,
      'user_id'  : 2
    });
    const results: EloquentTestPost[] = await EloquentTestPost.createQuery().whereHas('parentPost',
      query => {
        query.where('name', 'Parent Post');
      }).get();
    expect(results.length).toBe(1);
    expect(head(results).name).toBe('Child Post');
  });

  it('has on nested self referencing belongs to relationship', async () => {
    const grandParentPost = await EloquentTestPost.createQuery().create({
      'name'   : 'Grandparent Post',
      'user_id': 1
    });
    const parentPost      = await EloquentTestPost.createQuery().create({
      'name'     : 'Parent Post',
      'parent_id': grandParentPost.id,
      'user_id'  : 2
    });
    await EloquentTestPost.createQuery().create({
      'name'     : 'Child Post',
      'parent_id': parentPost.id,
      'user_id'  : 3
    });
    // @ts-ignore
    const results: EloquentTestPost[] = await EloquentTestPost.createQuery().has(
      'parentPost.parentPost').get();
    expect(results.length).toBe(1);
    expect(head(results).name).toBe('Child Post');
  });

  it('where has on nested self referencing belongs to relationship', async () => {
    const grandParentPost = await EloquentTestPost.createQuery().create({
      'name'   : 'Grandparent Post',
      'user_id': 1
    });
    const parentPost      = await EloquentTestPost.createQuery().create({
      'name'     : 'Parent Post',
      'parent_id': grandParentPost.id,
      'user_id'  : 2
    });
    await EloquentTestPost.createQuery().create({
      'name'     : 'Child Post',
      'parent_id': parentPost.id,
      'user_id'  : 3
    });
    // @ts-ignore
    const results: EloquentTestPost[] = await EloquentTestPost.createQuery().whereHas(
      'parentPost.parentPost', query => {
        query.where('name', 'Grandparent Post');
      }).get();
    expect(results.length).toBe(1);
    expect(head(results).name).toBe('Child Post');
  });

  it('has on self referencing has many relationship', async () => {
    const parentPost = await EloquentTestPost.createQuery().create({
      'name'   : 'Parent Post',
      'user_id': 1
    });
    await EloquentTestPost.createQuery().create({
      'name'     : 'Child Post',
      'parent_id': parentPost.id,
      'user_id'  : 2
    });
    // @ts-ignore
    const results: EloquentTestPost[] = await EloquentTestPost.createQuery().has(
      'childPosts').get();
    expect(results.length).toBe(1);
    expect(head(results).name).toBe('Parent Post');
  });

  it('where has on self referencing has many relationship', async () => {
    const parentPost = await EloquentTestPost.createQuery().create({
      'name'   : 'Parent Post',
      'user_id': 1
    });
    await EloquentTestPost.createQuery().create({
      'name'     : 'Child Post',
      'parent_id': parentPost.id,
      'user_id'  : 2
    });
    // @ts-ignore
    const results: EloquentTestPost[] = await EloquentTestPost.createQuery().whereHas('childPosts',
      query => {
        query.where('name', 'Child Post');
      }).get();
    expect(results.length).toBe(1);
    expect(head(results).name).toBe('Parent Post');
  });

  it('has on nested self referencing has many relationship', async () => {
    const grandParentPost = await EloquentTestPost.createQuery().create({
      'name'   : 'Grandparent Post',
      'user_id': 1
    });
    const parentPost      = await EloquentTestPost.createQuery().create({
      'name'     : 'Parent Post',
      'parent_id': grandParentPost.id,
      'user_id'  : 2
    });
    await EloquentTestPost.createQuery().create({
      'name'     : 'Child Post',
      'parent_id': parentPost.id,
      'user_id'  : 3
    });
    // @ts-ignore
    const results: EloquentTestPost[] = await EloquentTestPost.createQuery().has(
      'childPosts.childPosts').get();
    expect(results.length).toBe(1);
    expect(head(results).name).toBe('Grandparent Post');
  });

  it('where has on nested self referencing has many relationship', async () => {
    const grandParentPost = await EloquentTestPost.createQuery().create({
      'name'   : 'Grandparent Post',
      'user_id': 1
    });
    const parentPost      = await EloquentTestPost.createQuery().create({
      'name'     : 'Parent Post',
      'parent_id': grandParentPost.id,
      'user_id'  : 2
    });
    await EloquentTestPost.createQuery().create({
      'name'     : 'Child Post',
      'parent_id': parentPost.id,
      'user_id'  : 3
    });
    // @ts-ignore
    const results: EloquentTestPost[] = await EloquentTestPost.createQuery().whereHas(
      'childPosts.childPosts', query => {
        query.where('name', 'Child Post');
      }).get();

    expect(results.length).toBe(1);
    expect(head(results).name).toBe('Grandparent Post');
  });

  it('has with non where bindings', async () => {
    const user = await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await (
      await user.newRelation('posts').create({
        'name': 'Post 2'
      })
    ).newRelation('photos').create({
      'name': 'photo.jpg'
    });
    const query                   = await EloquentTestUser.createQuery().has('postWithPhotos');
    const {result: sql, bindings} = query.toSql();
    const bindingsCount           = bindings.length;
    const questionMarksCount      = sql.match(/\?/g)?.length || 0;
    expect(bindingsCount).toEqual(questionMarksCount);
  });

  it('has on morph to relationship', async () => {
    await expect(async () => {
      await EloquentTestUser.createQuery().has('imageable').get();
    }).rejects.toThrowError(
      `the relation [imageable] can't acquired. try to define a relation like\n@HasManyColumn()\npublic readonly imageable;\n`);
  });

  it('belongs to many relationship models are properly hydrated over chunked request', async () => {
    const user                    = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    const friend                  = await user.newRelation('friends').create({
      'email': 'abigailotwell@gmail.com'
    });
    const user1: EloquentTestUser = await EloquentTestUser.createQuery().first();
    await user1.newRelation('friends')
      .chunk(2)
      .pipe(
        tap(({results: friends}) => {
          expect(friends.length).toBe(1);
          expect(head(friends).email).toBe('abigailotwell@gmail.com');
          expect(head(friends).getRelation('pivot').getAttribute('user_id')).toBe(user.id);
          expect(head(friends).getRelation('pivot').getAttribute('friend_id')).toBe(friend.id);
        })
      ).toPromise();
  });

  it('belongs to many relationship models are properly hydrated over each request', async () => {
    const user   = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    const friend = await user.newRelation('friends').create({
      'email': 'abigailotwell@gmail.com'
    });
    await (await EloquentTestUser.createQuery().first()).newRelation('friends')
      .each()
      .pipe(
        tap(({item: result, index}) => {
          expect(result.email).toBe('abigailotwell@gmail.com');
          expect(result.getAttribute('user_id')).toBe(user.id);
          expect(result.getAttribute('friend_id')).toBe(friend.id);
        })
      ).toPromise();
  });

  xit('belongs to many relationship models are properly hydrated over cursor request', async () => {
    const user   = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    const friend = await user.newRelation('friends').create({
      'email': 'abigailotwell@gmail.com'
    });
    for (const result of await (await EloquentTestUser.createQuery().first()).newRelation(
      'friends').get()) {
      expect(result.email).toBe('abigailotwell@gmail.com');
      expect(result.getRelation('pivot').getAttribute('user_id')).toEqual(user.id);
      expect(result.getRelation('pivot').getAttribute('friend_id')).toEqual(friend.id);
    }
  });

  it('basic has many eager loading', async () => {
    // @ts-ignore
    let user: EloquentTestUser = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await user.newRelation('posts').create({
      'name': 'First Post'
    });
    user = await EloquentTestUser.createQuery()
      .with('posts')
      .where('email', 'taylorotwell@gmail.com')
      .first();
    expect(head(await user.posts).name).toBe('First Post');
    const post = await EloquentTestPost.createQuery().with('user').where('name',
      'First Post').get();
    expect(head(post).user.email).toBe('taylorotwell@gmail.com');
  });

  it('basic nested self referencing has many eager loading', async () => {
    // @ts-ignore
    let user: EloquentTestUser   = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    // @ts-ignore
    const post: EloquentTestPost = await user.newRelation('posts').create({
      'name': 'First Post'
    });
    await post.newRelation('childPosts').create({
      'name'   : 'Child Post',
      'user_id': user.id
    });
    user = await EloquentTestUser.createQuery().with('posts.childPosts').where('email',
      'taylorotwell@gmail.com').first();
    expect(head(await user.posts)).not.toBeNull();
    expect(head(await user.posts).name).toBe('First Post');
    expect(head(await head(await user.posts).childPosts)).not.toBeNull();
    expect(head(await head(await user.posts).childPosts as any[]).name).toBe('Child Post');
    // @ts-ignore
    const posts: EloquentTestPost[] = await EloquentTestPost.createQuery()
      .with('parentPost.user')
      .where('name', 'Child Post').get();
    expect((await head(posts).parentPost)).not.toBeNull();
    expect((await head(posts).parentPost).user).not.toBeNull();
    expect((await head(posts).parentPost).user.email).toBe('taylorotwell@gmail.com');
  });

  it('basic morph many relationship', async () => {
    const user = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await user.newRelation('photos').create({
      'name': 'Avatar 1'
    });
    await user.newRelation('photos').create({
      'name': 'Avatar 2'
    });
    const post = await user.newRelation('posts').create({
      'name': 'First Post'
    });
    await post.newRelation('photos').create({
      'name': 'Hero 1'
    });
    await post.newRelation('photos').create({
      'name': 'Hero 2'
    });

    const userPhotos = await user.photos;
    expect(userPhotos.length).toBe(2);

    expect(isArray(await user.photos)).toBe(true);
    expect((await user.photos)[0]).toBeInstanceOf(EloquentTestPhoto);
    expect(isArray(await post.photos)).toBe(true);
    expect((await post.photos)[0]).toBeInstanceOf(EloquentTestPhoto);
    expect((await user.photos).length).toBe(2);
    expect((await post.photos).length).toBe(2);
    expect((await user.photos)[0].name).toBe('Avatar 1');
    expect((await user.photos)[1].name).toBe('Avatar 2');
    expect((await post.photos)[0].name).toBe('Hero 1');
    expect((await post.photos)[1].name).toBe('Hero 2');
    const photos = await EloquentTestPhoto.createQuery().orderBy('name').get();
    expect(isArray(photos)).toBeTruthy();
    expect(photos.length).toBe(4);
    expect(await photos[0].imageable).toBeInstanceOf(EloquentTestUser);
    expect(await photos[2].imageable).toBeInstanceOf(EloquentTestPost);
    expect((await photos[1].imageable).email).toBe('taylorotwell@gmail.com');
    expect((await photos[3].imageable).name).toBe('First Post');
  });

  it('morph map is used for creating and fetching through relation', async () => {
    Relation.morphMap({
      'user': EloquentTestUser,
      'post': EloquentTestPost
    });
    const user = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await user.newRelation('photos').create({
      'name': 'Avatar 1'
    });
    await user.newRelation('photos').create({
      'name': 'Avatar 2'
    });
    const post = await user.newRelation('posts').create({
      'name': 'First Post'
    });
    await post.newRelation('photos').create({
      'name': 'Hero 1'
    });
    await post.newRelation('photos').create({
      'name': 'Hero 2'
    });
    expect(isArray(await user.photos)).toBeTruthy();
    expect((await user.photos)[0]).toBeInstanceOf(EloquentTestPhoto);
    expect(isArray(await post.photos)).toBeTruthy();
    expect((await post.photos)[0]).toBeInstanceOf(EloquentTestPhoto);
    expect((await user.photos).length).toBe(2);
    expect((await post.photos).length).toBe(2);
    expect((await user.photos)[0].name).toBe('Avatar 1');
    expect((await user.photos)[1].name).toBe('Avatar 2');
    expect((await post.photos)[0].name).toBe('Hero 1');
    expect((await post.photos)[1].name).toBe('Hero 2');
    expect((await user.photos)[0].getAttribute('imageable_type')).toBe('user');
    expect((await user.photos)[1].getAttribute('imageable_type')).toBe('user');
    expect((await post.photos)[0].getAttribute('imageable_type')).toBe('post');
    expect((await post.photos)[1].getAttribute('imageable_type')).toBe('post');
  });

  it('morph map is used when fetching parent', async () => {
    Relation.morphMap({
      'user': EloquentTestUser,
      'post': EloquentTestPost
    });
    const user = await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await user.newRelation('photos').create({
      'name': 'Avatar 1'
    });
    const photo = await EloquentTestPhoto.createQuery().first();
    expect(photo.getAttribute('imageable_type')).toBe('user');
    expect(await photo.imageable).toBeInstanceOf(EloquentTestUser);
  });

  it('morph map is merged by default', () => {
    const map1 = {
      'user': EloquentTestUser
    };
    const map2 = {
      'post': EloquentTestPost
    };
    Relation.morphMap(map1);
    Relation.morphMap(map2);
    expect(Relation.morphMap()).toEqual({...map1, ...map2});
  });

  it('morph map overwrites current map', () => {
    const map1 = {
      'user': EloquentTestUser
    };
    const map2 = {
      'post': EloquentTestPost
    };
    Relation.morphMap(map1, false);
    expect(Relation.morphMap()).toEqual(map1);
    Relation.morphMap(map2, false);
    expect(Relation.morphMap()).toEqual(map2);
  });

  it('empty morph to relationship', async () => {
    const photo = new EloquentTestPhoto();
    expect(await photo.imageable).toBeNull();
  });

  it('save or fail', async () => {
    const date = '1970-01-01';
    const post = EloquentTestPost.initAttributes({
      'user_id'   : 1,
      'name'      : 'Post',
      'created_at': date,
      'updated_at': date
    });
    expect(await post.saveOrFail()).toBeTruthy();
    expect(await EloquentTestPost.createQuery().count()).toEqual(1);
  });

  it('saving json fields', async () => {
    const model = await EloquentTestWithJSON.createQuery().create({
      'json': {
        'x': 0
      }
    });
    expect(model.json).toEqual({
      'x': 0
    });
    model.fillable(['json->y', 'json->a->b']);
    await model.update({
      'json->y': '1'
    });
    expect('json->y' in model.toArray()).toBeFalsy();
    expect(model.json).toEqual({
      'x': 0,
      'y': '1'
    });
    await model.update({
      'json->a->b': '3'
    });
    expect('json->a->b' in model.toArray()).toBeFalsy();
    expect(model.json).toEqual({
      'x': 0,
      'y': '1',
      'a': {
        'b': '3'
      }
    });
  });

  it('save or fail with duplicated entry', async () => {
    const date = '1970-01-01';
    EloquentTestPost.initAttributes({
      'id'        : 1,
      'user_id'   : 1,
      'name'      : 'Post',
      'created_at': date,
      'updated_at': date
    });
    const post = EloquentTestPost.initAttributes({
      'id'        : 1,
      'user_id'   : 1,
      'name'      : 'Post',
      'created_at': date,
      'updated_at': date
    });

    await expect(async () => {
      await post.saveOrFail();
    }).rejects.toThrowError('SQLSTATE[23000]:');
  });

  it('multi inserts with different values', async () => {
    const date   = '1970-01-01';
    const result = await EloquentTestPost.createQuery().insert([
      {
        'user_id'   : 1,
        'name'      : 'Post',
        'created_at': date,
        'updated_at': date
      }, {
        'user_id'   : 2,
        'name'      : 'Post',
        'created_at': date,
        'updated_at': date
      }
    ]);
    expect(result).toBeTruthy();
    expect(await EloquentTestPost.createQuery().count()).toEqual(2);
  });

  it('multi inserts with same values', async () => {
    const date   = '1970-01-01';
    const result = await EloquentTestPost.createQuery().insert([
      {
        'user_id'   : 1,
        'name'      : 'Post',
        'created_at': date,
        'updated_at': date
      }, {
        'user_id'   : 1,
        'name'      : 'Post',
        'created_at': date,
        'updated_at': date
      }
    ]);
    expect(result).toBeTruthy();
    expect(await EloquentTestPost.createQuery().count()).toEqual(2);
  });

//   it('nested transactions', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylor@laravel.com'
//     });
//     this.connection().transaction(() => {
//       try {
//         this.connection().transaction(() => {
//           user.email = 'otwell@laravel.com';
//           user.save();
//           throw new Exception();
//         });
//       } catch (e: Exception) {
//       }
//       let user = EloquentTestUser.first();
//       this.assertSame('taylor@laravel.com', user.email);
//     });
//   });

//   it('nested transactions using save or fail will succeed', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylor@laravel.com'
//     });
//     this.connection().transaction(() => {
//       try {
//         user.email = 'otwell@laravel.com';
//         user.saveOrFail();
//       } catch (e: Exception) {
//       }
//       let user = EloquentTestUser.first();
//       this.assertSame('otwell@laravel.com', user.email);
//       this.assertEquals(1, user.id);
//     });
//   });
//   it('nested transactions using save or fail will fails', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylor@laravel.com'
//     });
//     this.connection().transaction(() => {
//       try {
//         user.id    = 'invalid';
//         user.email = 'otwell@laravel.com';
//         user.saveOrFail();
//       } catch (e: Exception) {
//       }
//       let user = EloquentTestUser.first();
//       this.assertSame('taylor@laravel.com', user.email);
//       this.assertEquals(1, user.id);
//     });
//   });

  it('to array includes default formatted timestamps', () => {
    const model = new EloquentTestUser();
    model.setRawAttributes({
      'created_at': '2012-12-04',
      'updated_at': '2012-12-05'
    });
    const array = model.toArray();
    expect(array['created_at']).toBe('2012-12-04T00:00:00.000000Z');
    expect(array['updated_at']).toBe('2012-12-05T00:00:00.000000Z');
  });

  it('to array includes custom formatted timestamps', () => {
    const model = new EloquentTestUserWithCustomDateSerialization();
    model.setRawAttributes({
      'created_at': '2012-12-04',
      'updated_at': '2012-12-05'
    });
    const array = model.toArray();
    expect(array['created_at']).toBe('04-12-12');
    expect(array['updated_at']).toBe('05-12-12');
  });

  it('incrementing primary keys are cast to integers by default', async () => {
    await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    const user = await EloquentTestUser.createQuery().first();
    expect(isNumber(user.id)).toBeTruthy();
  });

  // it('default incrementing primary key integer cast can be overwritten', async () => {
  //   await EloquentTestUserWithStringCastId.createQuery().create({
  //     'email': 'taylorotwell@gmail.com'
  //   });
  //   const user = await EloquentTestUserWithStringCastId.createQuery().first();
  //   expect(isString(user.id)).toBeTruthy();
  // });

  it('relations are preloaded in global scope', async () => {
    const user = await EloquentTestUserWithGlobalScope.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await user.newRelation('posts').create({
      'name': 'My Post'
    });
    const result: EloquentTestUserWithGlobalScope = await EloquentTestUserWithGlobalScope.createQuery().first();
    expect(Object.keys(result.getRelations())).toHaveLength(1);
  });

//   it('model ignored by global scope can be refreshed', () => {
//     let user = EloquentTestUserWithOmittingGlobalScope.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     expect(user.fresh()).toNotNull();
//   });

//   it('global scope can be removed by other global scope', () => {
//     let user = EloquentTestUserWithGlobalScopeRemovingOtherScope.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.delete();
//     expect(EloquentTestUserWithGlobalScopeRemovingOtherScope.find(user.id)).toNotNull();
//   });

  it('for page before id correctly paginates', async () => {
    await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'id'   : 2,
      'email': 'abigailotwell@gmail.com'
    });
    let results = await EloquentTestUser.createQuery().forPageBeforeId(15, 2);
    expect(results).toBeInstanceOf(FedacoBuilder);
    expect((await results.first()).id).toEqual(1);
    results = await EloquentTestUser.createQuery().orderBy('id', 'desc').forPageBeforeId(15, 2);
    expect(results).toBeInstanceOf(FedacoBuilder);
    expect((await results.first()).id).toEqual(1);
  });

  it('for page after id correctly paginates', async () => {
    await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'id'   : 2,
      'email': 'abigailotwell@gmail.com'
    });
    let results = await EloquentTestUser.createQuery().forPageAfterId(15, 1);
    expect(results).toBeInstanceOf(FedacoBuilder);
    expect((await results.first()).id).toEqual(2);
    results = EloquentTestUser.createQuery().orderBy('id', 'desc').forPageAfterId(15, 1);
    expect(results).toBeInstanceOf(FedacoBuilder);
    expect((await results.first()).id).toEqual(2);
  });

  it('morph to relations across database connections', async () => {
    let item = null;
    await EloquentTestItem.createQuery().create({
      'id': 1
    });
    await EloquentTestOrder.createQuery().create({
      'id'       : 1,
      'item_type': 'EloquentTestItem',
      'item_id'  : 1
    });
    try {
      const order = await EloquentTestOrder.createQuery().first();
      item        = order.item;
    } catch (e) {
      console.log(e);
    }
    expect(item).toBeInstanceOf(EloquentTestItem);
  });

  it('eager loaded morph to relations on another database connection', async () => {
    await EloquentTestPost.createQuery().create({
      'id'     : 1,
      'name'   : 'Default Connection Post',
      'user_id': 1
    });
    await EloquentTestPhoto.createQuery().create({
      'id'            : 1,
      'imageable_type': 'post',
      'imageable_id'  : 1,
      'name'          : 'Photo'
    });
    await EloquentTestPost.useConnection('second_connection').create({
      'id'     : 1,
      'name'   : 'Second Connection Post',
      'user_id': 1
    });
    await EloquentTestPhoto.useConnection('second_connection').create({
      'id'            : 1,
      'imageable_type': 'post',
      'imageable_id'  : 1,
      'name'          : 'Photo'
    });
    const defaultConnectionPost = (
      await EloquentTestPhoto.createQuery().with('imageable').first()
    ).imageable;
    const secondConnectionPost  = (
      await EloquentTestPhoto.useConnection('second_connection').with('imageable').first()
    ).imageable;
    expect('Default Connection Post').toEqual(defaultConnectionPost.name);
    expect('Second Connection Post').toEqual(secondConnectionPost.name);
  });

  it('belongs to many custom pivot', async () => {
    const john = await EloquentTestUserWithCustomFriendPivot.createQuery().create({
      'id'   : 1,
      'name' : 'John Doe',
      'email': 'johndoe@example.com'
    });
    const jane = await EloquentTestUserWithCustomFriendPivot.createQuery().create({
      'id'   : 2,
      'name' : 'Jane Doe',
      'email': 'janedoe@example.com'
    });
    const jack = await EloquentTestUserWithCustomFriendPivot.createQuery().create({
      'id'   : 3,
      'name' : 'Jack Doe',
      'email': 'jackdoe@example.com'
    });
    const jule = await EloquentTestUserWithCustomFriendPivot.createQuery().create({
      'id'   : 4,
      'name' : 'Jule Doe',
      'email': 'juledoe@example.com'
    });
    await EloquentTestFriendLevel.createQuery().create({
      'id'   : 1,
      'level': 'acquaintance'
    });
    await EloquentTestFriendLevel.createQuery().create({
      'id'   : 2,
      'level': 'friend'
    });
    await EloquentTestFriendLevel.createQuery().create({
      'id'   : 3,
      'level': 'bff'
    });
    await john.newRelation('friends').attach(jane, {
      'friend_level_id': 1
    });
    await john.newRelation('friends').attach(jack, {
      'friend_level_id': 2
    });
    await john.newRelation('friends').attach(jule, {
      'friend_level_id': 3
    });

    const johnWithFriends = await EloquentTestUserWithCustomFriendPivot.createQuery()
      .with('friends').find(1);
    expect(johnWithFriends.friends.length).toBe(3);
    expect(await (await johnWithFriends.friends.find(it => it.id === 3).getAttribute(
      'pivot').level).level).toBe('friend');
    expect((await johnWithFriends.friends.find(it => it.id === 4).getAttribute(
      'pivot').friend).name).toBe('Jule Doe');
  });

  it('is after retrieving the same model', async () => {
    const saved     = await EloquentTestUser.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    const retrieved = await EloquentTestUser.createQuery().find(1);
    expect(saved.is(retrieved)).toBeTruthy();
  });

  it('fresh method on model', async () => {
    const now                        = new Date();
    const nowSerialized              = formatISO(startOfSecond(now));
    const nowWithFractionsSerialized = now.toJSON();
    // Carbon.setTestNow(now);
    const storedUser1                = await EloquentTestUser.createQuery().create({
      'id'      : 1,
      'email'   : 'taylorotwell@gmail.com',
      'birthday': now
    });
    await storedUser1.newQuery().update({
      'email': 'dev@mathieutu.ovh',
      'name' : 'Mathieu TUDISCO'
    });
    const freshStoredUser1 = await storedUser1.fresh();
    const storedUser2      = await EloquentTestUser.createQuery().create({
      'id'      : 2,
      'email'   : 'taylorotwell@gmail.com',
      'birthday': now
    });
    await storedUser2.newQuery().update({
      'email': 'dev@mathieutu.ovh'
    });
    const freshStoredUser2   = await storedUser2.fresh();
    const notStoredUser      = EloquentTestUser.initAttributes({
      'id'      : 3,
      'email'   : 'taylorotwell@gmail.com',
      'birthday': now
    });
    const freshNotStoredUser = await notStoredUser.fresh();
    expect(storedUser1.toArray()).toEqual({
      'id'        : 1,
      'email'     : 'taylorotwell@gmail.com',
      'birthday'  : nowWithFractionsSerialized,
      'created_at': nowSerialized,
      'updated_at': nowSerialized
    });
    expect(freshStoredUser1.toArray()).toEqual({
      'id'        : 1,
      'name'      : 'Mathieu TUDISCO',
      'email'     : 'dev@mathieutu.ovh',
      'birthday'  : nowWithFractionsSerialized,
      'created_at': nowSerialized,
      'updated_at': nowSerialized
    });
    expect(storedUser1).toBeInstanceOf(EloquentTestUser);
    expect(storedUser2.toArray()).toEqual({
      'id'        : 2,
      'email'     : 'taylorotwell@gmail.com',
      'birthday'  : nowWithFractionsSerialized,
      'created_at': nowSerialized,
      'updated_at': nowSerialized
    });
    expect(freshStoredUser2.toArray()).toEqual({
      'id'        : 2,
      'name'      : null,
      'email'     : 'dev@mathieutu.ovh',
      'birthday'  : nowWithFractionsSerialized,
      'created_at': nowSerialized,
      'updated_at': nowSerialized
    });
    expect(storedUser2).toBeInstanceOf(EloquentTestUser);
    expect(notStoredUser.toArray()).toEqual({
      'id'      : 3,
      'email'   : 'taylorotwell@gmail.com',
      'birthday': nowWithFractionsSerialized
    });
    expect(freshNotStoredUser).toBeNull();
  });
//   it('fresh method on collection', () => {
//     EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 2,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let users = EloquentTestUser.all().add(new EloquentTestUser({
//       'id'   : 3,
//       'email': 'taylorotwell@gmail.com'
//     }));
//     EloquentTestUser.find(1).update({
//       'name': 'Mathieu TUDISCO'
//     });
//     EloquentTestUser.find(2).update({
//       'email': 'dev@mathieutu.ovh'
//     });
//     expect(users.fresh()).toEqual(users.map.fresh());
//     let users = new Collection();
//     expect(users.fresh()).toEqual(users.map.fresh());
//   });

  it('timestamps using default date format', () => {
    const model = new EloquentTestUser();
    model.setDateFormat('yyyy-MM-dd HH:mm:ss');
    model.setRawAttributes({
      'created_at': '2017-11-14 08:23:19'
    });
    expect(model.fromDateTime(model.getAttribute('created_at'))).toBe('2017-11-14 08:23:19');
  });

  it('timestamps using default sql server date format', () => {
    const model = new EloquentTestUser();
    model.setDateFormat('yyyy-MM-dd HH:mm:ss.SSS');
    model.setRawAttributes({
      'created_at': '2017-11-14 08:23:19.000',
      'updated_at': '2017-11-14 08:23:19.734'
    });
    expect(model.fromDateTime(model.getAttribute('created_at'))).toBe('2017-11-14 08:23:19.000');
    expect(model.fromDateTime(model.getAttribute('updated_at'))).toBe('2017-11-14 08:23:19.734');
  });

  it('timestamps using custom date format', () => {
    const model = new EloquentTestUser();
    model.setDateFormat('yyyy-MM-dd HH:mm:ss.SSSS');
    model.setRawAttributes({
      'created_at': '2017-11-14 08:23:19.0000',
      'updated_at': '2017-11-14 08:23:19.7348'
    });
    expect(model.fromDateTime(model.getAttribute('created_at'))).toBe('2017-11-14 08:23:19.000000');
    expect(model.fromDateTime(model.getAttribute('updated_at'))).toBe('2017-11-14 08:23:19.734800');
  });
  it('timestamps using old sql server date format', () => {
    const model = new EloquentTestUser();
    model.setDateFormat('yyyy-MM-dd HH:mm:ss.000');
    model.setRawAttributes({
      'created_at': '2017-11-14 08:23:19.000'
    });
    expect(model.fromDateTime(model.getAttribute('created_at'))).toBe('2017-11-14 08:23:19.000');
  });
  // it('timestamps using old sql server date format fallback to default parsing', () => {
  //   let model = new EloquentTestUser();
  //   model.setDateFormat('Y-m-d H:i:s.000');
  //   model.setRawAttributes({
  //     'updated_at': '2017-11-14 08:23:19.734'
  //   });
  //   let date = model.getAttribute('updated_at');
  //   expect('the date should contains the precision').toBe('2017-11-14 08:23:19.734',
  //     date.format('Y-m-d H:i:s.v'));
  //   expect('the format should trims it').toBe('2017-11-14 08:23:19.000', model.fromDateTime(date));
  //   expect(Date.hasFormat('2017-11-14 08:23:19.000', model.getDateFormat())).toBeTruthy();
  //   expect(Date.hasFormat('2017-11-14 08:23:19.734', model.getDateFormat())).toFalse();
  // });
//   it('updating child model touches parent', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     post.update({
//       'name': 'Updated'
//     });
//     expect('It is not touching model own timestamps.').toBeTruthy(
//       future.isSameDay(post.fresh().updated_at));
//     expect('It is not touching models related timestamps.').toBeTruthy(
//       future.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });
//   it('multi level touching works', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'id'     : 1,
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     EloquentTouchingComment.initAttributes({
//       'content': 'Comment content',
//       'post_id': 1
//     });
//     expect('It is not touching models related timestamps.').toBeTruthy(
//       future.isSameDay(post.fresh().updated_at));
//     expect('It is not touching models related timestamps.').toBeTruthy(
//       future.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });
//   it('deleting child model touches parent timestamps', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     post.delete();
//     expect('It is not touching models related timestamps.').toBeTruthy(
//       future.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });
//   it('touching child model updates parents timestamps', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'id'     : 1,
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     post.touch();
//     expect('It is not touching model own timestamps.').toBeTruthy(
//       future.isSameDay(post.fresh().updated_at));
//     expect('It is not touching models related timestamps.').toBeTruthy(
//       future.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });
//   it('touching child model respects parent no touching', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'id'     : 1,
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     EloquentTouchingUser.withoutTouching(() => {
//       post.touch();
//     });
//     expect('It is not touching model own timestamps in withoutTouching scope.').toBeTruthy(
//       future.isSameDay(post.fresh().updated_at));
//     expect(
//       'It is touching model own timestamps in withoutTouching scope, when it should not.').toBeTruthy(
//       before.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });
//   it('updating child post respects no touching definition', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     EloquentTouchingUser.withoutTouching(() => {
//       post.update({
//         'name': 'Updated'
//       });
//     });
//     expect('It is not touching model own timestamps when it should.').toBeTruthy(
//       future.isSameDay(post.fresh().updated_at));
//     expect('It is touching models relationships when it should be disabled.').toBeTruthy(
//       before.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });
//   it('updating model in the disabled scope touches its own timestamps', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     Model.withoutTouching(() => {
//       post.update({
//         'name': 'Updated'
//       });
//     });
//     expect('It is touching models when it should be disabled.').toBeTruthy(
//       future.isSameDay(post.fresh().updated_at));
//     expect('It is touching models when it should be disabled.').toBeTruthy(
//       before.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });
//   it('deleting child model respects the no touching rule', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     EloquentTouchingUser.withoutTouching(() => {
//       post.delete();
//     });
//     expect('It is touching models when it should be disabled.').toBeTruthy(
//       before.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });
//   it('respected multi level touching chain', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'id'     : 1,
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     EloquentTouchingUser.withoutTouching(() => {
//       EloquentTouchingComment.initAttributes({
//         'content': 'Comment content',
//         'post_id': 1
//       });
//     });
//     expect('It is touching models when it should be disabled.').toBeTruthy(
//       future.isSameDay(post.fresh().updated_at));
//     expect('It is touching models when it should be disabled.').toBeTruthy(
//       before.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });
//   it('touches great parent even when parent is in no touch scope', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'id'     : 1,
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     EloquentTouchingPost.withoutTouching(() => {
//       EloquentTouchingComment.initAttributes({
//         'content': 'Comment content',
//         'post_id': 1
//       });
//     });
//     expect('It is touching models when it should be disabled.').toBeTruthy(
//       before.isSameDay(post.fresh().updated_at));
//     expect('It is touching models when it should be disabled.').toBeTruthy(
//       future.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });
//   it('can nest calls of no touching', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'id'     : 1,
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     EloquentTouchingUser.withoutTouching(() => {
//       EloquentTouchingPost.withoutTouching(() => {
//         EloquentTouchingComment.initAttributes({
//           'content': 'Comment content',
//           'post_id': 1
//         });
//       });
//     });
//     expect('It is touching models when it should be disabled.').toBeTruthy(
//       before.isSameDay(post.fresh().updated_at));
//     expect('It is touching models when it should be disabled.').toBeTruthy(
//       before.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });
//   it('can pass array of models to ignore', () => {
//     let before = Carbon.now();
//     let user   = EloquentTouchingUser.initAttributes({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post   = EloquentTouchingPost.initAttributes({
//       'id'     : 1,
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     expect(before.isSameDay(user.updated_at)).toBeTruthy();
//     expect(before.isSameDay(post.updated_at)).toBeTruthy();
//     Carbon.setTestNow(future = before.copy().addDays(3));
//     Model.withoutTouchingOn([EloquentTouchingUser, EloquentTouchingPost], () => {
//       EloquentTouchingComment.initAttributes({
//         'content': 'Comment content',
//         'post_id': 1
//       });
//     });
//     expect('It is touching models when it should be disabled.').toBeTruthy(
//       before.isSameDay(post.fresh().updated_at));
//     expect('It is touching models when it should be disabled.').toBeTruthy(
//       before.isSameDay(user.fresh().updated_at));
//     Carbon.setTestNow(before);
//   });

  it('when base model is ignored all child models are ignored', () => {
    expect(Model.isIgnoringTouch()).toBeFalsy();
    expect(User.isIgnoringTouch()).toBeFalsy();
    Model.withoutTouching(() => {
      expect(Model.isIgnoringTouch()).toBeTruthy();
      expect(User.isIgnoringTouch()).toBeTruthy();
    });
    expect(User.isIgnoringTouch()).toBeFalsy();
    expect(Model.isIgnoringTouch()).toBeFalsy();
  });

  it('child models are ignored', () => {
    expect(Model.isIgnoringTouch()).toBeFalsy();
    expect(User.isIgnoringTouch()).toBeFalsy();
    expect(Post.isIgnoringTouch()).toBeFalsy();
    User.withoutTouching(() => {
      expect(Model.isIgnoringTouch()).toBeFalsy();
      expect(Post.isIgnoringTouch()).toBeFalsy();
      expect(User.isIgnoringTouch()).toBeTruthy();
    });
    expect(Model.isIgnoringTouch()).toBeFalsy();
    expect(Post.isIgnoringTouch()).toBeFalsy();
    expect(User.isIgnoringTouch()).toBeFalsy();
  });
});

/*Eloquent Models...*/
@Table({
  morphTypeName: 'user'
})
export class EloquentTestUser extends Model {
  _table: any   = 'users';
  _dates: any   = ['birthday'];
  _guarded: any = [];

  @PrimaryColumn()
  id;

  @Column()
  name;

  @Column()
  email;

  @CreatedAtColumn()
  created_at;

  @UpdatedAtColumn()
  updated_at;

  @BelongsToManyColumn({
    related        : EloquentTestUser,
    table          : 'friends',
    foreignPivotKey: 'user_id',
    relatedPivotKey: 'friend_id'
  })
  friends;

  @BelongsToManyColumn({
    related        : EloquentTestUser,
    table          : 'friends',
    foreignPivotKey: 'user_id',
    relatedPivotKey: 'friend_id',
    // @ts-ignore
    onQuery: (q: BelongsToMany) => {
      q.wherePivot('user_id', 1);
    }
  })
  friendsOne;

  @BelongsToManyColumn({
    related        : EloquentTestUser,
    table          : 'friends',
    foreignPivotKey: 'user_id',
    relatedPivotKey: 'friend_id',
    // @ts-ignore
    onQuery: (q: BelongsToMany) => {
      q.wherePivot('user_id', 2);
    }
  })
  friendsTwo;

  @HasManyColumn({
    related   : forwardRef(() => EloquentTestPost),
    foreignKey: 'user_id',
  })
  public posts: Promise<any[]>;

  @HasOneColumn({
    related   : forwardRef(() => EloquentTestPost),
    foreignKey: 'user_id',
  })
  public post;

  @MorphManyColumn({
    related  : forwardRef(() => EloquentTestPhoto),
    morphName: 'imageable',
  })
  public photos;

  @HasOneColumn({
    related   : forwardRef(() => EloquentTestPost),
    foreignKey: 'user_id',
    onQuery   : (q => {
      q.join('photo', join => {
        join.on('photo.imageable_id', 'post.id');
        join.where('photo.imageable_type', 'EloquentTestPost');
      });
    })
  })
  public postWithPhotos;
}

export class EloquentTestUserWithCustomFriendPivot extends EloquentTestUser {
  @BelongsToManyColumn({
    related        : EloquentTestUser,
    table          : 'friends',
    foreignPivotKey: 'user_id',
    relatedPivotKey: 'friend_id',
    onQuery        : (q: BelongsToMany) => {
      q.using(EloquentTestFriendPivot).withPivot('user_id', 'friend_id', 'friend_level_id');
    }
  })
  friends;
}

export class EloquentTestUserWithSpaceInColumnName extends EloquentTestUser {
  _table: any = 'users_with_space_in_colum_name';

}

export class EloquentTestNonIncrementing extends Model {
  _table: any               = 'non_incrementing_users';
  _guarded: any             = [];
  public _incrementing: any = false;
  public _timestamps: any   = false;
}

export class EloquentTestNonIncrementingSecond extends EloquentTestNonIncrementing {
  _connection: any = 'second_connection';

  @Column()
  name;
}

export class EloquentTestUserWithGlobalScope extends EloquentTestUser {
  // public static boot() {
  //   super.boot();
  //   EloquentTestUserWithGlobalScope.addGlobalScope(builder => {
  //     builder.with('posts');
  //   });
  // }
}

// export class EloquentTestUserWithOmittingGlobalScope extends EloquentTestUser {
//   public static boot() {
//     super.boot();
//     EloquentTestUserWithOmittingGlobalScope.addGlobalScope(builder => {
//       builder.where("email", "!=", "taylorotwell@gmail.com");
//     });
//   }
// }
// export class EloquentTestUserWithGlobalScopeRemovingOtherScope extends Eloquent {
//   protected table: any = "soft_deleted_users";
//   protected guarded: any = [];
//   public static boot() {
//     EloquentTestUserWithGlobalScopeRemovingOtherScope.addGlobalScope(builder => {
//       builder.withoutGlobalScope(SoftDeletingScope);
//     });
//     super.boot();
//   }
// }
@Table({
  morphTypeName: 'post',
})
export class EloquentTestPost extends Model {
  _table: any   = 'posts';
  _guarded: any = [];

  @PrimaryColumn()
  id;

  @Column()
  name;

  // @Column()
  // user_id; no need to define this since BelongsToColumn dynamic add foreign user_id

  @BelongsToColumn({
    related   : EloquentTestUser,
    foreignKey: 'user_id'
  })
  public user;

  @MorphManyColumn({
    related  : forwardRef(() => EloquentTestPhoto),
    morphName: 'imageable',
  })
  photos;

  // public photos() {
  //   return this.morphMany(EloquentTestPhoto, 'imageable');
  // }

  // @Column()
  // parent_id; no need to define this since BelongsToColumn dynamic add foreign user_id


  @HasManyColumn({
    related   : forwardRef(() => EloquentTestPost),
    foreignKey: 'parent_id',
  })
  childPosts: Promise<any[]>;

  // public childPosts() {
  //   return this.hasMany(EloquentTestPost, 'parent_id');
  // }
  //

  @BelongsToColumn({
    related   : forwardRef(() => EloquentTestPost),
    foreignKey: 'parent_id',
  })
  parentPost;

  // public parentPost() {
  //   return this.belongsTo(EloquentTestPost, 'parent_id');
  // }
}

export class EloquentTestFriendLevel extends Model {
  _table: any   = 'friend_levels';
  _guarded: any = [];

  @Column()
  level;
}

@Table({})
export class EloquentTestPhoto extends Model {
  _table: any   = 'photos';
  _guarded: any = [];

  @Column()
  name;

  @MorphToColumn({
    morphTypeMap: {
      'EloquentTestUser': EloquentTestUser,
      'EloquentTestPost': EloquentTestPost,
      'user'            : EloquentTestUser,
      'post'            : EloquentTestPost,
    }
  })
  public imageable;
}

export class EloquentTestUserWithStringCastId extends EloquentTestUser {
  // protected casts: any = {
  //   "id": "string"
  // };

  @Column()
  id: string;

}

export class EloquentTestUserWithCustomDateSerialization extends EloquentTestUser {
  serializeDate(date) {
    return format(date, 'yyyy-MM-dd');
  }
}

export class EloquentTestOrder extends Model {
  _table: any   = 'test_orders';
  _guarded: any = [];
  _with: any[]  = ['item'];

  @PrimaryColumn()
  id;

  @MorphToColumn({
    morphTypeMap: {
      EloquentTestItem: forwardRef(() => EloquentTestItem)
    }
  })
  public item;
}

export class EloquentTestItem extends Model {
  _table: any      = 'test_items';
  _guarded: any    = [];
  _connection: any = 'second_connection';


}

export class EloquentTestWithJSON extends Model {
  _table: any   = 'with_json';
  _guarded: any = [];

  public _timestamps: any = false;
  // protected casts: any   = {
  //   'json': 'array'
  // };

  @ArrayColumn()
  json;
}

export class EloquentTestFriendPivot extends Pivot {
  _table: any   = 'friends';
  _guarded: any = [];

  @BelongsToColumn({
    related: EloquentTestUser
  })
  public user;

  @BelongsToColumn({
    related: EloquentTestUser
  })
  public friend;

  @BelongsToColumn({
    related   : EloquentTestFriendLevel,
    foreignKey: 'friend_level_id'
  })
  public level;
}

// export class EloquentTouchingUser extends Eloquent {
//   protected table: any = "users";
//   protected guarded: any = [];
// }
// export class EloquentTouchingPost extends Eloquent {
//   protected table: any = "posts";
//   protected guarded: any = [];
//   protected touches: any = ["user"];
//   public user() {
//     return this.belongsTo(EloquentTouchingUser, "user_id");
//   }
// }
// export class EloquentTouchingComment extends Eloquent {
//   protected table: any = "comments";
//   protected guarded: any = [];
//   protected touches: any = ["post"];
//   public post() {
//     return this.belongsTo(EloquentTouchingPost, "post_id");
//   }
// }
