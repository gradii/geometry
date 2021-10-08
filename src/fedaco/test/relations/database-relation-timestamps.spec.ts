import { Manager as DB } from 'Illuminate/Database/Capsule/Manager';
import { Model as Eloquent } from 'Illuminate/Database/Eloquent/Model';
import { Carbon } from 'Illuminate/Support/Carbon';
import { TestCase } from 'PHPUnit/Framework/TestCase';

describe('test database eloquent timestamps', () => {
  it('set up', () => {
    var db = new DB();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.bootEloquent();
    db.setAsGlobal();
    this.createSchema();
    Carbon.setTestNow(Carbon.now());
  });
  it('create schema', () => {
    this.schema().create('users', table => {
      table.increments('id');
      table.string('email').unique();
      table.timestamps();
    });
    this.schema().create('users_created_at', table => {
      table.increments('id');
      table.string('email').unique();
      table.string('created_at');
    });
    this.schema().create('users_updated_at', table => {
      table.increments('id');
      table.string('email').unique();
      table.string('updated_at');
    });
  });
  it('tear down', () => {
    this.schema().drop('users');
    this.schema().drop('users_created_at');
    this.schema().drop('users_updated_at');
  });
  it('user with created at and updated at', () => {
    var now  = Carbon.now();
    var user = UserWithCreatedAndUpdated.create({
      'email': 'test@test.com'
    });
    expect(user.created_at.toDateTimeString()).toEqual(now.toDateTimeString());
    expect(user.updated_at.toDateTimeString()).toEqual(now.toDateTimeString());
  });
  it('user with created at', () => {
    var now  = Carbon.now();
    var user = UserWithCreated.create({
      'email': 'test@test.com'
    });
    expect(user.created_at.toDateTimeString()).toEqual(now.toDateTimeString());
  });
  it('user with updated at', () => {
    var now  = Carbon.now();
    var user = UserWithUpdated.create({
      'email': 'test@test.com'
    });
    expect(user.updated_at.toDateTimeString()).toEqual(now.toDateTimeString());
  });
  it('connection', () => {
    return Eloquent.getConnectionResolver().connection();
  });
  it('schema', () => {
    return this.connection().getSchemaBuilder();
  });
});

/*Eloquent Models...*/
export class UserWithCreatedAndUpdated extends Eloquent {
  protected table: any   = 'users';
  protected guarded: any = [];
}

export class UserWithCreated extends Eloquent {
  static UPDATED_AT         = null;
  protected table: any      = 'users_created_at';
  protected guarded: any    = [];
  protected dateFormat: any = 'U';
}

export class UserWithUpdated extends Eloquent {
  static CREATED_AT         = null;
  protected table: any      = 'users_updated_at';
  protected guarded: any    = [];
  protected dateFormat: any = 'U';
}
