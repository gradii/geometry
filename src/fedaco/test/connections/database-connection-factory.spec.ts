import { DatabaseConfig } from '../../src/database-config';


describe('test database connection factory', () => {
  beforeEach(() => {
    const db = new DatabaseConfig();
    db.addConnection({
      'driver'  : 'sqlite',
      'database': ':memory:'
    });
    db.addConnection({
      'url': 'sqlite:///:memory:'
    }, 'url');
    db.addConnection({
      'driver': 'sqlite',
      'read'  : {
        'database': ':memory:'
      },
      'write' : {
        'database': ':memory:'
      }
    }, 'read_write');
    db.setAsGlobal();
  });

  it('connection can be created', () => {
    expect(this.db.getConnection().getPdo()).toInstanceOf(PDO);
    expect(this.db.getConnection().getReadPdo()).toInstanceOf(PDO);
    expect(this.db.getConnection('read_write').getPdo()).toInstanceOf(PDO);
    expect(this.db.getConnection('read_write').getReadPdo()).toInstanceOf(PDO);
    expect(this.db.getConnection('url').getPdo()).toInstanceOf(PDO);
    expect(this.db.getConnection('url').getReadPdo()).toInstanceOf(PDO);
  });
  it('connection from url has proper config', () => {
    db.addConnection({
      'url'           : 'mysql://root:pass@db/local?strict=true',
      'unix_socket'   : '',
      'charset'       : 'utf8mb4',
      'collation'     : 'utf8mb4_unicode_ci',
      'prefix'        : '',
      'prefix_indexes': true,
      'strict'        : false,
      'engine'        : null
    }, 'url-config');
    expect(this.db.getConnection('url-config').getConfig()).toEqual({
      'name'          : 'url-config',
      'driver'        : 'mysql',
      'database'      : 'local',
      'host'          : 'db',
      'username'      : 'root',
      'password'      : 'pass',
      'unix_socket'   : '',
      'charset'       : 'utf8mb4',
      'collation'     : 'utf8mb4_unicode_ci',
      'prefix'        : '',
      'prefix_indexes': true,
      'strict'        : true,
      'engine'        : null
    });
  });
  it('single connection not created until needed', () => {
    var connection = this.db.getConnection();
    var pdo        = new ReflectionProperty(get_class(connection), 'pdo');
    pdo.setAccessible(true);
    var readPdo = new ReflectionProperty(get_class(connection), 'readPdo');
    readPdo.setAccessible(true);
    expect(pdo.getValue(connection)).toNotInstanceOf(PDO);
    expect(readPdo.getValue(connection)).toNotInstanceOf(PDO);
  });
  it('read write connections not created until needed', () => {
    var connection = this.db.getConnection('read_write');
    var pdo        = new ReflectionProperty(get_class(connection), 'pdo');
    pdo.setAccessible(true);
    var readPdo = new ReflectionProperty(get_class(connection), 'readPdo');
    readPdo.setAccessible(true);
    expect(pdo.getValue(connection)).toNotInstanceOf(PDO);
    expect(readPdo.getValue(connection)).toNotInstanceOf(PDO);
  });
  it('if driver isnt set exception is thrown', () => {
    this.expectException(InvalidArgumentException);
    this.expectExceptionMessage('A driver must be specified.');
    var factory = new ConnectionFactory(container = m.mock(Container));
    factory.createConnector(['foo']);
  });
  it('exception is thrown on unsupported driver', () => {
    this.expectException(InvalidArgumentException);
    this.expectExceptionMessage('Unsupported driver [foo]');
    var factory = new ConnectionFactory(container = m.mock(Container));
    container.shouldReceive('bound').once().andReturn(false);
    factory.createConnector({
      'driver': 'foo'
    });
  });
  it('custom connectors can be resolved via container', () => {
    var factory = new ConnectionFactory(container = m.mock(Container));
    container.shouldReceive('bound').once()._with('db.connector.foo').andReturn(true);
    container.shouldReceive('make').once()._with('db.connector.foo').andReturn('connector');
    expect(factory.createConnector({
      'driver': 'foo'
    })).toBe('connector');
  });
  it('sqlite foreign key constraints', () => {
    this.db.addConnection({
      'url': 'sqlite:///:memory:?foreign_key_constraints=true'
    }, 'constraints_set');
    expect(this.db.getConnection().select('PRAGMA foreign_keys')[0].foreign_keys).toEqual(0);
    expect(this.db.getConnection('constraints_set').select(
      'PRAGMA foreign_keys')[0].foreign_keys).toEqual(1);
  });
});
