import { isArray } from '@gradii/check-type';
import { format } from 'date-fns';
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
import { Model } from '../src/fedaco/model';
import { BelongsToMany } from '../src/fedaco/relations/belongs-to-many';
import { Pivot } from '../src/fedaco/relations/pivot';
import { forwardRef } from '../src/query-builder/forward-ref';
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
    .dropAllTables();
  await schema('second_connection')
    .dropAllTables();

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
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'mysql',
      'host'    : '127.0.0.1',
      'port'    : 3306,
      'database': 'fedaco_test',
      'username': 'root',
      'password': '123456',
      'timezone': '+08:00'
    });
    db.addConnection({
      'driver'  : 'mysql',
      'host'    : '127.0.0.1',
      'port'    : 3306,
      'database': 'fedaco_second_test',
      'username': 'root',
      'password': '123456'
    }, 'second_connection');
    db.bootFedaco();
    db.setAsGlobal();
    // await createSchema();
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
