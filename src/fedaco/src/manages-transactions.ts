/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { isBlank } from '@gradii/check-type';
import { Connection } from './connection';
import { DatabaseTransactionsManager } from './database-transactions-manager';
import { Constructor } from './helper/constructor';

export interface ManagesTransactions {
  /*The number of active transactions.*/
  _transactions: number;
  /*The transaction manager instance.*/
  _transactionsManager: DatabaseTransactionsManager;

  transaction(callback: Function, attempts: number): Promise<any>;
}

type ManagesTransactionsCtor = Constructor<ManagesTransactions>;

export function mixinManagesTransactions<T extends Constructor<any>>(base: T): ManagesTransactionsCtor {
  return class _Self extends base {
    /*The number of active transactions.*/
    protected _transactions: number = 0;
    /*The transaction manager instance.*/
    protected _transactionsManager: DatabaseTransactionsManager;

    /*Execute a Closure within a transaction.*/
    public async transaction(this: Connection & _Self, callback: Function, attempts: number = 1) {
      let callbackResult;
      for (let currentAttempt = 1; currentAttempt <= attempts; currentAttempt++) {
        await this.beginTransaction();
        try {
          callbackResult = await callback(this);
        } catch (e) {
          this.handleTransactionException(e, currentAttempt, attempts);
          continue;
        }
        try {
          if (this._transactions == 1) {
            await (await this.getPdo()).commit();
          }
          this._transactions = Math.max(0, this._transactions - 1);
          if (this._transactions == 0) {
            optional(this._transactionsManager).commit(this.getName());
          }
        } catch (e) {
          this.handleCommitTransactionException(e, currentAttempt, attempts);
          continue;
        }
        this.fireConnectionEvent('committed');
        return callbackResult;
      }
    }

    /*Handle an exception encountered when running a transacted statement.*/
    protected handleTransactionException(e: Error, currentAttempt: number, maxAttempts: number) {
      if (this.causedByConcurrencyError(e) && this._transactions > 1) {
        this._transactions--;
        optional(this._transactionsManager).rollback(this.getName(), this._transactions);
        throw e;
      }
      this.rollBack();
      if (this.causedByConcurrencyError(e) && currentAttempt < maxAttempts) {
        return;
      }
      throw e;
    }

    /*Start a new database transaction.*/
    public async beginTransaction() {
      this.createTransaction();
      this._transactions++;
      optional(this._transactionsManager).begin(this.getName(), this._transactions);
      this.fireConnectionEvent('beganTransaction');
    }

    /*Create a transaction within the database.*/
    protected async createTransaction() {
      if (this._transactions == 0) {
        this.reconnectIfMissingConnection();
        try {
          await (await this.getPdo()).beginTransaction();
        } catch (e) {
          this.handleBeginTransactionException(e);
        }
      } else if (this._transactions >= 1 && this.queryGrammar.supportsSavepoints()) {
        this._createSavepoint();
      }
    }

    /*Create a save point within the database.*/
    protected async _createSavepoint() {
      await (await this.getPdo()).exec(this.queryGrammar.compileSavepoint('trans' + (this._transactions + 1)));
    }

    /*Handle an exception from a transaction beginning.*/
    protected async handleBeginTransactionException(e: Error) {
      if (this.causedByLostConnection(e)) {
        this.reconnect();
        await (await this.getPdo()).beginTransaction();
      } else {
        throw e;
      }
    }

    /*Commit the active database transaction.*/
    public async commit(this: Connection & _Self) {
      if (this._transactions == 1) {
        await (await this.getPdo()).commit();
      }
      this._transactions = Math.max(0, this._transactions - 1);
      if (this._transactions == 0) {
        optional(this._transactionsManager).commit(this.getName());
      }
      this.fireConnectionEvent('committed');
    }

    /*Handle an exception encountered when committing a transaction.*/
    protected handleCommitTransactionException(e: Error, currentAttempt: number,
                                               maxAttempts: number) {
      this._transactions = Math.max(0, this._transactions - 1);
      if (this.causedByConcurrencyError(e) && currentAttempt < maxAttempts) {
        return;
      }
      if (this.causedByLostConnection(e)) {
        this._transactions = 0;
      }
      throw e;
    }

    /*Rollback the active database transaction.*/
    public async rollBack(toLevel: number | null = null) {
      toLevel = isBlank(toLevel) ? this._transactions - 1 : toLevel;
      if (toLevel < 0 || toLevel >= this._transactions) {
        return;
      }
      try {
        this.performRollBack(toLevel);
      } catch (e) {
        this.handleRollBackException(e);
      }
      this._transactions = toLevel;
      optional(this._transactionsManager).rollback(this.getName(), this._transactions);
      this.fireConnectionEvent('rollingBack');
    }

    /*Perform a rollback within the database.*/
    protected async performRollBack(toLevel: number) {
      if (toLevel == 0) {
        await (await this.getPdo()).rollBack();
      } else if (this.queryGrammar.supportsSavepoints()) {
        await this.getPdo().exec(this.queryGrammar.compileSavepointRollBack('trans' + (toLevel + 1)));
      }
    }

    /*Handle an exception from a rollback.*/
    protected handleRollBackException(e) {
      if (this.causedByLostConnection(e)) {
        this._transactions = 0;
        optional(this._transactionsManager).rollback(this.getName(), this._transactions);
      }
      throw e;
    }

    /*Get the number of active transactions.*/
    public transactionLevel() {
      return this._transactions;
    }

    /*Execute the callback after a transaction commits.*/
    public afterCommit(this: Connection & _Self, callback: Function) {
      if (this._transactionsManager) {
        return this._transactionsManager.addCallback(callback);
      }
      throw new Error('RuntimeException Transactions Manager has not been set.');
    }

    /*Set the transaction manager instance on the connection.*/
    public setTransactionManager(manager: DatabaseTransactionsManager) {
      this._transactionsManager = manager;
      return this;
    }

    /*Unset the transaction manager for this connection.*/
    public unsetTransactionManager() {
      this._transactionsManager = null;
    }
  };
}
