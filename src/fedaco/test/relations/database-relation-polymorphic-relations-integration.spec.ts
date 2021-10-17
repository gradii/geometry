import { MorphToManyColumn } from '../../src/annotation/relation-column/morph-to-many.relation-column';
import { MorphedByManyColumn } from '../../src/annotation/relation-column/morphed-by-many.relation-column';
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

jest.setTimeout(100000);

async function createSchema() {
  await schema('default').create('posts', table => {
    table.increments('id');
    table.timestamps();
  });
  await schema('default').create('images', table => {
    table.increments('id');
    table.timestamps();
  });
  await schema('default').create('tags', table => {
    table.increments('id');
    table.timestamps();
  });
  await schema('default').create('taggables', table => {
    table.integer('eloquent_many_to_many_polymorphic_test_tag_id');
    table.integer('taggable_id');
    table.string('taggable_type');
  });
}

describe('test database eloquent polymorphic relations integration', () => {
  beforeEach(async () => {
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.bootFedaco();
    db.setAsGlobal();
    await createSchema();
  });

  it('creation', async () => {
    const post  = await EloquentManyToManyPolymorphicTestPost.createQuery().create();
    const image = await EloquentManyToManyPolymorphicTestImage.createQuery().create();
    const tag   = await EloquentManyToManyPolymorphicTestTag.createQuery().create();
    const tag2  = await EloquentManyToManyPolymorphicTestTag.createQuery().create();
    post.newRelation('tags').attach(tag.id);
    post.newRelation('tags').attach(tag2.id);
    image.newRelation('tags').attach(tag.id);
    expect(post.tags).toHaveLength(2);
    expect(image.tags).toHaveLength(1);
    expect(tag.posts).toHaveLength(1);
    expect(tag.images).toHaveLength(1);
    expect(tag2.posts).toHaveLength(1);
    expect(tag2.images).toHaveLength(0);
  });
  it('eager loading', async () => {
    let post = await EloquentManyToManyPolymorphicTestPost.createQuery().create();
    let tag  = await EloquentManyToManyPolymorphicTestTag.createQuery().create();
    post.tags().attach(tag.id);
    post = await EloquentManyToManyPolymorphicTestPost.createQuery().with('tags')
      .whereColumn('id', 1).first();
    tag  = await EloquentManyToManyPolymorphicTestTag.createQuery().with('posts')
      .whereColumn('id', 1).first();
    expect(post.relationLoaded('tags')).toBeTruthy();
    expect(tag.relationLoaded('posts')).toBeTruthy();
    expect(post.tags.first().id).toEqual(tag.id);
    expect(tag.posts.first().id).toEqual(post.id);
  });
  it('chunk by id', async () => {
    const post = await EloquentManyToManyPolymorphicTestPost.createQuery().create();
    const tag1 = await EloquentManyToManyPolymorphicTestTag.createQuery().create();
    const tag2 = await EloquentManyToManyPolymorphicTestTag.createQuery().create();
    const tag3 = await EloquentManyToManyPolymorphicTestTag.createQuery().create();
    post.tags().attach([tag1.id, tag2.id, tag3.id]);
    let count      = 0;
    let iterations = 0;
    post.tags().chunkById(2, tags => {
      expect(tags.first()).toBeInstanceOf(EloquentManyToManyPolymorphicTestTag);
      count += tags.count();
      iterations++;
    });
    expect(iterations).toEqual(2);
    expect(count).toEqual(3);
  });
});

/*Eloquent Models...*/
export class EloquentManyToManyPolymorphicTestPost extends Model {
  _table: any   = 'posts';
  _guarded: any = [];

  @MorphToManyColumn({
    related: forwardRef(() => EloquentManyToManyPolymorphicTestTag),
    name   : 'taggable'
  })
  public tags;
}

export class EloquentManyToManyPolymorphicTestImage extends Model {
  _table: any   = 'images';
  _guarded: any = [];

  @MorphToManyColumn({
    related: forwardRef(() => EloquentManyToManyPolymorphicTestTag),
    name   : 'taggable'
  })
  public tags;
}

export class EloquentManyToManyPolymorphicTestTag extends Model {
  _table: any   = 'tags';
  _guarded: any = [];

  @MorphedByManyColumn({
    related: EloquentManyToManyPolymorphicTestPost,
    name   : 'taggable'
  })
  public posts;

  @MorphedByManyColumn({
    related: EloquentManyToManyPolymorphicTestImage,
    name   : 'taggable'
  })
  public images;
}
