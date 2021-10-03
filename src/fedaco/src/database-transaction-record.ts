/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export class DatabaseTransactionRecord {
    /*The name of the database connection.*/
    public connection: string;
    /*The transaction level.*/
    public level: number;
    /*The callbacks that should be executed after committing.*/
    protected callbacks: any[] = [];
    /*Create a new database transaction record instance.*/
    public constructor(connection: string, level: number) {
        this.connection = connection;
        this.level = level;
    }
    /*Register a callback to be executed after committing.*/
    public addCallback(callback: callable) {
        this.callbacks.push(callback);
    }
    /*Execute all of the callbacks.*/
    public executeCallbacks() {
        for (const callback of this.callbacks) {
            call_user_func(callback);
        }
    }
    /*Get all of the callbacks.*/
    public getCallbacks() {
        return this.callbacks;
    }
}
