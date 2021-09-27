/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Dispatcher } from '../fedaco/mixins/has-events';
import { ConnectionResolverInterface } from '../interface/connection-resolver-interface';
import { MigrationRepositoryInterface } from './migration-repository-interface';


export class Migrator {
  /*The event dispatcher instance.*/
  protected events: Dispatcher;
  /*The migration repository implementation.*/
  protected repository: MigrationRepositoryInterface;
  /*The filesystem instance.*/
  protected files: Filesystem;
  /*The connection resolver instance.*/
  protected resolver: ConnectionResolverInterface;
  /*The name of the default connection.*/
  protected connection: string;
  /*The paths to all of the migration files.*/
  protected paths: any[] = [];
  /*The output interface implementation.*/
  protected output: OutputInterface;

  /*Create a new migrator instance.*/
  public constructor(
    repository: MigrationRepositoryInterface,
    resolver: ConnectionResolverInterface,
    files: File,
    dispatcher: Dispatcher | null = null) {
    this.files      = files;
    this.events     = dispatcher;
    this.resolver   = resolver;
    this.repository = repository;
  }

  /*Run the pending migrations at a given path.*/
  public run(paths: any[] | string = [], options: any[] = []) {
    const files      = this.getMigrationFiles(paths);
    const migrations = this.pendingMigrations(files, this.repository.getRan());

    this.requireFiles(migrations);
    this.runPending(migrations, options);
    return migrations;
  }

  /*Get the migration files that have not yet run.*/
  protected pendingMigrations(files: any[], ran: any[]) {
    return Collection.make(files).reject(file => {
      return this.getMigrationName(file) in ran;
    }).values().all();
  }

  /*Run an array of migrations.*/
  public runPending(migrations: any[], options: any[] = []) {
    if (migrations.length === 0) {
      this.fireMigrationEvent(new NoPendingMigrations('up'));
      this.note('<info>Nothing to migrate.</info>');
      return;
    }
    let batch     = this.repository.getNextBatchNumber();
    const pretend = options['pretend'] ?? false;
    const step    = options['step'] ?? false;
    this.fireMigrationEvent(new MigrationsStarted());
    for (const file of migrations) {
      this.runUp(file, batch, pretend);
      if (step) {
        batch++;
      }
    }
    this.fireMigrationEvent(new MigrationsEnded());
  }

  /*Run "up" a migration instance.*/
  protected runUp(file: string, batch: number, pretend: boolean) {
    const migration = this.resolvePath(file);
    const name      = this.getMigrationName(file);
    if (pretend) {
      return this.pretendToRun(migration, 'up');
    }
    this.note('"<comment>Migrating:</comment> {$name}"');
    const startTime = new Date();
    this.runMigration(migration, 'up');
    const runTime = number_format((microtime(true) - startTime) * 1000, 2);
    this.repository.log(name, batch);
    this.note('"<info>Migrated:</info>  {$name} ({$runTime}ms)"');
  }

  /*Rollback the last migration operation.*/
  public rollback(paths: any[] | string = [], options: any[] = []) {
    const migrations = this.getMigrationsForRollback(options);
    if (count(migrations) === 0) {
      this.fireMigrationEvent(new NoPendingMigrations('down'));
      this.note('<info>Nothing to rollback.</info>');
      return [];
    }
    return this.rollbackMigrations(migrations, paths, options);
  }

  /*Get the migrations for a rollback operation.*/
  protected getMigrationsForRollback(options: any[]) {
    if ((steps = options['step'] ?? 0) > 0) {
      return this.repository.getMigrations(steps);
    }
    return this.repository.getLast();
  }

  /*Rollback the given migrations.*/
  protected rollbackMigrations(migrations: any[], paths: any[] | string, options: any[]) {
    const rolledBack = [];
    this.requireFiles(files = this.getMigrationFiles(paths));
    this.fireMigrationEvent(new MigrationsStarted());
    for (const migration of migrations) {
      const migration = /*cast type object*/ migration;
      if (!(file = Arr.get(files, migration.migration))) {
        this.note('"<fg=red>Migration not found:</> {$migration->migration}"');
        continue;
      }
      rolledBack.push(file);
      this.runDown(file, migration, options['pretend'] ?? false);
    }
    this.fireMigrationEvent(new MigrationsEnded());
    return rolledBack;
  }

  /*Rolls all of the currently applied migrations back.*/
  public reset(paths: any[] | string = [], pretend: boolean = false) {
    const migrations = array_reverse(this.repository.getRan());
    if (count(migrations) === 0) {
      this.note('<info>Nothing to rollback.</info>');
      return [];
    }
    return this.resetMigrations(migrations, paths, pretend);
  }

  /*Reset the given migrations.*/
  protected resetMigrations(migrations: any[], paths: any[], pretend: boolean = false) {
    const migrations = collect(migrations).map(m => {
      return /*cast type object*/ {
        'migration': m
      };
    }).all();
    return this.rollbackMigrations(migrations, paths, compact('pretend'));
  }

  /*Run "down" a migration instance.*/
  protected runDown(file: string, migration: object, pretend: boolean) {
    const instance = this.resolvePath(file);
    const name     = this.getMigrationName(file);
    this.note('"<comment>Rolling back:</comment> {$name}"');
    if (pretend) {
      return this.pretendToRun(instance, 'down');
    }
    const startTime = microtime(true);
    this.runMigration(instance, 'down');
    const runTime = number_format((microtime(true) - startTime) * 1000, 2);
    this.repository.delete(migration);
    this.note('"<info>Rolled back:</info>  {$name} ({$runTime}ms)"');
  }

