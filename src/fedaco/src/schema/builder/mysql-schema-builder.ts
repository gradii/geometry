/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { SchemaBuilder } from '../schema-builder';

export class MysqlSchemaBuilder extends SchemaBuilder {
  /*Create a database in the schema.*/
  public createDatabase(name: string) {
    return this.connection.statement(this.grammar.compileCreateDatabase(name, this.connection));
  }

  /*Drop a database from the schema if the database exists.*/
  public dropDatabaseIfExists(name: string) {
    return this.connection.statement(this.grammar.compileDropDatabaseIfExists(name));
  }

  /*Determine if the given table exists.*/
  public hasTable(table: string) {
    table = this.connection.getTablePrefix() + table;
    return (this.connection.select(this.grammar.compileTableExists(),
      [this.connection.getDatabaseName(), table])).length > 0;
  }

  /*Get the column listing for a given table.*/
  public getColumnListing(table: string) {
    table   = this.connection.getTablePrefix() + table;
    const results = this.connection.select(this.grammar.compileColumnListing(),
      [this.connection.getDatabaseName(), table]);
    return this.connection.getPostProcessor().processColumnListing(results);
  }

  /*Drop all tables from the database.*/
  public dropAllTables() {
    const tables = [];
    for (const row of this.getAllTables()) {
      tables.push(row);
    }
    if (!tables.length) {
      return;
    }
    this.disableForeignKeyConstraints();
    this.connection.statement(this.grammar.compileDropAllTables(tables));
    this.enableForeignKeyConstraints();
  }

  /*Drop all views from the database.*/
  public dropAllViews() {
    const views = [];
    for (const row of this.getAllViews()) {
      views.push(row);
    }
    if (!views.length) {
      return;
    }
    this.connection.statement(this.grammar.compileDropAllViews(views));
  }

  /*Get all of the table names for the database.*/
  public getAllTables() {
    return this.connection.select(this.grammar.compileGetAllTables());
  }

  /*Get all of the view names for the database.*/
  public getAllViews() {
    return this.connection.select(this.grammar.compileGetAllViews());
  }
}
