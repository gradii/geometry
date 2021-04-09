import { GrammarInterface } from '../grammar.interface';
import { QueryBuilder } from '../query-builder';
import { QueryBuilderVisitor } from '../visitor/query-builder-visitor';
import { SqlserverQueryBuilderVisitor } from '../visitor/sqlserver-query-builder-visitor';
import { Grammar } from './grammar';

export class SqlserverGrammar extends Grammar implements GrammarInterface {
  private _tablePrefix = '';

  compileJoins() {

  }

  compileSelect(builder: QueryBuilder): string {

    const ast = this._prepareSelectAst(builder);

    const visitor = new SqlserverQueryBuilderVisitor(builder._grammar, builder);

    return ast.accept(visitor);
  }

  compileUpdate(builder: QueryBuilder, values: any): string {
    const ast = this._prepareUpdateAst(builder, values);

    const visitor = new SqlserverQueryBuilderVisitor(builder._grammar, builder);

    return ast.accept(visitor);
  }

  compileInsertOrIgnore(builder: QueryBuilder, values): string {
    throw new Error('RuntimeException');
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
    return `[${columnName.replace(/`/g, '')}]`;
  }

  quoteTableName(tableName): string {
    // if(keepSlashQuote) {
    //   return `\`${tableName.replace(/`/g, '``')}\``;
    // }
    return `[${this._tablePrefix}${tableName.replace(/`/g, '')}]`;
  }

  setTablePrefix(prefix: string) {
    this._tablePrefix = prefix;
  }

  compileInsertGetId(builder: QueryBuilder, values: any, sequence: string): string {
    return `set nocount on;${super.compileInsertGetId(builder, values,
      sequence)};select scope_identity() as ${this.wrap(sequence)}`;
  }
}