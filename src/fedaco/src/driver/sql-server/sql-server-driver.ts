/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { DbalConnection } from '../../dbal/connection';
import { SchemaManager } from '../../dbal/schema-manager';
import { Driver } from '../driver';

export class SqlServerDriver implements Driver {
  connect(): DbalConnection {
    return undefined;
  }

  getSchemaManager(connection: any, platform: any): SchemaManager {
    return undefined;
  }

}
