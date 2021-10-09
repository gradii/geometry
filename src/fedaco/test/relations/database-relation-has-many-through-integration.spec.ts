import { head } from 'ramda';
import { tap } from 'rxjs/operators';
import { Column } from '../../src/annotation/column/column';
import { DeletedAtColumn } from '../../src/annotation/column/deleted-at.column';
import { BelongsToColumn } from '../../src/annotation/relation-column/belongs-to.relation-column';
import { HasManyThroughColumn } from '../../src/annotation/relation-column/has-many-through.relation-column';
import { HasManyColumn } from '../../src/annotation/relation-column/has-many.relation-column';
import { DatabaseConfig } from '../../src/database-config';
import { mixinSoftDeletes } from '../../src/fedaco/mixins/soft-deletes';
import { Model } from '../../src/fedaco/model';
import { forwardRef } from '../../src/query-builder/forward-ref';
import { SchemaBuilder } from '../../src/schema/schema-builder';

function connection(connectionName = 'default') {
  return Model.getConnectionResolver().connection(connectionName);
}

function schema(connectionName = 'default'): SchemaBuilder {
  return connection(connectionName).getSchemaBuilder();
}

jest.setTimeout(100000);

async function createSchema() {
  await schema().create('users', table => {
    table.increments('id');
    table.string('email').withUnique();
    table.unsignedInteger('country_id');
    table.string('country_short');
    table.timestamps();
    table.softDeletes();
  });
  await schema().create('posts', table => {
    table.increments('id');
    table.integer('user_id');
    table.string('title');
    table.text('body');
    table.string('email');
    table.timestamps();
  });
  await schema().create('countries', table => {
    table.increments('id');
    table.string('name');
    table.string('shortname');
    table.timestamps();
  });
}

async function seedData() {
  const country = await HasManyThroughTestCountry.createQuery().create({
    'id'       : 1,
    'name'     : 'United States of America',
    'shortname': 'us'
  });

  const user = await country.newRelation('users').create({
    'id'           : 1,
    'email'        : 'taylorotwell@gmail.com',
    'country_short': 'us'
  });
  const post = await user.newRelation('posts').createMany([
    {
      'title': 'A title',
      'body' : 'A body',
      'email': 'taylorotwell@gmail.com'
    }, {
      'title': 'Another title',
      'body' : 'Another body',
      'email': 'taylorotwell@gmail.com'
    }
  ]);
}

async function seedDataExtended() {
  const country = await HasManyThroughTestCountry.createQuery().create({
    'id'       : 2,
    'name'     : 'United Kingdom',
    'shortname': 'uk'
  });

  const user = await country.newRelation('users').create({
    'id'           : 2,
    'email'        : 'example1@gmail.com',
    'country_short': 'uk'
  });

  await user.newRelation('posts').createMany([
    {
      'title': 'Example1 title1',
      'body' : 'Example1 body1',
      'email': 'example1post1@gmail.com'
    }, {
      'title': 'Example1 title2',
      'body' : 'Example1 body2',
      'email': 'example1post2@gmail.com'
    }
  ]);

  const user1 = await country.newRelation('users').create({
    'id'           : 3,
    'email'        : 'example2@gmail.com',
    'country_short': 'uk'
  });

  await user1.newRelation('posts').createMany([
    {
      'title': 'Example2 title1',
      'body' : 'Example2 body1',
      'email': 'example2post1@gmail.com'
    }, {
      'title': 'Example2 title2',
      'body' : 'Example2 body2',
      'email': 'example2post2@gmail.com'
    }
  ]);

  const user2 = await country.newRelation('users').create({
    'id'           : 4,
    'email'        : 'example3@gmail.com',
    'country_short': 'uk'
  });
  await user2.newRelation('posts').createMany([
    {
      'title': 'Example3 title1',
      'body' : 'Example3 body1',
      'email': 'example3post1@gmail.com'
    }, {
      'title': 'Example3 title2',
      'body' : 'Example3 body2',
      'email': 'example3post2@gmail.com'
    }
  ]);
}

async function seedDefaultData() {
  const r = await HasManyThroughDefaultTestCountry.createQuery().create({
    'id'  : 1,
    'name': 'United States of America'
  });
  const u = await r.newRelation('users').create({
    'id'   : 1,
    'email': 'taylorotwell@gmail.com'
  });
  await u.newRelation('posts').createMany([
    {
      'title': 'A title',
      'body' : 'A body'
    }, {
      'title': 'Another title',
      'body' : 'Another body'
    }
  ]);
}

