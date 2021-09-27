/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { Dispatcher } from './fedaco/mixins/has-events';
import { ConnectionInterface } from './query-builder/connection-interface';
import { Processor } from './query-builder/processor';
import { QueryBuilder } from './query-builder/query-builder';
import { SchemaGrammar } from './schema/grammar/schema-grammar';
import { SchemaBuilder } from './schema/schema-builder';

export class Connection implements ConnectionInterface {
  /*The active PDO connection.*/
  protected pdo: PDO | Function;
  /*The active PDO connection used for reads.*/
  protected readPdo: PDO | Function;
  /*The name of the connected database.*/
  protected database: string;
  /*The type of the connection.*/
  protected type: string | null;
  /*The table prefix for the connection.*/
  protected tablePrefix: string = '';
  /*The database connection configuration options.*/
  protected config: any[] = [];
  /*The reconnector instance for the connection.*/
  protected reconnector: callable;
  /*The query grammar implementation.*/
  protected queryGrammar: SchemaGrammar;
  /*The schema grammar implementation.*/
  protected schemaGrammar: SchemaGrammar;
  /*The query post processor implementation.*/
  protected postProcessor: Processor;
  /*The event dispatcher instance.*/
  protected events: Dispatcher;
  /*The default fetch mode of the connection.*/
  protected fetchMode: number = PDO.FETCH_OBJ;
  /*The number of active transactions.*/
  protected transactions: number = 0;
  /*The transaction manager instance.*/
  protected transactionsManager: DatabaseTransactionsManager;
  /*Indicates if changes have been made to the database.*/
  protected recordsModified: boolean = false;
  /*Indicates if the connection should use the "write" PDO connection.*/
  protected readOnWriteConnection: boolean = false;
  /*All of the queries run against the connection.*/
  protected queryLog: any[] = [];
  /*Indicates whether queries are being logged.*/
  protected loggingQueries: boolean = false;
  /*Indicates if the connection is in a "dry run".*/
  protected pretending: boolean = false;
  /*The instance of Doctrine connection.*/
  protected doctrineConnection: Connection;
  /*The connection resolvers.*/
  protected static resolvers: any[] = [];

  /*Create a new database connection instance.*/
  public constructor(pdo: PDO | Function, database: string = '', tablePrefix: string = '',
                     config: any[] = []) {
    this.pdo         = pdo;
    this.database    = database;
    this.tablePrefix = tablePrefix;
    this.config      = config;
    this.useDefaultQueryGrammar();
    this.useDefaultPostProcessor();
  }

  /*Set the query grammar to the default implementation.*/
  public useDefaultQueryGrammar() {
    this.queryGrammar = this.getDefaultQueryGrammar();
  }

  /*Get the default query grammar instance.*/
  protected getDefaultQueryGrammar() {
    return new QueryGrammar();
  }

  /*Set the schema grammar to the default implementation.*/
  public useDefaultSchemaGrammar() {
    this.schemaGrammar = this.getDefaultSchemaGrammar();
  }

  /*Get the default schema grammar instance.*/
  protected getDefaultSchemaGrammar() {
  }

  /*Set the query post processor to the default implementation.*/
  public useDefaultPostProcessor() {
    this.postProcessor = this.getDefaultPostProcessor();
  }

  /*Get the default post processor instance.*/
  protected getDefaultPostProcessor() {
    return new Processor();
  }

  /*Get a schema builder instance for the connection.*/
  public getSchemaBuilder() {
    if (isBlank(this.schemaGrammar)) {
      this.useDefaultSchemaGrammar();
    }
    return new SchemaBuilder(this);
  }

  /*Begin a fluent query against a database table.*/
  public table(table: Function | QueryBuilder | string, as: string | null = null) {
    return this.query().from(table, as);
  }

  /*Get a new query builder instance.*/
  public query() {
    return new QueryBuilder(this, this.getQueryGrammar(), this.getPostProcessor());
  }

  /*Run a select statement and return a single result.*/
  public selectOne(query: string, bindings: any[] = [], useReadPdo: boolean = true) {
    const records = this.select(query, bindings, useReadPdo);
    return array_shift(records);
  }

  /*Run a select statement against the database.*/
  public selectFromWriteConnection(query: string, bindings: any[] = []) {
    return this.select(query, bindings, false);
  }

  /*Run a select statement against the database.*/
  public select(query: string, bindings: any[] = [], useReadPdo: boolean = true) {
    return this.run(query, bindings, (query: string, bindings: any[]) => {
      if (this.pretending()) {
        return [];
      }
      const statement = this.prepared(this.getPdoForSelect(useReadPdo).prepare(query));
      this.bindValues(statement, this.prepareBindings(bindings));
      statement.execute();
      return statement.fetchAll();
    });
  }

