/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqliteDriver } from '../driver/sqlite/sqlite-driver';
import { Connector } from './connector';
import { ConnectorInterface } from './connector-interface';
import * as sqlite3 from 'sqlite3';


export class SqliteConnector extends Connector implements ConnectorInterface {
  /*Establish a database connection.*/
  public async connect(config: any) {
    const options = this.getOptions(config);
    if (config['database'] === ':memory:') {
      return this.createConnection('sqlite::memory:', config, options);
    }
    const path = config['database'];
    if (path === false) {
      throw new Error(`InvalidArgumentException Database (${config['database']}) does not exist.`);
    }
    return this.createConnection(`sqlite:${path}`, config, options);
  }

  createConnection(dsn: string, config: any, options: any) {
    const [username, password] = [config['username'] ?? null, config['password'] ?? null];
    try {
      return new sqlite3.Database('');
    } catch (e) {
      return this.tryAgainIfCausedByLostConnection(e, dsn, username, password, options);
    }
  }
}
