import { BelongsToColumn } from '../../src/annotation/relation-column/belongs-to.relation-column';
import { HasOneThroughColumn } from '../../src/annotation/relation-column/has-one-through.relation-column';
import { HasOneColumn } from '../../src/annotation/relation-column/has-one.relation-column';
import { DatabaseConfig } from '../../src/database-config';
import { Model } from '../../src/fedaco/model';
import { SchemaBuilder } from '../../src/schema/schema-builder';

function connection(connectionName = 'default') {
  return Model.getConnectionResolver().connection(connectionName);
}

function schema(connectionName = 'default'): SchemaBuilder {
  return connection(connectionName).getSchemaBuilder();
}

jest.setTimeout(100000);

async function createSchema() {
  await schema().create('users', table => {
    table.increments('id');
    table.string('email').unique();
    table.unsignedInteger('position_id').unique().nullable();
    table.string('position_short');
    table.timestamps();
    table.softDeletes();
  });
  await schema().create('contracts', table => {
    table.increments('id');
    table.integer('user_id').unique();
    table.string('title');
    table.text('body');
    table.string('email');
    table.timestamps();
  });
  await schema().create('positions', table => {
    table.increments('id');
    table.string('name');
    table.string('shortname');
    table.timestamps();
  });
}

describe('test database eloquent has one through integration', () => {
  beforeEach(async () => {
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.bootEloquent();
    db.setAsGlobal();
    await createSchema();
  });

  it('tear down', async () => {
    await schema().drop('users');
    await schema().drop('contracts');
    await schema().drop('positions');
  });
  it('it loads a has one through relation with custom keys', async () => {
    await seedData();
    const contract = (await HasOneThroughTestPosition.createQuery().first()).contract;
    expect(contract.title).toBe('A title');
  });
  it('it loads a default has one through relation', async () => {
    await migrateDefault();
    await seedDefaultData();
    const contract = (await HasOneThroughDefaultTestPosition.createQuery().first()).contract;
    expect(contract.title).toBe('A title');
    expect('email' in contract.getAttributes()).not.toBeTruthy();
    await resetDefault();
  });
  it('it loads a relation with custom intermediate and local key', async () => {
    await seedData();
    const contract = HasOneThroughIntermediateTestPosition.first().contract;
    expect(contract.title).toBe('A title');
  });
  it('eager loading a relation with custom intermediate and local key', async () => {
    await seedData();
    const contract = HasOneThroughIntermediateTestPosition._with('contract').first().contract;
    expect(contract.title).toBe('A title');
  });
  it('where has on a relation with custom intermediate and local key', async () => {
    await seedData();
    const position = HasOneThroughIntermediateTestPosition.whereHas('contract', query => {
      query.where('title', 'A title');
    }).get();
    expect(position).toHaveLength(1);
  });
  it('first or fail throws an exception', () => {
    this.expectException(ModelNotFoundException);
    this.expectExceptionMessage(
      'No query results for model [Illuminate\\Tests\\Database\\HasOneThroughTestContract].');
    HasOneThroughTestPosition.create({
      'id'       : 1,
      'name'     : 'President',
      'shortname': 'ps'
    }).user().create({
      'id'            : 1,
      'email'         : 'taylorotwell@gmail.com',
      'position_short': 'ps'
    });
    HasOneThroughTestPosition.first().contract().firstOrFail();
  });
  it('find or fail throws an exception', () => {
    this.expectException(ModelNotFoundException);
    HasOneThroughTestPosition.create({
      'id'       : 1,
      'name'     : 'President',
      'shortname': 'ps'
    }).user().create({
      'id'            : 1,
      'email'         : 'taylorotwell@gmail.com',
      'position_short': 'ps'
    });
    HasOneThroughTestPosition.first().contract().findOrFail(1);
  });
  it('first retrieves first record', () => {
    this.seedData();
    const contract = HasOneThroughTestPosition.first().contract().first();
    expect(contract).toNotNull();
    expect(contract.title).toBe('A title');
  });
  it('all columns are retrieved by default', () => {
    this.seedData();
    const contract = HasOneThroughTestPosition.first().contract().first();
    expect(array_keys(contract.getAttributes())).toEqual(
      [
        'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at', 'laravel_through_key'
      ]);
  });
  it('only proper columns are selected if provided', () => {
    this.seedData();
    const contract = HasOneThroughTestPosition.first().contract().first(['title', 'body']);
    expect(array_keys(contract.getAttributes())).toEqual(['title', 'body', 'laravel_through_key']);
  });
  it('chunk returns correct models', () => {
    this.seedData();
    this.seedDataExtended();
    const position = HasOneThroughTestPosition.find(1);
    position.contract().chunk(10, contractsChunk => {
      const contract = contractsChunk.first();
      this.assertEquals([
          'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at', 'laravel_through_key'
        ],
        array_keys(contract.getAttributes()));
    });
  });
  it('cursor returns correct models', () => {
    this.seedData();
    this.seedDataExtended();
    const position  = HasOneThroughTestPosition.find(1);
    const contracts = position.contract().cursor();
    for (const contract of contracts) {
      expect(array_keys(contract.getAttributes())).toEqual(
        [
          'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at',
          'laravel_through_key'
        ]);
    }
  });
  it('each returns correct models', () => {
    this.seedData();
    this.seedDataExtended();
    const position = HasOneThroughTestPosition.find(1);
    position.contract().each(contract => {
      this.assertEquals([
          'id', 'user_id', 'title', 'body', 'email', 'created_at', 'updated_at', 'laravel_through_key'
        ],
        array_keys(contract.getAttributes()));
    });
  });
  it('intermediate soft deletes are ignored', async () => {
    await seedData();
    await (await HasOneThroughSoftDeletesTestUser.createQuery().first()).delete();
    const contract = HasOneThroughSoftDeletesTestPosition.first().contract;
    expect(contract.title).toBe('A title');
  });
  it('eager loading loads related models correctly', async () => {
    await seedData();
    const position = HasOneThroughSoftDeletesTestPosition.createQuery()
      .with('contract')
      .first();
    expect(position.shortname).toBe('ps');
    expect(position.contract.title).toBe('A title');
  });

  async function seedData() {
    const position = await HasOneThroughTestPosition.createQuery().create({
      'id'       : 1,
      'name'     : 'President',
      'shortname': 'ps'
    });
    const user     = await position.newRelation('user').create({
      'id'            : 1,
      'email'         : 'taylorotwell@gmail.com',
      'position_short': 'ps'
    });
    await user.newRelation('contract').create({
      'title': 'A title',
      'body' : 'A body',
      'email': 'taylorotwell@gmail.com'
    });
  }

  async function seedDataExtended() {
    const position = await HasOneThroughTestPosition.createQuery().create({
      'id'       : 2,
      'name'     : 'Vice President',
      'shortname': 'vp'
    });
    const user     = await position.newRelation('user').create({
      'id'            : 2,
      'email'         : 'example1@gmail.com',
      'position_short': 'vp'
    });
    await user.newRelation('contract').create({
      'title': 'Example1 title1',
      'body' : 'Example1 body1',
      'email': 'example1contract1@gmail.com'
    });
  }

  async function seedDefaultData() {
    const position = await HasOneThroughDefaultTestPosition.createQuery().create({
      'id'  : 1,
      'name': 'President'
    });
    const user     = await position.newRelation('user').create({
      'id'   : 1,
      'email': 'taylorotwell@gmail.com'
    });
    await user.newRelation('contract').create({
      'title': 'A title',
      'body' : 'A body'
    });
  }

  async function resetDefault() {
    await schema().drop('users_default');
    await schema().drop('contracts_default');
    await schema().drop('positions_default');
  }

  async function migrateDefault() {
    await schema().create('users_default', table => {
      table.increments('id');
      table.string('email').unique();
      table.unsignedInteger('has_one_through_default_test_position_id').unique().nullable();
      table.timestamps();
    });
    await schema().create('contracts_default', table => {
      table.increments('id');
      table.integer('has_one_through_default_test_user_id').unique();
      table.string('title');
      table.text('body');
      table.timestamps();
    });
    await schema().create('positions_default', table => {
      table.increments('id');
      table.string('name');
      table.timestamps();
    });
  }
});

