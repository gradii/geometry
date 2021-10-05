/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { Table } from './table';


export abstract class SchemaManager {
  listTableDetails(table: string): Table {
    throw new Error('not implement');
  }

  getDatabasePlatform() {

  }
}
