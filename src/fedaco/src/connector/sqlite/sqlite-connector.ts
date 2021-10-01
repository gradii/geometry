/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import * as sqlite3 from 'sqlite3';
import { Connector } from '../connector';
import { ConnectorInterface } from '../connector-interface';
import { SqliteWrappedConnection } from './sqlite-wrapped-connection';


export class SqliteConnector extends Connector implements ConnectorInterface {
  /*Establish a database connection.*/
  public async connect(config: any) {
    const options = this.getOptions(config);
    if (config['database'] === ':memory:') {
      return this.createConnection(':memory:', config, options);
    }
    const path = config['database'];
    if (path === false) {
      throw new Error(`InvalidArgumentException Database (${config['database']}) does not exist.`);
    }
    return this.createConnection(`${path}`, config, options);
  }

  createConnection(database: string, config: any, options: any) {
    const [username, password] = [config['username'] ?? null, config['password'] ?? null];
    try {
      return new SqliteWrappedConnection(new sqlite3.Database(database));
    } catch (e) {
      return this.tryAgainIfCausedByLostConnection(e, database, username, password, options);
    }
  }
}