async function resetDefault() {
  await schema().drop('users_default');
  await schema().drop('posts_default');
  await schema().drop('countries_default');
}

async function migrateDefault() {
  await schema().create('users_default', table => {
    table.increments('id');
    table.string('email').withUnique();
    table.unsignedInteger('has_many_through_default_test_country_id');
    table.timestamps();
  });
  await schema().create('posts_default', table => {
    table.increments('id');
    table.integer('has_many_through_default_test_user_id');
    table.string('title');
    table.text('body');
    table.timestamps();
  });
  await schema().create('countries_default', table => {
    table.increments('id');
    table.string('name');
    table.timestamps();
  });
}

describe('test database eloquent has many through integration', () => {
  beforeEach(async () => {
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      // 'database': ':memory:'
      'database': 'tmp/integration-has-many-through.sqlite'
    });
    db.bootEloquent();
    db.setAsGlobal();
    await createSchema();
  });

  afterEach(async () => {
    await schema().drop('users');
    await schema().drop('posts');
    await schema().drop('countries');
  });

  it('it loads a has many through relation with custom keys', async () => {
    await seedData();
    const posts = await (await HasManyThroughTestCountry.createQuery().first()).posts;
    expect(posts[0].title).toBe('A title');
    expect(posts).toHaveLength(2);
  });

  it('it loads a default has many through relation', async () => {
    await migrateDefault();
    await seedDefaultData();
    const posts = await (await HasManyThroughDefaultTestCountry.createQuery().first()).posts;
    expect(posts[0].title).toBe('A title');
    expect(posts).toHaveLength(2);
    await resetDefault();
  });

  it('it loads a relation with custom intermediate and local key', async () => {
    await seedData();
    const posts = await (await HasManyThroughIntermediateTestCountry.createQuery().first()).posts;
    expect(posts[0].title).toBe('A title');
    expect(posts).toHaveLength(2);
  });

  it('eager loading a relation with custom intermediate and local key', async () => {
    await seedData();
    const posts = await (await HasManyThroughIntermediateTestCountry.createQuery().with(
      'posts').first()).posts;
    expect(posts[0].title).toBe('A title');
    expect(posts).toHaveLength(2);
  });

  it('where has on a relation with custom intermediate and local key', async () => {
    await seedData();
    const country = await HasManyThroughIntermediateTestCountry.createQuery()
      .whereHas('posts', query => {
        query.where('title', 'A title');
      })
      .get();
    expect(country).toHaveLength(1);
  });

  it('find method', async () => {
    const country = await HasManyThroughTestCountry.createQuery().create({
      'id'       : 1,
      'name'     : 'United States of America',
      'shortname': 'us'
    });
    const user    = await country.newRelation('users').create({
      'id'           : 1,
      'email'        : 'taylorotwell@gmail.com',
      'country_short': 'us'
    });
    await user.newRelation('posts').createMany([
      {
        'id'   : 1,
        'title': 'A title',
        'body' : 'A body',
        'email': 'taylorotwell@gmail.com'
      }, {
        'id'   : 2,
        'title': 'Another title',
        'body' : 'Another body',
        'email': 'taylorotwell@gmail.com'
      }
    ]);
    const country1 = await HasManyThroughTestCountry.createQuery().first();
    const post     = await country1.newRelation('posts').find(1);
    expect(post).not.toBeNull();
    expect(post.title).toBe('A title');
    expect(await country1.newRelation('posts').find([1, 2])).toHaveLength(2);
    expect(await country1.newRelation('posts').find([1, 2])).toHaveLength(2);
  });

  it('find many method', async () => {
    const country = await HasManyThroughTestCountry.createQuery().create({
      'id'       : 1,
      'name'     : 'United States of America',
      'shortname': 'us'
    });
    const user    = await country.newRelation('users').create({
      'id'           : 1,
      'email'        : 'taylorotwell@gmail.com',
      'country_short': 'us'
    });
    await user.newRelation('posts').createMany([
      {
        'id'   : 1,
        'title': 'A title',
        'body' : 'A body',
        'email': 'taylorotwell@gmail.com'
      }, {
        'id'   : 2,
        'title': 'Another title',
        'body' : 'Another body',
        'email': 'taylorotwell@gmail.com'
      }
    ]);
    const country1 = await HasManyThroughTestCountry.createQuery().first();
    expect(await country1.newRelation('posts').findMany([1, 2])).toHaveLength(2);
    expect(await country1.newRelation('posts').findMany([1, 2])).toHaveLength(2);
  });

  it('first or fail throws an exception', async () => {
    const country = await HasManyThroughTestCountry.createQuery().create({
      'id'       : 1,
      'name'     : 'United States of America',
      'shortname': 'us'
    });
    await country.newRelation('users').create({
      'id'           : 1,
      'email'        : 'taylorotwell@gmail.com',
      'country_short': 'us'
    });
    await expect(async () => {
      await (await HasManyThroughTestCountry.createQuery().first()).newRelation(
        'posts').firstOrFail();
    }).rejects.toThrowError(
      'ModelNotFoundException No query results for model [HasManyThroughTestPost].');
  });

  it('find or fail throws an exception', async () => {
    const country = await HasManyThroughTestCountry.createQuery().create({
      'id'       : 1,
      'name'     : 'United States of America',
      'shortname': 'us'
    });
    await country.newRelation('users').create({
      'id'           : 1,
      'email'        : 'taylorotwell@gmail.com',
      'country_short': 'us'
    });
    const user = await HasManyThroughTestCountry.createQuery().first();
    await expect(async () => {
      await user.newRelation('posts').findOrFail(1);
    }).rejects.toThrowError(
      'ModelNotFoundException No query results for model [HasManyThroughTestPost] [1]');

  });

  it('find or fail with many throws an exception', async () => {
    const country = await HasManyThroughTestCountry.createQuery().create({
      'id'       : 1,
      'name'     : 'United States of America',
      'shortname': 'us'
    });
    const user    = await country.newRelation('users').create({
      'id'           : 1,
      'email'        : 'taylorotwell@gmail.com',
      'country_short': 'us'
    });
    const post    = await user.newRelation('posts').create({
      'id'   : 1,
      'title': 'A title',
      'body' : 'A body',
      'email': 'taylorotwell@gmail.com'
    });

    await expect(async () => {
      await (await HasManyThroughTestCountry.createQuery().first()).newRelation(
        'posts').findOrFail([1, 2]);
    }).rejects.toThrowError(
      'ModelNotFoundException No query results for model [HasManyThroughTestPost] [1,2]');
  });

  it('first retrieves first record', async () => {
    await seedData();
    const post = await (await HasManyThroughTestCountry.createQuery().first()).newRelation(
      'posts').first();
    expect(post).not.toBeNull();
    expect(post.title).toBe('A title');
  });

  it('all columns are retrieved by default', async () => {
    await seedData();
    const post = await (await HasManyThroughTestCountry.createQuery().first()).newRelation(
      'posts').first();
    expect(Object.keys(post.getAttributes())).toEqual(
      [
        'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at', 'laravel_through_key'
      ]);
  });

  it('only proper columns are selected if provided', async () => {
    await seedData();
    const post = await (await HasManyThroughTestCountry.createQuery().first()).newRelation(
      'posts').first(['title', 'body']);
    expect(Object.keys(post.getAttributes())).toEqual(['title', 'body', 'laravel_through_key']);
  });

  it('chunk returns correct models', async () => {
    await seedData();
    await seedDataExtended();
    const country: HasManyThroughTestCountry = await HasManyThroughTestCountry.createQuery()
      .find(2);
    await country.newRelation('posts')
      .chunk(10).pipe(
        tap(({results: postsChunk}) => {
          const post = head(postsChunk);
          expect(Object.keys(post.getAttributes())).toEqual([
            'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at',
            'laravel_through_key'
          ]);
        })
      ).toPromise();
  });

  it('chunk by id', async () => {
    await seedData();
    await seedDataExtended();
    const country: HasManyThroughTestCountry = await HasManyThroughTestCountry.createQuery()
      .find(2);

    let i     = 0;
    let count = 0;

    await country.newRelation('posts').chunkById(2).pipe(
      tap(({results: collection}) => {
        i++;
        count += collection.length;
      })
    ).toPromise();
    expect(i).toEqual(3);
    expect(count).toEqual(6);
  });
  // it('cursor returns correct models', async () => {
  //   await seedData();
  //   this.seedDataExtended();
  //   const country = HasManyThroughTestCountry.find(2);
  //   const posts   = country.posts().cursor();
  //   expect(posts).toInstanceOf(LazyCollection);
  //   for (const post of posts) {
  //     expect(Object.keys(post.getAttributes())).toEqual(
  //       [
  //         'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at',
  //         'laravel_through_key'
  //       ]);
  //   }
  // });

  it('each returns correct models', async () => {
    await seedData();
    await seedDataExtended();
    const country = await HasManyThroughTestCountry.createQuery().find(2);
    await country.newRelation('posts').each(post => {
      expect(Object.keys(post.getAttributes())).toEqual([
        'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at', 'laravel_through_key'
      ]);
    }).toPromise();
  });

  it('intermediate soft deletes are ignored', async () => {
    await seedData();
    await (await HasManyThroughSoftDeletesTestUser.createQuery().first()).delete();
    const posts = await (await HasManyThroughSoftDeletesTestCountry.createQuery().first()).posts;
    expect(posts[0].title).toBe('A title');
    expect(posts).toHaveLength(2);
  });

  it('eager loading loads related models correctly', async () => {
    await seedData();
    const country = await HasManyThroughSoftDeletesTestCountry.createQuery().with('posts').first();
    expect(country.shortname).toBe('us');
    await country.posts;
    expect(country.posts[0].title).toBe('A title');
    expect(country.posts).toHaveLength(2);
  });

});

