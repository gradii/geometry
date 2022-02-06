/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Constructor } from '../../helper/constructor';
import { BindingVariable } from '../../query/ast/binding-variable';
import { Expression } from '../../query/ast/expression/expression';
import { FunctionCallExpression } from '../../query/ast/expression/function-call-expression';
import { NotExpression } from '../../query/ast/expression/not-expression';
import { RawExpression } from '../../query/ast/expression/raw-expression';
import { SqlParser } from '../../query/parser/sql-parser';
import { createIdentifier, raw } from '../ast-factory';
import { QueryBuilder } from '../query-builder';

export interface QueryBuilderWhereJson {
  whereJsonContains(column: any, value: any, conjunction?: 'and' | 'or' | string,
                    not?: boolean): this;

  orWhereJsonContains(column: any, value: any): this;

  whereJsonDoesntContain(column: any, value: any, conjunction?: 'and' | 'or' | string): this;

  orWhereJsonDoesntContain(column: any, value: any): this;

  whereJsonLength(column: any, operator: any, value?: any,
                  conjunction?: 'and' | 'or' | string): this;

  orWhereJsonLength(column: any, operator: any, value?: any): this;


}

export type WhereJsonCtor = Constructor<QueryBuilderWhereJson>;

export function mixinWhereJson<T extends Constructor<any>>(base: T): WhereJsonCtor & T {
  return class _Self extends base {
    _addJsonBasedWhere(column: string, value: any,
                       conjunction: 'and' | 'or' | string = 'and', not?: boolean): this {
      const type     = 'JsonContains';
      const leftNode = SqlParser.createSqlParser(column).parseUnaryTableColumn();
      let rightNode;

      if (value instanceof RawExpression) {
        rightNode = value;
      } else {
        rightNode = new BindingVariable(
          raw((this as unknown as QueryBuilder)._grammar.prepareBindingForJsonContains(value)),
          'where');
      }

      let ast: Expression = new FunctionCallExpression(
        createIdentifier(type),
        [leftNode, rightNode]
      );
      if (not) {
        ast = new NotExpression(ast);
      }

      this.addWhere(ast,
        conjunction
      );

      return this;
    }


    public whereJsonContains(column: any, value: any, conjunction = 'and', not = false) {
      this._addJsonBasedWhere(
        column,
        value,
        conjunction,
        not
      );

      return this;
    }

    public orWhereJsonContains(column: any, value: any) {
      return this.whereJsonContains(column, value, 'or');
    }

    public whereJsonDoesntContain(column: any, value: any, conjunction = 'and') {
      return this.whereJsonContains(column, value, conjunction, true);
    }

    public orWhereJsonDoesntContain(column: any, value: any) {
      return this.whereJsonDoesntContain(column, value, 'or');
    }

    public whereJsonLength(column: string, operator: string, value?: any, conjunction = 'and') {
      // var type = "JsonLength";
      // const [value, operator] = this.prepareValueAndOperator(value, operator, func_num_args() === 2);
      // this.wheres.push(compact("type", "column", "operator", "value", "boolean"));
      // if (!value instanceof Expression) {
      //   this.addBinding(/*cast type int*/ this.flattenValue(value));
      // }
      return this;
    }

    public orWhereJsonLength(column: any, operator: any, value?: any) {
      // const [value, operator] = this.prepareValueAndOperator(value, operator, func_num_args() === 2);
      return this.whereJsonLength(column, operator, value, 'or');
    }
  };
}
