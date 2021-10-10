import { head } from 'ramda';
import { BelongsToColumn } from '../../src/annotation/relation-column/belongs-to.relation-column';
import { HasManyColumn } from '../../src/annotation/relation-column/has-many.relation-column';
import { HasOneColumn } from '../../src/annotation/relation-column/has-one.relation-column';
import { MorphToColumn } from '../../src/annotation/relation-column/morph-to.relation-column';
import { DatabaseConfig } from '../../src/database-config';
import { FedacoBuilder } from '../../src/fedaco/fedaco-builder';
import { mixinSoftDeletes, SoftDeletes } from '../../src/fedaco/mixins/soft-deletes';
import { Model } from '../../src/fedaco/model';
import { onlyTrashed, withoutTrashed, withTrashed } from '../../src/fedaco/scopes/soft-deleting-scope';
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
    table.integer('group_id').nullable();
    table.string('email').unique();
    table.timestamps();
    table.softDeletes();
  });
  await schema().create('posts', table => {
    table.increments('id');
    table.integer('user_id');
    table.string('title');
    table.timestamps();
    table.softDeletes();
  });
  await schema().create('comments', table => {
    table.increments('id');
    table.integer('owner_id').nullable();
    table.string('owner_type').nullable();
    table.integer('post_id');
    table.string('body');
    table.timestamps();
    table.softDeletes();
  });
  await schema().create('addresses', table => {
    table.increments('id');
    table.integer('user_id');
    table.string('address');
    table.timestamps();
    table.softDeletes();
  });
  await schema().create('groups', table => {
    table.increments('id');
    table.string('name');
    table.timestamps();
    table.softDeletes();
  });
}

async function createUsers() {
  const taylor = await SoftDeletesTestUser.createQuery().create({
    'id'   : 1,
    'email': 'taylorotwell@gmail.com'
  });
  await SoftDeletesTestUser.createQuery().create({
    'id'   : 2,
    'email': 'abigailotwell@gmail.com'
  });
  await taylor.delete();
}

