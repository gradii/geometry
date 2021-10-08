import { Manager as DB } from 'Illuminate/Database/Capsule/Manager';
import { Model as Eloquent } from 'Illuminate/Database/Eloquent/Model';
import { Relation } from 'Illuminate/Database/Eloquent/Relations/Relation';
import { TestCase } from 'PHPUnit/Framework/TestCase';

describe('test database eloquent polymorphic relations integration', () => {
  it('set up', () => {
    var db = new DB();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.bootEloquent();
    db.setAsGlobal();
    this.createSchema();
  });
  it('create schema', () => {
    this.schema('default').create('posts', table => {
      table.increments('id');
      table.timestamps();
    });
    this.schema('default').create('images', table => {
      table.increments('id');
      table.timestamps();
    });
    this.schema('default').create('tags', table => {
      table.increments('id');
      table.timestamps();
    });
    this.schema('default').create('taggables', table => {
      table.integer('eloquent_many_to_many_polymorphic_test_tag_id');
      table.integer('taggable_id');
      table.string('taggable_type');
    });
  });
  it('tear down', () => {
    [].forEach((connection, index) => {
    });
    Relation.morphMap([], false);
  });
  it('creation', () => {
    var post  = EloquentManyToManyPolymorphicTestPost.create();
    var image = EloquentManyToManyPolymorphicTestImage.create();
    var tag   = EloquentManyToManyPolymorphicTestTag.create();
    var tag2  = EloquentManyToManyPolymorphicTestTag.create();
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
    var post = EloquentManyToManyPolymorphicTestPost.create();
    var tag  = EloquentManyToManyPolymorphicTestTag.create();
    post.tags().attach(tag.id);
    var post = EloquentManyToManyPolymorphicTestPost._with('tags').whereId(1).first();
    var tag  = EloquentManyToManyPolymorphicTestTag._with('posts').whereId(1).first();
    expect(post.relationLoaded('tags')).toBeTruthy();
    expect(tag.relationLoaded('posts')).toBeTruthy();
    expect(post.tags.first().id).toEqual(tag.id);
    expect(tag.posts.first().id).toEqual(post.id);
  });
  it('chunk by id', () => {
    var post = EloquentManyToManyPolymorphicTestPost.create();
    var tag1 = EloquentManyToManyPolymorphicTestTag.create();
    var tag2 = EloquentManyToManyPolymorphicTestTag.create();
    var tag3 = EloquentManyToManyPolymorphicTestTag.create();
    post.tags().attach([tag1.id, tag2.id, tag3.id]);
    var count      = 0;
    var iterations = 0;
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

  public tags() {
    return this.morphToMany(EloquentManyToManyPolymorphicTestTag, 'taggable');
  }
}

export class EloquentManyToManyPolymorphicTestImage extends Model {
  _table: any   = 'images';
  _guarded: any = [];

  public tags() {
    return this.morphToMany(EloquentManyToManyPolymorphicTestTag, 'taggable');
  }
}

export class EloquentManyToManyPolymorphicTestTag extends Model {
  _table: any   = 'tags';
  _guarded: any = [];

  public posts() {
    return this.morphedByMany(EloquentManyToManyPolymorphicTestPost, 'taggable');
  }

  public images() {
    return this.morphedByMany(EloquentManyToManyPolymorphicTestImage, 'taggable');
  }
}
