/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { FedacoBuilder } from '../fedaco-builder';
import { Pivot } from './pivot';

export class MorphPivot extends Pivot {
  /*The type of the polymorphic relation.

  Explicitly define this so it's not included in saved attributes.*/
  protected morphType: string;
  /*The value of the polymorphic relation.

  Explicitly define this so it's not included in saved attributes.*/
  protected morphClass: string;

  /*Set the keys for a save update query.*/
  protected setKeysForSaveQuery(query: FedacoBuilder) {
    query.where(this.morphType, this.morphClass);
    return super.setKeysForSaveQuery(query);
  }

  /*Delete the pivot model record from the database.*/
  public delete() {
    let query = this.getDeleteQuery();
    query.where(this.morphType, this.morphClass);
    return query.delete();
  }

  /*Set the morph type for the pivot.*/
  public setMorphType(morphType: string) {
    this.morphType = morphType;
    return this;
  }

  /*Set the morph class for the pivot.*/
  public setMorphClass(morphClass: string) {
    this.morphClass = morphClass;
    return this;
  }
}
