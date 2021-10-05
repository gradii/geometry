/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { SchemaManager } from '../schema-manager';
import { Table } from '../table';


export class MysqlSchemaManager extends SchemaManager {
  listTableDetails(table: string): Table {
    throw new Error('not implement');
  }

  getDatabasePlatform(): void {
  }

}
