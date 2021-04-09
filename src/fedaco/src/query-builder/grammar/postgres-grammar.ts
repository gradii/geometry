import { ConditionExpression } from '../../query/ast/expression/condition-expression';
import { FromClause } from '../../query/ast/from-clause';
import { SelectClause } from '../../query/ast/select-clause';
import { QuerySpecification } from '../../query/ast/query-specification';
import { WhereClause } from '../../query/ast/where-clause';
import { SqlParser } from '../../query/parser/sql-parser';
import { GrammarInterface } from '../grammar.interface';
import { QueryBuilder } from '../query-builder';
import { MysqlQueryBuilderVisitor } from '../visitor/mysql-query-builder-visitor';
import { Grammar } from './grammar';
import { PostgresQueryBuilderVisitor } from '../visitor/postgres-query-builder-visitor';

export class PostgresGrammar extends Grammar implements GrammarInterface {
  private _tablePrefix = '';

  compileJoins() {

  }

  compileSelect(builder: QueryBuilder): string {
    const ast = this._prepareSelectAst(builder)

    const visitor = new PostgresQueryBuilderVisitor(builder._grammar, builder);

    return ast.accept(visitor);
  }

  compileUpdate(builder: QueryBuilder, values: any): string {
    const ast = this._prepareUpdateAst(builder, values);

    const visitor = new PostgresQueryBuilderVisitor(builder._grammar, builder);

    return ast.accept(visitor);
  }


  distinct(distinct: boolean | any[]): string {
    if (distinct !== false) {
      return 'DISTINCT';
    } else {
      return '';
    }
  }

  compileInsertOrIgnore(builder: QueryBuilder, values): string {
    return this.compileInsert(builder, values, 'into') + ' ON conflict do nothing';
  }

  /*Compile an insert and get ID statement into SQL.*/
  public compileInsertGetId(query: QueryBuilder, values: any[], sequence: string = 'id') {
    return `${this.compileInsert(query, values)} returning ${this.wrap(sequence)}`;
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