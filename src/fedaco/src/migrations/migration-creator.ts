/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { format } from 'date-fns';
import * as fs from 'fs';
import { Str } from 'Illuminate/Support/Str';
import { InvalidArgumentException } from 'InvalidArgumentException';

export class MigrationCreator {
  /*The filesystem instance.*/
  protected files: fs;
  /*The custom app stubs directory.*/
  protected customStubPath: string;
  /*The registered post create hooks.*/
  protected postCreate: any[] = [];

  /*Create a new migration creator instance.*/
  public constructor(files: File, customStubPath: string) {
    this.files          = files;
    this.customStubPath = customStubPath;
  }

  /*Create a new migration at the given path.*/
  public create(name: string, path: string, table: string | null = null, create: boolean = false) {
    this.ensureMigrationDoesntAlreadyExist(name, path);
    const stub = this.getStub(table, create);
    const path = this.getPath(name, path);
    this.files.ensureDirectoryExists(dirname(path));
    this.files.put(path, this.populateStub(stub, table));
    this.firePostCreateHooks(table, path);
    return path;
  }

  /*Ensure that a migration with the given name doesn't already exist.*/
  protected ensureMigrationDoesntAlreadyExist(name: string, migrationPath: string = null) {
    if (!empty(migrationPath)) {
      const migrationFiles = this.files.glob(migrationPath + '/*.php');
      for (const migrationFile of migrationFiles) {
        this.files.requireOnce(migrationFile);
      }
    }
    if (class_exists(className = this.getClassName(name))) {
      throw new InvalidArgumentException('"A {$className} class already exists."');
    }
  }

  /*Get the migration stub file.*/
  protected getStub(table: string | null, create: boolean) {
    if (isBlank(table)) {
      const stub = this.files.exists(
        customPath = this.customStubPath + '/migration.stub') ? customPath : this.stubPath() + '/migration.stub';
    } else if (create) {
      const stub = this.files.exists(
        customPath = this.customStubPath + '/migration.create.stub') ? customPath : this.stubPath() + '/migration.create.stub';
    } else {
      const stub = this.files.exists(
        customPath = this.customStubPath + '/migration.update.stub') ? customPath : this.stubPath() + '/migration.update.stub';
    }
    return this.files.get(stub);
  }

  /*Populate the place-holders in the migration stub.*/
  protected populateStub(stub: string, table: string | null) {
    if (!isBlank(table)) {
      const stub = str_replace(['DummyTable', '{{ table }}', '{{table}}'], table, stub);
    }
    return stub;
  }

  /*Get the class name of a migration name.*/
  protected getClassName(name: string) {
    return Str.studly(name);
  }

  /*Get the full path to the migration.*/
  protected getPath(name: string, path: string) {
    return path + '/' + this.getDatePrefix() + '_' + name + '.php';
  }

  /*Fire the registered post create hooks.*/
  protected firePostCreateHooks(table: string | null, path: string) {
    for (const callback of this.postCreate) {
      callback(table, path);
    }
  }

  /*Register a post migration create hook.*/
  public afterCreate(callback: Function) {
    this.postCreate.push(callback);
  }

  /*Get the date prefix for the migration.*/
  protected getDatePrefix() {
    return format(new Date(), 'yyyy_MM_dHHmmss');
  }

  /*Get the path to the stubs.*/
  public stubPath() {
    return __DIR__ + '/stubs';
  }

  /*Get the filesystem instance.*/
  public getFilesystem() {
    return this.files;
  }
}
