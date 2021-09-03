/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isArray } from '@gradii/check-type';
import { difference } from 'ramda';
import { Constructor } from '../../helper/constructor';

export function mixinHidesAttributes<T extends Constructor<{}>>(base: T) {
  // @ts-ignore
  return class HidesAttributes extends base {
    /*The attributes that should be hidden for serialization.*/
    _hidden: any[] = [];
    /*The attributes that should be visible in serialization.*/
    _visible: any[] = [];

    /*Get the hidden attributes for the model.*/
    public getHidden() {
      return this._hidden;
    }

    /*Set the hidden attributes for the model.*/
    public setHidden(hidden: any[]) {
      this._hidden = hidden;
      return this;
    }

    /*Get the visible attributes for the model.*/
    public getVisible() {
      return this._visible;
    }

    /*Set the visible attributes for the model.*/
    public setVisible(visible: any[]) {
      this._visible = visible;
      return this;
    }

    /*Make the given, typically hidden, attributes visible.*/
    public makeVisible(attributes: any[] | string | null) {
      attributes = isArray(attributes) ? attributes : arguments;
      this._hidden = difference(this._hidden, attributes);
      if (this._visible.length) {
        this._visible = [...this._visible, ...attributes];
      }
      return this;
    }

    /*Make the given, typically hidden, attributes visible if the given truth test passes.*/
    public makeVisibleIf(condition: boolean | Function, attributes: any[] | string | null) {
      return value(condition, this) ? this.makeVisible(attributes) : this;
    }

    /*Make the given, typically visible, attributes hidden.*/
    public makeHidden(attributes: any[] | string | null) {
      this._hidden = [...this._hidden, ...(isArray(attributes) ? attributes : arguments)];
      return this;
    }

    /*Make the given, typically visible, attributes hidden if the given truth test passes.*/
    public makeHiddenIf(condition: boolean | Function, attributes: any[] | string | null) {
      return value(condition, this) ? this.makeHidden(attributes) : this;
    }
  };
}