  /*Configure the PDO prepared statement.*/
  protected prepared(statement: PDOStatement) {
    statement.setFetchMode(this.fetchMode);
    this.event(new StatementPrepared(this, statement));
    return statement;
  }

  /*Get the PDO connection to use for a select query.*/
  protected getPdoForSelect(useReadPdo: boolean = true) {
    return useReadPdo ? this.getReadPdo() : this.getPdo();
  }

  /*Run an insert statement against the database.*/
  public insert(query: string, bindings: any[] = []) {
    return this.statement(query, bindings);
  }

  /*Run an update statement against the database.*/
  public update(query: string, bindings: any[] = []) {
    return this.affectingStatement(query, bindings);
  }

  /*Run a delete statement against the database.*/
  public delete(query: string, bindings: any[] = []) {
    return this.affectingStatement(query, bindings);
  }

  /*Execute an SQL statement and return the boolean result.*/
  public statement(query: string, bindings: any[] = []) {
    return this.run(query, bindings, (query: string, bindings: any[]) => {
      if (this.pretending()) {
        return true;
      }
      const statement = this.getPdo().prepare(query);
      this.bindValues(statement, this.prepareBindings(bindings));
      this.recordsHaveBeenModified();
      return statement.execute();
    });
  }

  /*Run an SQL statement and get the number of rows affected.*/
  public affectingStatement(query: string, bindings: any[] = []) {
    return this.run(query, bindings, (query: string, bindings: any[]) => {
      if (this.pretending()) {
        return 0;
      }
      const statement = this.getPdo().prepare(query);
      this.bindValues(statement, this.prepareBindings(bindings));
      statement.execute();
      this.recordsHaveBeenModified((count = statement.rowCount()) > 0);
      return count;
    });
  }

  /*Run a raw, unprepared query against the PDO connection.*/
  public unprepared(query: string) {
    return this.run(query, [], (query: string) => {
      if (this.pretending()) {
        return true;
      }
      this.recordsHaveBeenModified(change = this.getPdo().exec(query) !== false);
      return change;
    });
  }

  /*Execute the given callback in "dry run" mode.*/
  public pretend(callback: Function) {
    return this.withFreshQueryLog(() => {
      this.pretending = true;
      callback(this);
      this.pretending = false;
      return this.queryLog;
    });
  }

  /*Execute the given callback in "dry run" mode.*/
  protected withFreshQueryLog(callback: Function) {
    const loggingQueries = this.loggingQueries;
    this.enableQueryLog();
    this.queryLog       = [];
    const result        = callback();
    this.loggingQueries = loggingQueries;
    return result;
  }

  /*Bind values to their parameters in the given statement.*/
  public bindValues(statement: PDOStatement, bindings: any[]) {
    for (const [key, value] of Object.entries(bindings)) {
      statement.bindValue(is_string(key) ? key : key + 1, value,
        is_int(value) ? PDO.PARAM_INT : PDO.PARAM_STR);
    }
  }

  /*Prepare the query bindings for execution.*/
  public prepareBindings(bindings: any[]) {
    const grammar = this.getQueryGrammar();
    for (const [key, value] of Object.entries(bindings)) {
      if (value instanceof DateTimeInterface) {
        bindings[key] = value.format(grammar.getDateFormat());
      } else if (is_bool(value)) {
        bindings[key] = /*cast type int*/ value;
      }
    }
    return bindings;
  }

  /*Run a SQL statement and log its execution context.*/
  protected run(query: string, bindings: any[], callback: Function) {
    this.reconnectIfMissingConnection();
    const start = microtime(true);
    try {
      const result = this.runQueryCallback(query, bindings, callback);
    } catch (e: QueryException) {
      const result = this.handleQueryException(e, query, bindings, callback);
    }
    this.logQuery(query, bindings, this.getElapsedTime(start));
    return result;
  }

  /*Run a SQL statement.*/
  protected runQueryCallback(query: string, bindings: any[], callback: Function) {
    try {
      return callback(query, bindings);
    } catch (e) {
      throw new QueryException(query, this.prepareBindings(bindings), e);
    }
  }

  /*Log a query in the connection's query log.*/
  public logQuery(query: string, bindings: any[], time: number | null = null) {
    this.event(new QueryExecuted(query, bindings, time, this));
    if (this.loggingQueries) {
      this.queryLog.push(compact('query', 'bindings', 'time'));
    }
  }

  /*Get the elapsed time since a given starting point.*/
  protected getElapsedTime(start: number) {
    return round((microtime(true) - start) * 1000, 2);
  }