/*Eloquent Models...*/
export class HasManyThroughTestUser extends Model {
  _table: any   = 'users';
  _guarded: any = [];

  @HasManyColumn({
    related   : forwardRef(() => HasManyThroughTestPost),
    foreignKey: 'user_id'
  })
  public posts;
}

/*Eloquent Models...*/
export class HasManyThroughTestPost extends Model {
  _table: any   = 'posts';
  _guarded: any = [];

  @Column()
  title;

  @BelongsToColumn({
    related   : HasManyThroughTestUser,
    foreignKey: 'user_id'
  })
  public owner;
}

export class HasManyThroughTestCountry extends Model {
  _table: any   = 'countries';
  _guarded: any = [];

  @HasManyThroughColumn({
    related  : HasManyThroughTestPost,
    through  : HasManyThroughTestUser,
    firstKey : 'country_id',
    secondKey: 'user_id'
  })
  public posts;

  @HasManyColumn({
    related   : HasManyThroughTestUser,
    foreignKey: 'country_id'
  })
  public users;
}

/*Eloquent Models...*/
export class HasManyThroughDefaultTestUser extends Model {
  _table: any   = 'users_default';
  _guarded: any = [];

  @HasManyColumn({
    related: forwardRef(() => HasManyThroughDefaultTestPost),
  })
  public posts;
}

