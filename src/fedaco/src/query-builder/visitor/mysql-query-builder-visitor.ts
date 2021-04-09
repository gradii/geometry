import { FromClause } from '../../query/ast/from-clause';
import { UpdateSpecification } from '../../query/ast/update-specification';
import { GrammarInterface } from '../grammar.interface';
import { QueryBuilder } from '../query-builder';
import { QueryBuilderVisitor } from './query-builder-visitor';


export class MysqlQueryBuilderVisitor extends QueryBuilderVisitor {
  constructor(
    _grammar: GrammarInterface,
    /**
     * @deprecated
     * todo remove queryBuilder. should use binding only
     */
    _queryBuilder: QueryBuilder
  ) {
    super(_grammar, _queryBuilder);
  }

  visitUpdateSpecification(node: UpdateSpecification): string {
    let sql = `UPDATE ${node.target.accept(this)}`;

    this.explicitBindingType = 'updateJoin';
    if (node.fromClause) {
      sql += ` ${node.fromClause.joins.map(it => it.accept(this)).join(' ')}`;
    }
    this.explicitBindingType = undefined;

    sql += ` SET ${node.setClauses.map(
      it => it.accept(this)).join(', ')
    }`;

    if (node.whereClause) {
      sql += ` ${node.whereClause.accept(this)}`;
    }

    if (node.orderByClause) {
      sql += ` ${node.orderByClause.accept(this)}`;
    }
    if (node.offsetClause) {
      sql += ` ${node.offsetClause.accept(this)}`;
    }
    if (node.limitClause) {
      sql += ` ${node.limitClause.accept(this)}`;
    }
    return sql;
  }
}