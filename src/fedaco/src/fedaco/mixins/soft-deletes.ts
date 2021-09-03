/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { tap } from 'ramda';
import { Constructor } from '../../helper/constructor';
import { Model } from '../model';

/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export function mixinSoftDeletes<T extends Constructor<{}>>(base: T) {
  // @ts-ignore
  return class SoftDeletes extends base {
    isTypeofSoftDeletes = true;

    /*Indicates if the model is currently force deleting.*/
    _forceDeleting: boolean = false;
    /*Boot the soft deleting trait for a model.*/
    // public static bootSoftDeletes() {
    //     SoftDeletes.addGlobalScope(new SoftDeletingScope());
    // }
    /*Initialize the soft deleting trait for an instance.*/
    public initializeSoftDeletes(this: Model & this) {
      if (!(this._casts[this.getDeletedAtColumn()] !== undefined)) {
        this._casts[this.getDeletedAtColumn()] = 'datetime';
      }
    }

    /*Force a hard delete on a soft deleted model.*/
    public forceDelete() {
      this._forceDeleting = true;
      return tap(deleted => {
        this._forceDeleting = false;
        if (deleted) {
          this.fireModelEvent('forceDeleted', false);
        }
      }, this.delete());
    }

    /*Perform the actual delete query on this model instance.*/
    protected performDeleteOnModel() {
      if (this._forceDeleting) {
        this.exists = false;
        return this.setKeysForSaveQuery(this.newModelQuery()).forceDelete();
      }
      return this.runSoftDelete();
    }

    /*Perform the actual delete query on this model instance.*/
    protected runSoftDelete() {
      let query                       = this.setKeysForSaveQuery(this.newModelQuery());
      let time                        = this.freshTimestamp();
      let columns                     = {};
      this[this.getDeletedAtColumn()] = time;
      if (this.timestamps && !isBlank(this.getUpdatedAtColumn())) {
        this[this.getUpdatedAtColumn()]    = time;
        columns[this.getUpdatedAtColumn()] = this.fromDateTime(time);
      }
      query.update(columns);
      this.syncOriginalAttributes(array_keys(columns));
      this.fireModelEvent('trashed', false);
    }

    /*Restore a soft-deleted model instance.*/
    public restore() {
      if (this.fireModelEvent('restoring') === false) {
        return false;
      }
      this[this.getDeletedAtColumn()] = null;
      this.exists                     = true;
      let result                      = this.save();
      this.fireModelEvent('restored', false);
      return result;
    }

    /*Determine if the model instance has been soft-deleted.*/
    public trashed() {
      return !isBlank(this[this.getDeletedAtColumn()]);
    }

    // /*Register a "softDeleted" model event callback with the dispatcher.*/
    // public static softDeleted(callback: Function | string) {
    //   SoftDeletes.registerModelEvent('trashed', callback);
    // }
    //
    // /*Register a "restoring" model event callback with the dispatcher.*/
    // public static restoring(callback: Function | string) {
    //   SoftDeletes.registerModelEvent('restoring', callback);
    // }
    //
    // /*Register a "restored" model event callback with the dispatcher.*/
    // public static restored(callback: Function | string) {
    //   SoftDeletes.registerModelEvent('restored', callback);
    // }
    //
    // /*Register a "forceDeleted" model event callback with the dispatcher.*/
    // public static forceDeleted(callback: Function | string) {
    //   SoftDeletes.registerModelEvent('forceDeleted', callback);
    // }

    /*Determine if the model is currently force deleting.*/
    public isForceDeleting() {
      return this._forceDeleting;
    }

    /*Get the name of the "deleted at" column.*/
    public getDeletedAtColumn() {
      return defined('static::DELETED_AT') ? SoftDeletes.DELETED_AT : 'deleted_at';
    }

    /*Get the fully qualified "deleted at" column.*/
    public getQualifiedDeletedAtColumn() {
      return this.qualifyColumn(this.getDeletedAtColumn());
    }
  };
}
