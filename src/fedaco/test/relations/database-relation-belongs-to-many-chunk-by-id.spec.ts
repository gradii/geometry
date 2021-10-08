import { BelongsToManyColumn } from '../../src/annotation/relation-column/belongs-to-many.relation-column';
import { Model } from '../../src/fedaco/model';
import { forwardRef } from '../../src/query-builder/forward-ref';
import { SchemaBuilder } from '../../src/schema/schema-builder';
import { DatabaseConfig } from '../../src/databaseConfig';

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
    table.increments('aid');
    table.string('title');
  });
  schema().create('article_user', table => {
    table.integer('article_id').unsigned();
    table.foreign('article_id').references('aid').on('articles');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').on('users');
  });
}

async function seedData() {
  const user = await BelongsToManyChunkByIdTestTestUser.createQuery().create({
    'id': 1,
    'email': 'taylorotwell@gmail.com'
  });
  await BelongsToManyChunkByIdTestTestArticle.createQuery().insert([{
    'aid': 1,
    'title': 'Another title'
  }, {
    'aid': 2,
    'title': 'Another title'
  }, {
    'aid': 3,
    'title': 'Another title'
  }]);
  user.articles().sync([3, 1, 2]);
}

describe('test database eloquent belongs to many chunk by id', () => {
  beforeAll(() => {
    const db = new DatabaseConfig();
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

  it('belongs to chunk by id', async () => {

    const user = await BelongsToManyChunkByIdTestTestUser.createQuery().first();
    let i = 0;
    user.getRelationMethod('articles').chunkById(1, collection => {
      i++;
      expect(collection.first().aid).toBe(i)
    });
    expect(i).toEqual(3);
  });
});

export class BelongsToManyChunkByIdTestTestUser extends Model {
  protected table: any = 'users';
  protected fillable: any = ['id', 'email'];
  public timestamps: any = false;

  @BelongsToManyColumn({
    related: forwardRef(() => BelongsToManyChunkByIdTestTestArticle),
    table: 'article_user',
    foreignPivotKey: 'user_id',
    relatedPivotKey: 'article_id'
  })
  public articles;
}

export class BelongsToManyChunkByIdTestTestArticle extends Model {
  _primaryKey: any = 'aid';
  _table: any = 'articles';
  _keyType: any = 'string';
  public incrementing: any = false;
  public timestamps: any = false;
  protected fillable: any = ['aid', 'title'];
}