/*Eloquent Models...*/
export class HasOneThroughTestUser extends Model {
  _table: any   = 'users';
  _guarded: any = [];

  public contract() {
    return this.hasOne(HasOneThroughTestContract, 'user_id');
  }
}

/*Eloquent Models...*/
export class HasOneThroughTestContract extends Model {
  _table: any   = 'contracts';
  _guarded: any = [];

  public owner() {
    return this.belongsTo(HasOneThroughTestUser, 'user_id');
  }
}

export class HasOneThroughTestPosition extends Model {
  _table: any   = 'positions';
  _guarded: any = [];

  public contract() {
    return this.hasOneThrough(HasOneThroughTestContract, HasOneThroughTestUser, 'position_id',
      'user_id');
  }

  public user() {
    return this.hasOne(HasOneThroughTestUser, 'position_id');
  }
}

/*Eloquent Models...*/
export class HasOneThroughDefaultTestUser extends Model {
  _table: any   = 'users_default';
  _guarded: any = [];

  public contract() {
    return this.hasOne(HasOneThroughDefaultTestContract);
  }
}

/*Eloquent Models...*/
export class HasOneThroughDefaultTestContract extends Model {
  _table: any   = 'contracts_default';
  _guarded: any = [];

  public owner() {
    return this.belongsTo(HasOneThroughDefaultTestUser);
  }
}

export class HasOneThroughDefaultTestPosition extends Model {
  _table: any   = 'positions_default';
  _guarded: any = [];

  public contract() {
    return this.hasOneThrough(HasOneThroughDefaultTestContract, HasOneThroughDefaultTestUser);
  }

  public user() {
    return this.hasOne(HasOneThroughDefaultTestUser);
  }
}

export class HasOneThroughIntermediateTestPosition extends Model {
  _table: any   = 'positions';
  _guarded: any = [];

  public contract() {
    return this.hasOneThrough(HasOneThroughTestContract, HasOneThroughTestUser, 'position_short',
      'email', 'shortname',
      'email');
  }

  public user() {
    return this.hasOne(HasOneThroughTestUser, 'position_id');
  }
}

export class HasOneThroughSoftDeletesTestUser extends Model {
  _table: any   = 'users';
  _guarded: any = [];

  @HasOneColumn({
    related   : HasOneThroughSoftDeletesTestContract,
    foreignKey: 'user_id'
  })
  public contract;
}

/*Eloquent Models...*/
export class HasOneThroughSoftDeletesTestContract extends Model {
  _table: any   = 'contracts';
  _guarded: any = [];

  @BelongsToColumn({
    related   : HasOneThroughSoftDeletesTestUser,
    foreignKey: 'user_id'
  })
  public owner;
}

export class HasOneThroughSoftDeletesTestPosition extends Model {
  _table: any   = 'positions';
  _guarded: any = [];

  @HasOneThroughColumn({
    related  : HasOneThroughSoftDeletesTestContract,
    through  : HasOneThroughTestUser,
    firstKey : 'position_id',
    secondKey: 'user_id'
  })
  public contract;

  @HasOneColumn({
    related   : HasOneThroughSoftDeletesTestUser,
    foreignKey: 'position_id'
  })
  public user;
}