describe('test database eloquent soft deletes integration', () => {
  beforeEach(async () => {
    // Carbon.setTestNow(Carbon.now());
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
    // Carbon.setTestNow(null);
    await schema().drop('users');
    await schema().drop('posts');
    await schema().drop('comments');
  });
  it('soft deletes are not retrieved', async () => {
    await createUsers();
    const users = await SoftDeletesTestUser.createQuery().get();
    expect(users).toHaveLength(1);
    expect(head(users).id).toEqual(2);
    expect(SoftDeletesTestUser.createQuery().find(1)).toBeNull();
  });
  it('soft deletes are not retrieved from base query', () => {
    createUsers();
    const query = SoftDeletesTestUser.createQuery().toBase();
    expect(query).toBeInstanceOf(FedacoBuilder);
    expect(query.get()).toHaveLength(1);
  });
  // it('soft deletes are not retrieved from builder helpers', () => {
  //   createUsers();
  //   let count = 0;
  //   let query = SoftDeletesTestUser.createQuery();
  //   query.chunk(2, user => {
  //     count += count(user);
  //   });
  //   expect(count).toEqual(1);
  //   query = SoftDeletesTestUser.createQuery();
  //   expect(query.pluck('email').all()).toHaveLength(1);
  //   // Paginator.currentPageResolver(() => {
  //   //   return 1;
  //   // });
  //    query = SoftDeletesTestUser.createQuery();
  //   expect(query.paginate(2).all()).toHaveLength(1);
  //    query = SoftDeletesTestUser.createQuery();
  //   expect(query.simplePaginate(2).all()).toHaveLength(1);
  //   expect(SoftDeletesTestUser.createQuery().where('email', 'taylorotwell@gmail.com').increment(
  //     'id')).toEqual(0);
  //   expect(SoftDeletesTestUser.createQuery().where('email', 'taylorotwell@gmail.com').decrement(
  //     'id')).toEqual(0);
  // });
  it('with trashed returns all records', async () => {
    await createUsers();
    expect(SoftDeletesTestUser.createQuery().pipe(
      withTrashed()
    ).get()).toHaveLength(2);
    expect(SoftDeletesTestUser.createQuery().pipe(
      withTrashed()
    ).find(1)).toBeInstanceOf(Model);
  });

  it('with trashed accepts an argument', async () => {
    await createUsers();
    expect(SoftDeletesTestUser.createQuery().pipe(
      withTrashed(false)
    ).get()).toHaveLength(1);
    expect(SoftDeletesTestUser.createQuery().pipe(
      withTrashed(true)
    ).get()).toHaveLength(2);
  });

  it('delete sets deleted column', async () => {
    await createUsers();
    expect(SoftDeletesTestUser.createQuery().pipe(
      withTrashed()
    ).find(1).deleted_at).toBeInstanceOf(Date);
    expect(SoftDeletesTestUser.createQuery().find(2).deleted_at).toBeNull();
  });

  it('force delete actually deletes records', async () => {
    await createUsers();
    (await SoftDeletesTestUser.createQuery().find(2)).forceDelete();
    const users = await SoftDeletesTestUser.createQuery().pipe(
      withTrashed()
    ).get();
    expect(users).toHaveLength(1);
    expect(head(users).id).toEqual(1);
  });

  it('restore restores records', async () => {
    await createUsers();
    const taylor = await SoftDeletesTestUser.createQuery().pipe(withTrashed()).find(1);
    expect(taylor.trashed()).toBeTruthy();
    taylor.restore();
    const users = await SoftDeletesTestUser.createQuery().get();
    expect(users).toHaveLength(2);
    expect(users.find(it => it.id === 1).deleted_at).toBeNull();
    expect(users.find(it => it.id === 2).deleted_at).toBeNull();
  });

  it('only trashed only returns trashed records', async () => {
    await createUsers();
    const users = await SoftDeletesTestUser.createQuery().pipe(
      onlyTrashed()
    ).get();
    expect(users).toHaveLength(1);
    expect(head(users).id).toEqual(1);
  });

  it('only without trashed only returns trashed records', async() => {
    await createUsers();
    let users = SoftDeletesTestUser.createQuery().pipe(withoutTrashed()).get();
    expect(users).toHaveLength(1);
    expect(users.first().id).toEqual(2);
    users = await SoftDeletesTestUser.createQuery().pipe(
      withTrashed(),
      withoutTrashed()
    ).get();
    expect(users).toHaveLength(1);
    expect(head(users).id).toEqual(2);
  });

  it('first or new', async () => {
    await createUsers();
    let result = await SoftDeletesTestUser.createQuery().firstOrNew({
      'email': 'taylorotwell@gmail.com'
    });
    expect(result.id).toBeNull();
    result = SoftDeletesTestUser.createQuery().pipe(
      withTrashed()
    ).firstOrNew({
      'email': 'taylorotwell@gmail.com'
    });
    expect(result.id).toEqual(1);
  });

  it('find or new', async () => {
    await createUsers();
    let result = SoftDeletesTestUser.createQuery().findOrNew(1);
    expect(result.id).toBeNull();
    result = SoftDeletesTestUser.createQuery().pipe(withTrashed()).findOrNew(1);
    expect(result.id).toEqual(1);
  });

  it('first or create', async () => {
    await createUsers();
    let result = SoftDeletesTestUser.createQuery().pipe(withTrashed()).firstOrCreate({
      'email': 'taylorotwell@gmail.com'
    });
    expect(result.email).toBe('taylorotwell@gmail.com');
    expect(SoftDeletesTestUser.createQuery().get()).toHaveLength(1);
    result = SoftDeletesTestUser.createQuery().firstOrCreate({
      'email': 'foo@bar.com'
    });
    expect(result.email).toBe('foo@bar.com');
    expect(SoftDeletesTestUser.createQuery().get()).toHaveLength(2);
    expect(SoftDeletesTestUser.createQuery().pipe(withTrashed()).get()).toHaveLength(3);
  });
  it('update model after soft deleting', async () => {
    const now = Carbon.now();
    await createUsers();
    /**/
    const userModel = SoftDeletesTestUser.createQuery().find(2);
    userModel.delete();
    expect(userModel.getOriginal('deleted_at')).toEqual(now.toDateTimeString());
    expect(SoftDeletesTestUser.createQuery().find(2)).toBeNull();
    expect(SoftDeletesTestUser.createQuery().pipe(withTrashed()).find(2)).toEqual(userModel);
  });
  it('restore after soft delete', () => {
    createUsers();
    /**/
    const userModel = SoftDeletesTestUser.createQuery().find(2);
    userModel.delete();
    userModel.restore();
    expect(SoftDeletesTestUser.createQuery().find(2).id).toEqual(userModel.id);
  });
  it('soft delete after restoring', async () => {
    createUsers();
    /**/
    const userModel = await SoftDeletesTestUser.createQuery().withTrashed().find(1);
    userModel.restore();
    expect(SoftDeletesTestUser.find(1).deleted_at).toEqual(userModel.deleted_at);
    expect(SoftDeletesTestUser.find(1).deleted_at).toEqual(userModel.getOriginal('deleted_at'));
    userModel.delete();
    expect(SoftDeletesTestUser.find(1)).toBeNull();
    expect(SoftDeletesTestUser.withTrashed().find(1).deleted_at).toEqual(userModel.deleted_at);
    expect(SoftDeletesTestUser.withTrashed().find(1).deleted_at).toEqual(
      userModel.getOriginal('deleted_at'));
  });
  it('modifying before soft deleting and restoring', () => {
    createUsers();
    /**/
    const userModel = SoftDeletesTestUser.find(2);
    userModel.email = 'foo@bar.com';
    userModel.delete();
    userModel.restore();
    expect(SoftDeletesTestUser.find(2).id).toEqual(userModel.id);
    expect(SoftDeletesTestUser.find(2).email).toBe('foo@bar.com');
  });
  it('update or create', () => {
    createUsers();
    let result = SoftDeletesTestUser.updateOrCreate({
      'email': 'foo@bar.com'
    }, {
      'email': 'bar@baz.com'
    });
    expect(result.email).toBe('bar@baz.com');
    expect(SoftDeletesTestUser.all()).toHaveLength(2);
    const result = SoftDeletesTestUser.withTrashed().updateOrCreate({
      'email': 'taylorotwell@gmail.com'
    }, {
      'email': 'foo@bar.com'
    });
    expect(result.email).toBe('foo@bar.com');
    expect(SoftDeletesTestUser.all()).toHaveLength(2);
    expect(SoftDeletesTestUser.withTrashed().get()).toHaveLength(3);
  });
  it('has one relationship can be soft deleted', () => {
    createUsers();
    let abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    abigail.address().create({
      'address': 'Laravel avenue 43'
    });
    abigail.address().delete();
    let abigail = abigail.fresh();
    expect(abigail.address).toBeNull();
    expect(abigail.address().withTrashed().first().address).toBe('Laravel avenue 43');
    abigail.address().withTrashed().restore();
    let abigail = abigail.fresh();
    expect(abigail.address.address).toBe('Laravel avenue 43');
    abigail.address.delete();
    let abigail = abigail.fresh();
    expect(abigail.address).toBeNull();
    expect(abigail.address().withTrashed().first().address).toBe('Laravel avenue 43');
    abigail.address().withTrashed().forceDelete();
    const abigail = abigail.fresh();
    expect(abigail.address).toBeNull();
  });
  it('belongs to relationship can be soft deleted', () => {
    createUsers();
    let abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    const group = SoftDeletesTestGroup.create({
      'name': 'admin'
    });
    abigail.group().associate(group);
    abigail.save();
    abigail.group().delete();
    let abigail = abigail.fresh();
    expect(abigail.group).toBeNull();
    expect(abigail.group().withTrashed().first().name).toBe('admin');
    abigail.group().withTrashed().restore();
    let abigail = abigail.fresh();
    expect(abigail.group.name).toBe('admin');
    abigail.group.delete();
    let abigail = abigail.fresh();
    expect(abigail.group).toBeNull();
    expect(abigail.group().withTrashed().first().name).toBe('admin');
    abigail.group().withTrashed().forceDelete();
    const abigail = abigail.fresh();
    expect(abigail.group().withTrashed().first()).toBeNull();
  });
  it('has many relationship can be soft deleted', () => {
    createUsers();
    let abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    abigail.posts().create({
      'title': 'First Title'
    });
    abigail.posts().create({
      'title': 'Second Title'
    });
    abigail.posts().where('title', 'Second Title').delete();
    let abigail = abigail.fresh();
    expect(abigail.posts).toHaveLength(1);
    expect(abigail.posts.first().title).toBe('First Title');
    expect(abigail.posts().withTrashed().get()).toHaveLength(2);
    abigail.posts().withTrashed().restore();
    let abigail = abigail.fresh();
    expect(abigail.posts).toHaveLength(2);
    abigail.posts().where('title', 'Second Title').forceDelete();
    const abigail = abigail.fresh();
    expect(abigail.posts).toHaveLength(1);
    expect(abigail.posts().withTrashed().get()).toHaveLength(1);
  });
  it('second level relationship can be soft deleted', () => {
    createUsers();
    let abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    const post  = abigail.posts().create({
      'title': 'First Title'
    });
    post.comments().create({
      'body': 'Comment Body'
    });
    abigail.posts().first().comments().delete();
    const abigail = abigail.fresh();
    expect(abigail.posts().first().comments).toHaveLength(0);
    expect(abigail.posts().first().comments().withTrashed().get()).toHaveLength(1);
  });
  it('where has with deleted relationship', async () => {
    createUsers();
    const abigail = await SoftDeletesTestUser.createQuery().where('email',
      'abigailotwell@gmail.com').first();
    const post    = abigail.posts().create({
      'title': 'First Title'
    });
    let users     = await SoftDeletesTestUser.createQuery().where('email',
      'taylorotwell@gmail.com').has('posts').get();
    expect(users).toHaveLength(0);
    users = await SoftDeletesTestUser.createQuery().where('email',
      'abigailotwell@gmail.com').has('posts').get();
    expect(users).toHaveLength(1);
    users = await SoftDeletesTestUser.createQuery().where('email', 'doesnt@exist.com').orHas(
      'posts').get();
    expect(users).toHaveLength(1);
    users = await SoftDeletesTestUser.createQuery().whereHas('posts', query => {
      query.where('title', 'First Title');
    }).get();
    expect(users).toHaveLength(1);
    users = await SoftDeletesTestUser.createQuery().whereHas('posts', query => {
      query.where('title', 'Another Title');
    }).get();
    expect(users).toHaveLength(0);
    users = await SoftDeletesTestUser.createQuery().where('email',
      'doesnt@exist.com').orWhereHas('posts',
      query => {
        query.where('title', 'First Title');
      }).get();
    expect(users).toHaveLength(1);
    post.delete();
    users = await SoftDeletesTestUser.createQuery().has('posts').get();
    expect(users).toHaveLength(0);
  });
  it('where has with nested deleted relationship and only trashed condition', async () => {
    createUsers();
    const abigail = await SoftDeletesTestUser.createQuery().where('email',
      'abigailotwell@gmail.com').first();
    const post    = abigail.posts().create({
      'title': 'First Title'
    });
    post.delete();
    let users = SoftDeletesTestUser.createQuery().has('posts').get();
    expect(users).toHaveLength(0);
    users = SoftDeletesTestUser.createQuery().whereHas('posts', q => {
      q.onlyTrashed();
    }).get();
    expect(users).toHaveLength(1);
    users = SoftDeletesTestUser.createQuery().whereHas('posts', q => {
      q.withTrashed();
    }).get();
    expect(users).toHaveLength(1);
  });
  it('where has with nested deleted relationship', () => {
    createUsers();
    const abigail = SoftDeletesTestUser.createQuery().where('email',
      'abigailotwell@gmail.com').first();
    const post    = abigail.posts().create({
      'title': 'First Title'
    });
    const comment = post.comments().create({
      'body': 'Comment Body'
    });
    comment.delete();
    let users = SoftDeletesTestUser.createQuery().has('posts.comments').get();
    expect(users).toHaveLength(0);
    const users = SoftDeletesTestUser.createQuery().doesntHave('posts.comments').get();
    expect(users).toHaveLength(1);
  });
  it('where doesnt have with nested deleted relationship', () => {
    createUsers();
    const users = SoftDeletesTestUser.createQuery().doesntHave('posts.comments').get();
    expect(users).toHaveLength(1);
  });
  it('where has with nested deleted relationship and with trashed condition', () => {
    createUsers();
    const abigail = SoftDeletesTestUserWithTrashedPosts.createQuery().where('email',
      'abigailotwell@gmail.com').first();
    const post    = abigail.posts().create({
      'title': 'First Title'
    });
    post.delete();
    const users = SoftDeletesTestUserWithTrashedPosts.createQuery().has('posts').get();
    expect(users).toHaveLength(1);
  });
  it('with count with nested deleted relationship and only trashed condition', () => {
    createUsers();
    const abigail = SoftDeletesTestUser.createQuery().where('email',
      'abigailotwell@gmail.com').first();
    const post1   = abigail.posts().create({
      'title': 'First Title'
    });
    post1.delete();
    abigail.posts().create({
      'title': 'Second Title'
    });
    abigail.posts().create({
      'title': 'Third Title'
    });
    let user = SoftDeletesTestUser.createQuery().withCount('posts').orderBy('postsCount',
      'desc').first();
    expect(user.posts_count).toEqual(2);
    user = SoftDeletesTestUser.createQuery().withCount({
      'posts': q => {
        q.onlyTrashed();
      }
    }).orderBy('postsCount', 'desc').first();
    expect(user.posts_count).toEqual(1);
    user = SoftDeletesTestUser.createQuery().withCount({
      'posts': q => {
        q.withTrashed();
      }
    }).orderBy('postsCount', 'desc').first();
    expect(user.posts_count).toEqual(3);
    user = SoftDeletesTestUser.createQuery().withCount({
      'posts': q => {
        q.withTrashed().where('title', 'First Title');
      }
    }).orderBy('postsCount', 'desc').first();
    expect(user.posts_count).toEqual(1);
    user = SoftDeletesTestUser.createQuery().withCount({
      'posts': q => {
        q.where('title', 'First Title');
      }
    }).orderBy('postsCount', 'desc').first();
    expect(user.posts_count).toEqual(0);
  });
  it('or where with soft delete constraint', () => {
    createUsers();
    const users = SoftDeletesTestUser.createQuery().where('email',
      'taylorotwell@gmail.com').orWhere('email',
      'abigailotwell@gmail.com');
    expect(users.pluck('email').all()).toEqual(['abigailotwell@gmail.com']);
  });
  it('morph to with trashed', () => {
    createUsers();
    const abigail = SoftDeletesTestUser.createQuery().where('email',
      'abigailotwell@gmail.com').first();
    const post1   = abigail.posts().create({
      'title': 'First Title'
    });
    post1.comments().create({
      'body'      : 'Comment Body',
      'owner_type': SoftDeletesTestUser,
      'owner_id'  : abigail.id
    });
    abigail.delete();
    let comment = SoftDeletesTestCommentWithTrashed._with({
      'owner': q => {
        q.withoutGlobalScope(SoftDeletingScope);
      }
    }).first();
    expect(comment.owner.email).toEqual(abigail.email);
    comment = SoftDeletesTestCommentWithTrashed._with({
      'owner': q => {
        q.withTrashed();
      }
    }).first();
    expect(comment.owner.email).toEqual(abigail.email);
    comment = TestCommentWithoutSoftDelete._with({
      'owner': q => {
        q.withTrashed();
      }
    }).first();
    expect(comment.owner.email).toEqual(abigail.email);
  });
  it('morph to with bad method call', () => {
    this.expectException(BadMethodCallException);
    createUsers();
    const abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    const post1   = abigail.posts().create({
      'title': 'First Title'
    });
    post1.comments().create({
      'body'      : 'Comment Body',
      'owner_type': SoftDeletesTestUser,
      'owner_id'  : abigail.id
    });
    TestCommentWithoutSoftDelete._with({
      'owner': q => {
        q.thisMethodDoesNotExist();
      }
    }).first();
  });
  it('morph to with constraints', async () => {
    createUsers();
    const abigail = await SoftDeletesTestUser.createQuery().where('email',
      'abigailotwell@gmail.com').first();
    const post1   = abigail.posts().create({
      'title': 'First Title'
    });
    await post1.comments().create({
      'body'      : 'Comment Body',
      'owner_type': SoftDeletesTestUser,
      'owner_id'  : abigail.id
    });
    const comment = await SoftDeletesTestCommentWithTrashed.createQuery().with({
      'owner': q => {
        q.where('email', 'taylorotwell@gmail.com');
      }
    }).first();
    expect(comment.owner).toBeNull();
  });
  it('morph to without constraints', () => {
    createUsers();
    const abigail = SoftDeletesTestUser.createQuery().where('email',
      'abigailotwell@gmail.com').first();
    const post1   = abigail.posts().create({
      'title': 'First Title'
    });
    post1.comments().create({
      'body'      : 'Comment Body',
      'owner_type': SoftDeletesTestUser,
      'owner_id'  : abigail.id
    });
    let comment = SoftDeletesTestCommentWithTrashed.createQuery().with('owner').first();
    expect(comment.owner.email).toEqual(abigail.email);
    abigail.delete();
    const comment = SoftDeletesTestCommentWithTrashed._with('owner').first();
    expect(comment.owner).toBeNull();
  });
  it('morph to non soft deleting model', async () => {
    const taylor = await TestUserWithoutSoftDelete.createQuery().create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    const post1  = await taylor.newRelation('posts').create({
      'title': 'First Title'
    });
    await post1.newRelation('comments').create({
      'body'      : 'Comment Body',
      'owner_type': TestUserWithoutSoftDelete,
      'owner_id'  : taylor.id
    });
    let comment = await SoftDeletesTestCommentWithTrashed.createQuery().with('owner').first();
    expect(comment.owner.email).toEqual(taylor.email);
    await taylor.delete();
    comment = await SoftDeletesTestCommentWithTrashed.createQuery().with('owner').first();
    expect(comment.owner).toBeNull();
  });
});