  /*Run a migration inside a transaction if the database supports it.*/
  protected runMigration(migration: object, method: string) {
    const connection = this.resolveConnection(migration.getConnection());
    const callback   = () => {
      if (method_exists(migration, method)) {
        this.fireMigrationEvent(new MigrationStarted(migration, method));
        migration[method]();
        this.fireMigrationEvent(new MigrationEnded(migration, method));
      }
    };
    this.getSchemaGrammar(connection).supportsSchemaTransactions() &&
    migration.withinTransaction ?
      connection.transaction(callback) : callback();
  }

  /*Pretend to run the migrations.*/
  protected pretendToRun(migration: object, method: string) {
    try {
      for (const query of this.getQueries(migration, method)) {
        const name            = get_class(migration);
        const reflectionClass = new ReflectionClass(migration);
        if (reflectionClass.isAnonymous()) {
          const name = this.getMigrationName(reflectionClass.getFileName());
        }
        this.note('"<info>{$name}:</info> {$query[\'query\']}"');
      }
    } catch (e: SchemaException) {
      const name = get_class(migration);
      this.note(
        '"<info>{$name}:</info> failed to dump queries. This may be due to changing database columns using Doctrine, which is not supported while pretending to run migrations."');
    }
  }

  /*Get all of the queries that would be run for a migration.*/
  protected getQueries(migration: object, method: string) {
    const db = this.resolveConnection(migration.getConnection());
    return db.pretend(() => {
      if (method_exists(migration, method)) {
        migration[method]();
      }
    });
  }

  /*Resolve a migration instance from a file.*/
  public resolve(file: string) {
    const clazz = this.getMigrationClass(file);
    return new clazz();
  }

  /*Resolve a migration instance from a migration path.*/
  protected resolvePath(path: string) {
    const clazz = this.getMigrationClass(this.getMigrationName(path));
    if (class_exists(clazz) && realpath(path) == new ReflectionClass(clazz).getFileName()) {
      return new clazz();
    }
    const migration = this.files.getRequire(path);
    return is_object(migration) ? migration : new clazz();
  }

  /*Generate a migration class name based on the migration file name.*/
  protected getMigrationClass(migrationName: string) {
    return Str.studly(array_slice(explode('_', migrationName), 4).join('_'));
  }

  /*Get all of the migration files in a given path.*/
  public getMigrationFiles(paths: string | any[]) {
    return Collection.make(paths).flatMap(path => {
      return Str.endsWith(path, '.php') ? [path] : this.files.glob(path + '/*_*.php');
    }).filter().values().keyBy(file => {
      return this.getMigrationName(file);
    }).sortBy((file, key) => {
      return key;
    }).all();
  }

  /*Require in all the migration files in a given path.*/
  public requireFiles(files: any[]) {
    for (const file of files) {
      this.files.requireOnce(file);
    }
  }

  /*Get the name of the migration.*/
  public getMigrationName(path: string) {
    return str_replace('.php', '', basename(path));
  }

  /*Register a custom migration path.*/
  public path(path: string) {
    this.paths = array_unique([...this.paths, ...[path]]);
  }

  /*Get all of the custom migration paths.*/
  public paths() {
    return this.paths;
  }

  /*Get the default connection name.*/
  public getConnection() {
    return this.connection;
  }

  /*Execute the given callback using the given connection as the default connection.*/
  public usingConnection(name: string, callback: callable) {
    const previousConnection = this.resolver.getDefaultConnection();
    this.setConnection(name);
    return tap(callback(), () => {
      this.setConnection(previousConnection);
    });
  }

  /*Set the default connection name.*/
  public setConnection(name: string) {
    if (!isBlank(name)) {
      this.resolver.setDefaultConnection(name);
    }
    this.repository.setSource(name);
    this.connection = name;
  }

  /*Resolve the database connection instance.*/
  public resolveConnection(connection: string) {
    return this.resolver.connection(connection || this.connection);
  }

  /*Get the schema grammar out of a migration connection.*/
  protected getSchemaGrammar(connection: Connection) {
    if (isBlank(grammar = connection.getSchemaGrammar())) {
      connection.useDefaultSchemaGrammar();
      const grammar = connection.getSchemaGrammar();
    }
    return grammar;
  }

  /*Get the migration repository instance.*/
  public getRepository() {
    return this.repository;
  }

  /*Determine if the migration repository exists.*/
  public repositoryExists() {
    return this.repository.repositoryExists();
  }

  /*Determine if any migrations have been run.*/
  public hasRunAnyMigrations() {
    return this.repositoryExists() && count(this.repository.getRan()) > 0;
  }

  /*Delete the migration repository data store.*/
  public deleteRepository() {
    return this.repository.deleteRepository();
  }

  /*Get the file system instance.*/
  public getFilesystem() {
    return this.files;
  }

  /*Set the output implementation that should be used by the console.*/
  public setOutput(output: OutputInterface) {
    this.output = output;
    return this;
  }

  /*Write a note to the console's output.*/
  protected note(message: string) {
    if (this.output) {
      this.output.writeln(message);
    }
  }

  /*Fire the given event for the migration.*/
  public fireMigrationEvent(event: MigrationEvent) {
    if (this.events) {
      this.events.dispatch(event);
    }
  }
}
