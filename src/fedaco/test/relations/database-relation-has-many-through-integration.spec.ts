import { BelongsToColumn } from '../../src/annotation/relation-column/belongs-to.relation-column';
import { HasManyThroughColumn } from '../../src/annotation/relation-column/has-many-through.relation-column';
import { HasManyColumn } from '../../src/annotation/relation-column/has-many.relation-column';
import { DatabaseConfig } from '../../src/database-config';
import { Model } from '../../src/fedaco/model';
import { SchemaBuilder } from '../../src/schema/schema-builder';

function connection(connectionName = 'default') {
  return Model.getConnectionResolver().connection(connectionName);
}

function schema(connectionName = 'default'): SchemaBuilder {
  return connection(connectionName).getSchemaBuilder();
}

async function createSchema() {
  await schema().create('users', table => {
    table.increments('id');
    table.string('email').unique();
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
  (
    await HasManyThroughTestCountry.createQuery().create({
      'id'       : 1,
      'name'     : 'United States of America',
      'shortname': 'us'
    })
  ).users().create({
    'id'           : 1,
    'email'        : 'taylorotwell@gmail.com',
    'country_short': 'us'
  }).posts().createMany([
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

  country.users().create({
    'id'           : 3,
    'email'        : 'example2@gmail.com',
    'country_short': 'uk'
  }).posts().createMany([
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
  country.users().create({
    'id'           : 4,
    'email'        : 'example3@gmail.com',
    'country_short': 'uk'
  }).posts().createMany([
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
  const u = await r.users().create({
    'id'   : 1,
    'email': 'taylorotwell@gmail.com'
  });
  await u.posts().createMany([
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
    table.string('email').unique();
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
      'database': ':memory:'
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
    const post     = country1.newRelation('posts').find(1);
    expect(post).not.toBeNull();
    expect(post.title).toBe('A title');
    expect(country1.posts().find([1, 2])).toHaveLength(2);
    expect(country1.posts().find([1, 2])).toHaveLength(2);
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
    expect(country1.posts().findMany([1, 2])).toHaveLength(2);
    expect(country1.posts().findMany([1, 2])).toHaveLength(2);
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
    expect(async () => {
      await (await HasManyThroughTestCountry.createQuery().first()).newRelation('posts').firstOrFail();
    }).rejects.toThrowError(
      'ModelNotFoundException No query results for model [Illuminate\\Tests\\Database\\HasManyThroughTestPost].');

  });
  it('find or fail throws an exception', () => {
    this.expectException(ModelNotFoundException);
    this.expectExceptionMessage(
      'No query results for model [Illuminate\\Tests\\Database\\HasManyThroughTestPost] 1');
    HasManyThroughTestCountry.create({
      'id'       : 1,
      'name'     : 'United States of America',
      'shortname': 'us'
    }).users().create({
      'id'           : 1,
      'email'        : 'taylorotwell@gmail.com',
      'country_short': 'us'
    });
    HasManyThroughTestCountry.first().posts().findOrFail(1);
  });
  it('find or fail with many throws an exception', () => {
    this.expectException(ModelNotFoundException);
    this.expectExceptionMessage(
      'No query results for model [Illuminate\\Tests\\Database\\HasManyThroughTestPost] 1, 2');
    HasManyThroughTestCountry.create({
      'id'       : 1,
      'name'     : 'United States of America',
      'shortname': 'us'
    }).users().create({
      'id'           : 1,
      'email'        : 'taylorotwell@gmail.com',
      'country_short': 'us'
    }).posts().create({
      'id'   : 1,
      'title': 'A title',
      'body' : 'A body',
      'email': 'taylorotwell@gmail.com'
    });
    HasManyThroughTestCountry.first().posts().findOrFail([1, 2]);
  });
  it('find or fail with many using collection throws an exception', () => {
    this.expectException(ModelNotFoundException);
    this.expectExceptionMessage(
      'No query results for model [Illuminate\\Tests\\Database\\HasManyThroughTestPost] 1, 2');
    HasManyThroughTestCountry.create({
      'id'       : 1,
      'name'     : 'United States of America',
      'shortname': 'us'
    }).users().create({
      'id'           : 1,
      'email'        : 'taylorotwell@gmail.com',
      'country_short': 'us'
    }).posts().create({
      'id'   : 1,
      'title': 'A title',
      'body' : 'A body',
      'email': 'taylorotwell@gmail.com'
    });
    HasManyThroughTestCountry.first().posts().findOrFail(new Collection([1, 2]));
  });
  it('first retrieves first record', () => {
    this.seedData();
    const post = HasManyThroughTestCountry.first().posts().first();
    expect(post).toNotNull();
    expect(post.title).toBe('A title');
  });
  it('all columns are retrieved by default', () => {
    this.seedData();
    const post = HasManyThroughTestCountry.first().posts().first();
    expect(array_keys(post.getAttributes())).toEqual(
      [
        'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at', 'laravel_through_key'
      ]);
  });
  it('only proper columns are selected if provided', () => {
    this.seedData();
    const post = HasManyThroughTestCountry.first().posts().first(['title', 'body']);
    expect(array_keys(post.getAttributes())).toEqual(['title', 'body', 'laravel_through_key']);
  });
  it('chunk returns correct models', () => {
    this.seedData();
    this.seedDataExtended();
    const country = HasManyThroughTestCountry.find(2);
    country.posts().chunk(10, postsChunk => {
      const post = postsChunk.first();
      this.assertEquals([
          'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at', 'laravel_through_key'
        ],
        array_keys(post.getAttributes()));
    });
  });
  it('chunk by id', () => {
    this.seedData();
    this.seedDataExtended();
    const country = HasManyThroughTestCountry.find(2);
    let i         = 0;
    let count     = 0;
    country.posts().chunkById(2, collection => {
      i++;
      count += collection.count();
    });
    expect(i).toEqual(3);
    expect(count).toEqual(6);
  });
  it('cursor returns correct models', () => {
    this.seedData();
    this.seedDataExtended();
    const country = HasManyThroughTestCountry.find(2);
    const posts   = country.posts().cursor();
    expect(posts).toInstanceOf(LazyCollection);
    for (const post of posts) {
      expect(array_keys(post.getAttributes())).toEqual(
        [
          'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at',
          'laravel_through_key'
        ]);
    }
  });
  it('each returns correct models', () => {
    this.seedData();
    this.seedDataExtended();
    const country = HasManyThroughTestCountry.find(2);
    country.posts().each(post => {
      this.assertEquals([
          'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at', 'laravel_through_key'
        ],
        array_keys(post.getAttributes()));
    });
  });
  it('intermediate soft deletes are ignored', async () => {
    await seedData();
    HasManyThroughSoftDeletesTestUser.createQuery().first().delete();
    const posts = HasManyThroughSoftDeletesTestCountry.first().posts;
    expect(posts[0].title).toBe('A title');
    expect(posts).toHaveLength(2);
  });
  it('eager loading loads related models correctly', async () => {
    await seedData();
    const country = HasManyThroughSoftDeletesTestCountry.createQuery().with('posts').first();
    expect(country.shortname).toBe('us');
    expect(country.posts[0].title).toBe('A title');
    expect(country.posts).toHaveLength(2);
  });

});

/*Eloquent Models...*/
export class HasManyThroughTestUser extends Model {
  _table: any   = 'users';
  _guarded: any = [];

  @HasManyColumn({
    related   : HasManyThroughTestPost,
    foreignKey: 'user_id'
  })
  public posts;
}

/*Eloquent Models...*/
export class HasManyThroughTestPost extends Model {
  _table: any   = 'posts';
  _guarded: any = [];

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
    related: HasManyThroughDefaultTestPost
  })
  public posts;
}

/*Eloquent Models...*/
export class HasManyThroughDefaultTestPost extends Model {
  _table: any   = 'posts_default';
  _guarded: any = [];

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

  public posts() {
    return this.hasManyThrough(HasManyThroughTestPost, HasManyThroughTestUser, 'country_short',
      'email', 'shortname',
      'email');
  }

  public users() {
    return this.hasMany(HasManyThroughTestUser, 'country_id');
  }
}

export class HasManyThroughSoftDeletesTestUser extends Model {
  _table: any   = 'users';
  _guarded: any = [];

  public posts() {
    return this.hasMany(HasManyThroughSoftDeletesTestPost, 'user_id');
  }
}

/*Eloquent Models...*/
export class HasManyThroughSoftDeletesTestPost extends Model {
  _table: any   = 'posts';
  _guarded: any = [];

  @BelongsToColumn({
    related   : HasManyThroughSoftDeletesTestUser,
    foreignKey: 'user_id'
  })
  public owner;
}

export class HasManyThroughSoftDeletesTestCountry extends Model {
  _table: any   = 'countries';
  _guarded: any = [];

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
