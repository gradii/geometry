/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { Collection } from '../../define/collection';
import { JoinClauseBuilder } from '../../query-builder/query-builder';
import { FedacoBuilder } from '../fedaco-builder';
import { Model } from '../model';
import { mixinCanBeOneOfMany } from './concerns/can-be-one-of-many';
import { mixinComparesRelatedModels } from './concerns/compares-related-models';
import { mixinSupportsDefaultModels } from './concerns/supports-default-models';
import { MorphOneOrMany } from './morph-one-or-many';

export class MorphOne extends mixinCanBeOneOfMany(
  mixinComparesRelatedModels(
    mixinSupportsDefaultModels(
      MorphOneOrMany
    )
  )
) {

  public supportsPartialRelations = true;

  /*Get the results of the relationship.*/
  public async getResults() {
    if (isBlank(this.getParentKey())) {
      return this._getDefaultFor(this._parent);
    }
    return await this._query.first() || this._getDefaultFor(this._parent);
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    for (const model of models) {
      model.setRelation(relation, this._getDefaultFor(model));
    }
    return models;
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    return this.matchOne(models, results, relation);
  }

  /*Get the relationship query.*/
  public getRelationExistenceQuery(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                   columns: any[] | any = ['*']) {
    if (this.isOneOfMany()) {
      this.mergeOneOfManyJoinsTo(query);
    }
    return super.getRelationExistenceQuery(query, parentQuery, columns);
  }

  /*Add constraints for inner join subselect for one of many relationships.*/
  public addOneOfManySubQueryConstraints(query: FedacoBuilder, column: string | null = null,
                                         aggregate: string | null                    = null) {
    query.addSelect(this.foreignKey, this.morphType);
  }

  /*Get the columns that should be selected by the one of many subquery.*/
  public getOneOfManySubQuerySelectColumns() {
    return [this.foreignKey, this.morphType];
  }

  /*Add join query constraints for one of many relationships.*/
  public addOneOfManyJoinSubQueryConstraints(join: JoinClauseBuilder) {
    join.on(
      this.qualifySubSelectColumn(this.morphType),
      '=',
      this.qualifyRelatedColumn(this.morphType)
    ).on(
      this.qualifySubSelectColumn(this.foreignKey),
      '=',
      this.qualifyRelatedColumn(this.foreignKey)
    );
  }

  /*Make a new related instance for the given model.*/
  public newRelatedInstanceFor(parent: Model) {
    return this._related.newInstance()
      .setAttribute(this.getForeignKeyName(), parent[this.localKey])
      .setAttribute(this.getMorphType(), this.morphClass);
  }

  /*Get the value of the model's foreign key.*/
  protected getRelatedKeyFrom(model: Model) {
    return model.getAttribute(this.getForeignKeyName());
  }
}
