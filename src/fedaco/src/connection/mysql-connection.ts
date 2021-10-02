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
import { SchemaGrammar } from '../schema/grammar/schema-grammar';
import { MySqlSchemaState } from '../schema/mysql-schema-state';

export class MysqlConnection extends Connection {
  /*Determine if the connected database is a MariaDB database.*/
  public async isMaria() {
    return false;
    // return (await this.getPdo()).getAttribute('ATTR_SERVER_VERSION').includes('MariaDB');
  }

  /*Get the default query grammar instance.*/
  protected getDefaultQueryGrammar(): MysqlQueryGrammar {
    return this.withTablePrefix(new MysqlQueryGrammar()) as MysqlQueryGrammar;
  }

  /*Get a schema builder instance for the connection.*/
  public getSchemaBuilder(): MysqlSchemaBuilder {
    if (isBlank(this.schemaGrammar)) {
      this.useDefaultSchemaGrammar();
    }
    return new MysqlSchemaBuilder(this);
  }

  /*Get the default schema grammar instance.*/
  protected getDefaultSchemaGrammar(): SchemaGrammar {
    return this.withTablePrefix(new MysqlSchemaGrammar()) as SchemaGrammar;
  }

  /*Get the schema state for the connection.*/
  public getSchemaState(files?: any, processFactory?: Function) {
    return new MySqlSchemaState(this, files, processFactory);
  }

  /*Get the default post processor instance.*/
  protected getDefaultPostProcessor() {
    return new MysqlProcessor();
  }

  /*Get the Doctrine DBAL driver.*/
  protected getDoctrineDriver(): MysqlDriver {
    return new MysqlDriver();
  }
}
