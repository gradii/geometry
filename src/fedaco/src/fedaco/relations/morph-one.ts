/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { Collection } from '../../define/collection';
import { MorphOneOrMany } from './morph-one-or-many';

export class MorphOne extends MorphOneOrMany {
  /*Get the results of the relationship.*/
  public getResults() {
    if (isBlank(this.getParentKey())) {
      return this.getDefaultFor(this.parent);
    }
    return this.query.first() || this.getDefaultFor(this.parent);
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    for (let model of models) {
      model.setRelation(relation, this.getDefaultFor(model));
    }
    return models;
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    return this.matchOne(models, results, relation);
  }

  /*Get the relationship query.*/
  public getRelationExistenceQuery(query: Builder, parentQuery: Builder,
                                   columns: any[] | any = ['*']) {
    if (this.isOneOfMany()) {
      this.mergeOneOfManyJoinsTo(query);
    }
    return super.getRelationExistenceQuery(query, parentQuery, columns);
  }

  /*Add constraints for inner join subselect for one of many relationships.*/
  public addOneOfManySubQueryConstraints(query: Builder, column: string | null = null,
                                         aggregate: string | null = null) {
    query.addSelect(this.foreignKey, this.morphType);
  }

  /*Get the columns that should be selected by the one of many subquery.*/
  public getOneOfManySubQuerySelectColumns() {
    return [this.foreignKey, this.morphType];
  }

  /*Add join query constraints for one of many relationships.*/
  public addOneOfManyJoinSubQueryConstraints(join: JoinClause) {
    join.on(this.qualifySubSelectColumn(this.morphType), '=',
      this.qualifyRelatedColumn(this.morphType)).on(this.qualifySubSelectColumn(this.foreignKey),
      '=', this.qualifyRelatedColumn(this.foreignKey));
  }

  /*Make a new related instance for the given model.*/
  public newRelatedInstanceFor(parent: Model) {
    return this.related.newInstance().setAttribute(this.getForeignKeyName(),
      parent[this.localKey]).setAttribute(this.getMorphType(), this.morphClass);
  }

  /*Get the value of the model's foreign key.*/
  protected getRelatedKeyFrom(model: Model) {
    return model.getAttribute(this.getForeignKeyName());
  }
}
