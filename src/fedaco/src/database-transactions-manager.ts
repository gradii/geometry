/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Collection } from 'Illuminate/Support/Collection';
import { DatabaseTransactionRecord } from './database-transaction-record';

export class DatabaseTransactionsManager {
  /*All of the recorded transactions.*/
  protected transactions: Collection;

  /*Create a new database transactions manager instance.*/
  public constructor() {
    this.transactions = collect();
  }

  /*Start a new database transaction.*/
  public begin(connection: string, level: number) {
    this.transactions.push(new DatabaseTransactionRecord(connection, level));
  }

  /*Rollback the active database transaction.*/
  public rollback(connection: string, level: number) {
    this.transactions = this.transactions.reject(transaction => {
      return transaction.connection == connection && transaction.level > level;
    }).values();
  }

  /*Commit the active database transaction.*/
  public commit(connection: string) {
    const [forThisConnection, forOtherConnections] = this.transactions.partition(transaction => {
      return transaction.connection == connection;
    });
    this.transactions                              = forOtherConnections.values();
    forThisConnection.map.executeCallbacks();
  }

  /*Register a transaction callback.*/
  public addCallback(callback: callable) {
    if (current = this.transactions.last()) {
      return current.addCallback(callback);
    }
    call_user_func(callback);
  }

  /*Get all the transactions.*/
  public getTransactions() {
    return this.transactions;
  }
}