/*Eloquent Models...*/
export class TestUserWithoutSoftDelete extends Model {
  _table: any   = 'users';
  _guarded: any = [];

  @HasManyColumn({
    related   : forwardRef(() => SoftDeletesTestPost),
    foreignKey: 'user_id'
  })
  public posts;
}

/*Eloquent Models...*/
export class SoftDeletesTestUser extends (mixinSoftDeletes<any>(
  Model) as typeof Model & { new(...args: any[]): SoftDeletes }) {
  _table: any   = 'users';
  _guarded: any = [];

  @HasManyColumn({
    related   : forwardRef(() => SoftDeletesTestPost),
    foreignKey: 'user_id'
  })
  public posts;

  @HasOneColumn({
    related   : forwardRef(() => SoftDeletesTestAddress),
    foreignKey: 'user_id'
  })
  public address;

  @BelongsToColumn({
    related   : forwardRef(() => SoftDeletesTestGroup),
    foreignKey: 'group_id'
  })
  public group;
}

export class SoftDeletesTestUserWithTrashedPosts extends Model {
  _table: any   = 'users';
  _guarded: any = [];

  @HasManyColumn({
    related   : forwardRef(() => SoftDeletesTestPost),
    foreignKey: 'user_id',
    onQuery   : (q => {
      q.pipe(
        withTrashed()
      );
    })
  })
  public posts;
}