  /*Handle a query exception.*/
  protected handleQueryException(e: QueryException, query: string, bindings: any[],
                                 callback: Function) {
    if (this.transactions >= 1) {
      throw e;
    }
    return this.tryAgainIfCausedByLostConnection(e, query, bindings, callback);
  }

  /*Handle a query exception that occurred during query execution.*/
  protected tryAgainIfCausedByLostConnection(e: QueryException, query: string, bindings: any[],
                                             callback: Function) {
    if (this.causedByLostConnection(e.getPrevious())) {
      this.reconnect();
      return this.runQueryCallback(query, bindings, callback);
    }
    throw e;
  }

  /*Reconnect to the database.*/
  public reconnect() {
    if (is_callable(this.reconnector)) {
      this.doctrineConnection = null;
      return call_user_func(this.reconnector, this);
    }
    throw new LogicException('Lost connection and no reconnector available.');
  }

  /*Reconnect to the database if a PDO connection is missing.*/
  protected reconnectIfMissingConnection() {
    if (isBlank(this.pdo)) {
      this.reconnect();
    }
  }

  /*Disconnect from the underlying PDO connection.*/
  public disconnect() {
    this.setPdo(null).setReadPdo(null);
  }

  /*Register a database query listener with the connection.*/
  public listen(callback: Function) {
    if (this.events !== undefined) {
      this.events.listen(Events.QueryExecuted, callback);
    }
  }

  /*Fire an event for this connection.*/
  protected fireConnectionEvent(event: string) {
    if (!(this.events !== undefined)) {
      return;
    }
    switch (event) {
      case 'beganTransaction':
        return this.events.dispatch(new TransactionBeginning(this));
      case 'committed':
        return this.events.dispatch(new TransactionCommitted(this));
      case 'rollingBack':
        return this.events.dispatch(new TransactionRolledBack(this));
    }
  }

  /*Fire the given event if possible.*/
  protected event(event: any) {
    if (this.events !== undefined) {
      this.events.dispatch(event);
    }
  }

  /*Get a new raw query expression.*/
  public raw(value: any) {
    return new Expression(value);
  }

  /*Determine if the database connection has modified any database records.*/
  public hasModifiedRecords() {
    return this.recordsModified;
  }

  /*Indicate if any records have been modified.*/
  public recordsHaveBeenModified(value: boolean = true) {
    if (!this.recordsModified) {
      this.recordsModified = value;
    }
  }

  /*Set the record modification state.*/
  public setRecordModificationState(value: boolean) {
    this.recordsModified = value;
    return this;
  }

  /*Reset the record modification state.*/
  public forgetRecordModificationState() {
    this.recordsModified = false;
  }

  /*Indicate that the connection should use the write PDO connection for reads.*/
  public useWriteConnectionWhenReading(value: boolean = true) {
    this.readOnWriteConnection = value;
    return this;
  }

  /*Is Doctrine available?*/
  public isDoctrineAvailable() {
    return class_exists('Doctrine\\DBAL\\Connection');
  }

  /*Get a Doctrine Schema Column instance.*/
  public getDoctrineColumn(table: string, column: string) {
    const schema = this.getDoctrineSchemaManager();
    return schema.listTableDetails(table).getColumn(column);
  }

  /*Get the Doctrine DBAL schema manager for the connection.*/
  public getDoctrineSchemaManager() {
    const connection = this.getDoctrineConnection();
    return this.getDoctrineDriver().getSchemaManager(connection, connection.getDatabasePlatform());
  }

  /*Get the Doctrine DBAL database connection instance.*/
  public getDoctrineConnection() {
    if (isBlank(this.doctrineConnection)) {
      const driver            = this.getDoctrineDriver();
      this.doctrineConnection = new DoctrineConnection(array_filter({
        'pdo'          : this.getPdo(),
        'dbname'       : this.getDatabaseName(),
        'driver'       : driver.getName(),
        'serverVersion': this.getConfig('server_version')
      }), driver);
    }
    return this.doctrineConnection;
  }

  /*Get the current PDO connection.*/
  public getPdo() {
    if (this.pdo instanceof Closure) {
      return this.pdo = call_user_func(this.pdo);
    }
    return this.pdo;
  }

  /*Get the current PDO connection parameter without executing any reconnect logic.*/
  public getRawPdo() {
    return this.pdo;
  }

  /*Get the current PDO connection used for reading.*/
  public getReadPdo() {
    if (this.transactions > 0) {
      return this.getPdo();
    }
    if (this.readOnWriteConnection || this.recordsModified && this.getConfig('sticky')) {
      return this.getPdo();
    }
    if (this.readPdo instanceof Closure) {
      return this.readPdo = call_user_func(this.readPdo);
    }
    return this.readPdo || this.getPdo();
  }

