/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { Connection } from '../connection';
import { SqlServerDriver } from '../driver/sql-server/sql-server-driver';
import { SqlserverQueryGrammar } from '../query-builder/grammar/sqlserver-query-grammar';
import { SqlServerProcessor } from '../query-builder/processor/sql-server-processor';
import { SqlServerSchemaBuilder } from '../schema/builder/sql-server-schema-builder';
import { SqlServerSchemaGrammar } from '../schema/grammar/sql-server-schema-grammar';

export class SqlServerConnection extends Connection {
  /*Execute a Closure within a transaction.*/
  public transaction(callback: Function, attempts: number = 1) {
    for (let a = 1; a <= attempts; a++) {
      if (this.getDriverName() === 'sqlsrv') {
        return super.transaction(callback);
      }
      this.getPdo().exec('BEGIN TRAN');
      let result;
      try {
        result = callback(this);
        this.getPdo().exec('COMMIT TRAN');
      } catch (e) {
        this.getPdo().exec('ROLLBACK TRAN');
        throw e;
      }
      return result;
    }
  }

  /*Get the default query grammar instance.*/
  protected getDefaultQueryGrammar() {
    return this.withTablePrefix(new SqlserverQueryGrammar());
  }

  /*Get a schema builder instance for the connection.*/
  public getSchemaBuilder() {
    if (isBlank(this.schemaGrammar)) {
      this.useDefaultSchemaGrammar();
    }
    return new SqlServerSchemaBuilder(this);
  }

  /*Get the default schema grammar instance.*/
  protected getDefaultSchemaGrammar() {
    return this.withTablePrefix(new SqlServerSchemaGrammar());
  }

  /*Get the schema state for the connection.*/
  public getSchemaState(files: Filesystem | null = null, processFactory: Function | null = null) {
    throw new Error('RuntimeException Schema dumping is not supported when using SQL Server.');
  }

  /*Get the default post processor instance.*/
  protected getDefaultPostProcessor() {
    return new SqlServerProcessor();
  }

  /*Get the Doctrine DBAL driver.*/
  protected getDoctrineDriver() {
    return new SqlServerDriver();
  }
}