/*Eloquent Models...*/
export class SoftDeletesTestPost extends Model {
  _table: any   = 'posts';
  _guarded: any = [];

  @HasManyColumn({
    related   : forwardRef(() => SoftDeletesTestComment),
    foreignKey: 'post_id'
  })
  public comments;
}

/*Eloquent Models...*/
export class TestCommentWithoutSoftDelete extends Model {
  _table: any   = 'comments';
  _guarded: any = [];

  @MorphToColumn({
    morphTypeMap: {}
  })
  public owner;
}

/*Eloquent Models...*/
export class SoftDeletesTestComment extends Model {
  _table: any   = 'comments';
  _guarded: any = [];

  @MorphToColumn({
    morphTypeMap: {}
  })
  public owner;
}

export class SoftDeletesTestCommentWithTrashed extends Model {
  _table: any   = 'comments';
  _guarded: any = [];

  @MorphToColumn({
    morphTypeMap: {}
  })
  public owner;
}

/*Eloquent Models...*/
export class SoftDeletesTestAddress extends Model {
  _table: any   = 'addresses';
  _guarded: any = [];
}

/*Eloquent Models...*/
export class SoftDeletesTestGroup extends Model {
  _table: any   = 'groups';
  _guarded: any = [];

  @HasManyColumn({
    related: SoftDeletesTestUser
  })
  public users;
}
