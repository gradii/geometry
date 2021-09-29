/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { tap } from 'ramda';
import { Connection } from '../connection';
import { Blueprint } from './blueprint';
import { SchemaGrammar } from './grammar/schema-grammar';

export class SchemaBuilder {
  /*The database connection instance.*/
  protected connection: Connection;
  /*The schema grammar instance.*/
  protected grammar: SchemaGrammar;
  /*The Blueprint resolver callback.*/
  protected resolver: Function;
  /*The default string length for migrations.*/
  public static _defaultStringLength: number = 255;
  /*The default relationship morph key type.*/
  public static _defaultMorphKeyType: string = 'int';

  /*Create a new database Schema manager.*/
  public constructor(connection: Connection) {
    this.connection = connection;
    this.grammar    = connection.getSchemaGrammar();
  }

  /*Set the default string length for migrations.*/
  public static defaultStringLength(length: number) {
    this._defaultStringLength = length;
  }

  /*Set the default morph key type for migrations.*/
  public static defaultMorphKeyType(type: string) {
    if (!['int', 'uuid'].includes(type)) {
      throw new Error(`InvalidArgumentException Morph key type must be 'int' or 'uuid'.`);
    }
    this._defaultMorphKeyType = type;
  }

  /*Set the default morph key type for migrations to UUIDs.*/
  public static morphUsingUuids() {
    return this.defaultMorphKeyType('uuid');
  }

  /*Create a database in the schema.*/
  public createDatabase(name: string) {
    throw new Error('LogicException This database driver does not support creating databases.');
  }

  /*Drop a database from the schema if the database exists.*/
  public dropDatabaseIfExists(name: string) {
    throw new Error('LogicException This database driver does not support dropping databases.');
  }

  /*Determine if the given table exists.*/
  public async hasTable(table: string) {
    table        = this.connection.getTablePrefix() + table;
    const result = await this.connection.selectFromWriteConnection(
      this.grammar.compileTableExists(), [table]
    );
    return result.length > 0;
  }

  /*Determine if the given table has a given column.*/
  public async hasColumn(table: string, column: string) {
    const result = await this.getColumnListing(table);
    return result.map(it => it.toLowerCase()).includes(column.toLowerCase());
  }

  /*Determine if the given table has given columns.*/
  public async hasColumns(table: string, columns: any[]) {
    const result       = await this.getColumnListing(table);
    const tableColumns = result.map(it => it.toLowerCase());
    for (const column of columns) {
      if (!tableColumns.includes(column.toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  /*Get the data type for the given column name.*/
  public async getColumnType(table: string, column: string) {
    table        = this.connection.getTablePrefix() + table;
    const result = await this.connection.getDoctrineColumn(table, column);
    return result.getType().getName();
  }

  /*Get the column listing for a given table.*/
  public async getColumnListing(table: string): Promise<string[]> {
    const results = await this.connection.selectFromWriteConnection(
      this.grammar.compileColumnListing(this.connection.getTablePrefix() + table)
    );
    return this.connection.getPostProcessor().processColumnListing(results);
  }

  /*Modify a table on the schema.*/
  public table(table: string, callback: Function) {
    this.build(this.createBlueprint(table, callback));
  }

  /*Create a new table on the schema.*/
  public create(table: string, callback: Function) {
    this.build(tap(blueprint => {
      blueprint.create();
      callback(blueprint);
    }, this.createBlueprint(table)));
  }

  /*Drop a table from the schema.*/
  public drop(table: string) {
    this.build(tap(blueprint => {
      blueprint.drop();
    }, this.createBlueprint(table)));
  }

  /*Drop a table from the schema if it exists.*/
  public dropIfExists(table: string) {
    this.build(tap(blueprint => {
      blueprint.dropIfExists();
    }, this.createBlueprint(table)));
  }

  /*Drop columns from a table schema.*/
  public dropColumns(table: string, columns: string | any[]) {
    this.table(table, (blueprint: Blueprint) => {
      blueprint.dropColumn(columns);
    });
  }

  /*Drop all tables from the database.*/
  public dropAllTables() {
    throw new Error('LogicException This database driver does not support dropping all tables.');
  }

  /*Drop all views from the database.*/
  public dropAllViews() {
    throw new Error('LogicException This database driver does not support dropping all views.');
  }

  /*Drop all types from the database.*/
  public dropAllTypes() {
    throw new Error('LogicException This database driver does not support dropping all types.');
  }

  /*Get all of the table names for the database.*/
  public getAllTables() {
    throw new Error('LogicException This database driver does not support getting all tables.');
  }

  /*Rename a table on the schema.*/
  public rename(from: string, to: string) {
    this.build(
      tap((blueprint: Blueprint) => {
        blueprint.rename(to);
      }, this.createBlueprint(from))
    );
  }

  /*Enable foreign key constraints.*/
  public async enableForeignKeyConstraints() {
    return this.connection.statement(this.grammar.compileEnableForeignKeyConstraints());
  }

  /*Disable foreign key constraints.*/
  public disableForeignKeyConstraints() {
    return this.connection.statement(this.grammar.compileDisableForeignKeyConstraints());
  }

  /*Execute the blueprint to build / modify the table.*/
  protected build(blueprint: Blueprint) {
    blueprint.build(this.connection, this.grammar);
  }

  /*Create a new command set with a Closure.*/
  protected createBlueprint(table: string, callback: Function | null = null) {
    const prefix = this.connection.getConfig('prefix_indexes') ?
      this.connection.getConfig('prefix') : '';
    if (this.resolver !== undefined) {
      return this.resolver(table, callback, prefix);
    }
    return new Blueprint(table, callback, prefix);
  }

  /*Register a custom Doctrine mapping type.*/
  public registerCustomDoctrineType(clazz: string, name: string, type: string) {
    // if (!this.connection.isDoctrineAvailable()) {
    //   throw new Error(
    //     'RuntimeException Registering a custom Doctrine type requires Doctrine DBAL (doctrine/dbal).');
    // }
    // if (!Type.hasType(name)) {
    //   Type.addType(name, clazz);
    //   this.connection.getDoctrineSchemaManager().getDatabasePlatform().registerDoctrineTypeMapping(
    //     type, name);
    // }
  }

  /*Get the database connection instance.*/
  public getConnection() {
    return this.connection;
  }

  /*Set the database connection instance.*/
  public setConnection(connection: Connection) {
    this.connection = connection;
    return this;
  }

  /*Set the Schema Blueprint resolver callback.*/
  public blueprintResolver(resolver: Function) {
    this.resolver = resolver;
  }
}
