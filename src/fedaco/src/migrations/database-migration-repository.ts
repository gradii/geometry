/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ConnectionResolverInterface } from '../interface/connection-resolver-interface';
import { MigrationRepositoryInterface } from './migration-repository-interface';

export class DatabaseMigrationRepository implements MigrationRepositoryInterface {
  /*The database connection resolver instance.*/
  protected resolver: ConnectionResolverInterface;
  /*The name of the migration table.*/
  protected table: string;
  /*The name of the database connection to use.*/
  protected connection: string;

  /*Create a new database migration repository instance.*/
  public constructor(resolver: ConnectionResolverInterface, table: string) {
    this.table    = table;
    this.resolver = resolver;
  }

  /*Get the completed migrations.*/
  public getRan() {
    return this.table()
      .orderBy('batch', 'asc')
      .orderBy('migration', 'asc')
      .pluck('migration').all();
  }

  /*Get list of migrations.*/
  public getMigrations(steps: number) {
    const query = this.table().where('batch', '>=', '1');
    return query
      .orderBy('batch', 'desc')
      .orderBy('migration', 'desc')
      .take(steps)
      .get().all();
  }

  /*Get the last migration batch.*/
  public getLast() {
    const query = this.table()
      .where('batch', this.getLastBatchNumber());
    return query.orderBy('migration', 'desc').get().all();
  }

  /*Get the completed migrations with their batch numbers.*/
  public getMigrationBatches() {
    return this.table()
      .orderBy('batch', 'asc')
      .orderBy('migration', 'asc')
      .pluck('batch', 'migration').all();
  }

  /*Log that a migration was run.*/
  public log(file: string, batch: number) {
    const record = {
      'migration': file,
      'batch'    : batch
    };
    this.table().insert(record);
  }

  /*Remove a migration from the log.*/
  public delete(migration: object) {
    this.table().where('migration', migration.migration).delete();
  }

  /*Get the next migration batch number.*/
  public getNextBatchNumber() {
    return this.getLastBatchNumber() + 1;
  }

  /*Get the last migration batch number.*/
  public getLastBatchNumber() {
    return this.table().max('batch');
  }

  /*Create the migration repository data store.*/
  public createRepository() {
    const schema = this.getConnection().getSchemaBuilder();
    schema.create(this.table, table => {
      table.increments('id');
      table.string('migration');
      table.integer('batch');
    });
  }

  /*Determine if the migration repository exists.*/
  public repositoryExists() {
    const schema = this.getConnection().getSchemaBuilder();
    return schema.hasTable(this.table);
  }

  /*Delete the migration repository data store.*/
  public deleteRepository() {
    const schema = this.getConnection().getSchemaBuilder();
    schema.drop(this.table);
  }

  /*Get a query builder for the migration table.*/
  protected table() {
    return this.getConnection().table(this.table).useWritePdo();
  }

  /*Get the connection resolver instance.*/
  public getConnectionResolver() {
    return this.resolver;
  }

  /*Resolve the database connection instance.*/
  public getConnection() {
    return this.resolver.connection(this.connection);
  }

  /*Set the information source to gather data.*/
  public setSource(name: string) {
    this.connection = name;
  }
}
