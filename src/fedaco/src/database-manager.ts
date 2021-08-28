// import { Application } from "Illuminate/Contracts/Foundation/Application";
// import { ConnectionFactory } from "Illuminate/Database/Connectors/ConnectionFactory";
// import { Connection } from "Illuminate/Database/Connection";
// import { ConnectionFactory } from "Illuminate/Database/Connectors/ConnectionFactory";
// import { Arr } from "Illuminate/Support/Arr";
// import { ConfigurationUrlParser } from "Illuminate/Support/ConfigurationUrlParser";
// import { Str } from "Illuminate/Support/Str";
// import { InvalidArgumentException } from "InvalidArgumentException";
// import { PDO } from "PDO";

import { ConnectionResolverInterface } from './interface/connection-resolver-interface';
import { ConnectionInterface } from './query-builder/connection-interface';
import { MysqlGrammar } from './query-builder/grammar/mysql-grammar';
import { Processor } from './query-builder/processor';
import { QueryBuilder } from './query-builder/query-builder';

class Conn implements ConnectionInterface {
  _query;

  constructor() {
    this._query = new QueryBuilder(
      this,
      new MysqlGrammar(),
      new Processor());
  }

  query() {
    return this._query;
  }

  select() {
  }

  insert() {
  }

  update() {
  }

  delete() {
  }

  statement() {
  }

  affectingStatement() {
  }

  getName() {

  }
}


/**/
export class DatabaseManager implements ConnectionResolverInterface {
  // /*The application instance.*/
  // protected app: Application;
  // /*The database connection factory instance.*/
  // protected factory: ConnectionFactory;
  // /*The active connection instances.*/
  // protected connections: any[] = [];
  // /*The custom connection resolvers.*/
  // protected extensions: any[] = [];
  // /*The callback to be executed to reconnect to a database.*/
  // protected reconnector: callable;
  // /*Create a new database manager instance.*/
  // public constructor(app: Application, factory: ConnectionFactory) {
  //     this.app = app;
  //     this.factory = factory;
  //     this.reconnector = connection => {
  //         this.reconnect(connection.getNameWithReadWriteType());
  //     };
  // }
  /*Get a database connection instance.*/
  public connection(name: string | null = null) {
    // const [database, type] = this.parseConnectionName(name);
    // var name = name || database;
    // if (!(this.connections[name] !== undefined)) {
    //     this.connections[name] = this.configure(this.makeConnection(database), type);
    // }
    // return this.connections[name];
    return new Conn();
  }

  /*Parse the connection into an array of the name and read / write type.*/
  protected parseConnectionName(name: string) {
    // var name = name || this.getDefaultConnection();
    // return Str.endsWith(name, ["::read", "::write"]) ? name.split("::") : [name, null];
  }

  /*Make the database connection instance.*/
  protected makeConnection(name: string) {
    // var config = this.configuration(name);
    // if (this.extensions[name] !== undefined) {
    //     return call_user_func(this.extensions[name], config, name);
    // }
    // if (this.extensions[driver = config["driver"]] !== undefined) {
    //     return call_user_func(this.extensions[driver], config, name);
    // }
    // return this.factory.make(config, name);
  }

  /*Get the configuration for a connection.*/
  protected configuration(name: string) {
    // var name = name || this.getDefaultConnection();
    // var connections = this.app["config"]["database.connections"];
    // if (isBlank(config = Arr.get(connections, name))) {
    //     throw new InvalidArgumentException("\"Database connection [{$name}] not configured.\"");
    // }
    // return new ConfigurationUrlParser().parseConfiguration(config);
  }

  /*Prepare the database connection instance.*/
  protected configure(connection/*: Connection*/, type: string) {
    // var connection = this.setPdoForType(connection, type).setReadWriteType(type);
    // if (this.app.bound("events")) {
    //     connection.setEventDispatcher(this.app["events"]);
    // }
    // if (this.app.bound("db.transactions")) {
    //     connection.setTransactionManager(this.app["db.transactions"]);
    // }
    // connection.setReconnector(this.reconnector);
    // return connection;
  }

  /*Prepare the read / write mode for database connection instance.*/
  protected setPdoForType(connection, type: string | null = null) {
    // if (type === "read") {
    //     connection.setPdo(connection.getReadPdo());
    // }
    // else if (type === "write") {
    //     connection.setReadPdo(connection.getPdo());
    // }
    // return connection;
  }

  /*Disconnect from the given database and remove from local cache.*/
  public purge(name: string | null = null) {
    // var name = name || this.getDefaultConnection();
    // this.disconnect(name);
    // delete this.connections[name];
  }

  /*Disconnect from the given database.*/
  public disconnect(name: string | null = null) {
    // if (this.connections[name = name || this.getDefaultConnection()] !== undefined) {
    //     this.connections[name].disconnect();
    // }
  }

  /*Reconnect to the given database.*/
  public reconnect(name: string | null = null) {
    // this.disconnect(name = name || this.getDefaultConnection());
    // if (!(this.connections[name] !== undefined)) {
    //     return this.connection(name);
    // }
    // return this.refreshPdoConnections(name);
  }

  /*Set the default database connection for the callback execution.*/
  public usingConnection(name: string, callback: Function) {
    // var previousName = this.getDefaultConnection();
    // this.setDefaultConnection(name);
    // return tap(callback(), () => {
    //     this.setDefaultConnection(previousName);
    // });
  }

  /*Refresh the PDO connections on a given connection.*/
  protected refreshPdoConnections(name: string) {
    // const [database, type] = this.parseConnectionName(name);
    // var fresh = this.configure(this.makeConnection(database), type);
    // return this.connections[name].setPdo(fresh.getRawPdo()).setReadPdo(fresh.getRawReadPdo());
  }

  /*Get the default connection name.*/
  public getDefaultConnection() {
    // return this.app["config"]["database.default"];
  }

  /*Set the default connection name.*/
  public setDefaultConnection(name: string) {
    // this.app["config"]["database.default"] = name;
  }

  /*Get all of the support drivers.*/
  public supportedDrivers() {
    // return ["mysql", "pgsql", "sqlite", "sqlsrv"];
  }

  /*Get all of the drivers that are actually available.*/
  public availableDrivers() {
    // return array_intersect(this.supportedDrivers(), str_replace("dblib", "sqlsrv", PDO.getAvailableDrivers()));
  }

  /*Register an extension connection resolver.*/
  public extend(name: string, resolver: Function) {
    // this.extensions[name] = resolver;
  }

  /*Return all of the created connections.*/
  public getConnections() {
    // return this.connections;
  }

  /*Set the database reconnector callback.*/
  public setReconnector(reconnector: Function) {
    // this.reconnector = reconnector;
  }

  /*Set the application instance used by the manager.*/
  public setApplication(app) {
    // this.app = app;
    // return this;
  }

  /*Dynamically pass methods to the default connection.*/
  public __call(method: string, parameters: any[]) {
    // return this.connection().method(());
  }
}
