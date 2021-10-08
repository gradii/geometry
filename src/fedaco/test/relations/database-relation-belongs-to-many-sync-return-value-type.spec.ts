import { Manager as DB } from 'Illuminate/Database/Capsule/Manager';
import { Model as Eloquent } from 'Illuminate/Database/Eloquent/Model';
import { BelongsToManyColumn } from 'src/fedaco/src/annotation/relation-column/belongs-to-many.relation-column';
import { DatabaseConfig } from 'src/fedaco/src/databaseConfig';
import { Model } from 'src/fedaco/src/fedaco/model';
import { forwardRef } from '../../src/query-builder/forward-ref';


function connection(connectionName = 'default') {
  return Model.getConnectionResolver().connection(connectionName);
}

function schema(connectionName = 'default'): SchemaBuilder {
  return connection(connectionName).getSchemaBuilder();
}

jest.setTimeout(100000);

function createSchema() {
  schema().create('users', table => {
    table.increments('id');
    table.string('email').unique();
  });
  schema().create('articles', table => {
    table.string('id');
    table.string('title');
    table.primary('id');
  });
  schema().create('article_user', table => {
    table.string('article_id');
    table.foreign('article_id').references('id').on('articles');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').on('users');
  });
}

async function seedData() {
  await BelongsToManySyncTestTestUser.createQuery().create({
    'id': 1,
    'email': 'taylorotwell@gmail.com'
  });
  await BelongsToManySyncTestTestArticle.createQuery().insert([{
    'id': '7b7306ae-5a02-46fa-a84c-9538f45c7dd4',
    'title': 'uuid title'
  }, {
    'id': /*cast type string*/ PHP_INT_MAX + 1,
    'title': 'Another title'
  }, {
    'id': '1',
    'title': 'Another title'
  }]);
}

describe('test database eloquent belongs to many sync return value type', () => {
  beforeAll(() => {
    var db = new DatabaseConfig();
    db.addConnection({
      'driver': 'sqlite',
      'database': ':memory:'
    });
    db.bootEloquent();
    db.setAsGlobal();
    createSchema();
  });

  afterAll(() => {
    schema().drop('users');
    schema().drop('articles');
    schema().drop('article_user');
  })

  it('seed data', async () => {
    await BelongsToManySyncTestTestUser.createQuery().create({
      'id': 1,
      'email': 'taylorotwell@gmail.com'
    });
    await BelongsToManySyncTestTestArticle.createQuery().insert([{
      'id': '7b7306ae-5a02-46fa-a84c-9538f45c7dd4',
      'title': 'uuid title'
    }, {
      'id': /*cast type string*/ PHP_INT_MAX + 1,
      'title': 'Another title'
    }, {
      'id': '1',
      'title': 'Another title'
    }]);
  });
  it('sync return value type', () => {
    this.seedData();
    var user = BelongsToManySyncTestTestUser.query().first();
    var articleIDs = BelongsToManySyncTestTestArticle.all().pluck('id').toArray();
    var changes = user.articles().sync(articleIDs);
    collect(changes['attached']).map(id => {
      this.assertSame(gettype(id), new BelongsToManySyncTestTestArticle().getKeyType());
    });
  });
});

export class BelongsToManySyncTestTestUser extends Model {
  protected table: any = 'users';
  protected fillable: any = ['id', 'email'];
  public timestamps: any = false;

  @BelongsToManyColumn({
    related: forwardRef(() => BelongsToManySyncTestTestArticle),
    table: 'article_user',
    foreignPivotKey: 'user_id',
    relatedPivotKey: 'article_id'
  })
  public articles;
}

export class BelongsToManySyncTestTestArticle extends Model {
  protected table: any = 'articles';
  protected keyType: any = 'string';
  public incrementing: any = false;
  public timestamps: any = false;
  protected fillable: any = ['id', 'title'];
}
