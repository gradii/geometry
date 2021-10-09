import { isArray } from '@gradii/check-type';
import { DatabaseConfig } from '../../src/database-config';
import { Model } from '../../src/fedaco/model';
import { SchemaBuilder } from '../../src/schema/schema-builder';
import { EloquentTestUser } from '../fedaco-integration.spec';

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
    Model.getConnectionResolver().connection().setTablePrefix('prefix_');
    await createSchema();
  });

  it('basic model hydration', async () => {
    await EloquentTestUser.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await EloquentTestUser.createQuery().create({
      'email': 'abigailotwell@gmail.com'
    });
    const models = EloquentTestUser.createQuery().fromQuery(
      'SELECT * FROM prefix_users WHERE email = ?',
      ['abigailotwell@gmail.com']);
    expect(isArray(models)).toBeTruthy();
    expect(models[0]).toBeInstanceOf(EloquentTestUser);
    expect(models[0].email).toBe('abigailotwell@gmail.com');
    expect(models).toHaveLength(1);
  });
});
