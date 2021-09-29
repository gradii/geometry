/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank, isBoolean } from '@gradii/check-type';
import { BaseGrammar } from '../../base-grammar';
import { Connection } from '../../connection';
import { SchemaManager } from '../../dbal/schema-manager';
import { upperCaseFirst } from '../../helper/str';
import { RawExpression } from '../../query/ast/expression/raw-expression';
import { Blueprint } from '../blueprint';
import { ColumnDefinition } from '../column-definition';
import { ForeignKeyDefinition } from '../foreign-key-definition';
// import { ChangeColumn } from './change-column';
// import { RenameColumn } from './rename-column';

export class SchemaGrammar extends BaseGrammar {

  protected modifiers: string[];

  /*If this Grammar supports schema changes wrapped in a transaction.*/
  protected transactions: boolean = false;
  /**
   * The commands to be executed outside of create or alter command.
   */
  protected fluentCommands: string[] = [];

  /*The commands to be executed outside of create or alter command.*/
  protected ColumnDefinitionCommands: any[] = [];

  /*Compile a create database command.*/
  public compileCreateDatabase(name: string, connection: Connection): string {
    throw new Error('LogicException This database driver does not support creating databases.');
  }

  /*Compile a drop database if exists command.*/
  public compileDropDatabaseIfExists(name: string): string {
    throw new Error('LogicException This database driver does not support dropping databases.');
  }

  public compileEnableForeignKeyConstraints(): string {
    throw new Error(
      'LogicException This database driver does not support enable foreign key constraints.');
  }

  public compileDisableForeignKeyConstraints(): string {
    throw new Error(
      'LogicException This database driver does not support disable foreign key constraints.');
  }

  public compileColumnListing(table?: string): string {
    throw new Error('not implement');
  }

  public compileTableExists(): string {
    throw new Error('not implement');
  }

  public compileEnableWriteableSchema(): string {
    throw new Error('not implement');
  }

  public compileDisableWriteableSchema(): string {
    throw new Error('not implement');
  }

  public compileRebuild(): string {
    throw new Error('not implement');
  }

  public compileDropAllForeignKeys(): string {
    throw new Error('not implement');
  }

  public compileDropAllTables(tables?: string[]): string {
    throw new Error('not implement');
  }

  public compileDropAllViews(views?: string[]): string {
    throw new Error('not implement');
  }

  public compileGetAllTables(...args: any[]): string {
    throw new Error('not implement');
  }

  public compileGetAllViews(...args: any[]): string {
    throw new Error('not implement');
  }

  public compileDropAllTypes(...args: any[]): string {
    throw new Error('not implement');
  }

  public compileGetAllTypes(): string {
    throw new Error('not implement');
  }

  /*Compile a rename column command.*/
  public compileRenameColumn(blueprint: Blueprint, command: ColumnDefinition,
                             connection: Connection) {
    // return RenameColumn.compile(this, blueprint, command, connection);
  }

  /*Compile a change column command into a series of SQL statements.*/
  public compileChange(blueprint: Blueprint, command: ColumnDefinition, connection: Connection) {
    // return ChangeColumn.compile(this, blueprint, command, connection);
  }

  /*Compile a foreign key command.*/
  public compileForeign(blueprint: Blueprint, command: ForeignKeyDefinition) {
    let sql = `alter table ${this.wrapTable(blueprint)}
      add constraint ${this.wrap(command.index)} `;
    sql += `foreign key (${this.columnize(command.columns)}) references ${this.wrapTable(
      command.on)} (${this.columnize(/*cast type array*/ command.references)})`;
    if (!isBlank(command.onDelete)) {
      sql += ` on delete ${command.onDelete}`;
    }
    if (!isBlank(command.onUpdate)) {
      sql += ` on update ${command.onUpdate}`;
    }
    return sql;
  }

  /*Compile the blueprint's column definitions.*/
  protected getColumns(blueprint: Blueprint) {
    const columns = [];
    for (const column of blueprint.getAddedColumns()) {
      // todo check me
      const sql = this.wrap(column.name) + ' ' + this.getType(column);
      columns.push(this.addModifiers(sql, blueprint, column));
    }
    return columns;
  }

  /*Get the SQL for the column data type.*/
  protected getType(column: ColumnDefinition) {
    // @ts-ignore
    return this['type' + upperCaseFirst(column.type)](column);
  }

  /*Create the column definition for a generated, computed column type.*/
  protected typeComputed(column: ColumnDefinition) {
    throw new Error('RuntimeException This database driver does not support the computed type.');
  }

  /*Add the column modifiers to the definition.*/
  protected addModifiers(sql: string, blueprint: Blueprint, column: ColumnDefinition) {
    for (const modifier of this.modifiers) {
      const method = `modify${modifier}`;
      if (method in this) {
        // @ts-ignore
        sql += this[method](blueprint, column);
      }
    }
    return sql;
  }

  /*Get the primary key command if it exists on the blueprint.*/
  protected getCommandByName(blueprint: Blueprint, name: string) {
    const commands = this.getCommandsByName(blueprint, name);
    if (commands.length > 0) {
      return commands[0];
    }
  }

  /*Get all of the commands with a given name.*/
  protected getCommandsByName(blueprint: Blueprint, name: string) {
    return blueprint.getCommands().filter(value => {
      return value.name == name;
    });
  }

  /*Add a prefix to an array of values.*/
  public prefixArray(prefix: string, values: any[]) {
    return values.map(value => {
      return prefix + ' ' + value;
    });
  }

  /*Wrap a table in keyword identifiers.*/
  public wrapTable(table: any) {
    return super.wrapTable(table instanceof Blueprint ? table.getTable() : table);
  }

  /*Split the given JSON selector into the field and the optional path and wrap them separately.*/
  protected wrapJsonFieldAndPath(column: string) {
    const parts = column.split('->');
    const field = this.wrap(parts[0]);
    const path  = parts.length > 1 ? ', ' + this.wrapJsonPath(parts[1], '->') : '';
    return [field, path];
  }

  /*Wrap the given JSON path.*/
  protected wrapJsonPath(value: string, delimiter: string = '->') {
    value = value.replace(/([\\]+)?'/, `''`);
    return `'$."${value.replace(delimiter, '"."')}"'`;
  }

  /*Wrap a value in keyword identifiers.*/
  public wrap(value: RawExpression | string, prefixAlias: boolean = false) {
    return super.wrap(value instanceof ColumnDefinition ?
      value.name : value,
      prefixAlias);
  }

  /*Format a value so that it can be used in "default" clauses.*/
  protected getDefaultValue(value: any) {
    if (value instanceof RawExpression) {
      return value;
    }
    return isBoolean(value) ?
      `'${/*cast type int*/ value}'` : `'${/*cast type string*/ value}'`;
  }

  /*Create an empty Doctrine DBAL TableDiff from the Blueprint.*/
  public getDoctrineTableDiff(blueprint: Blueprint, schema: SchemaManager) {
    // const table = this.getTablePrefix() + blueprint.getTable();
    // return tap(new TableDiff(table), tableDiff => {
    //   tableDiff.fromTable = schema.listTableDetails(table);
    // });
  }

  /**
   * Get the fluent commands for the grammar.
   */
  public getFluentCommands() {
    return this.fluentCommands;
  }

  /*Get the ColumnDefinition commands for the grammar.*/
  public getColumnDefinitionCommands() {
    return this.ColumnDefinitionCommands;
  }

  /*Check if this Grammar supports schema changes wrapped in a transaction.*/
  public supportsSchemaTransactions() {
    return this.transactions;
  }
}
