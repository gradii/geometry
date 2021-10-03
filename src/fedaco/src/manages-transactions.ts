export class ManagesTransactions {
  /*Execute a Closure within a transaction.*/
  public transaction(callback: Function, attempts: number = 1) {
    for (let currentAttempt = 1; currentAttempt <= attempts; currentAttempt++) {
      this.beginTransaction();
      try {
        var callbackResult = callback(this);
      } catch (e: Throwable) {
        this.handleTransactionException(e, currentAttempt, attempts);
        continue;
      }
      try {
        if (this.transactions == 1) {
          this.getPdo().commit();
        }
        this.transactions = max(0, this.transactions - 1);
        if (this.transactions == 0) {
          optional(this.transactionsManager).commit(this.getName());
        }
      } catch (e: Throwable) {
        this.handleCommitTransactionException(e, currentAttempt, attempts);
        continue;
      }
      this.fireConnectionEvent('committed');
      return callbackResult;
    }
  }

  /*Handle an exception encountered when running a transacted statement.*/
  protected handleTransactionException(e: Throwable, currentAttempt: number, maxAttempts: number) {
    if (this.causedByConcurrencyError(e) && this.transactions > 1) {
      this.transactions--;
      optional(this.transactionsManager).rollback(this.getName(), this.transactions);
      throw e;
    }
    this.rollBack();
    if (this.causedByConcurrencyError(e) && currentAttempt < maxAttempts) {
      return;
    }
    throw e;
  }

  /*Start a new database transaction.*/
  public beginTransaction() {
    this.createTransaction();
    this.transactions++;
    optional(this.transactionsManager).begin(this.getName(), this.transactions);
    this.fireConnectionEvent('beganTransaction');
  }

  /*Create a transaction within the database.*/
  protected createTransaction() {
    if (this.transactions == 0) {
      this.reconnectIfMissingConnection();
      try {
        this.getPdo().beginTransaction();
      } catch (e: Throwable) {
        this.handleBeginTransactionException(e);
      }
    } else if (this.transactions >= 1 && this.queryGrammar.supportsSavepoints()) {
      this.createSavepoint();
    }
  }

  /*Create a save point within the database.*/
  protected createSavepoint() {
    this.getPdo().exec(this.queryGrammar.compileSavepoint('trans' + (this.transactions + 1)));
  }

  /*Handle an exception from a transaction beginning.*/
  protected handleBeginTransactionException(e: Throwable) {
    if (this.causedByLostConnection(e)) {
      this.reconnect();
      this.getPdo().beginTransaction();
    } else {
      throw e;
    }
  }

  /*Commit the active database transaction.*/
  public commit() {
    if (this.transactions == 1) {
      this.getPdo().commit();
    }
    this.transactions = max(0, this.transactions - 1);
    if (this.transactions == 0) {
      optional(this.transactionsManager).commit(this.getName());
    }
    this.fireConnectionEvent('committed');
  }

  /*Handle an exception encountered when committing a transaction.*/
  protected handleCommitTransactionException(e: Throwable, currentAttempt: number,
                                             maxAttempts: number) {
    this.transactions = max(0, this.transactions - 1);
    if (this.causedByConcurrencyError(e) && currentAttempt < maxAttempts) {
      return;
    }
    if (this.causedByLostConnection(e)) {
      this.transactions = 0;
    }
    throw e;
  }

  /*Rollback the active database transaction.*/
  public rollBack(toLevel: number | null = null) {
    var toLevel = isBlank(toLevel) ? this.transactions - 1 : toLevel;
    if (toLevel < 0 || toLevel >= this.transactions) {
      return;
    }
    try {
      this.performRollBack(toLevel);
    } catch (e: Throwable) {
      this.handleRollBackException(e);
    }
    this.transactions = toLevel;
    optional(this.transactionsManager).rollback(this.getName(), this.transactions);
    this.fireConnectionEvent('rollingBack');
  }

  /*Perform a rollback within the database.*/
  protected performRollBack(toLevel: number) {
    if (toLevel == 0) {
      this.getPdo().rollBack();
    } else if (this.queryGrammar.supportsSavepoints()) {
      this.getPdo().exec(this.queryGrammar.compileSavepointRollBack('trans' + (toLevel + 1)));
    }
  }

  /*Handle an exception from a rollback.*/
  protected handleRollBackException(e: Throwable) {
    if (this.causedByLostConnection(e)) {
      this.transactions = 0;
      optional(this.transactionsManager).rollback(this.getName(), this.transactions);
    }
    throw e;
  }

  /*Get the number of active transactions.*/
  public transactionLevel() {
    return this.transactions;
  }

  /*Execute the callback after a transaction commits.*/
  public afterCommit(callback: callable) {
    if (this.transactionsManager) {
      return this.transactionsManager.addCallback(callback);
    }
    throw new Error('RuntimeException Transactions Manager has not been set.');
  }
}
