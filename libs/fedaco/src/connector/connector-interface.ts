/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export interface ConnectorInterface {
    /*Establish a database connection.*/
    connect(config: any[]);
}
