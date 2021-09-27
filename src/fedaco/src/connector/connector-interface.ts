export interface ConnectorInterface {
    /*Establish a database connection.*/
    connect(config: any[]);
}
