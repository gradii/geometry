import { InvalidArgumentException } from "InvalidArgumentException";
export class SqliteConnector extends Connector implements ConnectorInterface {
    /*Establish a database connection.*/
    public connect(config: any[]) {
        var options = this.getOptions(config);
        if (config["database"] === ":memory:") {
            return this.createConnection("sqlite::memory:", config, options);
        }
        var path = realpath(config["database"]);
        if (path === false) {
            throw new InvalidArgumentException("\"Database ({$config['database']}) does not exist.\"");
        }
        return this.createConnection("\"sqlite:{$path}\"", config, options);
    }
}
