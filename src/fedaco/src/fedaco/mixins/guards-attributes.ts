/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Constructor } from '../../helper/constructor';

export interface GuardsAttributes {
  getFillable(): this;

  totallyGuarded(): boolean;

  isFillable(key: string): boolean;

  getGuarded(): this;

  _fillableFromArray(attributes: any): this;
}

export type GuardsAttributesCtor = Constructor<GuardsAttributes>;


export function mixinGuardsAttributes<T extends Constructor<any>>(base: T): GuardsAttributesCtor & T {
  return class _Self extends base {
    /*The attributes that are mass assignable.*/
    _fillable: string[] = [];
    /*The attributes that aren't mass assignable.*/
    _guarded: string[] = ['*'];
    /*Indicates if all mass assignment is enabled.*/
    _unguarded: boolean = false;
    /*The actual columns that exist on the database and can be guarded.*/
    _guardableColumns: any[];

    /*Get the fillable attributes for the model.*/
    public getFillable() {
      return this._fillable;
    }

    /*Set the fillable attributes for the model.*/
    public fillable(fillable: any[]) {
      this._fillable = fillable;
      return this;
    }

    /*Merge new fillable attributes with existing fillable attributes on the model.*/
    public mergeFillable(fillable: any[]) {
      this._fillable = [...this._fillable, ...fillable];
      return this;
    }

    /*Get the guarded attributes for the model.*/
    public getGuarded() {
      return this._guarded;
    }

    /*Set the guarded attributes for the model.*/
    public guard(guarded: any[]) {
      this._guarded = guarded;
      return this;
    }

    /*Merge new guarded attributes with existing guarded attributes on the model.*/
    public mergeGuarded(guarded: any[]) {
      this._guarded = [...this._guarded, ...guarded];
      return this;
    }

    /*Disable all mass assignable restrictions.*/
    public unguard(state: boolean = true) {
      this._unguarded = state;
    }

    /*Enable the mass assignment restrictions.*/
    public reguard() {
      this._unguarded = false;
    }

    /*Determine if the current state is "unguarded".*/
    public isUnguarded() {
      return this._unguarded;
    }

    /*Run the given callable while being unguarded.*/
    public unguarded(callback: Function) {
      if (this._unguarded) {
        return callback();
      }
      this.unguard();
      try {
        return callback();
      } finally {
        this.reguard();
      }
    }

    /*Determine if the given attribute may be mass assigned.*/
    public isFillable(key: string) {
      if (this._unguarded) {
        return true;
      }
      if (this.getFillable().includes(key)) {
        return true;
      }
      if (this.isGuarded(key)) {
        return false;
      }
      return !this.getFillable().length &&
        !key.includes('.') &&
        !key.startsWith('_');
    }

    /*Determine if the given key is guarded.*/
    public isGuarded(key: string) {
      if (!this.getGuarded().length) {
        return false;
      }
      return this.getGuarded() == ['*'] ||
        // !empty(preg_grep('/^' + preg_quote(key) + '$/i', this.getGuarded())) ||
        !this._isGuardableColumn(key);
    }

    /*Determine if the given column is a valid, guardable column.*/
    _isGuardableColumn(key: string) {
      if (!(this._guardableColumns != undefined)) {
        // this._guardableColumns = this.getConnection().getSchemaBuilder().getColumnListing(this.getTable());
      }
      return this._guardableColumns.includes(key);
    }

    /*Determine if the model is totally guarded.*/
    public totallyGuarded() {
      return this.getFillable().length === 0 && this.getGuarded() == ['*'];
    }

    /*Get the fillable attributes of a given array.*/
    _fillableFromArray(attributes: any) {
      if (this.getFillable().length > 0 && !this._unguarded) {
        const rst: any = {}, fillable = this.getFillable();
        for (let key of Object.keys(attributes)) {
          if (fillable.includes(key)) {
            rst[key] = attributes[key];
          }
        }
        return rst;
      }
      return attributes;
    }
  };
}
