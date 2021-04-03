import { Builder } from '../builder';
import { GrammarInterface } from '../grammar.interface';
import { QueryBuilder } from '../query-builder';
import { QueryBuilderVisitor } from '../visitor/query-builder-visitor';
import { Grammar } from './grammar';

export class MysqlGrammar extends Grammar implements GrammarInterface {
  private _tablePrefix = '';

  compileJoins() {

  }

  compileSelect(builder: QueryBuilder): string {
    const ast = this._prepareSelectAst(builder);

    const visitor = new QueryBuilderVisitor(builder._grammar, builder);

    return ast.accept(visitor);
  }

  compileInsert(builder: Builder): string {
    // const ast = this._prepareSelectAst(builder);
    // const ast = new InsertExpression()
    //
    // const visitor = new QueryBuilderVisitor(builder._grammar, builder);
    //
    // return ast.accept(visitor);
    return ''
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
    return `\`${columnName.replace(/`/g, '')}\``;
  }

  quoteTableName(tableName): string {
    // if(keepSlashQuote) {
    //   return `\`${tableName.replace(/`/g, '``')}\``;
    // }
    return `\`${this._tablePrefix}${tableName.replace(/`/g, '')}\``;
  }

  quoteSchemaName(quoteSchemaName): string {
    // if(keepSlashQuote) {
    //   return `\`${tableName.replace(/`/g, '``')}\``;
    // }
    return `\`${quoteSchemaName.replace(/`/g, '')}\``;
  }

  setTablePrefix(prefix: string) {
    this._tablePrefix = prefix;
  }
}