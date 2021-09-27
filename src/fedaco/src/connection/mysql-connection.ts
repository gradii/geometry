/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { Connection } from '../connection';
import { MysqlDriver } from '../driver/mysql/mysql-driver';
import { MysqlQueryGrammar } from '../query-builder/grammar/mysql-query-grammar';
import { MysqlProcessor } from '../query-builder/processor/mysql-processor';
import { MysqlSchemaBuilder } from '../schema/builder/mysql-schema-builder';
import { MysqlSchemaGrammar } from '../schema/grammar/mysql-schema-grammar';
import { MySqlSchemaState } from '../schema/mysql-schema-state';

export class MysqlConnection extends Connection {
  /*Determine if the connected database is a MariaDB database.*/
  public isMaria() {
    return this.getPdo().getAttribute(PDO.ATTR_SERVER_VERSION).includes('MariaDB');
  }

  /*Get the default query grammar instance.*/
  protected getDefaultQueryGrammar() {
    return this.withTablePrefix(new MysqlQueryGrammar());
  }

  /*Get a schema builder instance for the connection.*/
  public getSchemaBuilder() {
    if (isBlank(this.schemaGrammar)) {
      this.useDefaultSchemaGrammar();
    }
    return new MysqlSchemaBuilder(this);
  }

  /*Get the default schema grammar instance.*/
  protected getDefaultSchemaGrammar() {
    return this.withTablePrefix(new MysqlSchemaGrammar());
  }

  /*Get the schema state for the connection.*/
  public getSchemaState(files: Filesystem | null = null, processFactory: callable | null = null) {
    return new MySqlSchemaState(this, files, processFactory);
  }

  /*Get the default post processor instance.*/
  protected getDefaultPostProcessor() {
    return new MysqlProcessor();
  }

  /*Get the Doctrine DBAL driver.*/
  protected getDoctrineDriver() {
    return new MysqlDriver();
  }
}
