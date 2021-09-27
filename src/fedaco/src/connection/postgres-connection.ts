/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank, isNumber, isString } from '@gradii/check-type';
import { Connection } from '../connection';
import { PostgresDriver } from '../driver/postgres/postgres-driver';
import { PostgresQueryGrammar } from '../query-builder/grammar/postgres-query-grammar';
import { PostgresProcessor } from '../query-builder/processor/postgres-processor';
import { PostgresSchemaBuilder } from '../schema/builder/postgres-schema-builder';
import { PostgresSchemaGrammar } from '../schema/grammar/postgres-schema-grammar';

export class PostgresConnection extends Connection {
  /*Bind values to their parameters in the given statement.*/
  public bindValues(statement: PDOStatement, bindings: any[]) {
    for (const [key, value] of Object.entries(bindings)) {
      if (isNumber(value)) {
        const pdoParam = PDO.PARAM_INT;
      } else if (is_resource(value)) {
        const pdoParam = PDO.PARAM_LOB;
      } else {
        const pdoParam = PDO.PARAM_STR;
      }
      statement.bindValue(isString(key) ? key : key + 1, value, pdoParam);
    }
  }

  /*Get the default query grammar instance.*/
  protected getDefaultQueryGrammar() {
    return this.withTablePrefix(new PostgresQueryGrammar());
  }

  /*Get a schema builder instance for the connection.*/
  public getSchemaBuilder() {
    if (isBlank(this.schemaGrammar)) {
      this.useDefaultSchemaGrammar();
    }
    return new PostgresSchemaBuilder(this);
  }

  /*Get the default schema grammar instance.*/
  protected getDefaultSchemaGrammar() {
    return this.withTablePrefix(new PostgresSchemaGrammar());
  }

  /*Get the schema state for the connection.*/
  public getSchemaState(files: Filesystem | null = null, processFactory: callable | null = null) {
    return new PostgresSchemaState(this, files, processFactory);
  }

  /*Get the default post processor instance.*/
  protected getDefaultPostProcessor() {
    return new PostgresProcessor();
  }

  /*Get the Doctrine DBAL driver.*/
  protected getDoctrineDriver() {
    return new PostgresDriver();
  }
}
