import { isString } from '@gradii/check-type';
import { Constructor } from '../../helper/constructor';
import { QueryBuilder } from '../../query-builder/query-builder';
import { RawExpression } from '../../query/ast/expression/raw-expression';
import { OrderByElement } from '../../query/ast/order-by-element';
import { SqlParser } from '../../query/parser/sql-parser';
import { rawBindings } from '../ast-factory';
import { wrapToArray } from '../ast-helper';

export interface QueryBuilderOrderBy {
  orderBy(column: Function | QueryBuilder | RawExpression | string,
          direction?: string): this

  orderByRaw(sql: string, bindings: any[] | any): this

  orderByDesc(column: string): this

  orderByDesc(column: (q) => void): this

  reorder(column?, direction?): this
}

export type QueryBuilderOrderByCtor = Constructor<QueryBuilderOrderBy>;

export function mixinOrderBy<T extends Constructor<any>>(base: T): QueryBuilderOrderByCtor & T {
  return class _Self extends base {

    /**
     * Add an "order by" clause to the query.
     */
    public orderBy(this: QueryBuilder & _Self, column: Function | QueryBuilder | RawExpression | string,
                   direction: string = 'asc') {
      let columnNode;

      if (this.isQueryable(column)) {
        columnNode = this._createSubQuery(this._unions.length > 0 ? 'unionOrder' : 'order', column);
        // const [query, bindings] = this._createSub(column);
        // columnNode              = raw('(' + query + ')');
        // throw new Error('not implement yet');

        // this.addBinding(bindings, this.qUnions ? 'unionOrder' : 'order');
      } else if (column instanceof RawExpression) {
        columnNode = column;
      } else if (isString(column)) {
        columnNode = SqlParser.createSqlParser(column as string).parseUnaryTableColumn();
      } else {
        throw new Error('invalid column type');
      }
      direction = direction.toLowerCase();
      if (!['asc', 'desc'].includes(direction)) {
        throw new Error('InvalidArgumentException Order direction must be "asc" or "desc".');
      }

      this._addOrder(new OrderByElement(
        columnNode,
        direction
      ));
      return this;
    }

    protected _addOrder(ast) {
      if (this._unions.length > 0) {
        this._unionOrders.push(ast);
      } else {
        this._orders.push(ast);
      }
      return this;
    }

    /*Add a raw "order by" clause to the query.*/
    public orderByRaw(this: QueryBuilder & _Self, sql: string, bindings = []) {
      // const type = 'Raw';
      // this[this.qUnions ? 'qUnionOrders' : 'qOrders'].push(compact('type', 'sql'));
      // this.addBinding(bindings, this.qUnions ? 'unionOrder' : 'order');
      bindings = wrapToArray(bindings);
      if (this._unions.length > 0) {
        this._unionOrders.push(rawBindings(sql, bindings, 'unionOrder'));
      } else {
        this._orders.push(rawBindings(sql, bindings, 'order'));
      }

      return this;
    }

    /*Add a descending "order by" clause to the query.*/
    public orderByDesc(this: QueryBuilder & _Self, column: string) {
      return this.orderBy(column, 'desc');
    }

    /*Remove all existing orders and optionally add a new order.*/
    public reorder(this: QueryBuilder & _Self, column?, direction = 'asc') {
      this._orders                 = [];
      this._unionOrders            = [];
      this._bindings['order']      = [];
      this._bindings['unionOrder'] = [];
      if (column) {
        return this.orderBy(column, direction);
      }
      return this;
    }

  };
}
