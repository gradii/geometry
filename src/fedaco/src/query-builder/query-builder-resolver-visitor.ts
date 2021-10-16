/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SqlNode } from '../query/sql-node';
import { SqlVisitor } from '../query/sql-visitor';
import { GrammarInterface } from './grammar.interface';

/**
 *
 */
export class QueryBuilderResolverVisitor implements SqlVisitor {

  constructor(private _grammar: GrammarInterface) {

  }

  visitDeleteSpecification(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitAssignmentSetClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitSelectInsertSource(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitSetClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitUpdateSpecification(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitValuesInsertSource(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitLockClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitRejectOrderElementExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitAggregateFragment(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitInsertSpecification(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitBetweenPredicateExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitBinaryExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitBinaryUnionQueryExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitBindingVariable(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitCommonValueExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitComparisonExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitConditionExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitConditionTermExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitExistsPredicateExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitFieldAsExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitFromTable(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitFunctionCallExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitGroupByClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitHavingClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitInPredicateExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitJoinExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitJoinFragment(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitJoinOnExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitJoinedTable(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitJsonPathColumn(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitJsonPathExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitLimitClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitNestedExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitNestedPredicateExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitNullPredicateExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitNumberLiteralExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitOffsetClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitOrderByClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitOrderByElement(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitParenthesizedExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitRawBindingExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitRawExpression(node: SqlNode): string | number {
    throw new Error('Method not implemented.');
  }

  visitSelectScalarExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitStringLiteralExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitTableName(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitTableReferenceExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitUnionFragment(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitWhereClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitAsExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitFromClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitIdentifier(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitIdentifyVariableDeclaration(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitJoinClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitNodePart(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitPathExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitRangeVariableDeclaration(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitSelectClause(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitColumnReferenceExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitQuerySpecification(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }

  visitNotExpression(node: SqlNode): string {
    throw new Error('Method not implemented.');
  }


}
