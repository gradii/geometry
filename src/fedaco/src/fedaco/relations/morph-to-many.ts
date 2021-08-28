/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Model } from '../model';
import { BelongsToMany } from './belongs-to-many';

export class MorphToMany extends BelongsToMany {
  /*The type of the polymorphic relation.*/
  protected morphType: string;
  /*The class name of the morph type constraint.*/
  protected morphClass: string;
  /*Indicates if we are connecting the inverse of the relation.

  This primarily affects the morphClass constraint.*/
  protected inverse: boolean;

  /*Create a new morph to many relationship instance.*/
  public constructor(query: Builder, parent: Model, name: string, table: string,
                     foreignPivotKey: string, relatedPivotKey: string, parentKey: string,
                     relatedKey: string, relationName: string | null = null,
                     inverse: boolean                                = false) {
    super(query, parent, table, foreignPivotKey, relatedPivotKey, parentKey, relatedKey,
      relationName);
    this.inverse    = inverse;
    this.morphType  = name + '_type';
    this.morphClass = inverse ? query.getModel().getMorphClass() : parent.getMorphClass();
  }

  /*Set the where clause for the relation query.*/
  protected addWhereConstraints() {
    super.addWhereConstraints();
    this.query.where(this.qualifyPivotColumn(this.morphType), this.morphClass);
    return this;
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    super.addEagerConstraints(models);
    this.query.where(this.qualifyPivotColumn(this.morphType), this.morphClass);
  }

  /*Create a new pivot attachment record.*/
  protected baseAttachRecord(id: number, timed: boolean) {
    return Arr.add(super.baseAttachRecord(id, timed), this.morphType, this.morphClass);
  }

  /*Add the constraints for a relationship count query.*/
  public getRelationExistenceQuery(query: Builder, parentQuery: Builder,
                                   columns: any[] | any = ['*']) {
    return super.getRelationExistenceQuery(query, parentQuery, columns).where(
      this.qualifyPivotColumn(this.morphType), this.morphClass);
  }

  /*Get the pivot models that are currently attached.*/
  protected getCurrentlyAttachedPivots() {
    return super.getCurrentlyAttachedPivots().map(record => {
      return record instanceof MorphPivot ? record.setMorphType(this.morphType).setMorphClass(
        this.morphClass) : record;
    });
  }

  /*Create a new query builder for the pivot table.*/
  public newPivotQuery() {
    return super.newPivotQuery().where(this.morphType, this.morphClass);
  }

  /*Create a new pivot model instance.*/
  public newPivot(attributes: any[] = [], exists: boolean = false) {
    var using = this.using;
    var pivot = using ? using.fromRawAttributes(this.parent, attributes, this.table,
      exists) : MorphPivot.fromAttributes(this.parent, attributes, this.table, exists);
    pivot.setPivotKeys(this.foreignPivotKey, this.relatedPivotKey).setMorphType(
      this.morphType).setMorphClass(this.morphClass);
    return pivot;
  }

  /*Get the pivot columns for the relation.

  "pivot_" is prefixed at each column for easy removal later.*/
  protected aliasedPivotColumns() {
    var defaults = [this.foreignPivotKey, this.relatedPivotKey, this.morphType];
    return collect([...defaults, ...this.pivotColumns]).map(column => {
      return this.qualifyPivotColumn(column) + ' as pivot_' + column;
    }).unique().all();
  }

  /*Get the foreign key "type" name.*/
  public getMorphType() {
    return this.morphType;
  }

  /*Get the class name of the parent model.*/
  public getMorphClass() {
    return this.morphClass;
  }

  /*Get the indicator for a reverse relationship.*/
  public getInverse() {
    return this.inverse;
  }
}
