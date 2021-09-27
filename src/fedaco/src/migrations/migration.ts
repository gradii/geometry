/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export class Migration {
  /*The name of the database connection to use.*/
  protected connection: string | null;
  /*Enables, if supported, wrapping the migration within a transaction.*/
  public withinTransaction: boolean = true;

  /*Get the migration connection name.*/
  public getConnection() {
    return this.connection;
  }
}
