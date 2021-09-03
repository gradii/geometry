/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Constructor } from '../../helper/constructor';
import { QueryBuilder } from '../../query-builder/query-builder';

type ExcludeMethod = 'find' | 'get' | 'clone';

export type ForwardCallToQueryBuilderCtor = Constructor<Omit<QueryBuilder, ExcludeMethod>>;


export function mixinForwardCallToQueryBuilder<T extends Constructor<any>>(base: T): ForwardCallToQueryBuilderCtor & T {

  return class _Self extends base {

    // find(...args){return this._query.find(...args)}
    pluck(...args: any[]) {return this._query.pluck(...args); }
    stripTableForPluck(...args: any[]) {return this._query.stripTableForPluck(...args); }
    pluckFromColumn(...args: any[]) {return this._query.pluckFromColumn(...args); }
    addBinding(...args: any[]) {return this._query.addBinding(...args); }
    addSelect(...args: any[]) {return this._query.addSelect(...args); }
    distinct(...args: any[]) {return this._query.distinct(...args); }
    insertGetId(...args: any[]) {return this._query.insertGetId(...args); }
    from(...args: any[]) {return this._query.from(...args); }
    fromSub(...args: any[]) {return this._query.fromSub(...args); }
    get(...args: any[]) {return this._query.get(...args); }
    getBindings(...args: any[]) {return this._query.getBindings(...args); }
    getConnection(...args: any[]) {return this._query.getConnection(...args); }
    insertUsing(...args: any[]) {return this._query.insertUsing(...args); }
    insertOrIgnore(...args: any[]) {return this._query.insertOrIgnore(...args); }
    getGrammar(...args: any[]) {return this._query.getGrammar(...args); }
    getProcessor(...args: any[]) {return this._query.getProcessor(...args); }
    getRawBindings(...args: any[]) {return this._query.getRawBindings(...args); }
    isQueryable(...args: any[]) {return this._query.isQueryable(...args); }
    newQuery(...args: any[]) {return this._query.newQuery(...args); }
    runSelect(...args: any[]) {return this._query.runSelect(...args); }
    selectRaw(...args: any[]) {return this._query.selectRaw(...args); }
    select(...args: any[]) {return this._query.select(...args); }
    update(...args: any[]) {return this._query.update(...args); }
    delete(...args: any[]) {return this._query.delete(...args); }
    truncate(...args: any[]) {return this._query.truncate(...args); }
    updateOrInsert(...args: any[]) {return this._query.updateOrInsert(...args); }
    insert(...args: any[]) {return this._query.insert(...args); }
    selectSub(...args: any[]) {return this._query.selectSub(...args); }
    lock(...args: any[]) {return this._query.lock(...args); }
    toSql(...args: any[]) {return this._query.toSql(...args); }
    resetBindings(...args: any[]) {return this._query.resetBindings(...args); }
    useReadConnection(...args: any[]) {return this._query.useReadConnection(...args); }
    useWriteConnection(...args: any[]) {return this._query.useWriteConnection(...args); }
    onceWithColumns(...args: any[]) {return this._query.onceWithColumns(...args); }
    join(...args: any[]) {return this._query.join(...args); }
    joinWhere(...args: any[]) {return this._query.joinWhere(...args); }
    joinSub(...args: any[]) {return this._query.joinSub(...args); }
    leftJoin(...args: any[]) {return this._query.leftJoin(...args); }
    leftJoinWhere(...args: any[]) {return this._query.leftJoinWhere(...args); }
    leftJoinSub(...args: any[]) {return this._query.leftJoinSub(...args); }
    rightJoin(...args: any[]) {return this._query.rightJoin(...args); }
    rightJoinWhere(...args: any[]) {return this._query.rightJoinWhere(...args); }
    rightJoinSub(...args: any[]) {return this._query.rightJoinSub(...args); }
    crossJoin(...args: any[]) {return this._query.crossJoin(...args); }
    oldest(...args: any[]) {return this._query.oldest(...args); }
    orderBy(...args: any[]) {return this._query.orderBy(...args); }
    orderByDesc(...args: any[]) {return this._query.orderByDesc(...args); }
    orderByRaw(...args: any[]) {return this._query.orderByRaw(...args); }
    reorder(...args: any[]) {return this._query.reorder(...args); }
    groupBy(...args: any[]) {return this._query.groupBy(...args); }
    groupByRaw(...args: any[]) {return this._query.groupByRaw(...args); }
    addHaving(...args: any[]) {return this._query.addHaving(...args); }
    having(...args: any[]) {return this._query.having(...args); }
    havingBetween(...args: any[]) {return this._query.havingBetween(...args); }
    havingRaw(...args: any[]) {return this._query.havingRaw(...args); }
    orHaving(...args: any[]) {return this._query.orHaving(...args); }
    orHavingRaw(...args: any[]) {return this._query.orHavingRaw(...args); }
    limit(...args: any[]) {return this._query.limit(...args); }
    skip(...args: any[]) {return this._query.skip(...args); }
    offset(...args: any[]) {return this._query.offset(...args); }
    take(...args: any[]) {return this._query.take(...args); }
    forPage(...args: any[]) {return this._query.forPage(...args); }
    union(...args: any[]) {return this._query.union(...args); }
    unionAll(...args: any[]) {return this._query.unionAll(...args); }
    orWhereDate(...args: any[]) {return this._query.orWhereDate(...args); }
    orWhereDay(...args: any[]) {return this._query.orWhereDay(...args); }
    orWhereMonth(...args: any[]) {return this._query.orWhereMonth(...args); }
    orWhereTime(...args: any[]) {return this._query.orWhereTime(...args); }
    orWhereYear(...args: any[]) {return this._query.orWhereYear(...args); }
    whereDate(...args: any[]) {return this._query.whereDate(...args); }
    whereDay(...args: any[]) {return this._query.whereDay(...args); }
    whereMonth(...args: any[]) {return this._query.whereMonth(...args); }
    whereTime(...args: any[]) {return this._query.whereTime(...args); }
    whereYear(...args: any[]) {return this._query.whereYear(...args); }
    aggregate(...args: any[]) {return this._query.aggregate(...args); }
    count(...args: any[]) {return this._query.count(...args); }
    doesntExist(...args: any[]) {return this._query.doesntExist(...args); }
    exists(...args: any[]) {return this._query.exists(...args); }
    getCountForPagination(...args: any[]) {return this._query.getCountForPagination(...args); }
    max(...args: any[]) {return this._query.max(...args); }
    min(...args: any[]) {return this._query.min(...args); }
    sum(...args: any[]) {return this._query.sum(...args); }
    addWhereExistsQuery(...args: any[]) {return this._query.addWhereExistsQuery(...args); }
    orWhereBetween(...args: any[]) {return this._query.orWhereBetween(...args); }
    orWhereExists(...args: any[]) {return this._query.orWhereExists(...args); }
    orWhereIn(...args: any[]) {return this._query.orWhereIn(...args); }
    orWhereIntegerInRaw(...args: any[]) {return this._query.orWhereIntegerInRaw(...args); }
    orWhereIntegerNotInRaw(...args: any[]) {return this._query.orWhereIntegerNotInRaw(...args); }
    orWhereNotBetween(...args: any[]) {return this._query.orWhereNotBetween(...args); }
    orWhereNotExists(...args: any[]) {return this._query.orWhereNotExists(...args); }
    orWhereNotIn(...args: any[]) {return this._query.orWhereNotIn(...args); }
    orWhereNotNull(...args: any[]) {return this._query.orWhereNotNull(...args); }
    orWhereNull(...args: any[]) {return this._query.orWhereNull(...args); }
    where(...args: any[]) {return this._query.where(...args); }
    whereBetween(...args: any[]) {return this._query.whereBetween(...args); }
    whereExists(...args: any[]) {return this._query.whereExists(...args); }
    whereIn(...args: any[]) {return this._query.whereIn(...args); }
    whereIntegerInRaw(...args: any[]) {return this._query.whereIntegerInRaw(...args); }
    whereIntegerNotInRaw(...args: any[]) {return this._query.whereIntegerNotInRaw(...args); }
    whereNotBetween(...args: any[]) {return this._query.whereNotBetween(...args); }
    whereNotExists(...args: any[]) {return this._query.whereNotExists(...args); }
    whereNotIn(...args: any[]) {return this._query.whereNotIn(...args); }
    whereNotNull(...args: any[]) {return this._query.whereNotNull(...args); }
    whereNull(...args: any[]) {return this._query.whereNull(...args); }
    addNestedWhereQuery(...args: any[]) {return this._query.addNestedWhereQuery(...args); }
    addWhere(...args: any[]) {return this._query.addWhere(...args); }
    forNestedWhere(...args: any[]) {return this._query.forNestedWhere(...args); }
    orWhere(...args: any[]) {return this._query.orWhere(...args); }
    orWhereColumn(...args: any[]) {return this._query.orWhereColumn(...args); }
    orWhereRaw(...args: any[]) {return this._query.orWhereRaw(...args); }
    // where(...args){return this._query.where(...args)}
    whereColumn(...args: any[]) {return this._query.whereColumn(...args); }
    whereNested(...args: any[]) {return this._query.whereNested(...args); }
    whereRaw(...args: any[]) {return this._query.whereRaw(...args); }
    when(...args: any[]) {return this._query.when(...args); }
    tap(...args: any[]) {return this._query.tap(...args); }
    first(...args: any[]) {return this._query.first(...args); }
    unless(...args: any[]) {return this._query.unless(...args); }

  };
}
