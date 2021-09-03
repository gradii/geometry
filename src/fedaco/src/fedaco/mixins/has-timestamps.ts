/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { Constructor } from '../../helper/constructor';
import { Model } from '../model';

export interface HasTimestamps {

  /*Update the model's update timestamp.*/
  touch(attribute: string): boolean;

  /*Update the creation and update timestamps.*/
  updateTimestamps(): boolean;

  /*Set the value of the "created at" attribute.*/
  setCreatedAt(value: any): this;

  /*Set the value of the "updated at" attribute.*/
  setUpdatedAt(value: any): this;

  /*Get a fresh timestamp for the model.*/
  freshTimestamp(): Date;

  /*Get a fresh timestamp for the model.*/
  freshTimestampString(): string;

  /*Determine if the model uses timestamps.*/
  usesTimestamps(): boolean;

  /*Get the name of the "created at" column.*/
  getCreatedAtColumn(): string;

  /*Get the name of the "updated at" column.*/
  getUpdatedAtColumn(): string;

  /*Get the fully qualified "created at" column.*/
  getQualifiedCreatedAtColumn(this: Model & this): string;

  /*Get the fully qualified "updated at" column.*/
  getQualifiedUpdatedAtColumn(this: Model & this): string;
}


export type HasTimestampsCtor = Constructor<HasTimestamps>;


/** Mixin to augment a directive with a `disableRipple` property. */
export function mixinHasTimestamps<T extends Constructor<any>>(base: T): HasTimestampsCtor & T {
  // @ts-ignore
  return class _Self extends base {

    /*Indicates if the model should be timestamped.*/
    public timestamps: boolean = true;

    /*Update the model's update timestamp.*/
    public touch(this: Model & _Self, attribute: string = null) {
      if (attribute) {
        // @ts-ignore
        this[attribute] = this.freshTimestamp();
        return this.save();
      }
      if (!this.usesTimestamps()) {
        return false;
      }
      this.updateTimestamps();
      return this.save();
    }

    /*Update the creation and update timestamps.*/
    public updateTimestamps(this: Model & _Self) {
      let time            = this.freshTimestamp();
      let updatedAtColumn = this.getUpdatedAtColumn();
      if (!isBlank(updatedAtColumn) && !this.isDirty(updatedAtColumn)) {
        this.setUpdatedAt(time);
      }
      let createdAtColumn = this.getCreatedAtColumn();
      if (!this.exists && !isBlank(createdAtColumn) && !this.isDirty(createdAtColumn)) {
        this.setCreatedAt(time);
      }
    }

    /*Set the value of the "created at" attribute.*/
    public setCreatedAt(value: any) {
      this[this.getCreatedAtColumn()] = value;
      return this;
    }

    /*Set the value of the "updated at" attribute.*/
    public setUpdatedAt(value: any) {
      this[this.getUpdatedAtColumn()] = value;
      return this;
    }

    /*Get a fresh timestamp for the model.*/
    public freshTimestamp() {
      return Date.now();
    }

    /*Get a fresh timestamp for the model.*/
    public freshTimestampString(this: Model & this) {
      return this.fromDateTime(this.freshTimestamp());
    }

    /*Determine if the model uses timestamps.*/
    public usesTimestamps() {
      return this.timestamps;
    }

    /*Get the name of the "created at" column.*/
    public getCreatedAtColumn() {
      return 'created_at';
    }

    /*Get the name of the "updated at" column.*/
    public getUpdatedAtColumn() {
      return 'updated_at';
    }

    /*Get the fully qualified "created at" column.*/
    public getQualifiedCreatedAtColumn(this: Model & this) {
      return this.qualifyColumn(this.getCreatedAtColumn());
    }

    /*Get the fully qualified "updated at" column.*/
    public getQualifiedUpdatedAtColumn(this: Model & this) {
      return this.qualifyColumn(this.getUpdatedAtColumn());
    }
  };
}
