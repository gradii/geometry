/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isAnyEmpty } from '@gradii/check-type';
import { GrammarInterface } from '../grammar.interface';
import { QueryBuilder } from '../query-builder';
import { MysqlQueryBuilderVisitor } from '../visitor/mysql-query-builder-visitor';
import { QueryBuilderVisitor } from '../visitor/query-builder-visitor';
import { QueryGrammar } from './query-grammar';

export class MysqlQueryGrammar extends QueryGrammar implements GrammarInterface {
  private _tablePrefix = '';

  compileJoins() {
  }

  protected _createVisitor(queryBuilder: QueryBuilder) {
    return new MysqlQueryBuilderVisitor(queryBuilder._grammar, queryBuilder);
  }

  compileSelect(builder: QueryBuilder): string {
    const ast = this._prepareSelectAst(builder);

    const visitor = new MysqlQueryBuilderVisitor(builder._grammar, builder);

    return ast.accept(visitor);
  }

  compileUpdate(builder: QueryBuilder, values: any): string {
    const ast = this._prepareUpdateAst(builder, values);

    const visitor = new MysqlQueryBuilderVisitor(builder._grammar, builder);

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
    if (columnName === '*') {
      return columnName;
    } else {
      return `\`${columnName.replace(/`/g, '')}\``;
    }
  }

  quoteTableName(tableName: string): string {
    // if(keepSlashQuote) {
    //   return `\`${tableName.replace(/`/g, '``')}\``;
    // }
    return `\`${this._tablePrefix}${tableName.replace(/`/g, '')}\``;
  }

  quoteSchemaName(quoteSchemaName: string): string {
    // if(keepSlashQuote) {
    //   return `\`${tableName.replace(/`/g, '``')}\``;
    // }
    return `\`${quoteSchemaName.replace(/`/g, '')}\``;
  }

  setTablePrefix(prefix: string) {
    this._tablePrefix = prefix;
    return this;
  }

  compileInsert(builder: QueryBuilder, values: any, insertOption: string = 'into'): string {
    if (isAnyEmpty(values)) {
      const visitor = new QueryBuilderVisitor(builder._grammar, builder);
      return `INSERT INTO ${builder._from.accept(visitor)} ()
              VALUES ()`;
    }

    return super.compileInsert(builder, values, insertOption);
  }
}