/*Eloquent Models...*/
export class HasManyThroughDefaultTestPost extends Model {
  _table: any   = 'posts_default';
  _guarded: any = [];

  @Column()
  title;

  @BelongsToColumn({
    related: HasManyThroughDefaultTestUser
  })
  public owner;
}

export class HasManyThroughDefaultTestCountry extends Model {
  _table: any   = 'countries_default';
  _guarded: any = [];

  @HasManyThroughColumn({
    related: HasManyThroughDefaultTestPost,
    through: HasManyThroughDefaultTestUser
  })
  public posts;

  @HasManyColumn({
    related: HasManyThroughDefaultTestUser
  })
  public users;
}

export class HasManyThroughIntermediateTestCountry extends Model {
  _table: any   = 'countries';
  _guarded: any = [];

  @HasManyThroughColumn({
    related       : HasManyThroughTestPost,
    through       : HasManyThroughTestUser,
    firstKey      : 'country_short',
    secondKey     : 'email',
    localKey      : 'shortname',
    secondLocalKey: 'email'
  })
  public posts;

  @HasManyColumn({
    related   : HasManyThroughTestUser,
    foreignKey: 'country_id'
  })
  public users;
}

export class HasManyThroughSoftDeletesTestUser extends (mixinSoftDeletes<any>(Model) as typeof Model) {
  _table: any   = 'users';
  _guarded: any = [];

  @HasManyColumn({
    related   : forwardRef(() => HasManyThroughSoftDeletesTestPost),
    foreignKey: 'user_id'
  })
  public posts;

  @DeletedAtColumn()
  deleted_at;
}

/*Eloquent Models...*/
export class HasManyThroughSoftDeletesTestPost extends Model {
  _table: any   = 'posts';
  _guarded: any = [];

  @Column()
  title;

  @BelongsToColumn({
    related   : HasManyThroughSoftDeletesTestUser,
    foreignKey: 'user_id'
  })
  public owner;
}

export class HasManyThroughSoftDeletesTestCountry extends Model {
  _table: any   = 'countries';
  _guarded: any = [];

  @Column()
  shortname;

  @HasManyThroughColumn({
    related  : HasManyThroughSoftDeletesTestPost,
    through  : HasManyThroughTestUser,
    firstKey : 'country_id',
    secondKey: 'user_id',
  })
  public posts;

  @HasManyColumn({
    related   : HasManyThroughSoftDeletesTestUser,
    foreignKey: 'country_id'
  })
  public users;
}
