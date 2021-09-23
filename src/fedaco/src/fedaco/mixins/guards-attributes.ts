/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Constructor } from '../../helper/constructor';
import { reflector } from '@gradii/annotation';
import { isArray } from '@gradii/check-type';
import { Column, ColumnDefine, DateCastableColumn, DateColumn, EncryptedCastableColumn } from '../../annotation/column';
import { Scope } from '../../annotation/scope';
import { BelongsToColumn } from '../../annotation/belongs-to.relation';
import { BelongsToManyColumn } from '../../annotation/belongs-to-many.relation';
import { HasManyColumn } from '../../annotation/has-many.relation';
import { HasOneColumn } from '../../annotation/has-one.relation';
import { findLast } from 'ramda'

function isAnyGuarded(guarded: string[]) {
  return guarded.length === 1 && guarded[0] === '*'
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace GuardsAttributes {
  export const _unguarded: boolean
}

export interface GuardsAttributes {
  getFillable(): this;

  totallyGuarded(): boolean;

  isFillable(key: string): boolean;

  getGuarded(): this;

  _fillableFromArray(attributes: any): this;
}


export type GuardsAttributesCtor<M> = Constructor<GuardsAttributes>;


export function mixinGuardsAttributes<T extends Constructor<any>, M>(base: T): GuardsAttributesCtor<M> & T {
  return class _Self extends base {
    /*The attributes that are mass assignable.*/
    _fillable: string[] = [];
    /*The attributes that aren't mass assignable.*/
    _guarded: string[] = ['*'];
    /*Indicates if all mass assignment is enabled.*/
    static _unguarded = false;
    /*The actual columns that exist on the database and can be guarded.*/
    static _guardableColumns: any[];

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
    public static unguard(state: boolean = true) {
      this._unguarded = state;
    }

    /*Enable the mass assignment restrictions.*/
    public static reguard() {
      this._unguarded = false;
    }

    /*Determine if the current state is "unguarded".*/
    public static isUnguarded() {
      return this._unguarded;
    }

    /*Run the given callable while being unguarded.*/
    public static unguarded(callback: Function) {
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
      if ((this.constructor as typeof _Self)._unguarded) {
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
      return isAnyGuarded(this.getGuarded()) ||
        this.getGuarded().includes(key) ||
        !this._isGuardableColumn(key);
    }

    /*Determine if the given column is a valid, guardable column.*/
    _isGuardableColumn(key: string) {
      if (this._guardableColumns == undefined) {
        // this._guardableColumns = this.getConnection().getSchemaBuilder().getColumnListing(this.getTable());
        this._guardableColumns = []
        const meta = reflector.propMetadata(this.constructor)
        for (const x of Object.keys(meta)) {
          if (meta[x] && isArray(meta[x])) {
            const currentMeta = findLast(it => {
              return Column.isTypeOf(it) ||
                DateColumn.isTypeOf(it) ||
                DateCastableColumn.isTypeOf(it) ||
                EncryptedCastableColumn.isTypeOf(it) ||
                Scope.isTypeOf(it) ||
                BelongsToColumn.isTypeOf(it) ||
                BelongsToManyColumn.isTypeOf(it) ||
                HasManyColumn.isTypeOf(it) ||
                HasOneColumn.isTypeOf(it);
            }, meta[x]) as ColumnDefine;

            if (currentMeta) {
              this._guardableColumns.push(x)
            }
          }
        }
      }
      return this._guardableColumns.includes(key);
    }

    /*Determine if the model is totally guarded.*/
    public totallyGuarded() {
      return this.getFillable().length === 0 && isAnyGuarded(this.getGuarded());
    }

    /*Get the fillable attributes of a given array.*/
    _fillableFromArray(attributes: any) {
      if (this.getFillable().length > 0 && !(this.constructor as typeof _Self)._unguarded) {
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
