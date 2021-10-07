/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AbstractPlatform } from 'Doctrine/DBAL/Platforms';

/*Schema Diff.*/
export class SchemaDiff {
  /**/
  public fromSchema: Schema | null;
  /*All added namespaces.*/
  public newNamespaces: string[] = [];
  /*All removed namespaces.*/
  public removedNamespaces: string[] = [];
  /*All added tables.*/
  public newTables: Table[] = [];
  /*All changed tables.*/
  public changedTables: TableDiff[] = [];
  /*All removed tables.*/
  public removedTables: Table[] = [];
  /**/
  public newSequences: Sequence[] = [];
  /**/
  public changedSequences: Sequence[] = [];
  /**/
  public removedSequences: Sequence[] = [];
  /**/
  public orphanedForeignKeys: ForeignKeyConstranumber[] = [];

  /*Constructs an SchemaDiff object.*/
  public constructor(
    newTables: Table[]         = [],
    changedTables: TableDiff[] = [],
    removedTables: Table[]     = [],
    fromSchema                 = null
  ) {
    this.newTables = newTables;
    this.changedTables = changedTables;
    this.removedTables = removedTables;
    this.fromSchema = fromSchema;
  }

  /*The to save sql mode ensures that the following things don't happen:

      1. Tables are deleted
      2. Sequences are deleted
      3. Foreign Keys which reference tables that would otherwise be deleted.

      This way it is ensured that assets are deleted which might not be relevant to the metadata schema at all.*/
  public toSaveSql(platform) {
    return this._toSql(platform, true);
  }

  /**/
  public toSql(platform) {
    return this._toSql(platform, false);
  }

  /**/
  protected _toSql(platform, saveMode: boolean = false) {
    let sql = [];
    if (platform.supportsSchemas()) {
      for (const newNamespace of this.newNamespaces) {
        sql.push(platform.getCreateSchemaSQL(newNamespace));
      }
    }
    if (platform.supportsForeignKeyConstraints() && saveMode === false) {
      for (const orphanedForeignKey of this.orphanedForeignKeys) {
        sql.push(
          platform.getDropForeignKeySQL(
            orphanedForeignKey,
            orphanedForeignKey.getLocalTable()
          )
        );
      }
    }
    if (platform.supportsSequences() === true) {
      for (const sequence of this.changedSequences) {
        sql.push(platform.getAlterSequenceSQL(sequence));
      }
      if (saveMode === false) {
        for (const sequence of this.removedSequences) {
          sql.push(platform.getDropSequenceSQL(sequence));
        }
      }
      for (const sequence of this.newSequences) {
        sql.push(platform.getCreateSequenceSQL(sequence));
      }
    }
    const foreignKeySql = [];
    for (const table of this.newTables) {
      const sql = [
        ...sql,
        ...platform.getCreateTableSQL(table, AbstractPlatform.CREATE_INDEXES)
      ];
      if (!platform.supportsForeignKeyConstraints()) {
        continue;
      }
      for (const foreignKey of table.getForeignKeys()) {
        foreignKeySql.push(platform.getCreateForeignKeySQL(foreignKey, table));
      }
    }
    const sql = [...sql, ...foreignKeySql];
    if (saveMode === false) {
      for (const table of this.removedTables) {
        sql.push(platform.getDropTableSQL(table));
      }
    }
    for (const tableDiff of this.changedTables) {
      const sql = [...sql, ...platform.getAlterTableSQL(tableDiff)];
    }
    return sql;
  }
}