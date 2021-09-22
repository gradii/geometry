/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank, isFunction, isString } from '@gradii/check-type';
import { last } from 'ramda';
import { Constructor } from '../../../helper/constructor';
import { JoinClauseBuilder } from '../../../query-builder/query-builder';
import { FedacoBuilder } from '../../fedaco-builder';
import { Relation } from '../relation';
import { mapWithKeys, wrap } from '../../../helper/arr';

export interface CanBeOneOfMany {
  ofMany(column?: string | any[] | null, aggregate?: string | Function | null,
         relation?: string | null);

  /*Indicate that the relation is the latest single result of a larger one-to-many relationship.*/
  latestOfMany(column?: string | any[] | null, relation?: string | null);

  /*Indicate that the relation is the oldest single result of a larger one-to-many relationship.*/
  oldestOfMany(column?: string | any[] | null, relation?: string | null);

  /*Get the default alias for the one of many inner join clause.*/
  _getDefaultOneOfManyJoinAlias(relation: string);

  /*Get a new query for the related model, grouping the query by the given column, often the foreign key of the relationship.*/
  _newOneOfManySubQuery(groupBy: string | any[], column?: string | null, aggregate?: string | null);

  /*Add the join subquery to the given query on the given column and the relationship's foreign key.*/
  _addOneOfManyJoinSubQuery(parent: FedacoBuilder, subQuery: FedacoBuilder, on: string);

  /*Merge the relationship query joins to the given query builder.*/
  _mergeOneOfManyJoinsTo(query);

  /*Get the query builder that will contain the relationship constraints.*/
  _getRelationQuery();

  /*Get the one of many inner join subselect builder instance.*/
  getOneOfManySubQuery();

  /*Get the qualified column name for the one-of-many relationship using the subselect join query's alias.*/
  qualifySubSelectColumn(column: string);

  /*Qualify related column using the related table name if it is not already qualified.*/
  _qualifyRelatedColumn(column: string);

  /*Guess the "hasOne" relationship's name via backtrace.*/
  _guessRelationship();

  /*Determine whether the relationship is a one-of-many relationship.*/
  isOneOfMany();

  /*Get the name of the relationship.*/
  getRelationName();
}