  /*Get the current read PDO connection parameter without executing any reconnect logic.*/
  public getRawReadPdo() {
    return this.readPdo;
  }

  /*Set the PDO connection.*/
  public setPdo(pdo: PDO | Function | null) {
    this.transactions = 0;
    this.pdo          = pdo;
    return this;
  }

  /*Set the PDO connection used for reading.*/
  public setReadPdo(pdo: PDO | Function | null) {
    this.readPdo = pdo;
    return this;
  }

  /*Set the reconnect instance on the connection.*/
  public setReconnector(reconnector: callable) {
    this.reconnector = reconnector;
    return this;
  }

  /*Get the database connection name.*/
  public getName() {
    return this.getConfig('name');
  }

  /*Get the database connection full name.*/
  public getNameWithReadWriteType() {
    return this.getName() + (this.readWriteType ? '::' + this.readWriteType : '');
  }

  /*Get an option from the configuration options.*/
  public getConfig(option: string | null = null) {
    return Arr.get(this.config, option);
  }

  /*Get the PDO driver name.*/
  public getDriverName() {
    return this.getConfig('driver');
  }

  /*Get the query grammar used by the connection.*/
  public getQueryGrammar() {
    return this.queryGrammar;
  }

  /*Set the query grammar used by the connection.*/
  public setQueryGrammar(grammar: SchemaGrammar) {
    this.queryGrammar = grammar;
    return this;
  }

  /*Get the schema grammar used by the connection.*/
  public getSchemaGrammar() {
    return this.schemaGrammar;
  }

  /*Set the schema grammar used by the connection.*/
  public setSchemaGrammar(grammar: SchemaGrammar) {
    this.schemaGrammar = grammar;
    return this;
  }

  /*Get the query post processor used by the connection.*/
  public getPostProcessor() {
    return this.postProcessor;
  }

  /*Set the query post processor used by the connection.*/
  public setPostProcessor(processor: Processor) {
    this.postProcessor = processor;
    return this;
  }

  /*Get the event dispatcher used by the connection.*/
  public getEventDispatcher() {
    return this.events;
  }

  /*Set the event dispatcher instance on the connection.*/
  public setEventDispatcher(events: Dispatcher) {
    this.events = events;
    return this;
  }

  /*Unset the event dispatcher for this connection.*/
  public unsetEventDispatcher() {
    this.events = null;
  }

  /*Set the transaction manager instance on the connection.*/
  public setTransactionManager(manager: DatabaseTransactionsManager) {
    this.transactionsManager = manager;
    return this;
  }

  /*Unset the transaction manager for this connection.*/
  public unsetTransactionManager() {
    this.transactionsManager = null;
  }

  /*Determine if the connection is in a "dry run".*/
  public pretending() {
    return this.pretending === true;
  }

  /*Get the connection query log.*/
  public getQueryLog() {
    return this.queryLog;
  }

  /*Clear the query log.*/
  public flushQueryLog() {
    this.queryLog = [];
  }

  /*Enable the query log on the connection.*/
  public enableQueryLog() {
    this.loggingQueries = true;
  }

  /*Disable the query log on the connection.*/
  public disableQueryLog() {
    this.loggingQueries = false;
  }

  /*Determine whether we're logging queries.*/
  public logging() {
    return this.loggingQueries;
  }

  /*Get the name of the connected database.*/
  public getDatabaseName() {
    return this.database;
  }

  /*Set the name of the connected database.*/
  public setDatabaseName(database: string) {
    this.database = database;
    return this;
  }

  /*Set the read / write type of the connection.*/
  public setReadWriteType(readWriteType: string | null) {
    this.readWriteType = readWriteType;
    return this;
  }

  /*Get the table prefix for the connection.*/
  public getTablePrefix() {
    return this.tablePrefix;
  }

  /*Set the table prefix in use by the connection.*/
  public setTablePrefix(prefix: string) {
    this.tablePrefix = prefix;
    this.getQueryGrammar().setTablePrefix(prefix);
    return this;
  }

  /*Set the table prefix and return the grammar.*/
  public withTablePrefix(grammar: SchemaGrammar) {
    grammar.setTablePrefix(this.tablePrefix);
    return grammar;
  }

  /*Register a connection resolver.*/
  public static resolverFor(driver: string, callback: Function) {
    Connection.resolvers[driver] = callback;
  }

  /*Get the connection resolver for the given driver.*/
  public static getResolver(driver: string) {
    return Connection.resolvers[driver] ?? null;
  }
}
