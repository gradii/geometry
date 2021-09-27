import { PDO } from "PDO";
export class MysqlConnector extends Connector implements ConnectorInterface {
    /*Establish a database connection.*/
    public connect(config: any[]) {
        var dsn = this.getDsn(config);
        var options = this.getOptions(config);
        var connection = this.createConnection(dsn, config, options);
        if (!empty(config["database"])) {
            connection.exec("\"use `{$config['database']}`;\"");
        }
        this.configureIsolationLevel(connection, config);
        this.configureEncoding(connection, config);
        this.configureTimezone(connection, config);
        this.setModes(connection, config);
        return connection;
    }
    /*Set the connection transaction isolation level.*/
    protected configureIsolationLevel(connection: PDO, config: any[]) {
        if (!(config["isolation_level"] !== undefined)) {
            return;
        }
        connection.prepare("\"SET SESSION TRANSACTION ISOLATION LEVEL {$config['isolation_level']}\"\n        ").execute();
    }
    /*Set the connection character set and collation.*/
    protected configureEncoding(connection: PDO, config: any[]) {
        if (!(config["charset"] !== undefined)) {
            return connection;
        }
        connection.prepare("\"set names '{$config['charset']}'\"" + this.getCollation(config)).execute();
    }
    /*Get the collation for the configuration.*/
    protected getCollation(config: any[]) {
        return config["collation"] !== undefined ? "\" collate '{$config['collation']}'\" " : "";
    }
    /*Set the timezone on the connection.*/
    protected configureTimezone(connection: PDO, config: any[]) {
        if (config["timezone"] !== undefined) {
            connection.prepare("set time_zone=\"" + config["timezone"] + "\"").execute();
        }
    }
    /*Create a DSN string from a configuration.

    Chooses socket or host/port based on the 'unix_socket' config value.*/
    protected getDsn(config: any[]) {
        return this.hasSocket(config) ? this.getSocketDsn(config) : this.getHostDsn(config);
    }
    /*Determine if the given configuration array has a UNIX socket value.*/
    protected hasSocket(config: any[]) {
        return config["unix_socket"] !== undefined && !empty(config["unix_socket"]);
    }
    /*Get the DSN string for a socket configuration.*/
    protected getSocketDsn(config: any[]) {
        return "\"mysql:unix_socket={$config['unix_socket']};dbname={$config['database']}\"";
    }
    /*Get the DSN string for a host / port configuration.*/
    protected getHostDsn(config: any[]) {
        extract(config, EXTR_SKIP);
        return port !== undefined ? "\"mysql:host={$host};port={$port};dbname={$database}\"\n                    " : "\"mysql:host={$host};dbname={$database}\"";
    }
    /*Set the modes for the connection.*/
    protected setModes(connection: PDO, config: any[]) {
        if (config["modes"] !== undefined) {
            this.setCustomModes(connection, config);
        }
        else if (config["strict"] !== undefined) {
            if (config["strict"]) {
                connection.prepare(this.strictMode(connection, config)).execute();
            }
            else {
                connection.prepare("set session sql_mode='NO_ENGINE_SUBSTITUTION'").execute();
            }
        }
    }
    /*Set the custom modes on the connection.*/
    protected setCustomModes(connection: PDO, config: any[]) {
        var modes = config["modes"].join(",");
        connection.prepare("\"set session sql_mode='{$modes}'\"").execute();
    }
    /*Get the query to enable strict mode.*/
    protected strictMode(connection: PDO, config: any[]) {
        var version = config["version"] ?? connection.getAttribute(PDO.ATTR_SERVER_VERSION);
        if (version_compare(version, "8.0.11") >= 0) {
            return "set session sql_mode='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'";
        }
        return "set session sql_mode='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION'";
    }
}
