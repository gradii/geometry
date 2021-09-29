/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Connector } from './connector';
import { ConnectorInterface } from './connector-interface';

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
}
