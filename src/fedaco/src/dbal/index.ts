// /**
//  * @license
//  *
//  * Use of this source code is governed by an MIT-style license
//  */
//
//
// export class Index {
//   /*Asset identifier instances of the column names the index is associated with.
//       array($columnName => Identifier)*/
//   protected _columns: string[] = [];
//   /**/
//   protected _isUnique: boolean = false;
//   /**/
//   protected _isPrimary: boolean = false;
//   /*Platform specific flags for indexes.
//       array($flagName => true)*/
//   protected _flags: true[] = [];
//   /*Platform specific options*/
//   private options: any[] = [];
//
//   /**/
//   public constructor(
//     indexName: string,
//     columns: string[],
//     isUnique: boolean  = false,
//     isPrimary: boolean = false,
//     flags: string[]    = [],
//     options: any[]     = []
//   ) {
//     const isUnique = isUnique || isPrimary;
//     this._setName(indexName);
//     this._isUnique = isUnique;
//     this._isPrimary = isPrimary;
//     this.options = options;
//     for (const column of columns) {
//       this._addColumn(column);
//     }
//     for (const flag of flags) {
//       this.addFlag(flag);
//     }
//   }
//
//   /*{@inheritdoc}*/
//   public getColumns() {
//     return array_keys(this._columns);
//   }
//
//   /*{@inheritdoc}*/
//   public getQuotedColumns(platform) {
//     const subParts =
//           platform.supportsColumnLengthIndexes() && this.hasOption('lengths')
//             ? this.getOption('lengths')
//             : [];
//     const columns = [];
//     for (const column of this._columns) {
//       const length = array_shift(subParts);
//       let quotedColumn = column.getQuotedName(platform);
//       if (length !== null) {
//         quotedColumn += '(' + length + ')';
//       }
//       columns.push(quotedColumn);
//     }
//     return columns;
//   }
//
//   /**/
//   public getUnquotedColumns() {
//     return array_map([this, 'trimQuotes'], this.getColumns());
//   }
//
//   /*Is the index neither unique nor primary key?*/
//   public isSimpleIndex() {
//     return !this._isPrimary && !this._isUnique;
//   }
//
//   /**/
//   public isUnique() {
//     return this._isUnique;
//   }
//
//   /**/
//   public isPrimary() {
//     return this._isPrimary;
//   }
//
//   /**/
//   public hasColumnAtPosition(columnName: string, pos: number = 0) {
//     const columnName = this.trimQuotes(columnName.toLowerCase());
//     const indexColumns = array_map('strtolower', this.getUnquotedColumns());
//     return array_search(columnName, indexColumns) === pos;
//   }
//
//   /*Checks if this index exactly spans the given column names in the correct order.*/
//   public spansColumns(columnNames: string[]) {
//     const columns = this.getColumns();
//     const numberOfColumns = count(columns);
//     const sameColumns = true;
//     for (let i = 0; i < numberOfColumns; i++) {
//       if (
//         columnNames[i] !== undefined &&
//         this.trimQuotes(columns[i].toLowerCase()) ===
//         this.trimQuotes(columnNames[i].toLowerCase())
//       ) {
//         continue;
//       }
//       const sameColumns = false;
//     }
//     return sameColumns;
//   }
//
//   /*Checks if the other index already fulfills all the indexing and constraint needs of the current one.*/
//   public isFullfilledBy(other) {
//     if (count(other.getColumns()) !== count(this.getColumns())) {
//       return false;
//     }
//     const sameColumns = this.spansColumns(other.getColumns());
//     if (sameColumns) {
//       if (!this.samePartialIndex(other)) {
//         return false;
//       }
//       if (!this.hasSameColumnLengths(other)) {
//         return false;
//       }
//       if (!this.isUnique() && !this.isPrimary()) {
//         return true;
//       }
//       if (other.isPrimary() !== this.isPrimary()) {
//         return false;
//       }
//       return other.isUnique() === this.isUnique();
//     }
//     return false;
//   }
//
//   /*Detects if the other index is a non-unique, non primary index that can be overwritten by this one.*/
//   public overrules(other) {
//     if (other.isPrimary()) {
//       return false;
//     }
//     if (this.isSimpleIndex() && other.isUnique()) {
//       return false;
//     }
//     return (
//       this.spansColumns(other.getColumns()) &&
//       (this.isPrimary() || this.isUnique()) &&
//       this.samePartialIndex(other)
//     );
//   }
//
//   /*Returns platform specific flags for indexes.*/
//   public getFlags() {
//     return array_keys(this._flags);
//   }
//
//   /*Adds Flag for an index that translates to platform specific handling.*/
//   public addFlag(flag: string) {
//     this._flags[flag.toLowerCase()] = true;
//     return this;
//   }
//
//   /*Does this index have a specific flag?*/
//   public hasFlag(flag: string) {
//     return this._flags[flag.toLowerCase()] !== undefined;
//   }
//
//   /*Removes a flag.*/
//   public removeFlag(flag: string) {
//     delete this._flags[flag.toLowerCase()];
//   }
//
//   /**/
//   public hasOption(name: string) {
//     return this.options[name.toLowerCase()] !== undefined;
//   }
//
//   /**/
//   public getOption(name: string) {
//     return this.options[name.toLowerCase()];
//   }
//
//   /**/
//   public getOptions() {
//     return this.options;
//   }
//
//   /**/
//   protected _addColumn(column: string) {
//     if (!is_string(column)) {
//       throw new Error('InvalidArgumentException Expecting a string as Index Column');
//     }
//     this._columns[column] = new Identifier(column);
//   }
//
//   /*Return whether the two indexes have the same partial index*/
//   private samePartialIndex(other) {
//     if (
//       this.hasOption('where') &&
//       other.hasOption('where') &&
//       this.getOption('where') === other.getOption('where')
//     ) {
//       return true;
//     }
//     return !this.hasOption('where') && !other.hasOption('where');
//   }
//
//   /*Returns whether the index has the same column lengths as the other*/
//   private hasSameColumnLengths(other) {
//     const filter = (length) => {
//       return length !== null;
//     };
//     return (
//       array_filter(this.options['lengths'] || [], filter) ===
//       array_filter(other.options['lengths'] || [], filter)
//     );
//   }
// }
