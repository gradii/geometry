// /**
//  * @license
//  *
//  * Use of this source code is governed by an MIT-style license
//  */
//
// import { SchemaDiff } from './schema-diff';
// import { JsonArrayType } from './types/json-array-type';
// import { JsonType } from './types/json-type';
// import { Types } from './types/Types';
//
// /*Compares two Schemas and return an instance of SchemaDiff.*/
// export class Comparator {
//   /**/
//   public static compareSchemas(fromSchema, toSchema) {
//     const c = new Comparator();
//     return c.compare(fromSchema, toSchema);
//   }
//
//   /*Returns a SchemaDiff object containing the differences between the schemas $fromSchema and $toSchema.
//
//       The returned differences are returned in such a way that they contain the
//       operations to change the schema stored in $fromSchema to the schema that is
//       stored in $toSchema.*/
//   public compare(fromSchema, toSchema) {
//     const diff               = new SchemaDiff();
//     diff.fromSchema        = fromSchema;
//     const foreignKeysToTable = [];
//     for (const namespace of toSchema.getNamespaces()) {
//       if (fromSchema.hasNamespace(namespace)) {
//         continue;
//       }
//       diff.newNamespaces[namespace] = namespace;
//     }
//     for (const namespace of fromSchema.getNamespaces()) {
//       if (toSchema.hasNamespace(namespace)) {
//         continue;
//       }
//       diff.removedNamespaces[namespace] = namespace;
//     }
//     for (const table of toSchema.getTables()) {
//       const tableName = table.getShortestName(toSchema.getName());
//       if (!fromSchema.hasTable(tableName)) {
//         diff.newTables[tableName] = toSchema.getTable(tableName);
//       } else {
//         const tableDifferences = this.diffTable(
//           fromSchema.getTable(tableName),
//           toSchema.getTable(tableName)
//         );
//         if (tableDifferences !== false) {
//           diff.changedTables[tableName] = tableDifferences;
//         }
//       }
//     }
//     for (const table of fromSchema.getTables()) {
//       const tableName = table.getShortestName(fromSchema.getName());
//       const table     = fromSchema.getTable(tableName);
//       if (!toSchema.hasTable(tableName)) {
//         diff.removedTables[tableName] = table;
//       }
//       for (const foreignKey of table.getForeignKeys()) {
//         const foreignTable = foreignKey.getForeignTableName().toLowerCase();
//         if (!(foreignKeysToTable[foreignTable] !== undefined)) {
//           foreignKeysToTable[foreignTable] = [];
//         }
//         foreignKeysToTable[foreignTable].push(foreignKey);
//       }
//     }
//     for (const [tableName, table] of Object.entries(diff.removedTables)) {
//       if (!(foreignKeysToTable[tableName] !== undefined)) {
//         continue;
//       }
//       diff.orphanedForeignKeys = [
//         ...diff.orphanedForeignKeys,
//         ...foreignKeysToTable[tableName]
//       ];
//       for (const foreignKey of foreignKeysToTable[tableName]) {
//         const localTableName = foreignKey.getLocalTableName().toLowerCase();
//         if (!(diff.changedTables[localTableName] !== undefined)) {
//           continue;
//         }
//         for (const [key, removedForeignKey] of Object.entries(
//           diff.changedTables[localTableName].removedForeignKeys
//         )) {
//           assert(removedForeignKey instanceof ForeignKeyConstraint);
//           if (
//             tableName !== removedForeignKey.getForeignTableName().toLowerCase()
//           ) {
//             continue;
//           }
//           delete diff.changedTables[localTableName].removedForeignKeys[key];
//         }
//       }
//     }
//     for (const sequence of toSchema.getSequences()) {
//       const sequenceName = sequence.getShortestName(toSchema.getName());
//       if (!fromSchema.hasSequence(sequenceName)) {
//         if (!this.isAutoIncrementSequenceInSchema(fromSchema, sequence)) {
//           diff.newSequences.push(sequence);
//         }
//       } else {
//         if (this.diffSequence(sequence, fromSchema.getSequence(sequenceName))) {
//           diff.changedSequences.push(toSchema.getSequence(sequenceName));
//         }
//       }
//     }
//     for (const sequence of fromSchema.getSequences()) {
//       if (this.isAutoIncrementSequenceInSchema(toSchema, sequence)) {
//         continue;
//       }
//       const sequenceName = sequence.getShortestName(fromSchema.getName());
//       if (toSchema.hasSequence(sequenceName)) {
//         continue;
//       }
//       diff.removedSequences.push(sequence);
//     }
//     return diff;
//   }
//
//   /**/
//   public diffSequence(sequence1, sequence2) {
//     if (sequence1.getAllocationSize() !== sequence2.getAllocationSize()) {
//       return true;
//     }
//     return sequence1.getInitialValue() !== sequence2.getInitialValue();
//   }
//
//   /*Returns the difference between the tables $table1 and $table2.
//
//       If there are no differences this method returns the boolean false.*/
//   public diffTable(table1, table2) {
//     let changes                = 0;
//     const tableDifferences       = new TableDiff(table1.getName());
//     tableDifferences.fromTable = table1;
//     const table1Columns          = table1.getColumns();
//     const table2Columns          = table2.getColumns();
//     for (const [columnName, column] of Object.entries(table2Columns)) {
//       if (table1.hasColumn(columnName)) {
//         continue;
//       }
//       tableDifferences.addedColumns[columnName] = column;
//       changes++;
//     }
//     for (const [columnName, column] of Object.entries(table1Columns)) {
//       if (!table2.hasColumn(columnName)) {
//         tableDifferences.removedColumns[columnName] = column;
//         changes++;
//         continue;
//       }
//       const changedProperties = this.diffColumn(
//         column,
//         table2.getColumn(columnName)
//       );
//       if (empty(changedProperties)) {
//         continue;
//       }
//
//       const columnDiff = new ColumnDiff(
//         column.getName(),
//         table2.getColumn(columnName),
//         changedProperties
//       );
//
//       columnDiff.fromColumn                             = column;
//       tableDifferences.changedColumns[column.getName()] = columnDiff;
//       changes++;
//     }
//     this.detectColumnRenamings(tableDifferences);
//     const table1Indexes = table1.getIndexes();
//     const table2Indexes = table2.getIndexes();
//     for (const [indexName, index] of Object.entries(table2Indexes)) {
//       if (
//         (index.isPrimary() && table1.hasPrimaryKey()) ||
//         table1.hasIndex(indexName)
//       ) {
//         continue;
//       }
//       tableDifferences.addedIndexes[indexName] = index;
//       changes++;
//     }
//     for (const [indexName, index] of Object.entries(table1Indexes)) {
//       if (
//         (index.isPrimary() && !table2.hasPrimaryKey()) ||
//         (!index.isPrimary() && !table2.hasIndex(indexName))
//       ) {
//         tableDifferences.removedIndexes[indexName] = index;
//         changes++;
//         continue;
//       }
//       const table2Index = index.isPrimary()
//         ? table2.getPrimaryKey()
//         : table2.getIndex(indexName);
//       assert(table2Index instanceof Index);
//       if (!this.diffIndex(index, table2Index)) {
//         continue;
//       }
//       tableDifferences.changedIndexes[indexName] = table2Index;
//       changes++;
//     }
//     this.detectIndexRenamings(tableDifferences);
//     const fromFkeys = table1.getForeignKeys();
//     const toFkeys   = table2.getForeignKeys();
//     for (const [key1, constraint1] of Object.entries(fromFkeys)) {
//       for (const [key2, constraint2] of Object.entries(toFkeys)) {
//         if (this.diffForeignKey(constraint1, constraint2) === false) {
//           {
//             delete fromFkeys[key1];
//             delete toFkeys[key2];
//           }
//         } else {
//           if (
//             constraint1.getName().toLowerCase() ===
//             constraint2.getName().toLowerCase()
//           ) {
//             tableDifferences.changedForeignKeys.push(constraint2);
//             changes++;
//             {
//               delete fromFkeys[key1];
//               delete toFkeys[key2];
//             }
//           }
//         }
//       }
//     }
//     for (const constraint1 of fromFkeys) {
//       tableDifferences.removedForeignKeys.push(constraint1);
//       changes++;
//     }
//     for (const constraint2 of toFkeys) {
//       tableDifferences.addedForeignKeys.push(constraint2);
//       changes++;
//     }
//     return changes ? tableDifferences : false;
//   }
//
//   /**/
//   public diffForeignKey(key1, key2) {
//     if (
//       array_map('strtolower', key1.getUnquotedLocalColumns()) !==
//       array_map('strtolower', key2.getUnquotedLocalColumns())
//     ) {
//       return true;
//     }
//     if (
//       array_map('strtolower', key1.getUnquotedForeignColumns()) !==
//       array_map('strtolower', key2.getUnquotedForeignColumns())
//     ) {
//       return true;
//     }
//     if (
//       key1.getUnqualifiedForeignTableName() !==
//       key2.getUnqualifiedForeignTableName()
//     ) {
//       return true;
//     }
//     if (key1.onUpdate() !== key2.onUpdate()) {
//       return true;
//     }
//     return key1.onDelete() !== key2.onDelete();
//   }
//
//   /*Returns the difference between the fields $field1 and $field2.
//
//       If there are differences this method returns $field2, otherwise the
//       boolean false.*/
//   public diffColumn(column1, column2) {
//     const properties1       = column1.toArray();
//     const properties2       = column2.toArray();
//     const changedProperties = [];
//     if (get_class(properties1['type']) !== get_class(properties2['type'])) {
//       changedProperties.push('type');
//     }
//     [].forEach((property, index) => {
//     });
//     if (
//       this.isALegacyJsonComparison(properties1['type'], properties2['type'])
//     ) {
//       array_shift(changedProperties);
//       changedProperties.push('comment');
//     }
//     if (
//       (properties1['default'] === null) !== (properties2['default'] === null) ||
//       properties1['default'] != properties2['default']
//     ) {
//       changedProperties.push('default');
//     }
//     if (
//       (properties1['type'] instanceof Types.StringType &&
//         !properties1['type'] instanceof Types.GuidType) ||
//       properties1['type'] instanceof Types.BinaryType
//     ) {
//       const length1 = properties1['length'] || 255;
//       const length2 = properties2['length'] || 255;
//       if (length1 !== length2) {
//         changedProperties.push('length');
//       }
//       if (properties1['fixed'] !== properties2['fixed']) {
//         changedProperties.push('fixed');
//       }
//     } else if (properties1['type'] instanceof Types.DecimalType) {
//       if (
//         (properties1['precision'] || 10) !== (properties2['precision'] || 10)
//       ) {
//         changedProperties.push('precision');
//       }
//       if (properties1['scale'] !== properties2['scale']) {
//         changedProperties.push('scale');
//       }
//     }
//     if (
//       properties1['comment'] !== properties2['comment'] &&
//       !(properties1['comment'] === null && properties2['comment'] === '') &&
//       !(properties2['comment'] === null && properties1['comment'] === '')
//     ) {
//       changedProperties.push('comment');
//     }
//     const customOptions1 = column1.getCustomSchemaOptions();
//     const customOptions2 = column2.getCustomSchemaOptions();
//     for (const key of [
//       ...array_keys(customOptions1),
//       ...array_keys(customOptions2)
//     ]) {
//       if (
//         !array_key_exists(key, properties1) ||
//         !array_key_exists(key, properties2)
//       ) {
//         changedProperties.push(key);
//       } else if (properties1[key] !== properties2[key]) {
//         changedProperties.push(key);
//       }
//     }
//     const platformOptions1 = column1.getPlatformOptions();
//     const platformOptions2 = column2.getPlatformOptions();
//     for (const key of array_keys(
//       array_intersect_key(platformOptions1, platformOptions2)
//     )) {
//       if (properties1[key] === properties2[key]) {
//         continue;
//       }
//       changedProperties.push(key);
//     }
//     return array_unique(changedProperties);
//   }
//
//   /*Finds the difference between the indexes $index1 and $index2.
//
//       Compares $index1 with $index2 and returns $index2 if there are any
//       differences or false in case there are no differences.*/
//   public diffIndex(index1, index2) {
//     return !(index1.isFullfilledBy(index2) && index2.isFullfilledBy(index1));
//   }
//
//   /**/
//   private isAutoIncrementSequenceInSchema(schema: Schema, sequence: Sequence) {
//     for (const table of schema.getTables()) {
//       if (sequence.isAutoIncrementsFor(table)) {
//         return true;
//       }
//     }
//     return false;
//   }
//
//   /*Try to find columns that only changed their name, rename operations maybe cheaper than add/drop
//       however ambiguities between different possibilities should not lead to renaming at all.*/
//   private detectColumnRenamings(tableDifferences) {
//     const renameCandidates = [];
//     for (const [addedColumnName, addedColumn] of Object.entries(
//       tableDifferences.addedColumns
//     )) {
//       for (const removedColumn of tableDifferences.removedColumns) {
//         if (count(this.diffColumn(addedColumn, removedColumn)) !== 0) {
//           continue;
//         }
//         renameCandidates[addedColumn.getName()].push([
//           removedColumn,
//           addedColumn,
//           addedColumnName
//         ]);
//       }
//     }
//     for (const candidateColumns of renameCandidates) {
//       if (count(candidateColumns) !== 1) {
//         continue;
//       }
//       const [removedColumn, addedColumn] = candidateColumns[0];
//       const removedColumnName              = removedColumn.getName().toLowerCase();
//       const addedColumnName                = addedColumn.getName().toLowerCase();
//       if (tableDifferences.renamedColumns[removedColumnName] !== undefined) {
//         continue;
//       }
//       tableDifferences.renamedColumns[removedColumnName] = addedColumn;
//       {
//         delete tableDifferences.addedColumns[addedColumnName];
//         delete tableDifferences.removedColumns[removedColumnName];
//       }
//     }
//   }
//
//   /*Try to find indexes that only changed their name, rename operations maybe cheaper than add/drop
//       however ambiguities between different possibilities should not lead to renaming at all.*/
//   private detectIndexRenamings(tableDifferences) {
//     const renameCandidates = [];
//     for (const [addedIndexName, addedIndex] of Object.entries(
//       tableDifferences.addedIndexes
//     )) {
//       for (const removedIndex of tableDifferences.removedIndexes) {
//         if (this.diffIndex(addedIndex, removedIndex)) {
//           continue;
//         }
//         renameCandidates[addedIndex.getName()].push([
//           removedIndex,
//           addedIndex,
//           addedIndexName
//         ]);
//       }
//     }
//     for (const candidateIndexes of renameCandidates) {
//       if (count(candidateIndexes) !== 1) {
//         continue;
//       }
//       const [removedIndex, addedIndex] = candidateIndexes[0];
//       const removedIndexName             = removedIndex.getName().toLowerCase();
//       const addedIndexName               = addedIndex.getName().toLowerCase();
//       if (tableDifferences.renamedIndexes[removedIndexName] !== undefined) {
//         continue;
//       }
//       tableDifferences.renamedIndexes[removedIndexName] = addedIndex;
//       {
//         delete tableDifferences.addedIndexes[addedIndexName];
//         delete tableDifferences.removedIndexes[removedIndexName];
//       }
//     }
//   }
//
//   /*TODO: kill with fire on v3.0*/
//   private isALegacyJsonComparison(one, other) {
//     if (!(one instanceof JsonType) || !(other instanceof JsonType)) {
//       return false;
//     }
//     return (
//       (!(one instanceof JsonArrayType) && other instanceof JsonArrayType) ||
//       (!(other instanceof JsonArrayType) && one instanceof JsonArrayType)
//     );
//   }
// }
