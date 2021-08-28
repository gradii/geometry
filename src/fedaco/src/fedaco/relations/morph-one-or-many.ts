/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Model } from '../model';
import { HasOneOrMany } from './has-one-or-many';
import { FedacoBuilder  } from '../fedaco-builder';

export class MorphOneOrMany extends HasOneOrMany {
  /*The foreign key type for the relationship.*/
  protected morphType: string;
  /*The class name of the parent model.*/
  protected morphClass: string;

  /*Create a new morph one or many relationship instance.*/
  public constructor(query: FedacoBuilder, parent: Model, type: string, id: string, localKey: string) {
    super(query, parent, id, localKey);
    this.morphType  = type;
    this.morphClass = parent.getMorphClass();
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    if (MorphOneOrMany.constraints) {
      super.addConstraints();
      this.getRelationQuery().where(this.morphType, this.morphClass);
    }
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    super.addEagerConstraints(models);
    this.getRelationQuery().where(this.morphType, this.morphClass);
  }

  /*Set the foreign ID and type for creating a related model.*/
  protected setForeignAttributesForCreate(model: Model) {
    model[this.getForeignKeyName()] = this.getParentKey();
    model[this.getMorphType()]      = this.morphClass;
  }

  /*Get the relationship query.*/
  public getRelationExistenceQuery(query: FedacoBuilder, parentQuery: FedacoBuilder,
                                   columns: any[] | any = ['*']) {
    return super.getRelationExistenceQuery(query, parentQuery, columns).where(
      query.qualifyColumn(this.getMorphType()), this.morphClass);
  }

  /*Get the foreign key "type" name.*/
  public getQualifiedMorphType() {
    return this.morphType;
  }

  /*Get the plain morph type name without the table.*/
  public getMorphType() {
    return last(this.morphType.split('.'));
  }

  /*Get the class name of the parent model.*/
  public getMorphClass() {
    return this.morphClass;
  }
}