export function mixinCanBeOneOfMany<T extends Constructor<any>>(base: T) {
  return class _Self extends base {

    /*Determines whether the relationship is one-of-many.*/
    _isOneOfMany = false;
    /*The name of the relationship.*/
    _relationName: string;
    /*The one of many inner join subselect query builder instance.*/
    _oneOfManySubQuery: FedacoBuilder | null;

    /*Add constraints for inner join subselect for one of many relationships.*/
    public addOneOfManySubQueryConstraints(
      query: FedacoBuilder, column: string | null = null,
      aggregate: string | null = null
    ) {
      throw new Error('not implement');
    }

    /*Get the columns the determine the relationship groups.*/
    public getOneOfManySubQuerySelectColumns() {
      throw new Error('not implement');
    }

    /*Add join query constraints for one of many relationships.*/
    public addOneOfManyJoinSubQueryConstraints(join: JoinClauseBuilder) {
      throw new Error('not implement');
    }

    /*Indicate that the relation is a single result of a larger one-to-many relationship.*/
    public ofMany(this: Relation & _Self, column: string | any | null = 'id',
                  aggregate: string | Function | null = 'MAX',
                  relation: string): this {
      this._isOneOfMany = true;
      this._relationName = relation// || this._getDefaultOneOfManyJoinAlias();
      const keyName = this._query.getModel().getKeyName();
      const columns = isString(column) ? {
        [column]: aggregate,
        [keyName]: aggregate,
      } : column;
      if (!(keyName in columns)) {
        columns[keyName] = 'MAX';
      }
      let closure
      if (isFunction(aggregate)) {
        closure = aggregate;
      }
      let previous
      const columnsEntries = Object.entries(columns);
      const lastColumn = columnsEntries[columnsEntries.length - 1][0]
      for (const [column, aggregate] of columnsEntries) {
        // @ts-ignore
        if (!['min', 'max'].includes(aggregate.toLowerCase())) {
          throw new Error(`InvalidArgumentException(
            '"Invalid aggregate [{$aggregate}] used within ofMany relation. Available aggregates: MIN, MAX"')`);
        }
        // @ts-ignore
        const subQuery = this._newOneOfManySubQuery(this._getOneOfManySubQuerySelectColumns(), column, aggregate);
        if (previous !== undefined) {
          this._addOneOfManyJoinSubQuery(subQuery, previous['subQuery'], previous['column']);
        } else if (closure !== undefined) {
          closure(subQuery);
        }
        if (!(previous !== undefined)) {
          this._oneOfManySubQuery = subQuery;
        }
        if (lastColumn == column) {
          this._addOneOfManyJoinSubQuery(this._query, subQuery, column);
        }
        previous = {
          'subQuery': subQuery,
          'column': column
        };
      }
      this.addConstraints();
      return this as unknown as any;
    }

    /*Indicate that the relation is the latest single result of a larger one-to-many relationship.*/
    public latestOfMany(this: Relation & _Self, column: string | any[] | null = 'id', relation: string | null = null) {
      return this.ofMany(
        mapWithKeys(wrap(column), (column: string | any[] | null) => {
          return {column: 'MAX'};
        }), 'MAX', relation);
    }

    /*Indicate that the relation is the oldest single result of a larger one-to-many relationship.*/
    public oldestOfMany(this: Relation & _Self, column: string | any[] | null = 'id', relation: string | null = null) {
      return this.ofMany(
        mapWithKeys(wrap(column), (column: string | any[] | null) => {
          return {column: 'MIN'};
        }), 'MIN', relation);
    }

    /*Get the default alias for the one of many inner join clause.*/
    // _getDefaultOneOfManyJoinAlias(relation: string) {
    //   return relation == this._query.getModel().getTable() ? relation + '_of_many' : relation;
    // }

    /*Get a new query for the related model, grouping the query by the given column, often the foreign key of the relationship.*/
    _newOneOfManySubQuery(groupBy: string | any[], column: string | null = null,
                          aggregate: string | null = null) {
      const subQuery = this.query.getModel().newQuery();
      for (const group of wrap(groupBy)) {
        subQuery.groupBy(this.qualifyRelatedColumn(group));
      }
      if (!isBlank(column)) {
        subQuery.selectRaw(aggregate + '(' + subQuery.getQuery().grammar.wrap(
          column) + ') as ' + subQuery.getQuery().grammar.wrap(column));
      }
      // @ts-ignore
      this.addOneOfManySubQueryConstraints(subQuery, groupBy, column, aggregate);
      return subQuery;
    }

    /*Add the join subquery to the given query on the given column and the relationship's foreign key.*/
    _addOneOfManyJoinSubQuery(parent: FedacoBuilder, subQuery: FedacoBuilder, on: string) {
      // parent.beforeQuery((parent: FedacoBuilder) => {
      //   subQuery.applyBeforeQueryCallbacks();
      //   parent.joinSub(subQuery, this._relationName, join => {
      //     join.on(this.qualifySubSelectColumn(on), '=', this.qualifyRelatedColumn(on));
      //     this.addOneOfManyJoinSubQueryConstraints(join, on);
      //   });
      // });
    }

    /*Merge the relationship query joins to the given query builder.*/
    _mergeOneOfManyJoinsTo(query) {
      query.getQuery().beforeQueryCallbacks = this.query.getQuery().beforeQueryCallbacks;
      query.applyBeforeQueryCallbacks();
    }

    /*Get the query builder that will contain the relationship constraints.*/
    _getRelationQuery() {
      return this.isOneOfMany() ? this._oneOfManySubQuery : this._query;
    }

    /*Get the one of many inner join subselect builder instance.*/
    public getOneOfManySubQuery() {
      return this._oneOfManySubQuery;
    }

    /*Get the qualified column name for the one-of-many relationship using the subselect join query's alias.*/
    public qualifySubSelectColumn(column: string) {
      return `${this.getRelationName()}.${last(column.split('.'))}`;
    }

    /*Qualify related column using the related table name if it is not already qualified.*/
    _qualifyRelatedColumn(column: string) {
      return column.includes('.') ? column : this._query.getModel().getTable() + '.' + column;
    }

    /*Guess the "hasOne" relationship's name via backtrace.*/
    // _guessRelationship() {
    //   return debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3)[2]['function'];
    // }

    /*Determine whether the relationship is a one-of-many relationship.*/
    public isOneOfMany() {
      return this._isOneOfMany;
    }

    /*Get the name of the relationship.*/
    public getRelationName() {
      return this._relationName;
    }
  };
}
