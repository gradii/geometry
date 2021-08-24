/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Builder } from 'Illuminate/Database/Eloquent/Builder';
import { Model } from 'Illuminate/Database/Eloquent/Model';
import { Arr } from 'Illuminate/Support/Arr';
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
  public constructor(query: Builder, parent: Model, name: string, table: string, foreignKey: string,
                     otherKey: string, relationName: string = null, inverse: boolean = false) {
    this.inverse    = inverse;
    this.morphType  = name + '_type';
    this.morphClass = inverse ? query.getModel().getMorphClass() : parent.getMorphClass();
    super(query, parent, table, foreignKey, otherKey, relationName);
  }

  /*Set the where clause for the relation query.*/
  protected setWhere() {
    super.setWhere();
    this.query.where(this.table + '.' + this.morphType, this.morphClass);
    return this;
  }

  /*Add the constraints for a relationship count query.*/
  public getRelationQuery(query: Builder, parent: Builder, columns: any[] | any = ['*']) {
    let query = super.getRelationQuery(query, parent, columns);
    return query.where(this.table + '.' + this.morphType, this.morphClass);
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    super.addEagerConstraints(models);
    this.query.where(this.table + '.' + this.morphType, this.morphClass);
  }

  /*Create a new pivot attachment record.*/
  protected createAttachRecord(id: number, timed: boolean) {
    let record = super.createAttachRecord(id, timed);
    return Arr.add(record, this.morphType, this.morphClass);
  }

  /*Create a new query builder for the pivot table.*/
  protected newPivotQuery() {
    let query = super.newPivotQuery();
    return query.where(this.morphType, this.morphClass);
  }

  /*Create a new pivot model instance.*/
  public newPivot(attributes: any[] = [], exists: boolean = false) {
    let pivot = new MorphPivot(this.parent, attributes, this.table, exists);
    pivot.setPivotKeys(this.foreignKey, this.otherKey).setMorphType(this.morphType).setMorphClass(
      this.morphClass);
    return pivot;
  }

  /*Get the foreign key "type" name.*/
  public getMorphType() {
    return this.morphType;
  }

  /*Get the class name of the parent model.*/
  public getMorphClass() {
    return this.morphClass;
  }
}
