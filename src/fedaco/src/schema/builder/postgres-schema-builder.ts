/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { isString } from '@gradii/check-type';
import { SchemaBuilder } from '../schema-builder';

export class PostgresSchemaBuilder extends SchemaBuilder {
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
    let database, schema;
    [database, schema, table] = this.parseSchemaAndTable(table);
    table                     = this.connection.getTablePrefix() + table;
    return this.connection.select(
      this.grammar.compileTableExists(),
      [database, schema, table]).length > 0;
  }

  /*Drop all tables from the database.*/
  public dropAllTables() {
    const tables         = [];
    const excludedTables = this.connection.getConfig('dont_drop') ?? ['spatial_ref_sys'];
    for (const row of this.getAllTables()) {
      const table = row;
      if (!excludedTables.includes(table)) {
        tables.push(table);
      }
    }
    if (!tables.length) {
      return;
    }
    this.connection.statement(this.grammar.compileDropAllTables(tables));
  }

  /*Drop all views from the database.*/
  public dropAllViews() {
    const views = [];
    for (const row of this.getAllViews()) {
      const row = /*cast type array*/ row;
      views.push(reset(row));
    }
    if (!views.length) {
      return;
    }
    this.connection.statement(this.grammar.compileDropAllViews(views));
  }

  /*Drop all types from the database.*/
  public dropAllTypes() {
    const types = [];
    for (const row of this.getAllTypes()) {
      const row = /*cast type array*/ row;
      types.push(reset(row));
    }
    if (empty(types)) {
      return;
    }
    this.connection.statement(this.grammar.compileDropAllTypes(types));
  }

  /*Get all of the table names for the database.*/
  public getAllTables() {
    return this.connection.select(this.grammar.compileGetAllTables(
      this.parseSearchPath(this.connection.getConfig('search_path'))));
  }

  /*Get all of the view names for the database.*/
  public getAllViews() {
    return this.connection.select(this.grammar.compileGetAllViews(
      this.parseSearchPath(this.connection.getConfig('search_path'))));
  }

  /*Get all of the type names for the database.*/
  public getAllTypes() {
    return this.connection.select(this.grammar.compileGetAllTypes());
  }

  /*Get the column listing for a given table.*/
  public getColumnListing(table: string) {
    const [database, schema, table] = this.parseSchemaAndTable(table);
    const table                       = this.connection.getTablePrefix() + table;
    const results                     = this.connection.select(this.grammar.compileColumnListing(),
      [database, schema, table]);
    return this.connection.getPostProcessor().processColumnListing(results);
  }

  /*Parse the database object reference and extract the database, schema, and table.*/
  protected parseSchemaAndTable(reference: string) {
    const searchPath = this.parseSearchPath(this.connection.getConfig('search_path') || 'public');
    const parts      = reference.split('.');
    const database   = this.connection.getConfig('database');
    if (count(parts) === 3) {
      const database = parts[0];
      array_shift(parts);
    }
    const schema = searchPath[0] === '$user' ? this.connection.getConfig('username') : searchPath[0];
    if (count(parts) === 2) {
      const schema = parts[0];
      array_shift(parts);
    }
    return [database, schema, parts[0]];
  }

  /*Parse the "search_path" value into an array.*/
  protected parseSearchPath(searchPath: string | any[]) {
    if (isString(searchPath)) {
      preg_match_all('/[a-zA-z0-9$]{1,}/i', searchPath, matches);
      const searchPath = matches[0];
    }
    array_walk(searchPath, schema => {
      let schema = trim(schema, '\'"');
      const schema = schema === '$user' ? this.connection.getConfig('username') : schema;
    });
    return searchPath;
  }
}
