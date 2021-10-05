/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Connection } from '../../connection';
import { DbalConnection } from '../../dbal/connection';
import { SchemaManager } from '../../dbal/schema-manager';
import { MysqlSchemaManager } from '../../dbal/schema-manager/mysql-schema-manager';
import { Driver } from '../driver';
import { MysqlConnectionOptions } from './MysqlConnectionOptions';

/**
 * Organizes communication with MySQL DBMS.
 */
export class MysqlDriver implements Driver {

  // -------------------------------------------------------------------------
  // Public Properties
  // -------------------------------------------------------------------------

  /**
   * Connection used by driver.
   */
  connection: Connection;

  /**
   * Mysql underlying library.
   */
  mysql: any;

  /**
   * Connection pool.
   * Used in non-replication mode.
   */
  pool: any;

  /**
   * Pool cluster used in replication mode.
   */
  poolCluster: any;

  // -------------------------------------------------------------------------
  // Public Implemented Properties
  // -------------------------------------------------------------------------

  /**
   * Connection options.
   */
  options: MysqlConnectionOptions;

  /**
   * Master database used to perform all write queries.
   */
  database?: string;

  /**
   * Indicates if replication is enabled.
   */
  isReplicated: boolean = false;

  /**
   * Indicates if tree tables are supported by this driver.
   */
  treeSupport = true;

  getSchemaManager(connection: any, platform: any): SchemaManager {
    return new MysqlSchemaManager();
  }

  connect(): DbalConnection {
    throw new Error('not implement');
  }
}
