/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { DbalConnection } from '../dbal/connection';
import { SchemaManager } from '../dbal/schema-manager';


export interface Driver {
  getSchemaManager(connection: any, platform: any): SchemaManager;

  connect(): DbalConnection;

}
