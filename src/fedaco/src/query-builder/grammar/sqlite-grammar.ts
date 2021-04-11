import { GrammarInterface } from '../grammar.interface';
import { QueryBuilder } from '../query-builder';
import { SqliteQueryBuilderVisitor } from '../visitor/sqlite-query-builder-visitor';
import { Grammar } from './grammar';

export class SqliteGrammar extends Grammar implements GrammarInterface {
  private _tablePrefix = '';

  compileJoins() {

  }


  compileInsertOrIgnore(builder: QueryBuilder, values): string {
    return this.compileInsert(builder, values, 'or ignore into');
  }

  compileSelect(builder: QueryBuilder): string {

    const ast = this._prepareSelectAst(builder);

    const visitor = new SqliteQueryBuilderVisitor(builder._grammar, builder);

    return ast.accept(visitor);
  }

  distinct(distinct: boolean | any[]): string {
    if (distinct !== false) {
      return 'DISTINCT';
    } else {
      return '';
    }
  }

  quoteColumnName(columnName: string) {
    // if(keepSlashQuote) {
    //   return `\`${columnName.replace(/`/g, '``')}\``;
    // }
    return `"${columnName.replace(/`/g, '')}"`;
  }

  quoteTableName(tableName): string {
    // if(keepSlashQuote) {
    //   return `\`${tableName.replace(/`/g, '``')}\``;
    // }
    return `"${this._tablePrefix}${tableName.replace(/`/g, '')}"`;
  }

  setTablePrefix(prefix: string) {
    this._tablePrefix = prefix;
  }
}