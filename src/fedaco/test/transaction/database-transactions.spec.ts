import { Exception } from 'Exception';
import { Manager as DB } from 'Illuminate/Database/Capsule/Manager';
import { DatabaseTransactionsManager } from 'Illuminate/Database/DatabaseTransactionsManager';

describe('test database transactions', () => {
  it('set up', () => {
    var db = new DB();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    }, 'second_connection');
    db.setAsGlobal();
    this.createSchema();
  });
  it('create schema', () => {
    [].forEach((connection, index) => {
    });
  });
  it('tear down', () => {
    [].forEach((connection, index) => {
    });
    m.close();
  });
  it('transaction is recorded and committed', () => {
    var transactionManager = m.mock(new DatabaseTransactionsManager());
    transactionManager.shouldReceive('begin').once()._with('default', 1);
    transactionManager.shouldReceive('commit').once()._with('default');
    this.connection().setTransactionManager(transactionManager);
    this.connection().table('users').insert({
      'name' : 'zain',
      'value': 1
    });
    this.connection().transaction(() => {
      this.connection().table('users').where({
        'name': 'zain'
      }).update({
        'value': 2
      });
    });
  });
  it('transaction is recorded and committed using the separate methods', () => {
    var transactionManager = m.mock(new DatabaseTransactionsManager());
    transactionManager.shouldReceive('begin').once()._with('default', 1);
    transactionManager.shouldReceive('commit').once()._with('default');
    this.connection().setTransactionManager(transactionManager);
    this.connection().table('users').insert({
      'name' : 'zain',
      'value': 1
    });
    this.connection().beginTransaction();
    this.connection().table('users').where({
      'name': 'zain'
    }).update({
      'value': 2
    });
    this.connection().commit();
  });
  it('nested transaction is recorded and committed', () => {
    var transactionManager = m.mock(new DatabaseTransactionsManager());
    transactionManager.shouldReceive('begin').once()._with('default', 1);
    transactionManager.shouldReceive('begin').once()._with('default', 2);
    transactionManager.shouldReceive('commit').once()._with('default');
    this.connection().setTransactionManager(transactionManager);
    this.connection().table('users').insert({
      'name' : 'zain',
      'value': 1
    });
    this.connection().transaction(() => {
      this.connection().table('users').where({
        'name': 'zain'
      }).update({
        'value': 2
      });
      this.connection().transaction(() => {
        this.connection().table('users').where({
          'name': 'zain'
        }).update({
          'value': 2
        });
      });
    });
  });
  it('nested transaction is recorde for different connectionsd and committed', () => {
    var transactionManager = m.mock(new DatabaseTransactionsManager());
    transactionManager.shouldReceive('begin').once()._with('default', 1);
    transactionManager.shouldReceive('begin').once()._with('second_connection', 1);
    transactionManager.shouldReceive('begin').once()._with('second_connection', 2);
    transactionManager.shouldReceive('commit').once()._with('default');
    transactionManager.shouldReceive('commit').once()._with('second_connection');
    this.connection().setTransactionManager(transactionManager);
    this.connection('second_connection').setTransactionManager(transactionManager);
    this.connection().table('users').insert({
      'name' : 'zain',
      'value': 1
    });
    this.connection().transaction(() => {
      this.connection().table('users').where({
        'name': 'zain'
      }).update({
        'value': 2
      });
      this.connection('second_connection').transaction(() => {
        this.connection('second_connection').table('users').where({
          'name': 'zain'
        }).update({
          'value': 2
        });
        this.connection('second_connection').transaction(() => {
          this.connection('second_connection').table('users').where({
            'name': 'zain'
          }).update({
            'value': 2
          });
        });
      });
    });
  });
  it('transaction is rolled back', () => {
    var transactionManager = m.mock(new DatabaseTransactionsManager());
    transactionManager.shouldReceive('begin').once()._with('default', 1);
    transactionManager.shouldReceive('rollback').once()._with('default', 0);
    transactionManager.shouldNotReceive('commit');
    this.connection().setTransactionManager(transactionManager);
    this.connection().table('users').insert({
      'name' : 'zain',
      'value': 1
    });
    try {
      this.connection().transaction(() => {
        this.connection().table('users').where({
          'name': 'zain'
        }).update({
          'value': 2
        });
        throw new Exception();
      });
    } catch (e: Throwable) {
    }
  });
  it('transaction is rolled back using separate methods', () => {
    var transactionManager = m.mock(new DatabaseTransactionsManager());
    transactionManager.shouldReceive('begin').once()._with('default', 1);
    transactionManager.shouldReceive('rollback').once()._with('default', 0);
    transactionManager.shouldNotReceive('commit');
    this.connection().setTransactionManager(transactionManager);
    this.connection().table('users').insert({
      'name' : 'zain',
      'value': 1
    });
    this.connection().beginTransaction();
    this.connection().table('users').where({
      'name': 'zain'
    }).update({
      'value': 2
    });
    this.connection().rollBack();
  });
  it('nested transactions are rolled back', () => {
    var transactionManager = m.mock(new DatabaseTransactionsManager());
    transactionManager.shouldReceive('begin').once()._with('default', 1);
    transactionManager.shouldReceive('begin').once()._with('default', 2);
    transactionManager.shouldReceive('rollback').once()._with('default', 1);
    transactionManager.shouldReceive('rollback').once()._with('default', 0);
    transactionManager.shouldNotReceive('commit');
    this.connection().setTransactionManager(transactionManager);
    this.connection().table('users').insert({
      'name' : 'zain',
      'value': 1
    });
    try {
      this.connection().transaction(() => {
        this.connection().table('users').where({
          'name': 'zain'
        }).update({
          'value': 2
        });
        this.connection().transaction(() => {
          this.connection().table('users').where({
            'name': 'zain'
          }).update({
            'value': 2
          });
          throw new Exception();
        });
      });
    } catch (e: Throwable) {
    }
  });
  it('schema', () => {
    return this.connection(connection).getSchemaBuilder();
  });
  it('connection', () => {
    return DB.connection(name);
  });
});
