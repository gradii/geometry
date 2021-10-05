import { Connector } from 'Illuminate/Database/Connectors/Connector';
import { MySqlConnector } from 'Illuminate/Database/Connectors/MySqlConnector';
import { PostgresConnector } from 'Illuminate/Database/Connectors/PostgresConnector';
import { SQLiteConnector } from 'Illuminate/Database/Connectors/SQLiteConnector';
import { SqlServerConnector } from 'Illuminate/Database/Connectors/SqlServerConnector';

describe('test database connector', () => {
  it('tear down', () => {
    m.close();
  });
  it('option resolution', () => {
    var connector = new Connector();
    connector.setDefaultOptions({
      0: 'foo',
      1: 'bar'
    });
    expect(connector.getOptions({
      'options': {
        0: 'baz',
        2: 'boom'
      }
    })).toEqual({
      0: 'baz',
      1: 'bar',
      2: 'boom'
    });
  });
  it('my sql connect calls create connection with proper arguments', () => {
    var connector  = this.getMockBuilder(MySqlConnector).setMethods(
      ['createConnection', 'getOptions']).getMock();
    var connection = m.mock(PDO);
    connector.expects(this.once()).method('getOptions')._with(this.equalTo(config)).willReturn(
      ['options']);
    connector.expects(this.once()).method('createConnection')._with(this.equalTo(dsn),
      this.equalTo(config), this.equalTo(['options'])).willReturn(connection);
    connection.shouldReceive('prepare').once()._with(
      'set names \'utf8\' collate \'utf8_unicode_ci\'').andReturn(connection);
    connection.shouldReceive('execute').once();
    connection.shouldReceive('exec').zeroOrMoreTimes();
    var result = connector.connect(config);
    expect(connection).toEqual(result);
  });
  it('my sql connect provider', () => {
    return [
      [
        'mysql:host=foo;dbname=bar', {
        'host'     : 'foo',
        'database' : 'bar',
        'collation': 'utf8_unicode_ci',
        'charset'  : 'utf8'
      }
      ], [
        'mysql:host=foo;port=111;dbname=bar', {
          'host'     : 'foo',
          'database' : 'bar',
          'port'     : 111,
          'collation': 'utf8_unicode_ci',
          'charset'  : 'utf8'
        }
      ], [
        'mysql:unix_socket=baz;dbname=bar', {
          'host'       : 'foo',
          'database'   : 'bar',
          'port'       : 111,
          'unix_socket': 'baz',
          'collation'  : 'utf8_unicode_ci',
          'charset'    : 'utf8'
        }
      ]
    ];
  });
  it('postgres connect calls create connection with proper arguments', () => {
    var dsn        = 'pgsql:host=foo;dbname=bar;port=111';
    var config     = {
      'host'    : 'foo',
      'database': 'bar',
      'port'    : 111,
      'charset' : 'utf8'
    };
    var connector  = this.getMockBuilder(PostgresConnector).setMethods(
      ['createConnection', 'getOptions']).getMock();
    var connection = m.mock(stdClass);
    connector.expects(this.once()).method('getOptions')._with(this.equalTo(config)).willReturn(
      ['options']);
    connector.expects(this.once()).method('createConnection')._with(this.equalTo(dsn),
      this.equalTo(config), this.equalTo(['options'])).willReturn(connection);
    connection.shouldReceive('prepare').once()._with('set names \'utf8\'').andReturn(connection);
    connection.shouldReceive('execute').once();
    var result = connector.connect(config);
    expect(connection).toEqual(result);
  });
  it('postgres search path is set', () => {
    var dsn        = 'pgsql:host=foo;dbname=bar';
    var config     = {
      'host'    : 'foo',
      'database': 'bar',
      'schema'  : 'public',
      'charset' : 'utf8'
    };
    var connector  = this.getMockBuilder(PostgresConnector).setMethods(
      ['createConnection', 'getOptions']).getMock();
    var connection = m.mock(stdClass);
    connector.expects(this.once()).method('getOptions')._with(this.equalTo(config)).willReturn(
      ['options']);
    connector.expects(this.once()).method('createConnection')._with(this.equalTo(dsn),
      this.equalTo(config), this.equalTo(['options'])).willReturn(connection);
    connection.shouldReceive('prepare').once()._with('set names \'utf8\'').andReturn(connection);
    connection.shouldReceive('prepare').once()._with('set search_path to "public"').andReturn(
      connection);
    connection.shouldReceive('execute').twice();
    var result = connector.connect(config);
    expect(connection).toEqual(result);
  });
  it('postgres search path array supported', () => {
    var dsn        = 'pgsql:host=foo;dbname=bar';
    var config     = {
      'host'    : 'foo',
      'database': 'bar',
      'schema'  : ['public', 'user'],
      'charset' : 'utf8'
    };
    var connector  = this.getMockBuilder(PostgresConnector).setMethods(
      ['createConnection', 'getOptions']).getMock();
    var connection = m.mock(stdClass);
    connector.expects(this.once()).method('getOptions')._with(this.equalTo(config)).willReturn(
      ['options']);
    connector.expects(this.once()).method('createConnection')._with(this.equalTo(dsn),
      this.equalTo(config), this.equalTo(['options'])).willReturn(connection);
    connection.shouldReceive('prepare').once()._with('set names \'utf8\'').andReturn(connection);
    connection.shouldReceive('prepare').once()._with(
      'set search_path to "public", "user"').andReturn(connection);
    connection.shouldReceive('execute').twice();
    var result = connector.connect(config);
    expect(connection).toEqual(result);
  });
  it('postgres application name is set', () => {
    var dsn        = 'pgsql:host=foo;dbname=bar';
    var config     = {
      'host'            : 'foo',
      'database'        : 'bar',
      'charset'         : 'utf8',
      'application_name': 'Laravel App'
    };
    var connector  = this.getMockBuilder(PostgresConnector).setMethods(
      ['createConnection', 'getOptions']).getMock();
    var connection = m.mock(stdClass);
    connector.expects(this.once()).method('getOptions')._with(this.equalTo(config)).willReturn(
      ['options']);
    connector.expects(this.once()).method('createConnection')._with(this.equalTo(dsn),
      this.equalTo(config), this.equalTo(['options'])).willReturn(connection);
    connection.shouldReceive('prepare').once()._with('set names \'utf8\'').andReturn(connection);
    connection.shouldReceive('prepare').once()._with(
      'set application_name to \'Laravel App\'').andReturn(connection);
    connection.shouldReceive('execute').twice();
    var result = connector.connect(config);
    expect(connection).toEqual(result);
  });
  it('sq lite memory databases may be connected to', () => {
    var dsn        = 'sqlite::memory:';
    var config     = {
      'database': ':memory:'
    };
    var connector  = this.getMockBuilder(SQLiteConnector).setMethods(
      ['createConnection', 'getOptions']).getMock();
    var connection = m.mock(stdClass);
    connector.expects(this.once()).method('getOptions')._with(this.equalTo(config)).willReturn(
      ['options']);
    connector.expects(this.once()).method('createConnection')._with(this.equalTo(dsn),
      this.equalTo(config), this.equalTo(['options'])).willReturn(connection);
    var result = connector.connect(config);
    expect(connection).toEqual(result);
  });
  it('sq lite file databases may be connected to', () => {
    var dsn        = 'sqlite:' + __DIR__;
    var config     = {
      'database': __DIR__
    };
    var connector  = this.getMockBuilder(SQLiteConnector).setMethods(
      ['createConnection', 'getOptions']).getMock();
    var connection = m.mock(stdClass);
    connector.expects(this.once()).method('getOptions')._with(this.equalTo(config)).willReturn(
      ['options']);
    connector.expects(this.once()).method('createConnection')._with(this.equalTo(dsn),
      this.equalTo(config), this.equalTo(['options'])).willReturn(connection);
    var result = connector.connect(config);
    expect(connection).toEqual(result);
  });
  it('sql server connect calls create connection with proper arguments', () => {
    var config     = {
      'host'    : 'foo',
      'database': 'bar',
      'port'    : 111
    };
    var dsn        = this.getDsn(config);
    var connector  = this.getMockBuilder(SqlServerConnector).setMethods(
      ['createConnection', 'getOptions']).getMock();
    var connection = m.mock(stdClass);
    connector.expects(this.once()).method('getOptions')._with(this.equalTo(config)).willReturn(
      ['options']);
    connector.expects(this.once()).method('createConnection')._with(this.equalTo(dsn),
      this.equalTo(config), this.equalTo(['options'])).willReturn(connection);
    var result = connector.connect(config);
    expect(connection).toEqual(result);
  });
  it('sql server connect calls create connection with optional arguments', () => {
    var config     = {
      'host'    : 'foo',
      'database': 'bar',
      'port'    : 111,
      'readonly': true,
      'charset' : 'utf-8',
      'pooling' : false,
      'appname' : 'baz'
    };
    var dsn        = this.getDsn(config);
    var connector  = this.getMockBuilder(SqlServerConnector).setMethods(
      ['createConnection', 'getOptions']).getMock();
    var connection = m.mock(stdClass);
    connector.expects(this.once()).method('getOptions')._with(this.equalTo(config)).willReturn(
      ['options']);
    connector.expects(this.once()).method('createConnection')._with(this.equalTo(dsn),
      this.equalTo(config), this.equalTo(['options'])).willReturn(connection);
    var result = connector.connect(config);
    expect(connection).toEqual(result);
  });
  it('sql server connect calls create connection with preferred odbc', () => {
    if (!in_array('odbc', PDO.getAvailableDrivers())) {
      this.markTestSkipped('PHP was compiled without PDO ODBC support.');
    }
    var config     = {
      'odbc'                : true,
      'odbc_datasource_name': 'server=localhost;database=test;'
    };
    var dsn        = this.getDsn(config);
    var connector  = this.getMockBuilder(SqlServerConnector).setMethods(
      ['createConnection', 'getOptions']).getMock();
    var connection = m.mock(stdClass);
    connector.expects(this.once()).method('getOptions')._with(this.equalTo(config)).willReturn(
      ['options']);
    connector.expects(this.once()).method('createConnection')._with(this.equalTo(dsn),
      this.equalTo(config), this.equalTo(['options'])).willReturn(connection);
    var result = connector.connect(config);
    expect(connection).toEqual(result);
  });
  it('get dsn', () => {
    extract(config, EXTR_SKIP);
    var availableDrivers = PDO.getAvailableDrivers();
    if (in_array('odbc', availableDrivers) && (config['odbc'] ?? null) === true) {
      return config['odbc_datasource_name'] !== undefined ? 'odbc:' + config['odbc_datasource_name'] : '';
    }
    if (in_array('sqlsrv', availableDrivers)) {
      var port     = config['port'] !== undefined ? ',' + port : '';
      var appname  = config['appname'] !== undefined ? ';APP=' + config['appname'] : '';
      var readonly = config['readonly'] !== undefined ? ';ApplicationIntent=ReadOnly' : '';
      var pooling  = config['pooling'] !== undefined && config['pooling'] == false ? ';ConnectionPooling=0' : '';
      return '"sqlsrv:Server={$host}{$port};Database={$database}{$readonly}{$pooling}{$appname}"';
    } else {
      var port    = config['port'] !== undefined ? ':' + port : '';
      var appname = config['appname'] !== undefined ? ';appname=' + config['appname'] : '';
      var charset = config['charset'] !== undefined ? ';charset=' + config['charset'] : '';
      return '"dblib:host={$host}{$port};dbname={$database}{$charset}{$appname}"';
    }
  });
});
