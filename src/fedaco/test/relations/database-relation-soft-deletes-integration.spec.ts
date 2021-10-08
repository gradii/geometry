import { BadMethodCallException } from 'BadMethodCallException';
import { Manager as DB } from 'Illuminate/Database/Capsule/Manager';
import { Model as Eloquent } from 'Illuminate/Database/Eloquent/Model';
import { SoftDeletes } from 'Illuminate/Database/Eloquent/SoftDeletes';
import { SoftDeletingScope } from 'Illuminate/Database/Eloquent/SoftDeletingScope';
import { Builder } from 'Illuminate/Database/Query/Builder';
import { Paginator } from 'Illuminate/Pagination/Paginator';
import { Carbon } from 'Illuminate/Support/Carbon';
import { TestCase } from 'PHPUnit/Framework/TestCase';

describe('test database eloquent soft deletes integration', () => {
  it('set up', () => {
    Carbon.setTestNow(Carbon.now());
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
    this.schema().create('users', table => {
      table.increments('id');
      table.integer('group_id').nullable();
      table.string('email').unique();
      table.timestamps();
      table.softDeletes();
    });
    this.schema().create('posts', table => {
      table.increments('id');
      table.integer('user_id');
      table.string('title');
      table.timestamps();
      table.softDeletes();
    });
    this.schema().create('comments', table => {
      table.increments('id');
      table.integer('owner_id').nullable();
      table.string('owner_type').nullable();
      table.integer('post_id');
      table.string('body');
      table.timestamps();
      table.softDeletes();
    });
    this.schema().create('addresses', table => {
      table.increments('id');
      table.integer('user_id');
      table.string('address');
      table.timestamps();
      table.softDeletes();
    });
    this.schema().create('groups', table => {
      table.increments('id');
      table.string('name');
      table.timestamps();
      table.softDeletes();
    });
  });
  it('tear down', () => {
    Carbon.setTestNow(null);
    this.schema().drop('users');
    this.schema().drop('posts');
    this.schema().drop('comments');
  });
  it('soft deletes are not retrieved', () => {
    this.createUsers();
    var users = SoftDeletesTestUser.all();
    expect(users).toCount(1);
    expect(users.first().id).toEqual(2);
    expect(SoftDeletesTestUser.find(1)).toNull();
  });
  it('soft deletes are not retrieved from base query', () => {
    this.createUsers();
    var query = SoftDeletesTestUser.query().toBase();
    expect(query).toInstanceOf(Builder);
    expect(query.get()).toCount(1);
  });
  it('soft deletes are not retrieved from builder helpers', () => {
    this.createUsers();
    var count = 0;
    var query = SoftDeletesTestUser.query();
    query.chunk(2, user => {
      count += count(user);
    });
    expect(count).toEqual(1);
    var query = SoftDeletesTestUser.query();
    expect(query.pluck('email').all()).toCount(1);
    Paginator.currentPageResolver(() => {
      return 1;
    });
    var query = SoftDeletesTestUser.query();
    expect(query.paginate(2).all()).toCount(1);
    var query = SoftDeletesTestUser.query();
    expect(query.simplePaginate(2).all()).toCount(1);
    expect(SoftDeletesTestUser.where('email', 'taylorotwell@gmail.com').increment('id')).toEqual(0);
    expect(SoftDeletesTestUser.where('email', 'taylorotwell@gmail.com').decrement('id')).toEqual(0);
  });
  it('with trashed returns all records', () => {
    this.createUsers();
    expect(SoftDeletesTestUser.withTrashed().get()).toCount(2);
    expect(SoftDeletesTestUser.withTrashed().find(1)).toInstanceOf(Eloquent);
  });
  it('with trashed accepts an argument', () => {
    this.createUsers();
    expect(SoftDeletesTestUser.withTrashed(false).get()).toCount(1);
    expect(SoftDeletesTestUser.withTrashed(true).get()).toCount(2);
  });
  it('delete sets deleted column', () => {
    this.createUsers();
    expect(SoftDeletesTestUser.withTrashed().find(1).deleted_at).toInstanceOf(Carbon);
    expect(SoftDeletesTestUser.find(2).deleted_at).toNull();
  });
  it('force delete actually deletes records', () => {
    this.createUsers();
    SoftDeletesTestUser.find(2).forceDelete();
    var users = SoftDeletesTestUser.withTrashed().get();
    expect(users).toCount(1);
    expect(users.first().id).toEqual(1);
  });
  it('restore restores records', () => {
    this.createUsers();
    var taylor = SoftDeletesTestUser.withTrashed().find(1);
    expect(taylor.trashed()).toBeTruthy();
    taylor.restore();
    var users = SoftDeletesTestUser.all();
    expect(users).toCount(2);
    expect(users.find(1).deleted_at).toNull();
    expect(users.find(2).deleted_at).toNull();
  });
  it('only trashed only returns trashed records', () => {
    this.createUsers();
    var users = SoftDeletesTestUser.onlyTrashed().get();
    expect(users).toCount(1);
    expect(users.first().id).toEqual(1);
  });
  it('only without trashed only returns trashed records', () => {
    this.createUsers();
    var users = SoftDeletesTestUser.withoutTrashed().get();
    expect(users).toCount(1);
    expect(users.first().id).toEqual(2);
    var users = SoftDeletesTestUser.withTrashed().withoutTrashed().get();
    expect(users).toCount(1);
    expect(users.first().id).toEqual(2);
  });
  it('first or new', () => {
    this.createUsers();
    var result = SoftDeletesTestUser.firstOrNew({
      'email': 'taylorotwell@gmail.com'
    });
    expect(result.id).toNull();
    var result = SoftDeletesTestUser.withTrashed().firstOrNew({
      'email': 'taylorotwell@gmail.com'
    });
    expect(result.id).toEqual(1);
  });
  it('find or new', () => {
    this.createUsers();
    var result = SoftDeletesTestUser.findOrNew(1);
    expect(result.id).toNull();
    var result = SoftDeletesTestUser.withTrashed().findOrNew(1);
    expect(result.id).toEqual(1);
  });
  it('first or create', () => {
    this.createUsers();
    var result = SoftDeletesTestUser.withTrashed().firstOrCreate({
      'email': 'taylorotwell@gmail.com'
    });
    expect(result.email).toBe('taylorotwell@gmail.com');
    expect(SoftDeletesTestUser.all()).toCount(1);
    var result = SoftDeletesTestUser.firstOrCreate({
      'email': 'foo@bar.com'
    });
    expect(result.email).toBe('foo@bar.com');
    expect(SoftDeletesTestUser.all()).toCount(2);
    expect(SoftDeletesTestUser.withTrashed().get()).toCount(3);
  });
  it('update model after soft deleting', () => {
    var now = Carbon.now();
    this.createUsers();
    /**/
    var userModel = SoftDeletesTestUser.find(2);
    userModel.delete();
    expect(userModel.getOriginal('deleted_at')).toEqual(now.toDateTimeString());
    expect(SoftDeletesTestUser.find(2)).toNull();
    expect(SoftDeletesTestUser.withTrashed().find(2)).toEqual(userModel);
  });
  it('restore after soft delete', () => {
    this.createUsers();
    /**/
    var userModel = SoftDeletesTestUser.find(2);
    userModel.delete();
    userModel.restore();
    expect(SoftDeletesTestUser.find(2).id).toEqual(userModel.id);
  });
  it('soft delete after restoring', () => {
    this.createUsers();
    /**/
    var userModel = SoftDeletesTestUser.withTrashed().find(1);
    userModel.restore();
    expect(SoftDeletesTestUser.find(1).deleted_at).toEqual(userModel.deleted_at);
    expect(SoftDeletesTestUser.find(1).deleted_at).toEqual(userModel.getOriginal('deleted_at'));
    userModel.delete();
    expect(SoftDeletesTestUser.find(1)).toNull();
    expect(SoftDeletesTestUser.withTrashed().find(1).deleted_at).toEqual(userModel.deleted_at);
    expect(SoftDeletesTestUser.withTrashed().find(1).deleted_at).toEqual(userModel.getOriginal('deleted_at'));
  });
  it('modifying before soft deleting and restoring', () => {
    this.createUsers();
    /**/
    var userModel   = SoftDeletesTestUser.find(2);
    userModel.email = 'foo@bar.com';
    userModel.delete();
    userModel.restore();
    expect(SoftDeletesTestUser.find(2).id).toEqual(userModel.id);
    expect(SoftDeletesTestUser.find(2).email).toBe('foo@bar.com');
  });
  it('update or create', () => {
    this.createUsers();
    var result = SoftDeletesTestUser.updateOrCreate({
      'email': 'foo@bar.com'
    }, {
      'email': 'bar@baz.com'
    });
    expect(result.email).toBe('bar@baz.com');
    expect(SoftDeletesTestUser.all()).toCount(2);
    var result = SoftDeletesTestUser.withTrashed().updateOrCreate({
      'email': 'taylorotwell@gmail.com'
    }, {
      'email': 'foo@bar.com'
    });
    expect(result.email).toBe('foo@bar.com');
    expect(SoftDeletesTestUser.all()).toCount(2);
    expect(SoftDeletesTestUser.withTrashed().get()).toCount(3);
  });
  it('has one relationship can be soft deleted', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    abigail.address().create({
      'address': 'Laravel avenue 43'
    });
    abigail.address().delete();
    var abigail = abigail.fresh();
    expect(abigail.address).toNull();
    expect(abigail.address().withTrashed().first().address).toBe('Laravel avenue 43');
    abigail.address().withTrashed().restore();
    var abigail = abigail.fresh();
    expect(abigail.address.address).toBe('Laravel avenue 43');
    abigail.address.delete();
    var abigail = abigail.fresh();
    expect(abigail.address).toNull();
    expect(abigail.address().withTrashed().first().address).toBe('Laravel avenue 43');
    abigail.address().withTrashed().forceDelete();
    var abigail = abigail.fresh();
    expect(abigail.address).toNull();
  });
  it('belongs to relationship can be soft deleted', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    var group   = SoftDeletesTestGroup.create({
      'name': 'admin'
    });
    abigail.group().associate(group);
    abigail.save();
    abigail.group().delete();
    var abigail = abigail.fresh();
    expect(abigail.group).toNull();
    expect(abigail.group().withTrashed().first().name).toBe('admin');
    abigail.group().withTrashed().restore();
    var abigail = abigail.fresh();
    expect(abigail.group.name).toBe('admin');
    abigail.group.delete();
    var abigail = abigail.fresh();
    expect(abigail.group).toNull();
    expect(abigail.group().withTrashed().first().name).toBe('admin');
    abigail.group().withTrashed().forceDelete();
    var abigail = abigail.fresh();
    expect(abigail.group().withTrashed().first()).toNull();
  });
  it('has many relationship can be soft deleted', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    abigail.posts().create({
      'title': 'First Title'
    });
    abigail.posts().create({
      'title': 'Second Title'
    });
    abigail.posts().where('title', 'Second Title').delete();
    var abigail = abigail.fresh();
    expect(abigail.posts).toCount(1);
    expect(abigail.posts.first().title).toBe('First Title');
    expect(abigail.posts().withTrashed().get()).toCount(2);
    abigail.posts().withTrashed().restore();
    var abigail = abigail.fresh();
    expect(abigail.posts).toCount(2);
    abigail.posts().where('title', 'Second Title').forceDelete();
    var abigail = abigail.fresh();
    expect(abigail.posts).toCount(1);
    expect(abigail.posts().withTrashed().get()).toCount(1);
  });
  it('second level relationship can be soft deleted', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    var post    = abigail.posts().create({
      'title': 'First Title'
    });
    post.comments().create({
      'body': 'Comment Body'
    });
    abigail.posts().first().comments().delete();
    var abigail = abigail.fresh();
    expect(abigail.posts().first().comments).toCount(0);
    expect(abigail.posts().first().comments().withTrashed().get()).toCount(1);
  });
  it('where has with deleted relationship', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    var post    = abigail.posts().create({
      'title': 'First Title'
    });
    var users   = SoftDeletesTestUser.where('email', 'taylorotwell@gmail.com').has('posts').get();
    expect(users).toCount(0);
    var users = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').has('posts').get();
    expect(users).toCount(1);
    var users = SoftDeletesTestUser.where('email', 'doesnt@exist.com').orHas('posts').get();
    expect(users).toCount(1);
    var users = SoftDeletesTestUser.whereHas('posts', query => {
      query.where('title', 'First Title');
    }).get();
    expect(users).toCount(1);
    var users = SoftDeletesTestUser.whereHas('posts', query => {
      query.where('title', 'Another Title');
    }).get();
    expect(users).toCount(0);
    var users = SoftDeletesTestUser.where('email', 'doesnt@exist.com').orWhereHas('posts', query => {
      query.where('title', 'First Title');
    }).get();
    expect(users).toCount(1);
    post.delete();
    var users = SoftDeletesTestUser.has('posts').get();
    expect(users).toCount(0);
  });
  it('where has with nested deleted relationship and only trashed condition', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    var post    = abigail.posts().create({
      'title': 'First Title'
    });
    post.delete();
    var users = SoftDeletesTestUser.has('posts').get();
    expect(users).toCount(0);
    var users = SoftDeletesTestUser.whereHas('posts', q => {
      q.onlyTrashed();
    }).get();
    expect(users).toCount(1);
    var users = SoftDeletesTestUser.whereHas('posts', q => {
      q.withTrashed();
    }).get();
    expect(users).toCount(1);
  });
  it('where has with nested deleted relationship', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    var post    = abigail.posts().create({
      'title': 'First Title'
    });
    var comment = post.comments().create({
      'body': 'Comment Body'
    });
    comment.delete();
    var users = SoftDeletesTestUser.has('posts.comments').get();
    expect(users).toCount(0);
    var users = SoftDeletesTestUser.doesntHave('posts.comments').get();
    expect(users).toCount(1);
  });
  it('where doesnt have with nested deleted relationship', () => {
    this.createUsers();
    var users = SoftDeletesTestUser.doesntHave('posts.comments').get();
    expect(users).toCount(1);
  });
  it('where has with nested deleted relationship and with trashed condition', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUserWithTrashedPosts.where('email', 'abigailotwell@gmail.com').first();
    var post    = abigail.posts().create({
      'title': 'First Title'
    });
    post.delete();
    var users = SoftDeletesTestUserWithTrashedPosts.has('posts').get();
    expect(users).toCount(1);
  });
  it('with count with nested deleted relationship and only trashed condition', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    var post1   = abigail.posts().create({
      'title': 'First Title'
    });
    post1.delete();
    abigail.posts().create({
      'title': 'Second Title'
    });
    abigail.posts().create({
      'title': 'Third Title'
    });
    var user = SoftDeletesTestUser.withCount('posts').orderBy('postsCount', 'desc').first();
    expect(user.posts_count).toEqual(2);
    var user = SoftDeletesTestUser.withCount({
      'posts': q => {
        q.onlyTrashed();
      }
    }).orderBy('postsCount', 'desc').first();
    expect(user.posts_count).toEqual(1);
    var user = SoftDeletesTestUser.withCount({
      'posts': q => {
        q.withTrashed();
      }
    }).orderBy('postsCount', 'desc').first();
    expect(user.posts_count).toEqual(3);
    var user = SoftDeletesTestUser.withCount({
      'posts': q => {
        q.withTrashed().where('title', 'First Title');
      }
    }).orderBy('postsCount', 'desc').first();
    expect(user.posts_count).toEqual(1);
    var user = SoftDeletesTestUser.withCount({
      'posts': q => {
        q.where('title', 'First Title');
      }
    }).orderBy('postsCount', 'desc').first();
    expect(user.posts_count).toEqual(0);
  });
  it('or where with soft delete constraint', () => {
    this.createUsers();
    var users = SoftDeletesTestUser.where('email', 'taylorotwell@gmail.com').orWhere('email',
      'abigailotwell@gmail.com');
    expect(users.pluck('email').all()).toEqual(['abigailotwell@gmail.com']);
  });
  it('morph to with trashed', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    var post1   = abigail.posts().create({
      'title': 'First Title'
    });
    post1.comments().create({
      'body'      : 'Comment Body',
      'owner_type': SoftDeletesTestUser,
      'owner_id'  : abigail.id
    });
    abigail.delete();
    var comment = SoftDeletesTestCommentWithTrashed._with({
      'owner': q => {
        q.withoutGlobalScope(SoftDeletingScope);
      }
    }).first();
    expect(comment.owner.email).toEqual(abigail.email);
    var comment = SoftDeletesTestCommentWithTrashed._with({
      'owner': q => {
        q.withTrashed();
      }
    }).first();
    expect(comment.owner.email).toEqual(abigail.email);
    var comment = TestCommentWithoutSoftDelete._with({
      'owner': q => {
        q.withTrashed();
      }
    }).first();
    expect(comment.owner.email).toEqual(abigail.email);
  });
  it('morph to with bad method call', () => {
    this.expectException(BadMethodCallException);
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    var post1   = abigail.posts().create({
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
  it('morph to with constraints', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    var post1   = abigail.posts().create({
      'title': 'First Title'
    });
    post1.comments().create({
      'body'      : 'Comment Body',
      'owner_type': SoftDeletesTestUser,
      'owner_id'  : abigail.id
    });
    var comment = SoftDeletesTestCommentWithTrashed._with({
      'owner': q => {
        q.where('email', 'taylorotwell@gmail.com');
      }
    }).first();
    expect(comment.owner).toNull();
  });
  it('morph to without constraints', () => {
    this.createUsers();
    var abigail = SoftDeletesTestUser.where('email', 'abigailotwell@gmail.com').first();
    var post1   = abigail.posts().create({
      'title': 'First Title'
    });
    post1.comments().create({
      'body'      : 'Comment Body',
      'owner_type': SoftDeletesTestUser,
      'owner_id'  : abigail.id
    });
    var comment = SoftDeletesTestCommentWithTrashed._with('owner').first();
    expect(comment.owner.email).toEqual(abigail.email);
    abigail.delete();
    var comment = SoftDeletesTestCommentWithTrashed._with('owner').first();
    expect(comment.owner).toNull();
  });
  it('morph to non soft deleting model', () => {
    var taylor = TestUserWithoutSoftDelete.create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    var post1  = taylor.posts().create({
      'title': 'First Title'
    });
    post1.comments().create({
      'body'      : 'Comment Body',
      'owner_type': TestUserWithoutSoftDelete,
      'owner_id'  : taylor.id
    });
    var comment = SoftDeletesTestCommentWithTrashed._with('owner').first();
    expect(comment.owner.email).toEqual(taylor.email);
    taylor.delete();
    var comment = SoftDeletesTestCommentWithTrashed._with('owner').first();
    expect(comment.owner).toNull();
  });
  it('create users', () => {
    var taylor = SoftDeletesTestUser.create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    SoftDeletesTestUser.create({
      'id'   : 2,
      'email': 'abigailotwell@gmail.com'
    });
    taylor.delete();
  });
  it('connection', () => {
    return Eloquent.getConnectionResolver().connection();
  });
  it('schema', () => {
    return this.connection().getSchemaBuilder();
  });
});

/*Eloquent Models...*/
export class TestUserWithoutSoftDelete extends Model {
  _table: any   = 'users';
  _guarded: any = [];

  public posts() {
    return this.hasMany(SoftDeletesTestPost, 'user_id');
  }
}

/*Eloquent Models...*/
export class SoftDeletesTestUser extends Model {
  _table: any   = 'users';
  _guarded: any = [];

  public posts() {
    return this.hasMany(SoftDeletesTestPost, 'user_id');
  }

  public address() {
    return this.hasOne(SoftDeletesTestAddress, 'user_id');
  }

  public group() {
    return this.belongsTo(SoftDeletesTestGroup, 'group_id');
  }
}

export class SoftDeletesTestUserWithTrashedPosts extends Model {
  _table: any   = 'users';
  _guarded: any = [];

  public posts() {
    return this.hasMany(SoftDeletesTestPost, 'user_id').withTrashed();
  }
}

/*Eloquent Models...*/
export class SoftDeletesTestPost extends Model {
  _table: any   = 'posts';
  _guarded: any = [];

  public comments() {
    return this.hasMany(SoftDeletesTestComment, 'post_id');
  }
}

/*Eloquent Models...*/
export class TestCommentWithoutSoftDelete extends Model {
  _table: any   = 'comments';
  _guarded: any = [];

  public owner() {
    return this.morphTo();
  }
}

/*Eloquent Models...*/
export class SoftDeletesTestComment extends Model {
  _table: any   = 'comments';
  _guarded: any = [];

  public owner() {
    return this.morphTo();
  }
}

export class SoftDeletesTestCommentWithTrashed extends Model {
  _table: any   = 'comments';
  _guarded: any = [];

  public owner() {
    return this.morphTo();
  }
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

  public users() {
    this.hasMany(SoftDeletesTestUser);
  }
}
