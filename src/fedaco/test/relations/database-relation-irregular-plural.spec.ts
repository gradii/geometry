import { SchemaBuilder } from '../../src/schema/schema-builder';
import { Model } from '../../src/fedaco/model';
import { DatabaseConfig } from '../../src/database-config';
import { MorphedByManyColumn } from '../../src/annotation/relation-column/morphed-by-many.relation-column';
import { MorphToManyColumn } from '../../src/annotation/relation-column/morph-to-many.relation-column';
import { BelongsToManyColumn } from '../../src/annotation/relation-column/belongs-to-many.relation-column';
import { forwardRef } from '../../src/query-builder/forward-ref';

function connection(connectionName = 'default') {
  return Model.getConnectionResolver().connection(connectionName);
}

function schema(connectionName = 'default'): SchemaBuilder {
  return connection(connectionName).getSchemaBuilder();
}

jest.setTimeout(100000);

async function createSchema() {
  await schema().create('irregular_plural_humans', table => {
    table.increments('id');
    table.string('email').withUnique();
    table.timestamps();
  });
  await schema().create('irregular_plural_tokens', table => {
    table.increments('id');
    table.string('title');
  });
  await schema().create('irregular_plural_human_irregular_plural_token', table => {
    table.integer('irregular_plural_human_id').withUnsigned();
    table.integer('irregular_plural_token_id').withUnsigned();
  });
  await schema().create('irregular_plural_mottos', table => {
    table.increments('id');
    table.string('name');
  });
  await schema().create('cool_mottos', table => {
    table.integer('irregular_plural_motto_id');
    table.integer('cool_motto_id');
    table.string('cool_motto_type');
  });
}

describe('test database fedaco irregular plural', () => {
  beforeEach(async () => {
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.bootFedaco();
    db.setAsGlobal();
    await createSchema();
  });

  afterEach(async () => {
    await schema().drop('irregular_plural_tokens');
    await schema().drop('irregular_plural_humans');
    await schema().drop('irregular_plural_human_irregular_plural_token');
  });

  it('it pluralizes the table name', async () => {
    const model = new IrregularPluralHuman();
    expect(model.getTable()).toBe('irregular_plural_humans');
  });

  it('it touches the parent with an irregular plural', async () => {
    // Carbon.setTestNow('2018-05-01 12:13:14');

    await IrregularPluralHuman.createQuery().create({
      'email': 'taylorotwell@gmail.com'
    });
    await IrregularPluralToken.createQuery().insert([
      {
        'title': 'The title'
      }
    ]);
    const human    = await IrregularPluralHuman.createQuery().first();
    const tokenIds = await IrregularPluralToken.createQuery().pluck('id');
    // Carbon.setTestNow('2018-05-01 15:16:17');
    await human.newRelation('irregularPluralTokens').sync(tokenIds);
    await human.refresh();
    expect(/*cast type string*/ human.created_at).toBe('2018-05-01 12:13:14');
    expect(/*cast type string*/ human.updated_at).toBe('2018-05-01 15:16:17');
  });

  it('it pluralizes morph to many relationships', async () => {
    const human = await IrregularPluralHuman.createQuery().create({
      'email': 'bobby@example.com'
    });
    await human.newRelation('mottoes').create({
      'name': 'Real eyes realize real lies'
    });
    const motto = await IrregularPluralMotto.createQuery().first();
    expect(motto.name).toBe('Real eyes realize real lies');
  });
});

export class IrregularPluralHuman extends Model {
  _guarded: any = [];

  @BelongsToManyColumn({
    related        : forwardRef(() => IrregularPluralToken),
    table          : 'irregular_plural_human_irregular_plural_token',
    foreignPivotKey: 'irregular_plural_token_id',
    relatedPivotKey: 'irregular_plural_human_id'
  })
  public irregularPluralTokens;

  @MorphToManyColumn({
    related: forwardRef(() => IrregularPluralMotto),
    name   : 'cool_motto'
  })
  public mottoes;
}

export class IrregularPluralToken extends Model {
  _guarded: any          = [];
  public timestamps: any = false;
  touches: any           = ['irregularPluralHumans'];
}

export class IrregularPluralMotto extends Model {
  _guarded: any          = [];
  public timestamps: any = false;

  @MorphedByManyColumn({
    related: IrregularPluralHuman,
    name   : 'cool_motto'
  })
  public irregularPluralHumans;
}
