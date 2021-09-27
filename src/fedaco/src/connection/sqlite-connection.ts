/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { Connection } from '../connection';
import { SqliteDriver } from '../driver/sqlite/sqlite-driver';
import { SqliteQueryGrammar } from '../query-builder/grammar/sqlite-query-grammar';
import { SqliteProcessor } from '../query-builder/processor/sqlite-processor';
import { SqliteSchemaBuilder } from '../schema/builder/sqlite-schema-builder';
import { SqliteSchemaGrammar } from '../schema/grammar/sqlite-schema-grammar';

export class SqliteConnection extends Connection {
  /*Create a new database connection instance.*/
  public constructor(pdo: PDO | Function, database: string = '', tablePrefix: string = '',
                     config: any[]                                                   = []) {
    super(pdo, database, tablePrefix, config);
    let enableForeignKeyConstraints = this.getForeignKeyConstraintsConfigurationValue();
    if (enableForeignKeyConstraints === null) {
      return;
    }
    enableForeignKeyConstraints ? this.getSchemaBuilder().enableForeignKeyConstraints() : this.getSchemaBuilder().disableForeignKeyConstraints();
  }

  /*Get the default query grammar instance.*/
  protected getDefaultQueryGrammar() {
    return this.withTablePrefix(new SqliteQueryGrammar());
  }

  /*Get a schema builder instance for the connection.*/
  public getSchemaBuilder() {
    if (isBlank(this.schemaGrammar)) {
      this.useDefaultSchemaGrammar();
    }
    return new SqliteSchemaBuilder(this);
  }

  /*Get the default schema grammar instance.*/
  protected getDefaultSchemaGrammar() {
    return this.withTablePrefix(new SqliteSchemaGrammar());
  }

  /*Get the schema state for the connection.*/
  public getSchemaState(files: Filesystem | null = null, processFactory: Function | null = null) {
    return new SqliteSchemaState(this, files, processFactory);
  }

  /*Get the default post processor instance.*/
  protected getDefaultPostProcessor() {
    return new SqliteProcessor();
  }

  /*Get the Doctrine DBAL driver.*/
  protected getDoctrineDriver() {
    return new SqliteDriver();
  }

  /*Get the database connection foreign key constraints configuration option.*/
  protected getForeignKeyConstraintsConfigurationValue() {
    return this.getConfig('foreign_key_constraints');
  }
}
