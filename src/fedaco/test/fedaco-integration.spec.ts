import { isArray } from '@gradii/check-type';
import { Column } from '../src/annotation/column/column';
import { PrimaryColumn } from '../src/annotation/column/primary.column';
import { BelongsToManyColumn } from '../src/annotation/relation-column/belongs-to-many.relation-column';
import { DatabaseConfig } from '../src/databaseConfig';
import { Model } from '../src/fedaco/model';
import { SchemaBuilder } from '../src/schema/schema-builder';

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
    table.string('email address');
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
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': 'tmp/integration.sqlite'
    });
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    }, 'second_connection');
    db.bootEloquent();
    db.setAsGlobal();
    await createSchema();
  });

  afterAll(async () => {
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
      'test_orders',
      'users',
      'users_with_space_in_colum_name',
      'with_json',
    ]) {
      await schema('default').drop(it);
    }

    // [].forEach((connection, index) => {
    // });
    // Relation.morphMap([], false);
    // Fedaco.unsetConnectionResolver();
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
    expect(model.friends !== undefined).toBeTruthy();
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

//   it('basic model collection retrieval', () => {
//     EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 2,
//       'email': 'abigailotwell@gmail.com'
//     });
//     let models = EloquentTestUser.oldest('id').get();
//     expect(models).toCount(2);
//     expect(models).toInstanceOf(Collection);
//     expect(models[0]).toInstanceOf(EloquentTestUser);
//     expect(models[1]).toInstanceOf(EloquentTestUser);
//     expect(models[0].email).toBe('taylorotwell@gmail.com');
//     expect(models[1].email).toBe('abigailotwell@gmail.com');
//   });
//   it('paginated model collection retrieval', () => {
//     EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 2,
//       'email': 'abigailotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 3,
//       'email': 'foo@gmail.com'
//     });
//     Paginator.currentPageResolver(() => {
//       return 1;
//     });
//     let models = EloquentTestUser.oldest('id').paginate(2);
//     expect(models).toCount(2);
//     expect(models).toInstanceOf(LengthAwarePaginator);
//     expect(models[0]).toInstanceOf(EloquentTestUser);
//     expect(models[1]).toInstanceOf(EloquentTestUser);
//     expect(models[0].email).toBe('taylorotwell@gmail.com');
//     expect(models[1].email).toBe('abigailotwell@gmail.com');
//     Paginator.currentPageResolver(() => {
//       return 2;
//     });
//     let models = EloquentTestUser.oldest('id').paginate(2);
//     expect(models).toCount(1);
//     expect(models).toInstanceOf(LengthAwarePaginator);
//     expect(models[0]).toInstanceOf(EloquentTestUser);
//     expect(models[0].email).toBe('foo@gmail.com');
//   });
//   it('paginated model collection retrieval when no elements', () => {
//     Paginator.currentPageResolver(() => {
//       return 1;
//     });
//     let models = EloquentTestUser.oldest('id').paginate(2);
//     expect(models).toCount(0);
//     expect(models).toInstanceOf(LengthAwarePaginator);
//     Paginator.currentPageResolver(() => {
//       return 2;
//     });
//     let models = EloquentTestUser.oldest('id').paginate(2);
//     expect(models).toCount(0);
//   });
//   it('paginated model collection retrieval when no elements and default per page', () => {
//     let models = EloquentTestUser.oldest('id').paginate();
//     expect(models).toCount(0);
//     expect(models).toInstanceOf(LengthAwarePaginator);
//   });
//   it('count for pagination with grouping', () => {
//     EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 2,
//       'email': 'abigailotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 3,
//       'email': 'foo@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 4,
//       'email': 'foo@gmail.com'
//     });
//     let query = EloquentTestUser.groupBy('email').getQuery();
//     expect(query.getCountForPagination()).toEqual(3);
//   });
//   it('count for pagination with grouping and sub selects', () => {
//     let user1 = EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 2,
//       'email': 'abigailotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 3,
//       'email': 'foo@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 4,
//       'email': 'foo@gmail.com'
//     });
//     user1.friends().create({
//       'id'   : 5,
//       'email': 'friend@gmail.com'
//     });
//     let query = EloquentTestUser.select({
//       0              : 'id',
//       'friends_count': EloquentTestUser.whereColumn('friend_id', 'user_id').count()
//     }).groupBy('email').getQuery();
//     expect(query.getCountForPagination()).toEqual(4);
//   });
//   it('first or create', () => {
//     let user1 = EloquentTestUser.firstOrCreate({
//       'email': 'taylorotwell@gmail.com'
//     });
//     expect(user1.email).toBe('taylorotwell@gmail.com');
//     expect(user1.name).toNull();
//     let user2 = EloquentTestUser.firstOrCreate({
//       'email': 'taylorotwell@gmail.com'
//     }, {
//       'name': 'Taylor Otwell'
//     });
//     expect(user2.id).toEqual(user1.id);
//     expect(user2.email).toBe('taylorotwell@gmail.com');
//     expect(user2.name).toNull();
//     let user3 = EloquentTestUser.firstOrCreate({
//       'email': 'abigailotwell@gmail.com'
//     }, {
//       'name': 'Abigail Otwell'
//     });
//     expect(user1.id).toNotEquals(user3.id);
//     expect(user3.email).toBe('abigailotwell@gmail.com');
//     expect(user3.name).toBe('Abigail Otwell');
//   });
//   it('update or create', () => {
//     let user1 = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let user2 = EloquentTestUser.updateOrCreate({
//       'email': 'taylorotwell@gmail.com'
//     }, {
//       'name': 'Taylor Otwell'
//     });
//     expect(user2.id).toEqual(user1.id);
//     expect(user2.email).toBe('taylorotwell@gmail.com');
//     expect(user2.name).toBe('Taylor Otwell');
//     let user3 = EloquentTestUser.updateOrCreate({
//       'email': 'themsaid@gmail.com'
//     }, {
//       'name': 'Mohamed Said'
//     });
//     expect(user3.name).toBe('Mohamed Said');
//     expect(2).toEqual(EloquentTestUser.count());
//   });
//   it('update or create on different connection', () => {
//     EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.on('second_connection').updateOrCreate({
//       'email': 'taylorotwell@gmail.com'
//     }, {
//       'name': 'Taylor Otwell'
//     });
//     EloquentTestUser.on('second_connection').updateOrCreate({
//       'email': 'themsaid@gmail.com'
//     }, {
//       'name': 'Mohamed Said'
//     });
//     expect(1).toEqual(EloquentTestUser.count());
//     expect(2).toEqual(EloquentTestUser.on('second_connection').count());
//   });
//   it('check and create methods on multi connections', () => {
//     EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.on('second_connection').find(EloquentTestUser.on('second_connection').insert({
//       'id'   : 2,
//       'email': 'themsaid@gmail.com'
//     }));
//     let user1 = EloquentTestUser.on('second_connection').findOrNew(1);
//     let user2 = EloquentTestUser.on('second_connection').findOrNew(2);
//     expect(user1.exists).toFalse();
//     expect(user2.exists).toBeTruthy();
//     expect(user1.getConnectionName()).toBe('second_connection');
//     expect(user2.getConnectionName()).toBe('second_connection');
//     let user1 = EloquentTestUser.on('second_connection').firstOrNew({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let user2 = EloquentTestUser.on('second_connection').firstOrNew({
//       'email': 'themsaid@gmail.com'
//     });
//     expect(user1.exists).toFalse();
//     expect(user2.exists).toBeTruthy();
//     expect(user1.getConnectionName()).toBe('second_connection');
//     expect(user2.getConnectionName()).toBe('second_connection');
//     expect(EloquentTestUser.on('second_connection').count()).toEqual(1);
//     let user1 = EloquentTestUser.on('second_connection').firstOrCreate({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let user2 = EloquentTestUser.on('second_connection').firstOrCreate({
//       'email': 'themsaid@gmail.com'
//     });
//     expect(user1.getConnectionName()).toBe('second_connection');
//     expect(user2.getConnectionName()).toBe('second_connection');
//     expect(EloquentTestUser.on('second_connection').count()).toEqual(2);
//   });
//   it('creating model with empty attributes', () => {
//     let model = EloquentTestNonIncrementing.create([]);
//     expect(model.exists).toFalse();
//     expect(model.wasRecentlyCreated).toFalse();
//   });
//   it('chunk by id with non incrementing key', () => {
//     EloquentTestNonIncrementingSecond.create({
//       'name': ' First'
//     });
//     EloquentTestNonIncrementingSecond.create({
//       'name': ' Second'
//     });
//     EloquentTestNonIncrementingSecond.create({
//       'name': ' Third'
//     });
//     let i = 0;
//     EloquentTestNonIncrementingSecond.query().chunkById(2, users => {
//       if (!i) {
//         this.assertSame(' First', users[0].name);
//         this.assertSame(' Second', users[1].name);
//       } else {
//         this.assertSame(' Third', users[0].name);
//       }
//       i++;
//     }, 'name');
//     expect(i).toEqual(2);
//   });
//   it('each by id with non incrementing key', () => {
//     EloquentTestNonIncrementingSecond.create({
//       'name': ' First'
//     });
//     EloquentTestNonIncrementingSecond.create({
//       'name': ' Second'
//     });
//     EloquentTestNonIncrementingSecond.create({
//       'name': ' Third'
//     });
//     let users = [];
//     EloquentTestNonIncrementingSecond.query().eachById((user, i) => {
//       users.push([user.name, i]);
//     }, 2, 'name');
//     expect(users).toEqual([[' First', 0], [' Second', 1], [' Third', 0]]);
//   });
//   it('pluck', () => {
//     EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 2,
//       'email': 'abigailotwell@gmail.com'
//     });
//     let simple = EloquentTestUser.oldest('id').pluck('users.email').all();
//     let keyed  = EloquentTestUser.oldest('id').pluck('users.email', 'users.id').all();
//     expect(simple).toEqual(['taylorotwell@gmail.com', 'abigailotwell@gmail.com']);
//     expect(keyed).toEqual({
//       1: 'taylorotwell@gmail.com',
//       2: 'abigailotwell@gmail.com'
//     });
//   });
//   it('pluck with join', () => {
//     let user1 = EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let user2 = EloquentTestUser.create({
//       'id'   : 2,
//       'email': 'abigailotwell@gmail.com'
//     });
//     user2.posts().create({
//       'id'  : 1,
//       'name': 'First post'
//     });
//     user1.posts().create({
//       'id'  : 2,
//       'name': 'Second post'
//     });
//     let query = EloquentTestUser.join('posts', 'users.id', '=', 'posts.user_id');
//     expect(query.pluck('posts.name', 'posts.id').all()).toEqual({
//       1: 'First post',
//       2: 'Second post'
//     });
//     expect(query.pluck('posts.name', 'users.id').all()).toEqual({
//       2: 'First post',
//       1: 'Second post'
//     });
//     expect(query.pluck('posts.name', 'users.email AS user_email').all()).toEqual({
//       'abigailotwell@gmail.com': 'First post',
//       'taylorotwell@gmail.com' : 'Second post'
//     });
//   });
//   it('pluck with column name containing a space', () => {
//     EloquentTestUserWithSpaceInColumnName.create({
//       'id'           : 1,
//       'email address': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUserWithSpaceInColumnName.create({
//       'id'           : 2,
//       'email address': 'abigailotwell@gmail.com'
//     });
//     let simple = EloquentTestUserWithSpaceInColumnName.oldest('id').pluck(
//       'users_with_space_in_colum_name.email address').all();
//     let keyed  = EloquentTestUserWithSpaceInColumnName.oldest('id').pluck('email address',
//       'id').all();
//     expect(simple).toEqual(['taylorotwell@gmail.com', 'abigailotwell@gmail.com']);
//     expect(keyed).toEqual({
//       1: 'taylorotwell@gmail.com',
//       2: 'abigailotwell@gmail.com'
//     });
//   });
//   it('find or fail', () => {
//     EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 2,
//       'email': 'abigailotwell@gmail.com'
//     });
//     let single   = EloquentTestUser.findOrFail(1);
//     let multiple = EloquentTestUser.findOrFail([1, 2]);
//     expect(single).toInstanceOf(EloquentTestUser);
//     expect(single.email).toBe('taylorotwell@gmail.com');
//     expect(multiple).toInstanceOf(Collection);
//     expect(multiple[0]).toInstanceOf(EloquentTestUser);
//     expect(multiple[1]).toInstanceOf(EloquentTestUser);
//   });
//   it('find or fail with single id throws model not found exception', () => {
//     this.expectException(ModelNotFoundException);
//     this.expectExceptionMessage(
//       'No query results for model [Illuminate\\Tests\\Database\\EloquentTestUser] 1');
//     EloquentTestUser.findOrFail(1);
//   });
//   it('find or fail with multiple ids throws model not found exception', () => {
//     this.expectException(ModelNotFoundException);
//     this.expectExceptionMessage(
//       'No query results for model [Illuminate\\Tests\\Database\\EloquentTestUser] 1, 2');
//     EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.findOrFail([1, 2]);
//   });
//   it('find or fail with multiple ids using collection throws model not found exception', () => {
//     this.expectException(ModelNotFoundException);
//     this.expectExceptionMessage(
//       'No query results for model [Illuminate\\Tests\\Database\\EloquentTestUser] 1, 2');
//     EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.findOrFail(new Collection([1, 2]));
//   });
//   it('one to one relationship', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.post().create({
//       'name': 'First Post'
//     });
//     let post = user.post;
//     let user = post.user;
//     expect(user.post.name !== undefined).toBeTruthy();
//     expect(user).toInstanceOf(EloquentTestUser);
//     expect(post).toInstanceOf(EloquentTestPost);
//     expect(user.email).toBe('taylorotwell@gmail.com');
//     expect(post.name).toBe('First Post');
//   });
//   it('isset loads in relationship if it isnt loaded already', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.post().create({
//       'name': 'First Post'
//     });
//     expect(user.post.name !== undefined).toBeTruthy();
//   });
//   it('one to many relationship', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.posts().create({
//       'name': 'First Post'
//     });
//     user.posts().create({
//       'name': 'Second Post'
//     });
//     let posts = user.posts;
//     let post2 = user.posts().where('name', 'Second Post').first();
//     expect(posts).toInstanceOf(Collection);
//     expect(posts).toCount(2);
//     expect(posts[0]).toInstanceOf(EloquentTestPost);
//     expect(posts[1]).toInstanceOf(EloquentTestPost);
//     expect(post2).toInstanceOf(EloquentTestPost);
//     expect(post2.name).toBe('Second Post');
//     expect(post2.user).toInstanceOf(EloquentTestUser);
//     expect(post2.user.email).toBe('taylorotwell@gmail.com');
//   });
//   it('basic model hydration', () => {
//     let user = new EloquentTestUser({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.setConnection('second_connection');
//     user.save();
//     let user = new EloquentTestUser({
//       'email': 'abigailotwell@gmail.com'
//     });
//     user.setConnection('second_connection');
//     user.save();
//     let models = EloquentTestUser.on('second_connection').fromQuery(
//       'SELECT * FROM users WHERE email = ?', ['abigailotwell@gmail.com']);
//     expect(models).toInstanceOf(Collection);
//     expect(models[0]).toInstanceOf(EloquentTestUser);
//     expect(models[0].email).toBe('abigailotwell@gmail.com');
//     expect(models[0].getConnectionName()).toBe('second_connection');
//     expect(models).toCount(1);
//   });
//   it('has on self referencing belongs to many relationship', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.friends().create({
//       'email': 'abigailotwell@gmail.com'
//     });
//     expect(user.friends[0].id !== undefined).toBeTruthy();
//     let results = EloquentTestUser.has('friends').get();
//     expect(results).toCount(1);
//     expect(results.first().email).toBe('taylorotwell@gmail.com');
//   });
//   it('where has on self referencing belongs to many relationship', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.friends().create({
//       'email': 'abigailotwell@gmail.com'
//     });
//     let results = EloquentTestUser.whereHas('friends', query => {
//       query.where('email', 'abigailotwell@gmail.com');
//     }).get();
//     expect(results).toCount(1);
//     expect(results.first().email).toBe('taylorotwell@gmail.com');
//   });
//   it('has on nested self referencing belongs to many relationship', () => {
//     let user   = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let friend = user.friends().create({
//       'email': 'abigailotwell@gmail.com'
//     });
//     friend.friends().create({
//       'email': 'foo@gmail.com'
//     });
//     let results = EloquentTestUser.has('friends.friends').get();
//     expect(results).toCount(1);
//     expect(results.first().email).toBe('taylorotwell@gmail.com');
//   });
//   it('where has on nested self referencing belongs to many relationship', () => {
//     let user   = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let friend = user.friends().create({
//       'email': 'abigailotwell@gmail.com'
//     });
//     friend.friends().create({
//       'email': 'foo@gmail.com'
//     });
//     let results = EloquentTestUser.whereHas('friends.friends', query => {
//       query.where('email', 'foo@gmail.com');
//     }).get();
//     expect(results).toCount(1);
//     expect(results.first().email).toBe('taylorotwell@gmail.com');
//   });
//   it('has on self referencing belongs to many relationship with where pivot', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.friends().create({
//       'email': 'abigailotwell@gmail.com'
//     });
//     let results = EloquentTestUser.has('friendsOne').get();
//     expect(results).toCount(1);
//     expect(results.first().email).toBe('taylorotwell@gmail.com');
//   });
//   it('has on nested self referencing belongs to many relationship with where pivot', () => {
//     let user   = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let friend = user.friends().create({
//       'email': 'abigailotwell@gmail.com'
//     });
//     friend.friends().create({
//       'email': 'foo@gmail.com'
//     });
//     let results = EloquentTestUser.has('friendsOne.friendsTwo').get();
//     expect(results).toCount(1);
//     expect(results.first().email).toBe('taylorotwell@gmail.com');
//   });
//   it('has on self referencing belongs to relationship', () => {
//     let parentPost = EloquentTestPost.create({
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     EloquentTestPost.create({
//       'name'     : 'Child Post',
//       'parent_id': parentPost.id,
//       'user_id'  : 2
//     });
//     let results = EloquentTestPost.has('parentPost').get();
//     expect(results).toCount(1);
//     expect(results.first().name).toBe('Child Post');
//   });
//   it('aggregated values of datetime field', () => {
//     EloquentTestUser.create({
//       'id'        : 1,
//       'email'     : 'test1@test.test',
//       'created_at': '2016-08-10 09:21:00',
//       'updated_at': Carbon.now()
//     });
//     EloquentTestUser.create({
//       'id'        : 2,
//       'email'     : 'test2@test.test',
//       'created_at': '2016-08-01 12:00:00',
//       'updated_at': Carbon.now()
//     });
//     expect(EloquentTestUser.max('created_at')).toBe('2016-08-10 09:21:00');
//     expect(EloquentTestUser.min('created_at')).toBe('2016-08-01 12:00:00');
//   });
//   it('where has on self referencing belongs to relationship', () => {
//     let parentPost = EloquentTestPost.create({
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     EloquentTestPost.create({
//       'name'     : 'Child Post',
//       'parent_id': parentPost.id,
//       'user_id'  : 2
//     });
//     let results = EloquentTestPost.whereHas('parentPost', query => {
//       query.where('name', 'Parent Post');
//     }).get();
//     expect(results).toCount(1);
//     expect(results.first().name).toBe('Child Post');
//   });
//   it('has on nested self referencing belongs to relationship', () => {
//     let grandParentPost = EloquentTestPost.create({
//       'name'   : 'Grandparent Post',
//       'user_id': 1
//     });
//     let parentPost      = EloquentTestPost.create({
//       'name'     : 'Parent Post',
//       'parent_id': grandParentPost.id,
//       'user_id'  : 2
//     });
//     EloquentTestPost.create({
//       'name'     : 'Child Post',
//       'parent_id': parentPost.id,
//       'user_id'  : 3
//     });
//     let results = EloquentTestPost.has('parentPost.parentPost').get();
//     expect(results).toCount(1);
//     expect(results.first().name).toBe('Child Post');
//   });
//   it('where has on nested self referencing belongs to relationship', () => {
//     let grandParentPost = EloquentTestPost.create({
//       'name'   : 'Grandparent Post',
//       'user_id': 1
//     });
//     let parentPost      = EloquentTestPost.create({
//       'name'     : 'Parent Post',
//       'parent_id': grandParentPost.id,
//       'user_id'  : 2
//     });
//     EloquentTestPost.create({
//       'name'     : 'Child Post',
//       'parent_id': parentPost.id,
//       'user_id'  : 3
//     });
//     let results = EloquentTestPost.whereHas('parentPost.parentPost', query => {
//       query.where('name', 'Grandparent Post');
//     }).get();
//     expect(results).toCount(1);
//     expect(results.first().name).toBe('Child Post');
//   });
//   it('has on self referencing has many relationship', () => {
//     let parentPost = EloquentTestPost.create({
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     EloquentTestPost.create({
//       'name'     : 'Child Post',
//       'parent_id': parentPost.id,
//       'user_id'  : 2
//     });
//     let results = EloquentTestPost.has('childPosts').get();
//     expect(results).toCount(1);
//     expect(results.first().name).toBe('Parent Post');
//   });
//   it('where has on self referencing has many relationship', () => {
//     let parentPost = EloquentTestPost.create({
//       'name'   : 'Parent Post',
//       'user_id': 1
//     });
//     EloquentTestPost.create({
//       'name'     : 'Child Post',
//       'parent_id': parentPost.id,
//       'user_id'  : 2
//     });
//     let results = EloquentTestPost.whereHas('childPosts', query => {
//       query.where('name', 'Child Post');
//     }).get();
//     expect(results).toCount(1);
//     expect(results.first().name).toBe('Parent Post');
//   });
//   it('has on nested self referencing has many relationship', () => {
//     let grandParentPost = EloquentTestPost.create({
//       'name'   : 'Grandparent Post',
//       'user_id': 1
//     });
//     let parentPost      = EloquentTestPost.create({
//       'name'     : 'Parent Post',
//       'parent_id': grandParentPost.id,
//       'user_id'  : 2
//     });
//     EloquentTestPost.create({
//       'name'     : 'Child Post',
//       'parent_id': parentPost.id,
//       'user_id'  : 3
//     });
//     let results = EloquentTestPost.has('childPosts.childPosts').get();
//     expect(results).toCount(1);
//     expect(results.first().name).toBe('Grandparent Post');
//   });
//   it('where has on nested self referencing has many relationship', () => {
//     let grandParentPost = EloquentTestPost.create({
//       'name'   : 'Grandparent Post',
//       'user_id': 1
//     });
//     let parentPost      = EloquentTestPost.create({
//       'name'     : 'Parent Post',
//       'parent_id': grandParentPost.id,
//       'user_id'  : 2
//     });
//     EloquentTestPost.create({
//       'name'     : 'Child Post',
//       'parent_id': parentPost.id,
//       'user_id'  : 3
//     });
//     let results = EloquentTestPost.whereHas('childPosts.childPosts', query => {
//       query.where('name', 'Child Post');
//     }).get();
//     expect(results).toCount(1);
//     expect(results.first().name).toBe('Grandparent Post');
//   });
//   it('has with non where bindings', () => {
//     let user = EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.posts().create({
//       'name': 'Post 2'
//     }).photos().create({
//       'name': 'photo.jpg'
//     });
//     let query              = EloquentTestUser.has('postWithPhotos');
//     let bindingsCount      = count(query.getBindings());
//     let questionMarksCount = substr_count(query.toSql(), '?');
//     expect(bindingsCount).toEqual(questionMarksCount);
//   });
//   it('has on morph to relationship', () => {
//     this.expectException(RuntimeException);
//     EloquentTestPhoto.has('imageable').get();
//   });
//   it('belongs to many relationship models are properly hydrated over chunked request', () => {
//     let user   = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let friend = user.friends().create({
//       'email': 'abigailotwell@gmail.com'
//     });
//     EloquentTestUser.first().friends().chunk(2, friends => {
//       this.assertCount(1, friends);
//       this.assertSame('abigailotwell@gmail.com', friends.first().email);
//       this.assertEquals(user.id, friends.first().pivot.user_id);
//       this.assertEquals(friend.id, friends.first().pivot.friend_id);
//     });
//   });
//   it('belongs to many relationship models are properly hydrated over each request', () => {
//     let user   = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let friend = user.friends().create({
//       'email': 'abigailotwell@gmail.com'
//     });
//     EloquentTestUser.first().friends().each(result => {
//       this.assertSame('abigailotwell@gmail.com', result.email);
//       this.assertEquals(user.id, result.pivot.user_id);
//       this.assertEquals(friend.id, result.pivot.friend_id);
//     });
//   });
//   it('belongs to many relationship models are properly hydrated over cursor request', () => {
//     let user   = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let friend = user.friends().create({
//       'email': 'abigailotwell@gmail.com'
//     });
//     for (let result of EloquentTestUser.first().friends().cursor()) {
//       expect(result.email).toBe('abigailotwell@gmail.com');
//       expect(result.pivot.user_id).toEqual(user.id);
//       expect(result.pivot.friend_id).toEqual(friend.id);
//     }
//   });
//   it('basic has many eager loading', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.posts().create({
//       'name': 'First Post'
//     });
//     let user = EloquentTestUser._with('posts').where('email', 'taylorotwell@gmail.com').first();
//     expect(user.posts.first().name).toBe('First Post');
//     let post = EloquentTestPost._with('user').where('name', 'First Post').get();
//     expect(post.first().user.email).toBe('taylorotwell@gmail.com');
//   });
//   it('basic nested self referencing has many eager loading', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let post = user.posts().create({
//       'name': 'First Post'
//     });
//     post.childPosts().create({
//       'name'   : 'Child Post',
//       'user_id': user.id
//     });
//     let user = EloquentTestUser._with('posts.childPosts').where('email',
//       'taylorotwell@gmail.com').first();
//     expect(user.posts.first()).toNotNull();
//     expect(user.posts.first().name).toBe('First Post');
//     expect(user.posts.first().childPosts.first()).toNotNull();
//     expect(user.posts.first().childPosts.first().name).toBe('Child Post');
//     let post = EloquentTestPost._with('parentPost.user').where('name', 'Child Post').get();
//     expect(post.first().parentPost).toNotNull();
//     expect(post.first().parentPost.user).toNotNull();
//     expect(post.first().parentPost.user.email).toBe('taylorotwell@gmail.com');
//   });
//   it('basic morph many relationship', () => {
//     let user = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.photos().create({
//       'name': 'Avatar 1'
//     });
//     user.photos().create({
//       'name': 'Avatar 2'
//     });
//     let post = user.posts().create({
//       'name': 'First Post'
//     });
//     post.photos().create({
//       'name': 'Hero 1'
//     });
//     post.photos().create({
//       'name': 'Hero 2'
//     });
//     expect(user.photos).toInstanceOf(Collection);
//     expect(user.photos[0]).toInstanceOf(EloquentTestPhoto);
//     expect(post.photos).toInstanceOf(Collection);
//     expect(post.photos[0]).toInstanceOf(EloquentTestPhoto);
//     expect(user.photos).toCount(2);
//     expect(post.photos).toCount(2);
//     expect(user.photos[0].name).toBe('Avatar 1');
//     expect(user.photos[1].name).toBe('Avatar 2');
//     expect(post.photos[0].name).toBe('Hero 1');
//     expect(post.photos[1].name).toBe('Hero 2');
//     let photos = EloquentTestPhoto.orderBy('name').get();
//     expect(photos).toInstanceOf(Collection);
//     expect(photos).toCount(4);
//     expect(photos[0].imageable).toInstanceOf(EloquentTestUser);
//     expect(photos[2].imageable).toInstanceOf(EloquentTestPost);
//     expect(photos[1].imageable.email).toBe('taylorotwell@gmail.com');
//     expect(photos[3].imageable.name).toBe('First Post');
//   });
//   it('morph map is used for creating and fetching through relation', () => {
//     Relation.morphMap({
//       'user': EloquentTestUser,
//       'post': EloquentTestPost
//     });
//     let user = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.photos().create({
//       'name': 'Avatar 1'
//     });
//     user.photos().create({
//       'name': 'Avatar 2'
//     });
//     let post = user.posts().create({
//       'name': 'First Post'
//     });
//     post.photos().create({
//       'name': 'Hero 1'
//     });
//     post.photos().create({
//       'name': 'Hero 2'
//     });
//     expect(user.photos).toInstanceOf(Collection);
//     expect(user.photos[0]).toInstanceOf(EloquentTestPhoto);
//     expect(post.photos).toInstanceOf(Collection);
//     expect(post.photos[0]).toInstanceOf(EloquentTestPhoto);
//     expect(user.photos).toCount(2);
//     expect(post.photos).toCount(2);
//     expect(user.photos[0].name).toBe('Avatar 1');
//     expect(user.photos[1].name).toBe('Avatar 2');
//     expect(post.photos[0].name).toBe('Hero 1');
//     expect(post.photos[1].name).toBe('Hero 2');
//     expect(user.photos[0].imageable_type).toBe('user');
//     expect(user.photos[1].imageable_type).toBe('user');
//     expect(post.photos[0].imageable_type).toBe('post');
//     expect(post.photos[1].imageable_type).toBe('post');
//   });
//   it('morph map is used when fetching parent', () => {
//     Relation.morphMap({
//       'user': EloquentTestUser,
//       'post': EloquentTestPost
//     });
//     let user = EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.photos().create({
//       'name': 'Avatar 1'
//     });
//     let photo = EloquentTestPhoto.first();
//     expect(photo.imageable_type).toBe('user');
//     expect(photo.imageable).toInstanceOf(EloquentTestUser);
//   });
//   it('morph map is merged by default', () => {
//     let map1 = {
//       'user': EloquentTestUser
//     };
//     let map2 = {
//       'post': EloquentTestPost
//     };
//     Relation.morphMap(map1);
//     Relation.morphMap(map2);
//     expect(Relation.morphMap()).toEqual([...map1, ...map2]);
//   });
//   it('morph map overwrites current map', () => {
//     let map1 = {
//       'user': EloquentTestUser
//     };
//     let map2 = {
//       'post': EloquentTestPost
//     };
//     Relation.morphMap(map1, false);
//     expect(Relation.morphMap()).toEqual(map1);
//     Relation.morphMap(map2, false);
//     expect(Relation.morphMap()).toEqual(map2);
//   });
//   it('empty morph to relationship', () => {
//     let photo = new EloquentTestPhoto();
//     expect(photo.imageable).toNull();
//   });
//   it('save or fail', () => {
//     let date = '1970-01-01';
//     let post = new EloquentTestPost({
//       'user_id'   : 1,
//       'name'      : 'Post',
//       'created_at': date,
//       'updated_at': date
//     });
//     expect(post.saveOrFail()).toBeTruthy();
//     expect(EloquentTestPost.count()).toEqual(1);
//   });
//   it('saving json fields', () => {
//     let model = EloquentTestWithJSON.create({
//       'json': {
//         'x': 0
//       }
//     });
//     expect(model.json).toEqual({
//       'x': 0
//     });
//     model.fillable(['json->y', 'json->a->b']);
//     model.update({
//       'json->y': '1'
//     });
//     expect(model.toArray()).toArrayNotHasKey('json->y');
//     expect(model.json).toEqual({
//       'x': 0,
//       'y': 1
//     });
//     model.update({
//       'json->a->b': '3'
//     });
//     expect(model.toArray()).toArrayNotHasKey('json->a->b');
//     expect(model.json).toEqual({
//       'x': 0,
//       'y': 1,
//       'a': {
//         'b': 3
//       }
//     });
//   });
//   it('save or fail with duplicated entry', () => {
//     this.expectException(QueryException);
//     this.expectExceptionMessage('SQLSTATE[23000]:');
//     let date = '1970-01-01';
//     EloquentTestPost.create({
//       'id'        : 1,
//       'user_id'   : 1,
//       'name'      : 'Post',
//       'created_at': date,
//       'updated_at': date
//     });
//     let post = new EloquentTestPost({
//       'id'        : 1,
//       'user_id'   : 1,
//       'name'      : 'Post',
//       'created_at': date,
//       'updated_at': date
//     });
//     post.saveOrFail();
//   });
//   it('multi inserts with different values', () => {
//     let date   = '1970-01-01';
//     let result = EloquentTestPost.insert([
//       {
//         'user_id'   : 1,
//         'name'      : 'Post',
//         'created_at': date,
//         'updated_at': date
//       }, {
//         'user_id'   : 2,
//         'name'      : 'Post',
//         'created_at': date,
//         'updated_at': date
//       }
//     ]);
//     expect(result).toBeTruthy();
//     expect(EloquentTestPost.count()).toEqual(2);
//   });
//   it('multi inserts with same values', () => {
//     let date   = '1970-01-01';
//     let result = EloquentTestPost.insert([
//       {
//         'user_id'   : 1,
//         'name'      : 'Post',
//         'created_at': date,
//         'updated_at': date
//       }, {
//         'user_id'   : 1,
//         'name'      : 'Post',
//         'created_at': date,
//         'updated_at': date
//       }
//     ]);
//     expect(result).toBeTruthy();
//     expect(EloquentTestPost.count()).toEqual(2);
//   });
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
//   it('to array includes default formatted timestamps', () => {
//     let model = new EloquentTestUser();
//     model.setRawAttributes({
//       'created_at': '2012-12-04',
//       'updated_at': '2012-12-05'
//     });
//     let array = model.toArray();
//     expect(array['created_at']).toBe('2012-12-04T00:00:00.000000Z');
//     expect(array['updated_at']).toBe('2012-12-05T00:00:00.000000Z');
//   });
//   it('to array includes custom formatted timestamps', () => {
//     let model = new EloquentTestUserWithCustomDateSerialization();
//     model.setRawAttributes({
//       'created_at': '2012-12-04',
//       'updated_at': '2012-12-05'
//     });
//     let array = model.toArray();
//     expect(array['created_at']).toBe('04-12-12');
//     expect(array['updated_at']).toBe('05-12-12');
//   });
//   it('incrementing primary keys are cast to integers by default', () => {
//     EloquentTestUser.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let user = EloquentTestUser.first();
//     expect(user.id).toIsInt();
//   });
//   it('default incrementing primary key integer cast can be overwritten', () => {
//     EloquentTestUserWithStringCastId.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     let user = EloquentTestUserWithStringCastId.first();
//     expect(user.id).toIsString();
//   });
//   it('relations are preloaded in global scope', () => {
//     let user = EloquentTestUserWithGlobalScope.create({
//       'email': 'taylorotwell@gmail.com'
//     });
//     user.posts().create({
//       'name': 'My Post'
//     });
//     let result = EloquentTestUserWithGlobalScope.first();
//     expect(result.getRelations()).toCount(1);
//   });
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
//   it('for page before id correctly paginates', () => {
//     EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 2,
//       'email': 'abigailotwell@gmail.com'
//     });
//     let results = EloquentTestUser.forPageBeforeId(15, 2);
//     expect(results).toInstanceOf(Builder);
//     expect(results.first().id).toEqual(1);
//     let results = EloquentTestUser.orderBy('id', 'desc').forPageBeforeId(15, 2);
//     expect(results).toInstanceOf(Builder);
//     expect(results.first().id).toEqual(1);
//   });
//   it('for page after id correctly paginates', () => {
//     EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     EloquentTestUser.create({
//       'id'   : 2,
//       'email': 'abigailotwell@gmail.com'
//     });
//     let results = EloquentTestUser.forPageAfterId(15, 1);
//     expect(results).toInstanceOf(Builder);
//     expect(results.first().id).toEqual(2);
//     let results = EloquentTestUser.orderBy('id', 'desc').forPageAfterId(15, 1);
//     expect(results).toInstanceOf(Builder);
//     expect(results.first().id).toEqual(2);
//   });
//   it('morph to relations across database connections', () => {
//     let item = null;
//     EloquentTestItem.create({
//       'id': 1
//     });
//     EloquentTestOrder.create({
//       'id'       : 1,
//       'item_type': EloquentTestItem,
//       'item_id'  : 1
//     });
//     try {
//       let item = EloquentTestOrder.first().item;
//     } catch (e: Exception) {
//     }
//     expect(item).toInstanceOf(EloquentTestItem);
//   });
//   it('eager loaded morph to relations on another database connection', () => {
//     EloquentTestPost.create({
//       'id'     : 1,
//       'name'   : 'Default Connection Post',
//       'user_id': 1
//     });
//     EloquentTestPhoto.create({
//       'id'            : 1,
//       'imageable_type': EloquentTestPost,
//       'imageable_id'  : 1,
//       'name'          : 'Photo'
//     });
//     EloquentTestPost.on('second_connection').create({
//       'id'     : 1,
//       'name'   : 'Second Connection Post',
//       'user_id': 1
//     });
//     EloquentTestPhoto.on('second_connection').create({
//       'id'            : 1,
//       'imageable_type': EloquentTestPost,
//       'imageable_id'  : 1,
//       'name'          : 'Photo'
//     });
//     let defaultConnectionPost = EloquentTestPhoto._with('imageable').first().imageable;
//     let secondConnectionPost  = EloquentTestPhoto.on('second_connection')._with(
//       'imageable').first().imageable;
//     expect('Default Connection Post').toEqual(defaultConnectionPost.name);
//     expect('Second Connection Post').toEqual(secondConnectionPost.name);
//   });
//   it('belongs to many custom pivot', () => {
//     let john = EloquentTestUserWithCustomFriendPivot.create({
//       'id'   : 1,
//       'name' : 'John Doe',
//       'email': 'johndoe@example.com'
//     });
//     let jane = EloquentTestUserWithCustomFriendPivot.create({
//       'id'   : 2,
//       'name' : 'Jane Doe',
//       'email': 'janedoe@example.com'
//     });
//     let jack = EloquentTestUserWithCustomFriendPivot.create({
//       'id'   : 3,
//       'name' : 'Jack Doe',
//       'email': 'jackdoe@example.com'
//     });
//     let jule = EloquentTestUserWithCustomFriendPivot.create({
//       'id'   : 4,
//       'name' : 'Jule Doe',
//       'email': 'juledoe@example.com'
//     });
//     EloquentTestFriendLevel.create({
//       'id'   : 1,
//       'level': 'acquaintance'
//     });
//     EloquentTestFriendLevel.create({
//       'id'   : 2,
//       'level': 'friend'
//     });
//     EloquentTestFriendLevel.create({
//       'id'   : 3,
//       'level': 'bff'
//     });
//     john.friends().attach(jane, {
//       'friend_level_id': 1
//     });
//     john.friends().attach(jack, {
//       'friend_level_id': 2
//     });
//     john.friends().attach(jule, {
//       'friend_level_id': 3
//     });
//     let johnWithFriends = EloquentTestUserWithCustomFriendPivot._with('friends').find(1);
//     expect(johnWithFriends.friends).toCount(3);
//     expect(johnWithFriends.friends.find(3).pivot.level.level).toBe('friend');
//     expect(johnWithFriends.friends.find(4).pivot.friend.name).toBe('Jule Doe');
//   });
//   it('is after retrieving the same model', () => {
//     let saved     = EloquentTestUser.create({
//       'id'   : 1,
//       'email': 'taylorotwell@gmail.com'
//     });
//     let retrieved = EloquentTestUser.find(1);
//     expect(saved.is(retrieved)).toBeTruthy();
//   });
//   it('fresh method on model', () => {
//     let now                        = Carbon.now();
//     let nowSerialized              = now.startOfSecond().toJSON();
//     let nowWithFractionsSerialized = now.toJSON();
//     Carbon.setTestNow(now);
//     let storedUser1 = EloquentTestUser.create({
//       'id'      : 1,
//       'email'   : 'taylorotwell@gmail.com',
//       'birthday': now
//     });
//     storedUser1.newQuery().update({
//       'email': 'dev@mathieutu.ovh',
//       'name' : 'Mathieu TUDISCO'
//     });
//     let freshStoredUser1 = storedUser1.fresh();
//     let storedUser2      = EloquentTestUser.create({
//       'id'      : 2,
//       'email'   : 'taylorotwell@gmail.com',
//       'birthday': now
//     });
//     storedUser2.newQuery().update({
//       'email': 'dev@mathieutu.ovh'
//     });
//     let freshStoredUser2   = storedUser2.fresh();
//     let notStoredUser      = new EloquentTestUser({
//       'id'      : 3,
//       'email'   : 'taylorotwell@gmail.com',
//       'birthday': now
//     });
//     let freshNotStoredUser = notStoredUser.fresh();
//     expect(storedUser1.toArray()).toEqual({
//       'id'        : 1,
//       'email'     : 'taylorotwell@gmail.com',
//       'birthday'  : nowWithFractionsSerialized,
//       'created_at': nowSerialized,
//       'updated_at': nowSerialized
//     });
//     expect(freshStoredUser1.toArray()).toEqual({
//       'id'        : 1,
//       'name'      : 'Mathieu TUDISCO',
//       'email'     : 'dev@mathieutu.ovh',
//       'birthday'  : nowWithFractionsSerialized,
//       'created_at': nowSerialized,
//       'updated_at': nowSerialized
//     });
//     expect(storedUser1).toInstanceOf(EloquentTestUser);
//     expect(storedUser2.toArray()).toEqual({
//       'id'        : 2,
//       'email'     : 'taylorotwell@gmail.com',
//       'birthday'  : nowWithFractionsSerialized,
//       'created_at': nowSerialized,
//       'updated_at': nowSerialized
//     });
//     expect(freshStoredUser2.toArray()).toEqual({
//       'id'        : 2,
//       'name'      : null,
//       'email'     : 'dev@mathieutu.ovh',
//       'birthday'  : nowWithFractionsSerialized,
//       'created_at': nowSerialized,
//       'updated_at': nowSerialized
//     });
//     expect(storedUser2).toInstanceOf(EloquentTestUser);
//     expect(notStoredUser.toArray()).toEqual({
//       'id'      : 3,
//       'email'   : 'taylorotwell@gmail.com',
//       'birthday': nowWithFractionsSerialized
//     });
//     expect(freshNotStoredUser).toNull();
//   });
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
//   it('timestamps using default date format', () => {
//     let model = new EloquentTestUser();
//     model.setDateFormat('Y-m-d H:i:s');
//     model.setRawAttributes({
//       'created_at': '2017-11-14 08:23:19'
//     });
//     expect(model.fromDateTime(model.getAttribute('created_at'))).toBe('2017-11-14 08:23:19');
//   });
//   it('timestamps using default sql server date format', () => {
//     let model = new EloquentTestUser();
//     model.setDateFormat('Y-m-d H:i:s.v');
//     model.setRawAttributes({
//       'created_at': '2017-11-14 08:23:19.000',
//       'updated_at': '2017-11-14 08:23:19.734'
//     });
//     expect(model.fromDateTime(model.getAttribute('created_at'))).toBe('2017-11-14 08:23:19.000');
//     expect(model.fromDateTime(model.getAttribute('updated_at'))).toBe('2017-11-14 08:23:19.734');
//   });
//   it('timestamps using custom date format', () => {
//     let model = new EloquentTestUser();
//     model.setDateFormat('Y-m-d H:i:s.u');
//     model.setRawAttributes({
//       'created_at': '2017-11-14 08:23:19.0000',
//       'updated_at': '2017-11-14 08:23:19.7348'
//     });
//     expect(model.fromDateTime(model.getAttribute('created_at'))).toBe('2017-11-14 08:23:19.000000');
//     expect(model.fromDateTime(model.getAttribute('updated_at'))).toBe('2017-11-14 08:23:19.734800');
//   });
//   it('timestamps using old sql server date format', () => {
//     let model = new EloquentTestUser();
//     model.setDateFormat('Y-m-d H:i:s.000');
//     model.setRawAttributes({
//       'created_at': '2017-11-14 08:23:19.000'
//     });
//     expect(model.fromDateTime(model.getAttribute('created_at'))).toBe('2017-11-14 08:23:19.000');
//   });
//   it('timestamps using old sql server date format fallback to default parsing', () => {
//     let model = new EloquentTestUser();
//     model.setDateFormat('Y-m-d H:i:s.000');
//     model.setRawAttributes({
//       'updated_at': '2017-11-14 08:23:19.734'
//     });
//     let date = model.getAttribute('updated_at');
//     expect('the date should contains the precision').toBe('2017-11-14 08:23:19.734',
//       date.format('Y-m-d H:i:s.v'));
//     expect('the format should trims it').toBe('2017-11-14 08:23:19.000', model.fromDateTime(date));
//     expect(Date.hasFormat('2017-11-14 08:23:19.000', model.getDateFormat())).toBeTruthy();
//     expect(Date.hasFormat('2017-11-14 08:23:19.734', model.getDateFormat())).toFalse();
//   });
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
//   it('when base model is ignored all child models are ignored', () => {
//     expect(Model.isIgnoringTouch()).toFalse();
//     expect(User.isIgnoringTouch()).toFalse();
//     Model.withoutTouching(() => {
//       this.assertTrue(Model.isIgnoringTouch());
//       this.assertTrue(User.isIgnoringTouch());
//     });
//     expect(User.isIgnoringTouch()).toFalse();
//     expect(Model.isIgnoringTouch()).toFalse();
//   });
//   it('child models are ignored', () => {
//     expect(Model.isIgnoringTouch()).toFalse();
//     expect(User.isIgnoringTouch()).toFalse();
//     expect(Post.isIgnoringTouch()).toFalse();
//     User.withoutTouching(() => {
//       this.assertFalse(Model.isIgnoringTouch());
//       this.assertFalse(Post.isIgnoringTouch());
//       this.assertTrue(User.isIgnoringTouch());
//     });
//     expect(Post.isIgnoringTouch()).toFalse();
//     expect(User.isIgnoringTouch()).toFalse();
//     expect(Model.isIgnoringTouch()).toFalse();
//   });
//   it('connection', () => {
//     return Fedaco.getConnectionResolver().connection(connection);
//   });
//   it('schema', () => {
//     return this.connection(connection).getSchemaBuilder();
//   });
});

/*Eloquent Models...*/
export class EloquentTestUser extends Model {
  _table: any   = 'users';
  _dates: any   = ['birthday'];
  _guarded: any = [];

  @PrimaryColumn()
  id;

  @Column()
  email;

  @BelongsToManyColumn({
    related        : EloquentTestUser,
    table          : 'friends',
    foreignPivotKey: 'user_id',
    relatedPivotKey: 'friend_id'
  })
  friends;

  // public friends() {
  //   return this.belongsToMany(EloquentTestUser, 'friends', 'user_id', 'friend_id');
  // }
  //
  // public friendsOne() {
  //   return this.belongsToMany(EloquentTestUser, 'friends', 'user_id', 'friend_id').wherePivot(
  //     'user_id', 1);
  // }
  //
  // public friendsTwo() {
  //   return this.belongsToMany(EloquentTestUser, 'friends', 'user_id', 'friend_id').wherePivot(
  //     'user_id', 2);
  // }
  //
  // public posts() {
  //   return this.hasMany(EloquentTestPost, 'user_id');
  // }
  //
  // public post() {
  //   return this.hasOne(EloquentTestPost, 'user_id');
  // }
  //
  // public photos() {
  //   return this.morphMany(EloquentTestPhoto, 'imageable');
  // }
  //
  // public postWithPhotos() {
  //   return this.post().join('photo', join => {
  //     join.on('photo.imageable_id', 'post.id');
  //     join.where('photo.imageable_type', 'EloquentTestPost');
  //   });
  // }
}

// export class EloquentTestUserWithCustomFriendPivot extends EloquentTestUser {
//   public friends() {
//     return this.belongsToMany(EloquentTestUser, "friends", "user_id", "friend_id").using(EloquentTestFriendPivot).withPivot("user_id", "friend_id", "friend_level_id");
//   }
// }
// export class EloquentTestUserWithSpaceInColumnName extends EloquentTestUser {
//   protected table: any = "users_with_space_in_colum_name";
// }
// export class EloquentTestNonIncrementing extends Eloquent {
//   protected table: any = "non_incrementing_users";
//   protected guarded: any = [];
//   public incrementing: any = false;
//   public timestamps: any = false;
// }
// export class EloquentTestNonIncrementingSecond extends EloquentTestNonIncrementing {
//   protected connection: any = "second_connection";
// }
// export class EloquentTestUserWithGlobalScope extends EloquentTestUser {
//   public static boot() {
//     super.boot();
//     EloquentTestUserWithGlobalScope.addGlobalScope(builder => {
//       builder._with("posts");
//     });
//   }
// }
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
// export class EloquentTestPost extends Eloquent {
//   protected table: any = "posts";
//   protected guarded: any = [];
//   public user() {
//     return this.belongsTo(EloquentTestUser, "user_id");
//   }
//   public photos() {
//     return this.morphMany(EloquentTestPhoto, "imageable");
//   }
//   public childPosts() {
//     return this.hasMany(EloquentTestPost, "parent_id");
//   }
//   public parentPost() {
//     return this.belongsTo(EloquentTestPost, "parent_id");
//   }
// }
// export class EloquentTestFriendLevel extends Eloquent {
//   protected table: any = "friend_levels";
//   protected guarded: any = [];
// }
// export class EloquentTestPhoto extends Eloquent {
//   protected table: any = "photos";
//   protected guarded: any = [];
//   public imageable() {
//     return this.morphTo();
//   }
// }
// export class EloquentTestUserWithStringCastId extends EloquentTestUser {
//   protected casts: any = {
//     "id": "string"
//   };
// }
// export class EloquentTestUserWithCustomDateSerialization extends EloquentTestUser {
//   protected serializeDate(date) {
//     return date.format("d-m-y");
//   }
// }
// export class EloquentTestOrder extends Eloquent {
//   protected guarded: any = [];
//   protected table: any = "test_orders";
//   protected _with: any = ["item"];
//   public item() {
//     return this.morphTo();
//   }
// }
// export class EloquentTestItem extends Eloquent {
//   protected guarded: any = [];
//   protected table: any = "test_items";
//   protected connection: any = "second_connection";
// }
// export class EloquentTestWithJSON extends Eloquent {
//   protected guarded: any = [];
//   protected table: any = "with_json";
//   public timestamps: any = false;
//   protected casts: any = {
//     "json": "array"
//   };
// }
// export class EloquentTestFriendPivot extends Pivot {
//   protected table: any = "friends";
//   protected guarded: any = [];
//   public user() {
//     return this.belongsTo(EloquentTestUser);
//   }
//   public friend() {
//     return this.belongsTo(EloquentTestUser);
//   }
//   public level() {
//     return this.belongsTo(EloquentTestFriendLevel, "friend_level_id");
//   }
// }
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
