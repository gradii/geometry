/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { FedacoBuilder } from '../fedaco-builder';
import { Model } from '../model';
import { HasOneOrMany } from './has-one-or-many';

export class MorphOneOrMany extends HasOneOrMany {
  /*The foreign key type for the relationship.*/
  protected morphType: string;
  /*The class name of the parent model.*/
  protected morphClass: string;

  /*Create a new morph one or many relationship instance.*/
  public constructor(query: FedacoBuilder, parent: Model, type: string, id: string,
                     localKey: string) {
    super(query, parent, id, localKey);
    this.morphType  = type;
    this.morphClass = parent.getMorphClass();
  }

  /*Set the base constraints on the relation query.*/
  public addConstraints() {
    if (MorphOneOrMany.constraints) {
      super.addConstraints();
      this.query.where(this.morphType, this.morphClass);
    }
  }

  /*Get the relationship query.*/
  public getRelationQuery(query: FedacoBuilder, parent: FedacoBuilder,
                          columns: any[] | any = ['*']) {
    let query = super.getRelationQuery(query, parent, columns);
    return query.where(this.morphType, this.morphClass);
  }

  /*Set the constraints for an eager load of the relation.*/
  public addEagerConstraints(models: any[]) {
    super.addEagerConstraints(models);
    this.query.where(this.morphType, this.morphClass);
  }

  /*Attach a model instance to the parent model.*/
  public save(model: Model) {
    model.setAttribute(this.getPlainMorphType(), this.morphClass);
    return super.save(model);
  }

  /*Find a related model by its primary key or return new instance of the related model.*/
  public findOrNew(id: any, columns: any[] = ['*']) {
    if (isBlank(instance = this.find(id, columns))) {
      let instance = this.related.newInstance();
      this.setForeignAttributesForCreate(instance);
    }
    return instance;
  }

  /*Get the first related model record matching the attributes or instantiate it.*/
  public firstOrNew(attributes: any[]) {
    let instance = this.where(attributes).first();
    if (isBlank(instance)) {
      instance = this.related.newInstance(attributes);
      this.setForeignAttributesForCreate(instance);
    }
    return instance;
  }
?>
  /*Get the first related record matching the attributes or create it.*/
  public firstOrCreate(attributes: any[]) {
    let instance = this.where(attributes).first();
    if (isBlank(instance)) {
      instance = this.create(attributes);
    }
    return instance;
  }

  /*Create or update a related record matching the attributes, and fill it with values.*/
  public updateOrCreate(attributes: any[], values: any[] = []) {
    let instance = this.firstOrNew(attributes);
    instance.fill(values);
    instance.save();
    return instance;
  }

  /*Create a new instance of the related model.*/
  public create(attributes: any[]) {
    let instance = this.related.newInstance(attributes);
    this.setForeignAttributesForCreate(instance);
    instance.save();
    return instance;
  }

  /*Set the foreign ID and type for creating a related model.*/
  protected setForeignAttributesForCreate(model: Model) {
    model[this.getPlainForeignKey()]       = this.getParentKey();
    model[last(this.morphType.split('.'))] = this.morphClass;
  }

  /*Get the foreign key "type" name.*/
  public getMorphType() {
    return this.morphType;
  }

  /*Get the plain morph type name without the table.*/
  public getPlainMorphType() {
    return last(this.morphType.split('.'));
  }

  /*Get the class name of the parent model.*/
  public getMorphClass() {
    return this.morphClass;
  }
}
