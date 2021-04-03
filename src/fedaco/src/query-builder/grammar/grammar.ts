
import { QueryBuilder } from '../query-builder';
import { isString } from '@gradii/check-type';
import { BinaryUnionQueryExpression } from '../../query/ast/binary-union-query-expression';
import { ConditionExpression } from '../../query/ast/expression/condition-expression';
import { FunctionCallExpression } from '../../query/ast/expression/function-call-expression';
import { ParenthesizedExpression } from '../../query/ast/expression/parenthesized-expression';
import { FromClause } from '../../query/ast/from-clause';
import { FromTable } from '../../query/ast/from-table';
import { GroupByClause } from '../../query/ast/group-by-clause';
import { HavingClause } from '../../query/ast/having-clause';
import { JoinExpression } from '../../query/ast/join-expression';
import { JoinedTable } from '../../query/ast/joined-table';
import { LimitClause } from '../../query/ast/limit-clause';
import { OffsetClause } from '../../query/ast/offset-clause';
import { OrderByClause } from '../../query/ast/order-by-clause';
import { OrderByElement } from '../../query/ast/order-by-element';
import { QueryExpression } from '../../query/ast/query-expression';
import { QuerySpecification } from '../../query/ast/query-specification';
import { SelectClause } from '../../query/ast/select-clause';
import { SelectScalarExpression } from '../../query/ast/select-scalar-expression';
import { TableReferenceExpression } from '../../query/ast/table-reference-expression';
import { WhereClause } from '../../query/ast/where-clause';
import { SqlParser } from '../../query/parser/sql-parser';
import { SqlNode } from '../../query/sql-node';
import { SqlVisitor } from '../../query/sql-visitor';
import {
  createIdentifier,
  createKeyword,
  raw
} from '../ast-factory';
import { Builder } from '../builder';
import { GrammarInterface } from '../grammar.interface';
import { JoinQueryBuilder } from '../query-builder';

export abstract class Grammar implements GrammarInterface {
  constructor() {
  }

  _prepareAggregateAst(builder, ast) {
    if (builder._unions.length > 0) {
      if (builder._aggregate) {
        ast = new QuerySpecification(
          new SelectClause(
            [
              new SelectScalarExpression(
                new FunctionCallExpression(
                  builder._aggregate.aggregateFunctionName,
                  builder._aggregate.aggregateColumns
                ),
                createIdentifier('aggregate')
              )
            ]
          ),
          new FromClause(
            new FromTable(
              new TableReferenceExpression(
                new ParenthesizedExpression(ast),
                createIdentifier('temp_table')
              )
            )
          )
        );
      }
    }

    return ast;
  }

  _prepareSelectAst(builder: QueryBuilder) {
    let whereClause, selectClause;
    if (builder._wheres.length > 0) {
      whereClause = new WhereClause(
        new ConditionExpression(
          builder._wheres
        )
      );
    }

    if (builder._aggregate && builder._unions.length === 0) {
      selectClause = new SelectClause(
        [
          new SelectScalarExpression(
            new FunctionCallExpression(
              builder._aggregate.aggregateFunctionName,
              builder._aggregate.aggregateColumns
            ),
            createIdentifier('aggregate')
          )
        ],
        builder._distinct
      );
    } else {
      selectClause = new SelectClause(
        builder._columns,
        builder._distinct
      );
    }

    let ast: QuerySpecification | BinaryUnionQueryExpression = new QuerySpecification(
      selectClause,
      builder._from ? new FromClause(builder._from, builder._joins as JoinedTable[]) : undefined,
      whereClause
    );

    if (builder._limit >= 0) {
      (ast as QueryExpression).limitClause = new LimitClause(builder._limit);
    }

    if (builder._offset >= 0) {
      (ast as QueryExpression).offsetClause = new OffsetClause(builder._offset);
    }

    if (builder._orders.length > 0) {
      (ast as QueryExpression).orderByClause = new OrderByClause(
        builder._orders as OrderByElement[]
      );
    }

    if (builder._groups.length > 0) {
      (ast as QuerySpecification).groupByClause = new GroupByClause(
        builder._groups
      );
    }

    if (builder._havings.length > 0) {
      (ast as QuerySpecification).havingClause = new HavingClause(
        builder._havings
      );
    }

    if (builder._unions.length > 0) {
      for (const it of builder._unions) {
        const rightSql = it.expression.toSql();
        const bindings = it.expression.getBindings()
        builder.addBinding(bindings, 'union')
        ast            = new BinaryUnionQueryExpression(ast, raw(rightSql), it.all);
      }

      if (builder._unionLimit >= 0) {
        (ast as BinaryUnionQueryExpression).limitClause = new LimitClause(builder._unionLimit);
      }

      if (builder._unionOffset >= 0) {
        (ast as BinaryUnionQueryExpression).offsetClause = new OffsetClause(builder._unionOffset);
      }

      if(builder._unionOrders.length >0){
        (ast as BinaryUnionQueryExpression).orderByClause = new OrderByClause(
          builder._unionOrders as OrderByElement[]
        )
      }
    }

    //SELECT count(*) AS aggregate FROM ([SELECT STMT] UNION [SELECT STMT]) AS "temp_table"
    ast = this._prepareAggregateAst(builder, ast);

    return ast;
  }


  compileAggregateFragment(aggregateFunctionName,
                           aggregateColumns,
                           visitor: SqlVisitor) {
    return ``;
  }

  compileJoinFragment(builder: JoinQueryBuilder, visitor: SqlVisitor): string {
    let whereClause;
    if (builder._wheres.length > 0) {
      //todo check
      whereClause = new ConditionExpression(
        builder._wheres
      );
    }
    let table;
    if (isString(builder.table)) {
      table = SqlParser.createSqlParser(builder.table).parseTableAlias();
    } else if (builder.table instanceof TableReferenceExpression) {
      table = builder.table;
    } else {
      throw new Error('invalid table');
    }

    if (builder._joins.length > 0) {
      table = new JoinedTable(table, builder._joins as JoinExpression[]);
    }

    const ast = new JoinExpression(
      builder.type,
      table,
      whereClause
    );

    return ast.accept(visitor);
  }

  compileNestedPredicate(builder: Builder, visitor: SqlVisitor): string {
    const ast = new ParenthesizedExpression(
      new ConditionExpression(
        builder._wheres
      )
    );
    return ast.accept(visitor);
  }

  compileSelect(builder: Builder) {
    return '';
  }

  compileInsert(builder: Builder, values: any): string {
    return '';
  }

  compileExists(builder: QueryBuilder): string {
    return `SELECT exists(${this.compileSelect(builder)}) AS \`exists\``;
  }

  distinct(distinct: boolean | any[]): string {
    return '';
  }

  getOperators() {
    return [];
  }

  quoteColumnName(columnName: string): string {
    return '';
  }

  quoteTableName(tableName: string): string {
    return tableName;
  }

  quoteSchemaName(schemaName: string): string {
    return schemaName;
  }

  setTablePrefix(prefix: string): void {
  }
}