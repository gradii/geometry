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
 await schema('default').create('users', table => {
    table.increments('id');
    table.string('email');
    table.timestamps();
  });
  await schema('default').create('friends', table => {
    table.integer('user_id');
    table.integer('friend_id');
  });
  await schema('default').create('posts', table => {
    table.increments('id');
    table.integer('user_id');
    table.integer('parent_id').nullable();
    table.string('name');
    table.timestamps();
  });
  await schema('default').create('photos', table => {
    table.increments('id');
    table.morphs('imageable');
    table.string('name');
    table.timestamps();
  });
}

describe('test database eloquent integration with table prefix', () => {
  beforeEach(async () => {
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.bootEloquent();
    db.setAsGlobal();
    Eloquent.getConnectionResolver().connection().setTablePrefix('prefix_');
    await createSchema();
  });
  it('create schema', () => {

  });
  it('tear down', () => {
    [].forEach((connection, index) => {
    });
    Relation.morphMap([], false);
  });
  it('basic model hydration', () => {
    EloquentTestUser.create({
      'email': 'taylorotwell@gmail.com'
    });
    EloquentTestUser.create({
      'email': 'abigailotwell@gmail.com'
    });
    const models = EloquentTestUser.fromQuery('SELECT * FROM prefix_users WHERE email = ?',
      ['abigailotwell@gmail.com']);
    expect(models).toInstanceOf(Collection);
    expect(models[0]).toInstanceOf(EloquentTestUser);
    expect(models[0].email).toBe('abigailotwell@gmail.com');
    expect(models).toCount(1);
  });
  it('connection', () => {
    return Eloquent.getConnectionResolver().connection(connection);
  });
  it('schema', () => {
    return this.connection(connection).getSchemaBuilder();
  });
});
