import { MorphToManyColumn } from '../../src/annotation/relation-column/morph-to-many.relation-column';
import { MorphedByManyColumn } from '../../src/annotation/relation-column/morphed-by-many.relation-column';
import { DatabaseConfig } from '../../src/database-config';
import { Model } from '../../src/fedaco/model';
import { Relation } from '../../src/fedaco/relations/relation';
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
  await  schema('default').create('images', table => {
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
  it('set up', async () => {
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.bootEloquent();
    db.setAsGlobal();
    await createSchema();
  });
  it('tear down', () => {
    [].forEach((connection, index) => {
    });
    Relation.morphMap([], false);
  });
  it('creation', () => {
    let post  = EloquentManyToManyPolymorphicTestPost.create();
    let image = EloquentManyToManyPolymorphicTestImage.create();
    let tag   = EloquentManyToManyPolymorphicTestTag.create();
    let tag2  = EloquentManyToManyPolymorphicTestTag.create();
    post.tags().attach(tag.id);
    post.tags().attach(tag2.id);
    image.tags().attach(tag.id);
    expect(post.tags).toCount(2);
    expect(image.tags).toCount(1);
    expect(tag.posts).toCount(1);
    expect(tag.images).toCount(1);
    expect(tag2.posts).toCount(1);
    expect(tag2.images).toCount(0);
  });
  it('eager loading', () => {
    let post = EloquentManyToManyPolymorphicTestPost.create();
    let tag  = EloquentManyToManyPolymorphicTestTag.create();
    post.tags().attach(tag.id);
    let post = EloquentManyToManyPolymorphicTestPost._with('tags').whereId(1).first();
    let tag  = EloquentManyToManyPolymorphicTestTag._with('posts').whereId(1).first();
    expect(post.relationLoaded('tags')).toBeTruthy();
    expect(tag.relationLoaded('posts')).toBeTruthy();
    expect(post.tags.first().id).toEqual(tag.id);
    expect(tag.posts.first().id).toEqual(post.id);
  });
  it('chunk by id', () => {
    let post = EloquentManyToManyPolymorphicTestPost.create();
    let tag1 = EloquentManyToManyPolymorphicTestTag.create();
    let tag2 = EloquentManyToManyPolymorphicTestTag.create();
    let tag3 = EloquentManyToManyPolymorphicTestTag.create();
    post.tags().attach([tag1.id, tag2.id, tag3.id]);
    let count      = 0;
    let iterations = 0;
    post.tags().chunkById(2, tags => {
      this.assertInstanceOf(EloquentManyToManyPolymorphicTestTag, tags.first());
      count += tags.count();
      iterations++;
    });
    expect(iterations).toEqual(2);
    expect(count).toEqual(3);
  });
  it('connection', () => {
    return Eloquent.getConnectionResolver().connection(connection);
  });
  it('schema', () => {
    return this.connection(connection).getSchemaBuilder();
  });
});

/*Eloquent Models...*/
export class EloquentManyToManyPolymorphicTestPost extends Model {
  _table: any   = 'posts';
  _guarded: any = [];

  @MorphToManyColumn({
    related: EloquentManyToManyPolymorphicTestTag,
    name   : 'taggable'
  })
  public tags;
}

export class EloquentManyToManyPolymorphicTestImage extends Model {
  _table: any   = 'images';
  _guarded: any = [];

  @MorphToManyColumn({
    related: EloquentManyToManyPolymorphicTestTag,
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
