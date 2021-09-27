/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Migration } from 'Illuminate/Database/Migrations/Migration';

export class MigrationEvent implements MigrationEvent {
  /*A migration instance.*/
  public migration: Migration;
  /*The migration method that was called.*/
  public method: string;

  /*Create a new event instance.*/
  public constructor(migration: Migration, method: string) {
    this.method    = method;
    this.migration = migration;
  }
}
