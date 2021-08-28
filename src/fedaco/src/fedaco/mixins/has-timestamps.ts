/*trait*/ import { isBlank } from '@gradii/check-type';
import { Constructor } from '../../helper/constructor';
import { FedacoBuilder } from '../fedaco-builder';
/** Mixin to augment a directive with a `disableRipple` property. */
export function mixinHasTimestamps<T extends Constructor<{}>>(base: T) {
  // @ts-ignore
  return class _Self extends base {

    /*Indicates if the model should be timestamped.*/
    public timestamps: boolean = true;

    /*Update the model's update timestamp.*/
    public touch(this: FedacoBuilder & _Self, attribute: string | null = null) {
      if (attribute) {
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
    public updateTimestamps() {
      var time            = this.freshTimestamp();
      var updatedAtColumn = this.getUpdatedAtColumn();
      if (!isBlank(updatedAtColumn) && !this.isDirty(updatedAtColumn)) {
        this.setUpdatedAt(time);
      }
      var createdAtColumn = this.getCreatedAtColumn();
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
    public freshTimestampString(this: FedacoBuilder) {
      return this.fromDateTime(this.freshTimestamp());
    }

    /*Determine if the model uses timestamps.*/
    public usesTimestamps() {
      return this.timestamps;
    }

    /*Get the name of the "created at" column.*/
    public getCreatedAtColumn() {
      return HasTimestamps.CREATED_AT;
    }

    /*Get the name of the "updated at" column.*/
    public getUpdatedAtColumn() {
      return HasTimestamps.UPDATED_AT;
    }

    /*Get the fully qualified "created at" column.*/
    public getQualifiedCreatedAtColumn() {
      return this.qualifyColumn(this.getCreatedAtColumn());
    }

    /*Get the fully qualified "updated at" column.*/
    public getQualifiedUpdatedAtColumn(this: FedacoBuilder) {
      return this.qualifyColumn(this.getUpdatedAtColumn());
    }
  };
}
