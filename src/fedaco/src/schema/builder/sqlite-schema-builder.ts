/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import * as fs from 'fs';
import { SchemaBuilder } from '../schema-builder';

export class SqliteSchemaBuilder extends SchemaBuilder {
  /*Create a database in the schema.*/
  public createDatabase(name: string) {
    fs.writeFileSync(name, '');
  }

  /*Drop a database from the schema if the database exists.*/
  public dropDatabaseIfExists(name: string) {
    return fs.existsSync(name) ? fs.rmSync(name) : true;
  }

  /*Drop all tables from the database.*/
  public dropAllTables() {
    if (this.connection.getDatabaseName() !== ':memory:') {
      return this.refreshDatabaseFile();
    }
    this.connection.select(this.grammar.compileEnableWriteableSchema());
    this.connection.select(this.grammar.compileDropAllTables());
    this.connection.select(this.grammar.compileDisableWriteableSchema());
    this.connection.select(this.grammar.compileRebuild());
  }

  /*Drop all views from the database.*/
  public dropAllViews() {
    this.connection.select(this.grammar.compileEnableWriteableSchema());
    this.connection.select(this.grammar.compileDropAllViews());
    this.connection.select(this.grammar.compileDisableWriteableSchema());
    this.connection.select(this.grammar.compileRebuild());
  }

  /*Empty the database file.*/
  public refreshDatabaseFile() {
    fs.writeFileSync(this.connection.getDatabaseName(), '');
  }
}
