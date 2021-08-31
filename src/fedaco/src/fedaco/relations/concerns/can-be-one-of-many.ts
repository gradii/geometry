/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { last } from 'ramda';
// import { InvalidArgumentException } from 'InvalidArgumentException';
import { Constructor } from '../../../helper/constructor';
import { FedacoBuilder } from '../../fedaco-builder';

export function mixinCanBeOneOfMany<T extends Constructor<{}>>(base: T) {
  // @ts-ignore
  return class CanBeOneOfMany extends base {

    /*Determines whether the relationship is one-of-many.*/
    protected _isOneOfMany: boolean = false;
    /*The name of the relationship.*/
    protected relationName: string;
    /*The one of many inner join subselect query builder instance.*/
    protected oneOfManySubQuery: FedacoBuilder | null;

    // /*Add constraints for inner join subselect for one of many relationships.*/
    // public abstract addOneOfManySubQueryConstraints(
    //   query: Builder, column: string | null = null,
    //   aggregate: string | null              = null
    // );
    //
    // /*Get the columns the determine the relationship groups.*/
    // public abstract getOneOfManySubQuerySelectColumns();
    //
    // /*Add join query constraints for one of many relationships.*/
    // public abstract addOneOfManyJoinSubQueryConstraints(join: JoinClause);

    /*Indicate that the relation is a single result of a larger one-to-many relationship.*/
    public ofMany(column: string | any[] | null = 'id', aggregate: string | Function | null = 'MAX',
                  relation: string | null                                                   = null) {
      this._isOneOfMany = true;
      this.relationName = relation || this.getDefaultOneOfManyJoinAlias(this.guessRelationship());
      let keyName       = this.query.getModel().getKeyName();
      let columns       = is_string(columns = column) ? {} : column;
      if (!array_key_exists(keyName, columns)) {
        columns[keyName] = 'MAX';
      }
      if (aggregate instanceof Closure) {
        let closure = aggregate;
      }
      for (let [column, aggregate] of Object.entries(columns)) {
        if (!in_array(aggregate.toLowerCase(), ['min', 'max'])) {
          throw new InvalidArgumentException(
            '"Invalid aggregate [{$aggregate}] used within ofMany relation. Available aggregates: MIN, MAX"');
        }
        let subQuery = this.newOneOfManySubQuery(this.getOneOfManySubQuerySelectColumns(), column,
          aggregate);
        if (previous !== undefined) {
          this.addOneOfManyJoinSubQuery(subQuery, previous['subQuery'], previous['column']);
        } else if (closure !== undefined) {
          closure(subQuery);
        }
        if (!(previous !== undefined)) {
          this.oneOfManySubQuery = subQuery;
        }
        if (array_key_last(columns) == column) {
          this.addOneOfManyJoinSubQuery(this.query, subQuery, column);
        }
        let previous = {
          'subQuery': subQuery,
          'column'  : column
        };
      }
      this.addConstraints();
      return this;
    }

    /*Indicate that the relation is the latest single result of a larger one-to-many relationship.*/
    public latestOfMany(column: string | any[] | null = 'id', relation: string | null = null) {
      return this.ofMany(collect(Arr.wrap(column)).mapWithKeys((column: string | any[] | null) => {
        return {};
      }).all(), 'MAX', relation || this.guessRelationship());
    }

    /*Indicate that the relation is the oldest single result of a larger one-to-many relationship.*/
    public oldestOfMany(column: string | any[] | null = 'id', relation: string | null = null) {
      return this.ofMany(collect(Arr.wrap(column)).mapWithKeys((column: string | any[] | null) => {
        return {};
      }).all(), 'MIN', relation || this.guessRelationship());
    }

    /*Get the default alias for the one of many inner join clause.*/
    protected getDefaultOneOfManyJoinAlias(relation: string) {
      return relation == this.query.getModel().getTable() ? relation + '_of_many' : relation;
    }

    /*Get a new query for the related model, grouping the query by the given column, often the foreign key of the relationship.*/
    protected newOneOfManySubQuery(groupBy: string | any[], column: string | null = null,
                                   aggregate: string | null                       = null) {
      let subQuery = this.query.getModel().newQuery();
      for (let group of Arr.wrap(groupBy)) {
        subQuery.groupBy(this.qualifyRelatedColumn(group));
      }
      if (!isBlank(column)) {
        subQuery.selectRaw(aggregate + '(' + subQuery.getQuery().grammar.wrap(
          column) + ') as ' + subQuery.getQuery().grammar.wrap(column));
      }
      this.addOneOfManySubQueryConstraints(subQuery, groupBy, column, aggregate);
      return subQuery;
    }

    /*Add the join subquery to the given query on the given column and the relationship's foreign key.*/
    protected addOneOfManyJoinSubQuery(parent: FedacoBuilder, subQuery: FedacoBuilder, on: string) {
      parent.beforeQuery((parent: FedacoBuilder) => {
        subQuery.applyBeforeQueryCallbacks();
        parent.joinSub(subQuery, this.relationName, join => {
          join.on(this.qualifySubSelectColumn(on), '=', this.qualifyRelatedColumn(on));
          this.addOneOfManyJoinSubQueryConstraints(join, on);
        });
      });
    }

    /*Merge the relationship query joins to the given query builder.*/
    protected mergeOneOfManyJoinsTo(query) {
      query.getQuery().beforeQueryCallbacks = this.query.getQuery().beforeQueryCallbacks;
      query.applyBeforeQueryCallbacks();
    }

    /*Get the query builder that will contain the relationship constraints.*/
    protected getRelationQuery() {
      return this.isOneOfMany() ? this.oneOfManySubQuery : this.query;
    }

    /*Get the one of many inner join subselect builder instance.*/
    public getOneOfManySubQuery() {
      return this.oneOfManySubQuery;
    }

    /*Get the qualified column name for the one-of-many relationship using the subselect join query's alias.*/
    public qualifySubSelectColumn(column: string) {
      return `${this.getRelationName()}.${last(column.split('.'))}`;
    }

    /*Qualify related column using the related table name if it is not already qualified.*/
    protected qualifyRelatedColumn(column: string) {
      return column.includes('.') ? column : this.query.getModel().getTable() + '.' + column;
    }

    /*Guess the "hasOne" relationship's name via backtrace.*/
    protected guessRelationship() {
      return debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3)[2]['function'];
    }

    /*Determine whether the relationship is a one-of-many relationship.*/
    public isOneOfMany() {
      return this._isOneOfMany;
    }

    /*Get the name of the relationship.*/
    public getRelationName() {
      return this.relationName;
    }
  };
}
