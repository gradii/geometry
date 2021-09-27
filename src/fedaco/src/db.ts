/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { DatabaseManager } from './database-manager';
import { Model } from './fedaco/model';
import { ConnectionInterface } from './query-builder/connection-interface';
import { QueryBuilder } from './query-builder/query-builder';

export class Db {
  config = {
    database: {
      fetch      : 0,
      default    : 'default',
      connections: {
        default: ''
      }
    }
  };

  /*The database manager instance.*/
  protected manager: DatabaseManager;

  protected static instance: Db;

  /*Create a new database capsule manager.*/
  public constructor(/*container: Container | null = null*/) {
    // this.setupContainer(container || new Container());
    this.setupManager();
  }

  /*Build the database manager instance.*/
  protected setupManager() {
    // const factory = new ConnectionFactory(this.container);
    this.manager  = new DatabaseManager(/*this.container, factory*/);
  }

  /*Get a connection instance from the global manager.*/
  public static connection(connection: string | null = null): ConnectionInterface {
    return this.instance.getConnection(connection);
  }

  /**
   * Make this capsule instance available globally.
   */
  public setAsGlobal() {
    (this.constructor as typeof Db).instance = this;
  }

  /*Get a fluent query builder instance.*/
  public static table(table: Function | QueryBuilder | string, as: string | null = null,
                      connection: string | null                             = null) {
    return (this.instance.constructor as typeof Db)
      .connection(connection)
      .table(table, as);
  }

  /*Get a schema builder instance.*/
  public static schema(connection: string | null = null) {
    return (this.instance.constructor as typeof Db)
      .connection(connection)
      .getSchemaBuilder();
  }

  /*Get a registered connection instance.*/
  public getConnection(name: string | null = null): ConnectionInterface {
    return this.manager.connection(name);
  }

  /*Register a connection with the manager.*/
  public addConnection(config: any, name: string = 'default') {
    const connections = this.config.database.connections;

    // @ts-ignore
    connections[name] = config;

    this.config.database.connections = connections;
  }

  /*Bootstrap Eloquent so it is ready for usage.*/
  public bootEloquent() {
    Model.setConnectionResolver(this.manager);
    const dispatcher = this.getEventDispatcher();
    if (dispatcher) {
      Model.setEventDispatcher(dispatcher);
    }
  }

  // /*Set the fetch mode for the database connections.*/
  // public setFetchMode(fetchMode: number) {
  //   this.config.database.fetch = fetchMode;
  //   return this;
  // }

  /*Get the database manager instance.*/
  public getDatabaseManager() {
    return this.manager;
  }

  // /*Get the current event dispatcher instance.*/
  // public getEventDispatcher() {
  //   if (this.container.bound('events')) {
  //     return this.container['events'];
  //   }
  // }

  // /*Set the event dispatcher instance to be used by connections.*/
  // public setEventDispatcher(dispatcher: Dispatcher) {
  //   this.container.instance('events', dispatcher);
  // }

  // /*Dynamically pass methods to the default connection.*/
  // public static __callStatic(method: string, parameters: any[]) {
  //   return Manager.connection().method(());
  // }
}

