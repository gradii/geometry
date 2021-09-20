/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isAnyEmpty, isArray, isBlank, isNumber, isString } from '@gradii/check-type';
import { Constructor } from '../../helper/constructor';
import { lowerCase, snakeCase } from '../../helper/str';
import { Builder } from '../../query-builder/builder';
import { ColumnReferenceExpression } from '../../query/ast/column-reference-expression';
import { Identifier } from '../../query/ast/identifier';
import { PathExpression } from '../../query/ast/path-expression';
import { FedacoBuilder } from '../fedaco-builder';
import { MorphTo } from '../relations/morph-to';
import { Relation } from '../relations/relation';

export interface QueriesRelationShips {
  withCount(relations: any): this;
}

export type QueriesRelationShipsCtor = Constructor<QueriesRelationShips>;

export function mixinQueriesRelationShips<T extends Constructor<any>>(base: T): QueriesRelationShipsCtor & T {
  return class _Self extends base {

    withCount(relations: any) {
      if (isAnyEmpty(relations)) {
        return this;
      }
      if (isBlank(this._query.columns)) {
        this.query.select([this._query.from + '.*']);
      }
      relations = isArray(relations) ? relations : arguments;
      for (let [name, constraints] of Object.entries(this.parseWithRelations(relations))) {
        const segments = name.split(' ');
        let alias;
        if (segments.length === 3 && lowerCase(segments[1]) === 'as') {
          [name, alias] = [segments[0], segments[2]];
        }
        const relation = this.getRelationWithoutConstraints(name);
        let query      = relation.getRelationExistenceCountQuery(relation.getRelated().newQuery(), this);
        query.callScope(constraints);
        query        = query.mergeConstraintsFrom(relation.getQuery()).toBase();
        query.orders = null;
        query.setBindings([], 'order');
        if (query.columns.length > 1) {
          query.columns            = [query.columns[0]];
          query.bindings['select'] = [];
        }
        const column = alias ?? snakeCase(name + '_count');
        this.selectSub(query, column);
      }
      return this;
    }
    //
    // /*Add a relationship count / exists condition to the query.*/
    // public has(relation: Relation | string,
    //            operator: string          = '>=',
    //            count: number             = 1,
    //            conjunction: string       = 'and',
    //            callback: Function | null = null) {
    //   if (isString(relation)) {
    //     if (relation.includes('.')) {
    //       return this._hasNested(relation, operator, count, conjunction, callback);
    //     }
    //     relation = this.getRelationWithoutConstraints(relation);
    //   }
    //   if (relation instanceof MorphTo) {
    //     return this.hasMorph(relation, ['*'], operator, count, conjunction, callback);
    //   }
    //   let method   = this.canUseExistsForExistenceCheck(operator,
    //     count) ? 'getRelationExistenceQuery' : 'getRelationExistenceCountQuery';
    //   let hasQuery = relation[method](relation.getRelated().newQueryWithoutRelationships(), this);
    //   if (callback) {
    //     hasQuery.callScope(callback);
    //   }
    //   return this.addHasWhere(hasQuery, relation, operator, count, conjunction);
    // }
    //
    // /*Add nested relationship count / exists conditions to the query.
    //
    // Sets up recursive call to whereHas until we finish the nested relation.*/
    // _hasNested(relations: string,
    //            operator: string          = '>=',
    //            count: number             = 1,
    //            conjunction: string       = 'and',
    //            callback: Function | null = null) {
    //   relations      = relations.split('.');
    //   let doesntHave = operator === '<' && count === 1;
    //   if (doesntHave) {
    //     operator = '>=';
    //     count    = 1;
    //   }
    //   let closure = q => {
    //     relations.length > 1 ? q.whereHas(array_shift(relations), closure) : q.has(
    //       array_shift(relations), operator, count, 'and', callback);
    //   };
    //   return this.has(array_shift(relations), doesntHave ? '<' : '>=', 1, conjunction, closure);
    // }
    //
    // /*Add a relationship count / exists condition to the query with an "or".*/
    // public orHas(relation: string, operator: string = '>=', count: number = 1) {
    //   return this.has(relation, operator, count, 'or');
    // }
    //
    // /*Add a relationship count / exists condition to the query.*/
    // public doesntHave(relation: string, conjunction: string = 'and',
    //                   callback: Function | null             = null) {
    //   return this.has(relation, '<', 1, conjunction, callback);
    // }
    //
    // /*Add a relationship count / exists condition to the query with an "or".*/
    // public orDoesntHave(relation: string) {
    //   return this.doesntHave(relation, 'or');
    // }
    //
    // /*Add a relationship count / exists condition to the query with where clauses.*/
    // public whereHas(relation: string, callback: Function | null = null, operator: string = '>=',
    //                 count: number                                                        = 1) {
    //   return this.has(relation, operator, count, 'and', callback);
    // }
    //
    // /*Add a relationship count / exists condition to the query with where clauses and an "or".*/
    // public orWhereHas(relation: string, callback: Function | null = null, operator: string = '>=',
    //                   count: number                                                        = 1) {
    //   return this.has(relation, operator, count, 'or', callback);
    // }
    //
    // /*Add a relationship count / exists condition to the query with where clauses.*/
    // public whereDoesntHave(relation: string, callback: Function | null = null) {
    //   return this.doesntHave(relation, 'and', callback);
    // }
    //
    // /*Add a relationship count / exists condition to the query with where clauses and an "or".*/
    // public orWhereDoesntHave(relation: string, callback: Function | null = null) {
    //   return this.doesntHave(relation, 'or', callback);
    // }
    //
    // /*Add a polymorphic relationship count / exists condition to the query.*/
    // public hasMorph(relation: MorphTo | string,
    //                 types: string[],
    //                 operator: string          = '>=',
    //                 count: number             = 1,
    //                 conjunction: string       = 'and',
    //                 callback: Function | null = null) {
    //   if (isString(relation)) {
    //     relation = this.getRelationWithoutConstraints(relation);
    //   }
    //   if (types === ['*']) {
    //     types = this.model.newModelQuery().distinct().pluck(
    //       relation.getMorphType()).filter().all();
    //   }
    //   for (let type of types) {
    //     let type = Relation.getMorphedModel(type) ?? type;
    //   }
    //   return this.where(query => {
    //     for (let type of types) {
    //       query.orWhere(query => {
    //         let belongsTo = this.getBelongsToRelation(relation, type);
    //         if (callback) {
    //           let callback = query => {
    //             return callback(query, type);
    //           };
    //         }
    //         query.where(this.qualifyColumn(relation.getMorphType()), '=',
    //           new type().getMorphClass()).whereHas(belongsTo, callback, operator, count);
    //       });
    //     }
    //   }, null, null, conjunction);
    // }
    //
    // /*Get the BelongsTo relationship for a single polymorphic type.*/
    // protected getBelongsToRelation(relation: MorphTo, type: string) {
    //   let belongsTo = Relation.noConstraints(() => {
    //     return this.model.belongsTo(type, relation.getForeignKeyName(), relation.getOwnerKeyName());
    //   });
    //   belongsTo.getQuery().mergeConstraintsFrom(relation.getQuery());
    //   return belongsTo;
    // }
    //
    // /*Add a polymorphic relationship count / exists condition to the query with an "or".*/
    // public orHasMorph(relation: MorphTo | string,
    //                   types: string[],
    //                   operator: string = '>=',
    //                   count: number    = 1) {
    //   return this.hasMorph(relation, types, operator, count, 'or');
    // }
    //
    // /*Add a polymorphic relationship count / exists condition to the query.*/
    // public doesntHaveMorph(relation: MorphTo | string, types: string[],
    //                        conjunction: string       = 'and',
    //                        callback: Function | null = null) {
    //   return this.hasMorph(relation, types, '<', 1, conjunction, callback);
    // }
    //
    // /*Add a polymorphic relationship count / exists condition to the query with an "or".*/
    // public orDoesntHaveMorph(relation: MorphTo | string, types: string[]) {
    //   return this.doesntHaveMorph(relation, types, 'or');
    // }
    //
    // /*Add a polymorphic relationship count / exists condition to the query with where clauses.*/
    // public whereHasMorph(relation: MorphTo | string, types: string[],
    //                      callback: Function | null = null, operator: string = '>=',
    //                      count: number                                      = 1) {
    //   return this.hasMorph(relation, types, operator, count, 'and', callback);
    // }
    //
    // /*Add a polymorphic relationship count / exists condition to the query with where clauses and an "or".*/
    // public orWhereHasMorph(relation: MorphTo | string, types: string[],
    //                        callback: Function | null = null,
    //                        operator: string          = '>=',
    //                        count: number             = 1) {
    //   return this.hasMorph(relation, types, operator, count, 'or', callback);
    // }
    //
    // /*Add a polymorphic relationship count / exists condition to the query with where clauses.*/
    // public whereDoesntHaveMorph(relation: MorphTo | string, types: string[],
    //                             callback: Function | null = null) {
    //   return this.doesntHaveMorph(relation, types, 'and', callback);
    // }
    //
    // /*Add a polymorphic relationship count / exists condition to the query with where clauses and an "or".*/
    // public orWhereDoesntHaveMorph(relation: MorphTo | string, types: string[],
    //                               callback: Function | null = null) {
    //   return this.doesntHaveMorph(relation, types, 'or', callback);
    // }
    //
    // /*Add subselect queries to include an aggregate value for a relationship.*/
    // public withAggregate(relations: any, column: string, func: string = null) {
    //   if (isAnyEmpty(relations)) {
    //     return this;
    //   }
    //   if (isBlank(this.query.columns)) {
    //     this.query.select([this.query.from + '.*']);
    //   }
    //   relations = isArray(relations) ? relations : [relations];
    //   for (let [name, constraints] of Object.entries(this.parseWithRelations(relations))) {
    //     let segments = name.split(' ');
    //     delete alias;
    //     if (segments.length === 3 && segments[1].toLowerCase() === 'as') {
    //       const [name, alias] = [segments[0], segments[2]];
    //     }
    //     let relation = this.getRelationWithoutConstraints(name);
    //     if (func) {
    //       let hashedColumn = this.getQuery().from === relation.getQuery().getQuery().from ?
    //         `"{$relation->getRelationCountHash(false)}.$column"
    //                                         ` : column;
    //       let expression   = `${func}(${this.getQuery().getGrammar().wrap(
    //         column === '*' ? column : relation.getRelated().qualifyColumn(hashedColumn))})`;
    //     } else {
    //       let expression = column;
    //     }
    //     let query = relation.getRelationExistenceQuery(relation.getRelated().newQuery(), this,
    //       new Expression(expression)).setBindings([], 'select');
    //     query.callScope(constraints);
    //     let query    = query.mergeConstraintsFrom(relation.getQuery()).toBase();
    //     query.orders = null;
    //     query.setBindings([], 'order');
    //     if (count(query.columns) > 1) {
    //       query.columns            = [query.columns[0]];
    //       query.bindings['select'] = [];
    //     }
    //     let alias = alias ?? Str.snake(
    //       preg_replace('/[^[:alnum:][:space:]_]/u', '', '"$name $function $column"'));
    //     this.selectSub(func ? query : query.limit(1), alias);
    //   }
    //   return this;
    // }
    //
    // /*Add subselect queries to count the relations.*/
    // public withCount(relations: any) {
    //   return this.withAggregate(isArray(relations) ? relations : arguments, '*', 'count');
    // }
    //
    // /*Add subselect queries to include the max of the relation's column.*/
    // public withMax(relation: string | any[], column: string) {
    //   return this.withAggregate(relation, column, 'max');
    // }
    //
    // /*Add subselect queries to include the min of the relation's column.*/
    // public withMin(relation: string | any[], column: string) {
    //   return this.withAggregate(relation, column, 'min');
    // }
    //
    // /*Add subselect queries to include the sum of the relation's column.*/
    // public withSum(relation: string | any[], column: string) {
    //   return this.withAggregate(relation, column, 'sum');
    // }
    //
    // /*Add subselect queries to include the average of the relation's column.*/
    // public withAvg(relation: string | any[], column: string) {
    //   return this.withAggregate(relation, column, 'avg');
    // }
    //
    // /*Add the "has" condition where clause to the query.*/
    // protected addHasWhere(hasQuery: FedacoBuilder, relation: Relation, operator: string,
    //                       count: number,
    //                       conjunction: string) {
    //   hasQuery.mergeConstraintsFrom(relation.getQuery());
    //   return this.canUseExistsForExistenceCheck(operator, count) ?
    //     this.addWhereExistsQuery(hasQuery.toBase(), conjunction, operator === '<' && count === 1) :
    //     this.addWhereCountQuery(hasQuery.toBase(), operator, count, conjunction);
    // }
    //
    // /*Merge the where constraints from another query to the current query.*/
    // public mergeConstraintsFrom(from: Builder) {
    //   let whereBindings = from.getQuery().getRawBindings()['where'] ?? [];
    //   return this.withoutGlobalScopes(from.removedScopes()).mergeWheres(from.getQuery().wheres,
    //     whereBindings);
    // }
    //
    // /*Add a sub-query count clause to this query.*/
    // protected addWhereCountQuery(query: Builder,
    //                              operator: string    = '>=',
    //                              count: number       = 1,
    //                              conjunction: string = 'and') {
    //   this.query.addBinding(query.getBindings(), 'where');
    //   return this.where(new Expression('(' + query.toSql() + ')'), operator,
    //     isNumber(count) ? new Expression(count) : count, conjunction);
    // }
    //
    // /*Get the "has relation" base query instance.*/
    // protected getRelationWithoutConstraints(relation: string) {
    //   return Relation.noConstraints(() => {
    //     return this.getModel()[relation]();
    //   });
    // }
    //
    // /*Check if we can run an "exists" query to optimize performance.*/
    // protected canUseExistsForExistenceCheck(operator: string, count: number) {
    //   return (operator === '>=' || operator === '<') && count === 1;
    // }
    //
    // // todo remove
    // deprecatedWithCount(relations: any) {
    //   if (isAnyEmpty(relations)) {
    //     return this;
    //   }
    //   if (!this._query._columns.length) {
    //     this._query.select(new ColumnReferenceExpression(
    //       new PathExpression(
    //         [this._query.from, new Identifier('*')]
    //       )
    //     ));
    //   }
    //   relations = isArray(relations) ? relations : arguments;
    //   for (let [name, constraints] of Object.entries(this.parseWithRelations(relations))) {
    //     const segments = name.split(' ');
    //     let alias;
    //     if (segments.length === 3 && lowerCase(segments[1]) === 'as') {
    //       [name, alias] = [segments[0], segments[2]];
    //     }
    //     const relation = this.getRelationWithoutConstraints(name);
    //     let query      = relation.getRelationExistenceCountQuery(
    //       relation.getRelated().newQuery(), this
    //     );
    //     query.callScope(constraints);
    //
    //     query = query.mergeConstraintsFrom(relation.getQuery()).toBase();
    //
    //     query.orders = null;
    //     query.setBindings([], 'order');
    //     if (query.columns.length > 1) {
    //       query.columns            = [query.columns[0]];
    //       query.bindings['select'] = [];
    //     }
    //     const column = alias ?? snakeCase(name + '_count');
    //     this.selectSub(query, column);
    //   }
    //   return this;
    // }
  };
}

