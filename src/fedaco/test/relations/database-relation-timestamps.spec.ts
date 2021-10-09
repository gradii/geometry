import { Database } from 'sqlite3';
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
  await schema().create('users', table => {
    table.increments('id');
    table.string('email').unique();
    table.timestamps();
  });
  await schema().create('users_created_at', table => {
    table.increments('id');
    table.string('email').unique();
    table.string('created_at');
  });
  await schema().create('users_updated_at', table => {
    table.increments('id');
    table.string('email').unique();
    table.string('updated_at');
  });
}

describe('test database eloquent timestamps', () => {
  beforeEach(async() => {
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.bootEloquent();
    db.setAsGlobal();
    await createSchema();
    Carbon.setTestNow(Carbon.now());
  });
  afterEach( async () => {
    await schema().drop('users');
    await schema().drop('users_created_at');
    await schema().drop('users_updated_at');
  });
  it('user with created at and updated at', () => {
    const now  = Carbon.now();
    const user = UserWithCreatedAndUpdated.create({
      'email': 'test@test.com'
    });
    expect(user.created_at.toDateTimeString()).toEqual(now.toDateTimeString());
    expect(user.updated_at.toDateTimeString()).toEqual(now.toDateTimeString());
  });
  it('user with created at', () => {
    const now  = Carbon.now();
    const user = UserWithCreated.create({
      'email': 'test@test.com'
    });
    expect(user.created_at.toDateTimeString()).toEqual(now.toDateTimeString());
  });
  it('user with updated at', () => {
    const now  = Carbon.now();
    const user = UserWithUpdated.create({
      'email': 'test@test.com'
    });
    expect(user.updated_at.toDateTimeString()).toEqual(now.toDateTimeString());
  });
});

/*Eloquent Models...*/
export class UserWithCreatedAndUpdated extends Model {
  _table: any   = 'users';
  _guarded: any = [];
}

export class UserWithCreated extends Model {
  static UPDATED_AT         = null;
  _table: any      = 'users_created_at';
  _guarded: any    = [];
  protected dateFormat: any = 'U';
}

export class UserWithUpdated extends Model {
  static CREATED_AT         = null;
  _table: any      = 'users_updated_at';
  _guarded: any    = [];
  protected dateFormat: any = 'U';
}
