/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


export class DbalConnection {
  getDatabasePlatform() {

  }
}

//
//
// /*A wrapper around a DBAL/Driver/Connection that adds features like
// events, transaction isolation levels, configuration, emulated transaction nesting,
// lazy connecting and more.*/
// export class Connection implements DriverConnection {
//   static TRANSACTION_READ_UNCOMMITTED =
//            TransactionIsolationLevel.READ_UNCOMMITTED;
//   static TRANSACTION_READ_COMMITTED = TransactionIsolationLevel.READ_COMMITTED;
//   static TRANSACTION_REPEATABLE_READ =
//            TransactionIsolationLevel.REPEATABLE_READ;
//   static TRANSACTION_SERIALIZABLE = TransactionIsolationLevel.SERIALIZABLE;
//   static ARRAY_PARAM_OFFSET = 100;
//   static PARAM_INT_ARRAY =
//            ParameterType.INTEGER + Connection.ARRAY_PARAM_OFFSET;
//   static PARAM_STR_ARRAY = ParameterType.STRING + Connection.ARRAY_PARAM_OFFSET;
//   /*The wrapped driver connection.*/
//   protected _conn: Connection | null;
//   /**/
//   protected _config: Configuration;
//   /**/
//   protected _eventManager: EventManager;
//   /**/
//   protected _expr: ExpressionBuilder;
//   /*The schema manager.*/
//   protected _schemaManager: AbstractSchemaManager | null;
//   /*The used DBAL driver.*/
//   protected _driver: Driver;
//   /**/
//   protected defaultFetchMode: number = FetchMode.ASSOCIATIVE;
//   /*Whether or not a connection has been established.*/
//   private isConnected: boolean = false;
//   /*The current auto-commit mode of this connection.*/
//   private autoCommit: boolean = true;
//   /*The transaction nesting level.*/
//   private transactionNestingLevel: number = 0;
//   /*The currently active transaction isolation level.*/
//   private transactionIsolationLevel: number;
//   /*If nested transactions should use savepoints.*/
//   private nestTransactionsWithSavepoints: boolean = false;
//   /*The parameters used during creation of the Connection instance.*/
//   private params: any[] = [];
//   /*The DatabasePlatform object that provides information about the
//       database platform used by the connection.*/
//   private platform: AbstractPlatform;
//   /*Flag that indicates whether the current transaction is marked for rollback only.*/
//   private isRollbackOnly: boolean = false;
//
//   /*Initializes a new instance of the Connection class.*/
//   public constructor(params, driver, config = null, eventManager = null) {
//     this._driver = driver;
//     this.params = params;
//     if (params['pdo'] !== undefined) {
//       this._conn = params['pdo'];
//       this.isConnected = true;
//       delete this.params['pdo'];
//     }
//     if (params['platform'] !== undefined) {
//       if (!params['platform'] instanceof Platforms.AbstractPlatform) {
//         throw DBALException.invalidPlatformType(params['platform']);
//       }
//       this.platform = params['platform'];
//     }
//     if (!config) {
//       var config = new Configuration();
//     }
//     if (!eventManager) {
//       var eventManager = new EventManager();
//     }
//     this._config = config;
//     this._eventManager = eventManager;
//     this._expr = new Query.Expression.ExpressionBuilder(this);
//     this.autoCommit = config.getAutoCommit();
//   }
//
//   /*Gets the parameters used during instantiation.*/
//   public getParams() {
//     return this.params;
//   }
//
//   /*Gets the name of the database this Connection is connected to.*/
//   public getDatabase() {
//     return this._driver.getDatabase(this);
//   }
//
//   /*Gets the hostname of the currently connected database.*/
//   public getHost() {
//     return this.params['host'];
//   }
//
//   /*Gets the port of the currently connected database.*/
//   public getPort() {
//     return this.params['port'];
//   }
//
//   /*Gets the username used by this connection.*/
//   public getUsername() {
//     return this.params['user'];
//   }
//
//   /*Gets the password used by this connection.*/
//   public getPassword() {
//     return this.params['password'];
//   }
//
//   /*Gets the DBAL driver instance.*/
//   public getDriver() {
//     return this._driver;
//   }
//
//   /*Gets the Configuration used by the Connection.*/
//   public getConfiguration() {
//     return this._config;
//   }
//
//   /*Gets the EventManager used by the Connection.*/
//   public getEventManager() {
//     return this._eventManager;
//   }
//
//   /*Gets the DatabasePlatform for the connection.*/
//   public getDatabasePlatform() {
//     if (this.platform === null) {
//       this.detectDatabasePlatform();
//     }
//     return this.platform;
//   }
//
//   /*Gets the ExpressionBuilder for the connection.*/
//   public getExpressionBuilder() {
//     return this._expr;
//   }
//
//   /*Establishes the connection with the database.*/
//   public connect() {
//     if (this.isConnected) {
//       return false;
//     }
//     var driverOptions = this.params['driverOptions'] || [];
//     var user = this.params['user'];
//     var password = this.params['password'];
//     this._conn = this._driver.connect(
//       this.params,
//       user,
//       password,
//       driverOptions
//     );
//     this.isConnected = true;
//     this.transactionNestingLevel = 0;
//     if (this.autoCommit === false) {
//       this.beginTransaction();
//     }
//     if (this._eventManager.hasListeners(Events.postConnect)) {
//       var eventArgs = new Event.ConnectionEventArgs(this);
//       this._eventManager.dispatchEvent(Events.postConnect, eventArgs);
//     }
//     return true;
//   }
//
//   /*Returns the current auto-commit mode for this connection.*/
//   public isAutoCommit() {
//     return this.autoCommit === true;
//   }
//
//   /*Sets auto-commit mode for this connection.
//
//       If a connection is in auto-commit mode, then all its SQL statements will be executed and committed as individual
//       transactions. Otherwise, its SQL statements are grouped into transactions that are terminated by a call to either
//       the method commit or the method rollback. By default, new connections are in auto-commit mode.
//
//       NOTE: If this method is called during a transaction and the auto-commit mode is changed, the transaction is
//       committed. If this method is called and the auto-commit mode is not changed, the call is a no-op.*/
//   public setAutoCommit(autoCommit) {
//     var autoCommit =
//           //cast type bool
//           autoCommit;
//     if (autoCommit === this.autoCommit) {
//       return;
//     }
//     this.autoCommit = autoCommit;
//     if (this.isConnected !== true || this.transactionNestingLevel === 0) {
//       return;
//     }
//     this.commitAll();
//   }
//
//   /*Sets the fetch mode.*/
//   public setFetchMode(fetchMode: number) {
//     this.defaultFetchMode = fetchMode;
//   }
//
//   /*Prepares and executes an SQL query and returns the first row of the result
//       as an associative array.*/
//   public fetchAssoc(statement, params = [], types = []) {
//     return this.executeQuery(statement, params, types).fetch(
//       FetchMode.ASSOCIATIVE
//     );
//   }
//
//   /*Prepares and executes an SQL query and returns the first row of the result
//       as a numerically indexed array.*/
//   public fetchArray(statement, params = [], types = []) {
//     return this.executeQuery(statement, params, types).fetch(FetchMode.NUMERIC);
//   }
//
//   /*Prepares and executes an SQL query and returns the value of a single column
//       of the first row of the result.*/
//   public fetchColumn(statement, params = [], column = 0, types = []) {
//     return this.executeQuery(statement, params, types).fetchColumn(column);
//   }
//
//   /*Whether an actual connection to the database is established.*/
//   public isConnected() {
//     return this.isConnected;
//   }
//
//   /*Checks whether a transaction is currently active.*/
//   public isTransactionActive() {
//     return this.transactionNestingLevel > 0;
//   }
//
//   /*Executes an SQL DELETE statement on a table.
//
//       Table expression and columns are not escaped and are not safe for user-input.*/
//   public delete(tableExpression, identifier, types = []) {
//     if (empty(identifier)) {
//       throw InvalidArgumentException.fromEmptyCriteria();
//     }
//     var columns = (values = conditions = []);
//     this.addIdentifierCondition(identifier, columns, values, conditions);
//     return this.executeUpdate(
//       'DELETE FROM ' + tableExpression + ' WHERE ' + conditions.join(' AND '),
//       values,
//       is_string(key(types)) ? this.extractTypeValues(columns, types) : types
//     );
//   }
//
//   /*Closes the connection.*/
//   public close() {
//     this._conn = null;
//     this.isConnected = false;
//   }
//
//   /*Sets the transaction isolation level.*/
//   public setTransactionIsolation(level) {
//     this.transactionIsolationLevel = level;
//     return this.executeUpdate(
//       this.getDatabasePlatform().getSetTransactionIsolationSQL(level)
//     );
//   }
//
//   /*Gets the currently active transaction isolation level.*/
//   public getTransactionIsolation() {
//     if (this.transactionIsolationLevel === null) {
//       this.transactionIsolationLevel = this.getDatabasePlatform().getDefaultTransactionIsolationLevel();
//     }
//     return this.transactionIsolationLevel;
//   }
//
//   /*Executes an SQL UPDATE statement on a table.
//
//       Table expression and columns are not escaped and are not safe for user-input.*/
//   public update(tableExpression, data, identifier, types = []) {
//     var columns = (values = conditions = set = []);
//     for (let [columnName, value] of Object.entries(data)) {
//       columns.push(columnName);
//       values.push(value);
//       set.push(columnName + ' = ?');
//     }
//     this.addIdentifierCondition(identifier, columns, values, conditions);
//     if (is_string(key(types))) {
//       var types = this.extractTypeValues(columns, types);
//     }
//     var sql =
//           'UPDATE ' +
//           tableExpression +
//           ' SET ' +
//           set.join(', ') +
//           ' WHERE ' +
//           conditions.join(' AND ');
//     return this.executeUpdate(sql, values, types);
//   }
//
//   /*Inserts a table row with specified data.
//
//       Table expression and columns are not escaped and are not safe for user-input.*/
//   public insert(tableExpression, data, types = []) {
//     if (empty(data)) {
//       return this.executeUpdate(
//         'INSERT INTO ' + tableExpression + ' () VALUES ()'
//       );
//     }
//     var columns = [];
//     var values = [];
//     var set = [];
//     for (let [columnName, value] of Object.entries(data)) {
//       columns.push(columnName);
//       values.push(value);
//       set.push('?');
//     }
//     return this.executeUpdate(
//       'INSERT INTO ' +
//       tableExpression +
//       ' (' +
//       columns.join(', ') +
//       ')' +
//       ' VALUES (' +
//       set.join(', ') +
//       ')',
//       values,
//       is_string(key(types)) ? this.extractTypeValues(columns, types) : types
//     );
//   }
//
//   /*Quotes a string so it can be safely used as a table or column name, even if
//       it is a reserved name.
//
//       Delimiting style depends on the underlying database platform that is being used.
//
//       NOTE: Just because you CAN use quoted identifiers does not mean
//       you SHOULD use them. In general, they end up causing way more
//       problems than they solve.*/
//   public quoteIdentifier(str) {
//     return this.getDatabasePlatform().quoteIdentifier(str);
//   }
//
//   /*{@inheritDoc}*/
//   public quote(input, type = ParameterType.STRING) {
//     var connection = this.getWrappedConnection();
//     const [value, bindingType] = this.getBindingInfo(input, type);
//     return connection.quote(value, bindingType);
//   }
//
//   /*Prepares and executes an SQL query and returns the result as an associative array.*/
//   public fetchAll(sql, params = [], types = []) {
//     return this.executeQuery(sql, params, types).fetchAll();
//   }
//
//   /*Prepares an SQL statement.*/
//   public prepare(statement) {
//     try {
//       var stmt = new Statement(statement, this);
//     } catch (ex) {
//       throw DBALException.driverExceptionDuringQuery(
//         this._driver,
//         ex,
//         statement
//       );
//     }
//     stmt.setFetchMode(this.defaultFetchMode);
//     return stmt;
//   }
//
//   /*Executes an, optionally parametrized, SQL query.
//
//       If the query is parametrized, a prepared statement is used.
//       If an SQLLogger is configured, the execution is logged.*/
//   public executeQuery(query, params = [], types = [], qcp = null) {
//     if (qcp !== null) {
//       return this.executeCacheQuery(query, params, types, qcp);
//     }
//     var connection = this.getWrappedConnection();
//     var logger = this._config.getSQLLogger();
//     if (logger) {
//       logger.startQuery(query, params, types);
//     }
//     try {
//       if (params) {
//         const [query, params, types] = SQLParserUtils.expandListParameters(
//           query,
//           params,
//           types
//         );
//         var stmt = connection.prepare(query);
//         if (types) {
//           this._bindTypedValues(stmt, params, types);
//           stmt.execute();
//         } else {
//           stmt.execute(params);
//         }
//       } else {
//         var stmt = connection.query(query);
//       }
//     } catch (ex) {
//       throw DBALException.driverExceptionDuringQuery(
//         this._driver,
//         ex,
//         query,
//         this.resolveParams(params, types)
//       );
//     }
//     stmt.setFetchMode(this.defaultFetchMode);
//     if (logger) {
//       logger.stopQuery();
//     }
//     return stmt;
//   }
//
//   /*Executes a caching query.*/
//   public executeCacheQuery(query, params, types, qcp) {
//     var resultCache =
//           qcp.getResultCacheDriver() || this._config.getResultCacheImpl();
//     if (resultCache === null) {
//       throw CacheException.noResultDriverConfigured();
//     }
//     var connectionParams = this.getParams();
//     delete connectionParams['platform'];
//     const [cacheKey, realKey] = qcp.generateCacheKeys(
//       query,
//       params,
//       types,
//       connectionParams
//     );
//     var data = resultCache.fetch(cacheKey);
//     if (data !== false) {
//       if (data[realKey] !== undefined) {
//         var stmt = new ArrayStatement(data[realKey]);
//       } else if (array_key_exists(realKey, data)) {
//         var stmt = new ArrayStatement([]);
//       }
//     }
//     if (!(stmt !== undefined)) {
//       var stmt = new ResultCacheStatement(
//         this.executeQuery(query, params, types),
//         resultCache,
//         cacheKey,
//         realKey,
//         qcp.getLifetime()
//       );
//     }
//     stmt.setFetchMode(this.defaultFetchMode);
//     return stmt;
//   }
//
//   /*Executes an, optionally parametrized, SQL query and returns the result,
//       applying a given projection/transformation function on each row of the result.*/
//   public project(query, params, func) {
//     var result = [];
//     var stmt = this.executeQuery(query, params);
//     while ((row = stmt.fetch())) {
//       result.push(func(row));
//     }
//     stmt.closeCursor();
//     return result;
//   }
//
//   /*Executes an SQL statement, returning a result set as a Statement object.*/
//   public query() {
//     var connection = this.getWrappedConnection();
//     var args = func_get_args();
//     var logger = this._config.getSQLLogger();
//     if (logger) {
//       logger.startQuery(args[0]);
//     }
//     try {
//       var statement = connection.query(...$args);
//     } catch (ex) {
//       throw DBALException.driverExceptionDuringQuery(this._driver, ex, args[0]);
//     }
//     statement.setFetchMode(this.defaultFetchMode);
//     if (logger) {
//       logger.stopQuery();
//     }
//     return statement;
//   }
//
//   /*Executes an SQL INSERT/UPDATE/DELETE query with the given parameters
//       and returns the number of affected rows.
//
//       This method supports PDO binding types as well as DBAL mapping types.*/
//   public executeUpdate(query, params = [], types = []) {
//     var connection = this.getWrappedConnection();
//     var logger = this._config.getSQLLogger();
//     if (logger) {
//       logger.startQuery(query, params, types);
//     }
//     try {
//       if (params) {
//         const [query, params, types] = SQLParserUtils.expandListParameters(
//           query,
//           params,
//           types
//         );
//         var stmt = connection.prepare(query);
//         if (types) {
//           this._bindTypedValues(stmt, params, types);
//           stmt.execute();
//         } else {
//           stmt.execute(params);
//         }
//         var result = stmt.rowCount();
//       } else {
//         var result = connection.exec(query);
//       }
//     } catch (ex) {
//       throw DBALException.driverExceptionDuringQuery(
//         this._driver,
//         ex,
//         query,
//         this.resolveParams(params, types)
//       );
//     }
//     if (logger) {
//       logger.stopQuery();
//     }
//     return result;
//   }
//
//   /*Executes an SQL statement and return the number of affected rows.*/
//   public exec(statement: string) {
//     var connection = this.getWrappedConnection();
//     var logger = this._config.getSQLLogger();
//     if (logger) {
//       logger.startQuery(statement);
//     }
//     try {
//       var result = connection.exec(statement);
//     } catch (ex) {
//       throw DBALException.driverExceptionDuringQuery(
//         this._driver,
//         ex,
//         statement
//       );
//     }
//     if (logger) {
//       logger.stopQuery();
//     }
//     return result;
//   }
//
//   /*Returns the current transaction nesting level.*/
//   public getTransactionNestingLevel() {
//     return this.transactionNestingLevel;
//   }
//
//   /*Fetches the SQLSTATE associated with the last database operation.*/
//   public errorCode() {
//     return this.getWrappedConnection().errorCode();
//   }
//
//   /*{@inheritDoc}*/
//   public errorInfo() {
//     return this.getWrappedConnection().errorInfo();
//   }
//
//   /*Returns the ID of the last inserted row, or the last value from a sequence object,
//       depending on the underlying driver.
//
//       Note: This method may not return a meaningful or consistent result across different drivers,
//       because the underlying database may not even support the notion of AUTO_INCREMENT/IDENTITY
//       columns or sequences.*/
//   public lastInsertId(seqName = null) {
//     return this.getWrappedConnection().lastInsertId(seqName);
//   }
//
//   /*Executes a function in a transaction.
//
//       The function gets passed this Connection instance as an (optional) parameter.
//
//       If an exception occurs during execution of the function or transaction commit,
//       the transaction is rolled back and the exception re-thrown.*/
//   public transactional(func) {
//     this.beginTransaction();
//     try {
//       var res = func(this);
//       this.commit();
//       return res;
//     } catch (e) {
//     }
//   }
//
//   /*Sets if nested transactions should use savepoints.*/
//   public setNestTransactionsWithSavepoints(
//     nestTransactionsWithSavepoints: boolean
//   ) {
//     if (this.transactionNestingLevel > 0) {
//       throw ConnectionException.mayNotAlterNestedTransactionWithSavepointsInTransaction();
//     }
//     if (!this.getDatabasePlatform().supportsSavepoints()) {
//       throw ConnectionException.savepointsNotSupported();
//     }
//     this.nestTransactionsWithSavepoints =
//       //cast type bool
//       nestTransactionsWithSavepoints;
//   }
//
//   /*Gets if nested transactions should use savepoints.*/
//   public getNestTransactionsWithSavepoints() {
//     return this.nestTransactionsWithSavepoints;
//   }
//
//   /*{@inheritDoc}*/
//   public beginTransaction() {
//     var connection = this.getWrappedConnection();
//     ++this.transactionNestingLevel;
//     var logger = this._config.getSQLLogger();
//     if (this.transactionNestingLevel === 1) {
//       if (logger) {
//         logger.startQuery('"START TRANSACTION"');
//       }
//       connection.beginTransaction();
//       if (logger) {
//         logger.stopQuery();
//       }
//     } else if (this.nestTransactionsWithSavepoints) {
//       if (logger) {
//         logger.startQuery('"SAVEPOINT"');
//       }
//       this.createSavepoint(this._getNestedTransactionSavePointName());
//       if (logger) {
//         logger.stopQuery();
//       }
//     }
//     return true;
//   }
//
//   /*{@inheritDoc}*/
//   public commit() {
//     if (this.transactionNestingLevel === 0) {
//       throw ConnectionException.noActiveTransaction();
//     }
//     if (this.isRollbackOnly) {
//       throw ConnectionException.commitFailedRollbackOnly();
//     }
//     var result = true;
//     var connection = this.getWrappedConnection();
//     var logger = this._config.getSQLLogger();
//     if (this.transactionNestingLevel === 1) {
//       if (logger) {
//         logger.startQuery('"COMMIT"');
//       }
//       var result = connection.commit();
//       if (logger) {
//         logger.stopQuery();
//       }
//     } else if (this.nestTransactionsWithSavepoints) {
//       if (logger) {
//         logger.startQuery('"RELEASE SAVEPOINT"');
//       }
//       this.releaseSavepoint(this._getNestedTransactionSavePointName());
//       if (logger) {
//         logger.stopQuery();
//       }
//     }
//     --this.transactionNestingLevel;
//     if (this.autoCommit !== false || this.transactionNestingLevel !== 0) {
//       return result;
//     }
//     this.beginTransaction();
//     return result;
//   }
//
//   /*Cancels any database changes done during the current transaction.*/
//   public rollBack() {
//     if (this.transactionNestingLevel === 0) {
//       throw ConnectionException.noActiveTransaction();
//     }
//     var connection = this.getWrappedConnection();
//     var logger = this._config.getSQLLogger();
//     if (this.transactionNestingLevel === 1) {
//       if (logger) {
//         logger.startQuery('"ROLLBACK"');
//       }
//       this.transactionNestingLevel = 0;
//       connection.rollBack();
//       this.isRollbackOnly = false;
//       if (logger) {
//         logger.stopQuery();
//       }
//       if (this.autoCommit === false) {
//         this.beginTransaction();
//       }
//     } else if (this.nestTransactionsWithSavepoints) {
//       if (logger) {
//         logger.startQuery('"ROLLBACK TO SAVEPOINT"');
//       }
//       this.rollbackSavepoint(this._getNestedTransactionSavePointName());
//       --this.transactionNestingLevel;
//       if (logger) {
//         logger.stopQuery();
//       }
//     } else {
//       this.isRollbackOnly = true;
//       --this.transactionNestingLevel;
//     }
//     return true;
//   }
//
//   /*Creates a new savepoint.*/
//   public createSavepoint(savepoint) {
//     if (!this.getDatabasePlatform().supportsSavepoints()) {
//       throw ConnectionException.savepointsNotSupported();
//     }
//     this.getWrappedConnection().exec(this.platform.createSavePoint(savepoint));
//   }
//
//   /*Releases the given savepoint.*/
//   public releaseSavepoint(savepoint) {
//     if (!this.getDatabasePlatform().supportsSavepoints()) {
//       throw ConnectionException.savepointsNotSupported();
//     }
//     if (!this.platform.supportsReleaseSavepoints()) {
//       return;
//     }
//     this.getWrappedConnection().exec(this.platform.releaseSavePoint(savepoint));
//   }
//
//   /*Rolls back to the given savepoint.*/
//   public rollbackSavepoint(savepoint) {
//     if (!this.getDatabasePlatform().supportsSavepoints()) {
//       throw ConnectionException.savepointsNotSupported();
//     }
//     this.getWrappedConnection().exec(
//       this.platform.rollbackSavePoint(savepoint)
//     );
//   }
//
//   /*Gets the wrapped driver connection.*/
//   public getWrappedConnection() {
//     this.connect();
//     return this._conn;
//   }
//
//   /*Gets the SchemaManager that can be used to inspect or change the
//       database schema through the connection.*/
//   public getSchemaManager() {
//     if (this._schemaManager === null) {
//       this._schemaManager = this._driver.getSchemaManager(this);
//     }
//     return this._schemaManager;
//   }
//
//   /*Marks the current transaction so that the only possible
//       outcome for the transaction to be rolled back.*/
//   public setRollbackOnly() {
//     if (this.transactionNestingLevel === 0) {
//       throw ConnectionException.noActiveTransaction();
//     }
//     this.isRollbackOnly = true;
//   }
//
//   /*Checks whether the current transaction is marked for rollback only.*/
//   public isRollbackOnly() {
//     if (this.transactionNestingLevel === 0) {
//       throw ConnectionException.noActiveTransaction();
//     }
//     return this.isRollbackOnly;
//   }
//
//   /*Converts a given value to its database representation according to the conversion
//       rules of a specific DBAL mapping type.*/
//   public convertToDatabaseValue(value, type) {
//     return Type.getType(type).convertToDatabaseValue(
//       value,
//       this.getDatabasePlatform()
//     );
//   }
//
//   /*Converts a given value to its PHP representation according to the conversion
//       rules of a specific DBAL mapping type.*/
//   public convertToPHPValue(value, type) {
//     return Type.getType(type).convertToPHPValue(
//       value,
//       this.getDatabasePlatform()
//     );
//   }
//
//   /*Resolves the parameters to a format which can be displayed.*/
//   public resolveParams(params: any[], types: number[] | string[]) {
//     var resolvedParams = [];
//     if (is_int(key(params))) {
//       var typeOffset = array_key_exists(0, types) ? -1 : 0;
//       var bindIndex = 1;
//       for (let value of params) {
//         var typeIndex = bindIndex + typeOffset;
//         if (types[typeIndex] !== undefined) {
//           var type = types[typeIndex];
//           const [value] = this.getBindingInfo(value, type);
//           resolvedParams[bindIndex] = value;
//         } else {
//           resolvedParams[bindIndex] = value;
//         }
//         ++bindIndex;
//       }
//     } else {
//       for (let [name, value] of Object.entries(params)) {
//         if (types[name] !== undefined) {
//           var type = types[name];
//           const [value] = this.getBindingInfo(value, type);
//           resolvedParams[name] = value;
//         } else {
//           resolvedParams[name] = value;
//         }
//       }
//     }
//     return resolvedParams;
//   }
//
//   /*Creates a new instance of a SQL query builder.*/
//   public createQueryBuilder() {
//     return new Query.QueryBuilder(this);
//   }
//
//   /*Ping the server
//
//       When the server is not available the method returns FALSE.
//       It is responsibility of the developer to handle this case
//       and abort the request or reconnect manually:*/
//   public ping() {
//     var connection = this.getWrappedConnection();
//     if (connection instanceof PingableConnection) {
//       return connection.ping();
//     }
//     try {
//       this.query(this.getDatabasePlatform().getDummySelectSQL());
//       return true;
//     } catch (e) {
//       return false;
//     }
//   }
//
//   /*Returns the savepoint name to use for nested transactions are false if they are not supported
//       "savepointFormat" parameter is not set*/
//   protected _getNestedTransactionSavePointName() {
//     return 'DOCTRINE2_SAVEPOINT_' + this.transactionNestingLevel;
//   }
//
//   /*Detects and sets the database platform.
//
//       Evaluates custom platform class and version in order to set the correct platform.*/
//   private detectDatabasePlatform() {
//     var version = this.getDatabasePlatformVersion();
//     if (version !== null) {
//       assert(this._driver instanceof VersionAwarePlatformDriver);
//       this.platform = this._driver.createDatabasePlatformForVersion(version);
//     } else {
//       this.platform = this._driver.getDatabasePlatform();
//     }
//     this.platform.setEventManager(this._eventManager);
//   }
//
//   /*Returns the version of the related platform if applicable.
//
//       Returns null if either the driver is not capable to create version
//       specific platform instances, no explicit server version was specified
//       or the underlying driver connection cannot determine the platform
//       version without having to query it (performance reasons).*/
//   private getDatabasePlatformVersion() {
//     if (!this._driver instanceof VersionAwarePlatformDriver) {
//       return null;
//     }
//     if (this.params['serverVersion'] !== undefined) {
//       return this.params['serverVersion'];
//     }
//     if (this._conn === null) {
//       try {
//         this.connect();
//       } catch (originalException) {
//         if (empty(this.params['dbname'])) {
//           throw originalException;
//         }
//         var databaseName = this.params['dbname'];
//         this.params['dbname'] = null;
//         try {
//           this.connect();
//         } catch (fallbackException) {
//           this.params['dbname'] = databaseName;
//           throw originalException;
//         }
//         this.params['dbname'] = databaseName;
//         var serverVersion = this.getServerVersion();
//         this.close();
//         return serverVersion;
//       }
//     }
//     return this.getServerVersion();
//   }
//
//   /*Returns the database server version if the underlying driver supports it.*/
//   private getServerVersion() {
//     var connection = this.getWrappedConnection();
//     if (
//       connection instanceof ServerInfoAwareConnection &&
//       !connection.requiresQueryForServerVersion()
//     ) {
//       return connection.getServerVersion();
//     }
//     return null;
//   }
//
//   /*Adds identifier condition to the query components*/
//   private addIdentifierCondition(identifier, columns, values, conditions) {
//     var platform = this.getDatabasePlatform();
//     for (let [columnName, value] of Object.entries(identifier)) {
//       if (value === null) {
//         conditions.push(platform.getIsNullExpression(columnName));
//         continue;
//       }
//       columns.push(columnName);
//       values.push(value);
//       conditions.push(columnName + ' = ?');
//     }
//   }
//
//   /*Extract ordered type list from an ordered column list and type map.*/
//   private extractTypeValues(
//     columnList: number[] | string[],
//     types: number[] | string[]
//   ) {
//     var typeValues = [];
//     for (let [columnIndex, columnName] of Object.entries(columnList)) {
//       typeValues.push(types[columnName] || ParameterType.STRING);
//     }
//     return typeValues;
//   }
//
//   /*Commits all current nesting transactions.*/
//   private commitAll() {
//     while (this.transactionNestingLevel !== 0) {
//       if (this.autoCommit === false && this.transactionNestingLevel === 1) {
//         this.commit();
//         return;
//       }
//       this.commit();
//     }
//   }
//
//   /*Binds a set of parameters, some or all of which are typed with a PDO binding type
//       or DBAL mapping type, to a given statement.*/
//   private _bindTypedValues(stmt, params, types) {
//     if (is_int(key(params))) {
//       var typeOffset = array_key_exists(0, types) ? -1 : 0;
//       var bindIndex = 1;
//       for (let value of params) {
//         var typeIndex = bindIndex + typeOffset;
//         if (types[typeIndex] !== undefined) {
//           var type = types[typeIndex];
//           const [value, bindingType] = this.getBindingInfo(value, type);
//           stmt.bindValue(bindIndex, value, bindingType);
//         } else {
//           stmt.bindValue(bindIndex, value);
//         }
//         ++bindIndex;
//       }
//     } else {
//       for (let [name, value] of Object.entries(params)) {
//         if (types[name] !== undefined) {
//           var type = types[name];
//           const [value, bindingType] = this.getBindingInfo(value, type);
//           stmt.bindValue(name, value, bindingType);
//         } else {
//           stmt.bindValue(name, value);
//         }
//       }
//     }
//   }
//
//   /*Gets the binding type of a given type. The given type can be a PDO or DBAL mapping type.*/
//   private getBindingInfo(value, type) {
//     if (is_string(type)) {
//       var type = Type.getType(type);
//     }
//     if (type instanceof Type) {
//       var value = type.convertToDatabaseValue(
//         value,
//         this.getDatabasePlatform()
//       );
//       var bindingType = type.getBindingType();
//     } else {
//       var bindingType = type;
//     }
//     return [value, bindingType];
//   }
// }
