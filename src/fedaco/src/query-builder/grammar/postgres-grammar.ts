import { ConditionExpression } from '../../query/ast/expression/condition-expression';
import { FromClause } from '../../query/ast/from-clause';
import { SelectClause } from '../../query/ast/select-clause';
import { QuerySpecification } from '../../query/ast/query-specification';
import { WhereClause } from '../../query/ast/where-clause';
import { GrammarInterface } from '../grammar.interface';
import { QueryBuilder } from '../query-builder';
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