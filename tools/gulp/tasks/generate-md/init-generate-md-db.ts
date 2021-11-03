import { DatabaseConfig, Model, SchemaBuilder } from '@gradii/fedaco';

function connection(connectionName = 'default') {
  return Model.getConnectionResolver().connection(connectionName);
}

function schema(connectionName = 'default'): SchemaBuilder {
  return connection(connectionName).getSchemaBuilder();
}

export async function createGenerateMdSchema() {
  await schema().create('md-files', function (table) {
    table.increments('id');
    table.string('name').withNullable();
    table.string('path');
    table.integer('flags').withDefault(1);
  });

  await schema().create('md-statements', function (table) {
    table.increments('id');
    table.integer('user_id');
    table.integer('parent_id').withNullable();
    table.integer('order');
    table.string('name');
  });

  await schema().create('code-blocks', function (table) {
    table.increments('id');
    table.integer('statement_id');
    table.integer('parent_id').withNullable();
    table.string('name');
  });

  await schema().create('code-statements', function (table) {
    table.increments('id');
    table.string('code');
    table.string('sql')
    table.string('name');
  });

  await schema().create('expect-blocks', function (table) {
    table.increments('id');
    table.string('expect');
    table.string('predicate');
    table.string('value');
  });
}

export async function deleteSchema() {
  await schema().drop('users');
}

const db = new DatabaseConfig();
db.addConnection({
  'driver'  : 'mysql',
  'host': 'aliyun-sh.gradii.com',
  'port': '8979',
  'database': 'generate-md',
  'username': 'dev',
  'password': ''
});
db.bootFedaco();
db.setAsGlobal();