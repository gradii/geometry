/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export interface ConnectionResolverInterface {
  /*Get a database connection instance.*/
  connection(name: string | null);

  /*Get the default connection name.*/
  getDefaultConnection();

  /*Set the default connection name.*/
  setDefaultConnection(name: string);
}
