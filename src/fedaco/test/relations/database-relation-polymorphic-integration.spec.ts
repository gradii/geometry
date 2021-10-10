import { BelongsToColumn } from '../../src/annotation/relation-column/belongs-to.relation-column';
import { MorphManyColumn } from '../../src/annotation/relation-column/morph-many.relation-column';
import { MorphToColumn } from '../../src/annotation/relation-column/morph-to.relation-column';
import { DatabaseConfig } from '../../src/database-config';
import { Model } from '../../src/fedaco/model';
import { forwardRef } from '../../src/query-builder/forward-ref';
import { SchemaBuilder } from '../../src/schema/schema-builder';

function connection(connectionName = 'default') {
  return Model.getConnectionResolver().connection(connectionName);
}

function schema(connectionName = 'default'): SchemaBuilder {
  return connection(connectionName).getSchemaBuilder();
}

async function seedData() {
  const taylor  = await TestUser.createQuery().create({
    'id'   : 1,
    'email': 'taylorotwell@gmail.com'
  });
  const post    = await taylor.newRelation('posts').create({
    'title': 'A title',
    'body' : 'A body'
  });
  const comment = await post.newRelation('comments').create({
    'body'   : 'A comment body',
    'user_id': 1
  });
  await comment.newRelation('likes').create([]);
}

async function createSchema() {
  await schema().create('users', table => {
    table.increments('id');
    table.string('email').unique();
    table.timestamps();
  });
  await schema().create('posts', table => {
    table.increments('id');
    table.integer('user_id');
    table.string('title');
    table.text('body');
    table.timestamps();
  });
  await schema().create('comments', table => {
    table.increments('id');
    table.integer('commentable_id');
    table.string('commentable_type');
    table.integer('user_id');
    table.text('body');
    table.timestamps();
  });
  await schema().create('likes', table => {
    table.increments('id');
    table.integer('likeable_id');
    table.string('likeable_type');
    table.timestamps();
  });
}

describe('test database eloquent polymorphic integration', () => {
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
  it('create schema', () => {

  });
  it('tear down', () => {
    schema().drop('users');
    schema().drop('posts');
    schema().drop('comments');
  });
  it('it loads relationships automatically', async () => {
    await seedData();
    const like = await TestLikeWithSingleWith.createQuery().first();
    expect(like.relationLoaded('likeable')).toBeTruthy();
    expect(like.likeable).toEqual(TestComment.createQuery().first());
  });
  it('it loads chained relationships automatically', async () => {
    await seedData();
    const like = await TestLikeWithSingleWith.createQuery().first();
    expect(like.likeable.relationLoaded('commentable')).toBeTruthy();
    expect(like.likeable.commentable).toEqual(await TestPost.createQuery().first());
  });
  it('it loads nested relationships automatically', async () => {
    await seedData();
    const like = await TestLikeWithNestedWith.createQuery().first();
    expect(like.relationLoaded('likeable')).toBeTruthy();
    expect(like.likeable.relationLoaded('owner')).toBeTruthy();
    expect(like.likeable.owner).toEqual(TestUser.createQuery().first());
  });
  it('it loads nested relationships on demand', async () => {
    await seedData();
    const like = await TestLike.createQuery().with('likeable.owner').first();
    expect(like.relationLoaded('likeable')).toBeTruthy();
    expect(like.likeable.relationLoaded('owner')).toBeTruthy();
    expect(like.likeable.owner).toEqual(await TestUser.createQuery().first());
  });
  it('it loads nested morph relationships on demand', async () => {
    await seedData();
    (await TestPost.createQuery().first()).newRelation('likes').create([]);
    const likes = TestLike.createQuery().with('likeable.owner').get().loadMorph('likeable', {});
    expect(likes[0].relationLoaded('likeable')).toBeTruthy();
    expect(likes[0].likeable.relationLoaded('owner')).toBeTruthy();
    expect(likes[0].likeable.relationLoaded('commentable')).toBeTruthy();
    expect(likes[1].relationLoaded('likeable')).toBeTruthy();
    expect(likes[1].likeable.relationLoaded('owner')).toBeTruthy();
    expect(likes[1].likeable.relationLoaded('comments')).toBeTruthy();
  });
  it('it loads nested morph relationship counts on demand', async () => {
    await seedData();
    (await TestPost.createQuery().first()).newRelation('likes').create([]);
    (await TestComment.createQuery().first()).newRelation('likes').create([]);
    const likes = TestLike.createQuery().with('likeable.owner').get().loadMorphCount('likeable',
      {});
    expect(likes[0].relationLoaded('likeable')).toBeTruthy();
    expect(likes[0].likeable.relationLoaded('owner')).toBeTruthy();
    expect(likes[0].likeable.likes_count).toEqual(2);
    expect(likes[1].relationLoaded('likeable')).toBeTruthy();
    expect(likes[1].likeable.relationLoaded('owner')).toBeTruthy();
    expect(likes[1].likeable.comments_count).toEqual(1);
    expect(likes[2].relationLoaded('likeable')).toBeTruthy();
    expect(likes[2].likeable.relationLoaded('owner')).toBeTruthy();
    expect(likes[2].likeable.likes_count).toEqual(2);
  });
});

/*Eloquent Models...*/
export class TestUser extends Model {
  _table: any   = 'users';
  _guarded: any = [];

  public posts() {
    return this.hasMany(TestPost, 'user_id');
  }
}

/*Eloquent Models...*/
export class TestPost extends Model {
  _table: any   = 'posts';
  _guarded: any = [];

  @MorphManyColumn({
    related  : forwardRef(() => TestComment),
    morphName: 'commentable'
  })
  public comments;

  @BelongsToColumn({
    related   : TestUser,
    foreignKey: 'user_id'
  })
  public owner;

  @MorphManyColumn({
    related  : forwardRef(() => TestLike),
    morphName: 'likeable'
  })
  public likes;
}

/*Eloquent Models...*/
export class TestComment extends Model {
  _table: any   = 'comments';
  _guarded: any = [];
  _with: any    = ['commentable'];

  @BelongsToColumn({
    related   : TestUser,
    foreignKey: 'user_id'
  })
  public owner;

  @MorphToColumn({
    morphTypeMap: {}
  })
  public commentable;

  @MorphManyColumn({
    related  : forwardRef(() => TestLike),
    morphName: 'likeable'
  })
  public likes;
}

export class TestLike extends Model {
  _table: any   = 'likes';
  _guarded: any = [];

  @MorphToColumn()
  public likeable;
}

export class TestLikeWithSingleWith extends Model {
  _table: any   = 'likes';
  _guarded: any = [];
  _with: any    = ['likeable'];

  @MorphToColumn({
    morphTypeMap: {}
  })
  public likeable;
}

export class TestLikeWithNestedWith extends Model {
  _table: any   = 'likes';
  _guarded: any = [];
  _with: any    = ['likeable.owner'];

  @MorphToColumn({
    morphTypeMap: {}
  })
  public likeable;
}
