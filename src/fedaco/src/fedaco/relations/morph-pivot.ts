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
  protected setKeysForSaveQuery(query: Builder) {
    query.where(this.morphType, this.morphClass);
    return super.setKeysForSaveQuery(query);
  }
  /*Set the keys for a select query.*/
  protected setKeysForSelectQuery(query: Builder) {
    query.where(this.morphType, this.morphClass);
    return super.setKeysForSelectQuery(query);
  }
  /*Delete the pivot model record from the database.*/
  public delete() {
    if (this.attributes[this.getKeyName()] !== undefined) {
      return /*cast type int*/ super.delete();
    }
    if (this.fireModelEvent("deleting") === false) {
      return 0;
    }
    var query = this.getDeleteQuery();
    query.where(this.morphType, this.morphClass);
    return tap(query.delete(), () => {
      this.fireModelEvent("deleted", false);
    });
  }
  /*Get the morph type for the pivot.*/
  public getMorphType() {
    return this.morphType;
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
  /*Get the queueable identity for the entity.*/
  public getQueueableId() {
    if (this.attributes[this.getKeyName()] !== undefined) {
      return this.getKey();
    }
    return `${this.foreignKey}:${this.getAttribute(this.foreignKey)}:${this.relatedKey}:${this.getAttribute(this.relatedKey)}:${this.morphType}:${this.morphClass}`;
  }
  /*Get a new query to restore one or more models by their queueable IDs.*/
  public newQueryForRestoration(ids: any[] | number) {
    if (is_array(ids)) {
      return this.newQueryForCollectionRestoration(ids);
    }
    if (!Str.contains(ids, ":")) {
      return super.newQueryForRestoration(ids);
    }
    var segments = ids.split(":");
    return this.newQueryWithoutScopes().where(segments[0], segments[1]).where(segments[2], segments[3]).where(segments[4], segments[5]);
  }
  /*Get a new query to restore multiple models by their queueable IDs.*/
  protected newQueryForCollectionRestoration(ids: any[]) {
    var ids = array_values(ids);
    if (!Str.contains(ids[0], ":")) {
      return super.newQueryForRestoration(ids);
    }
    var query = this.newQueryWithoutScopes();
    for (let id of ids) {
      var segments = id.split(":");
      query.orWhere(query => {
        return query.where(segments[0], segments[1]).where(segments[2], segments[3]).where(segments[4], segments[5]);
      });
    }
    return query;
  }
}
