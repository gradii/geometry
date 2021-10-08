import { ConnectionInterface } from '../../src/query-builder/connection-interface';
import { QueryBuilder } from '../../src/query-builder/query-builder';
import { SqliteQueryGrammar } from '../../src/query-builder/grammar/sqlite-query-grammar';
import { Processor } from '../../src/query-builder/processor';
import { SchemaBuilder } from '../../src/schema/schema-builder';
import { FedacoBuilder } from '../../src/fedaco/fedaco-builder';
import { MysqlQueryGrammar } from '../../src/query-builder/grammar/mysql-query-grammar';

let builder, related;


class Conn implements ConnectionInterface {
  getQueryGrammar(): any {

  }

  getDatabaseName(): string {
    return 'default-database';
  }

  getPostProcessor(): any {

  }

  query(): QueryBuilder {
    return new QueryBuilder(
      this,
      new SqliteQueryGrammar(),
      new Processor()
    );
  }

  async select() {
    return await Promise.resolve();
  }

  async insert(sql: string, bindings: any[]): Promise<boolean> {
    return false;
  }

  async update() {
  }

  async delete() {
  }

  async statement() {
  }

  async affectingStatement() {
  }

  getName() {
    return '';
  }

  getConfig(name: string): any {
  }

  getPdo(): any {
  }

  getSchemaBuilder(): SchemaBuilder {
    throw new Error('not implemented');
  }

  recordsHaveBeenModified(): any {
  }

  selectFromWriteConnection(sql: string, values: any): any {
  }

  table(table: Function | QueryBuilder | string, as?: string): QueryBuilder {
    return undefined;
  }

  insertGetId(sql: string, bindings: any[], sequence?: string): Promise<any> | boolean {
    return undefined;
  }
}

export function getBuilder() {
  return new FedacoBuilder(new QueryBuilder(
    new Conn(),
    new MysqlQueryGrammar(),
    new Processor()
  ));
}
