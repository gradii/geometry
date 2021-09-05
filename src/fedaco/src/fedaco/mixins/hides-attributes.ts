/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isArray } from '@gradii/check-type';
import { difference } from 'ramda';
import { Constructor } from '../../helper/constructor';
import { value } from '../../helper/fn';

export interface HidesAttributes {
  getHidden(): any[];

  /*Set the hidden attributes for the model.*/
  setHidden(hidden: any[]): this;

  /*Get the visible attributes for the model.*/
  getVisible(): any[];

  /*Set the visible attributes for the model.*/
  setVisible(visible: any[]): this;

  /*Make the given, typically hidden, attributes visible.*/
  makeVisible(attributes: any[] | string | null): this;

  /*Make the given, typically hidden, attributes visible if the given truth test passes.*/
  makeVisibleIf(condition: boolean | Function, attributes: any[] | string | null): this;

  /*Make the given, typically visible, attributes hidden.*/
  makeHidden(attributes: any[] | string | null): this;

  /*Make the given, typically visible, attributes hidden if the given truth test passes.*/
  makeHiddenIf(condition: boolean | Function, attributes: any[] | string | null): this;
}

type HidesAttributesCtor = Constructor<HidesAttributes>;

export function mixinHidesAttributes<T extends Constructor<{}>>(base: T): HidesAttributesCtor & T {
  // @ts-ignore
  return class _Self extends base {
    /*The attributes that should be hidden for serialization.*/
    _hidden: any[] = [];
    /*The attributes that should be visible in serialization.*/
    _visible: any[] = [];

    /*Get the hidden attributes for the model.*/
    public getHidden(): any[] {
      return this._hidden;
    }

    /*Set the hidden attributes for the model.*/
    public setHidden(hidden: any[]): this {
      this._hidden = hidden;
      return this;
    }

    /*Get the visible attributes for the model.*/
    public getVisible(): any[] {
      return this._visible;
    }

    /*Set the visible attributes for the model.*/
    public setVisible(visible: any[]): this {
      this._visible = visible;
      return this;
    }

    /*Make the given, typically hidden, attributes visible.*/
    public makeVisible(attributes: any[] | string | null): this {
      attributes   = isArray(attributes) ? attributes : arguments as unknown as any[];
      this._hidden = difference(this._hidden, attributes);
      if (this._visible.length) {
        this._visible = [...this._visible, ...attributes];
      }
      return this;
    }

    /*Make the given, typically hidden, attributes visible if the given truth test passes.*/
    public makeVisibleIf(condition: boolean | Function, attributes: any[] | string | null): this {
      return value(condition, this) ? this.makeVisible(attributes) : this;
    }

    /*Make the given, typically visible, attributes hidden.*/
    public makeHidden(attributes: any[] | string | null): this {
      this._hidden = [...this._hidden, ...(isArray(attributes) ? attributes : arguments)];
      return this;
    }

    /*Make the given, typically visible, attributes hidden if the given truth test passes.*/
    public makeHiddenIf(condition: boolean | Function, attributes: any[] | string | null): this {
      return value(condition, this) ? this.makeHidden(attributes) : this;
    }
  };
}
