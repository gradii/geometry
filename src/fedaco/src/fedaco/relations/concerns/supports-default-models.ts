/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isArray, isFunction } from '@gradii/check-type';
import { Constructor } from '../../../helper/constructor';
import { Model } from '../../model';
import { Relation } from '../relation';

export interface SupportsDefaultModels {
  withDefault(callback?: Function | any[] | boolean): this;

  _getDefaultFor(parent: Model): Model;
}

type SupportsDefaultModelsCtor = Constructor<SupportsDefaultModels>;

export function mixinSupportsDefaultModels<T extends Constructor<{}>>(base: T): SupportsDefaultModelsCtor & T {
  // @ts-ignore
  return class _Self extends base {
    /*Indicates if a default model instance should be used.

    Alternatively, may be a Closure or array.*/
    _withDefault: Function | any[] | boolean;

    /*Make a new related instance for the given model.*/
    // protected abstract newRelatedInstanceFor(parent: Model);

    /*Return a new model instance in case the relationship does not exist.*/
    public withDefault(callback: Function | any[] | boolean = true) {
      this._withDefault = callback;
      return this;
    }

    /*Get the default value for this relation.*/
    _getDefaultFor(this: Relation & this, parent: Model): Model {
      if (!this.withDefault) {
        return;
      }
      let instance = this.newRelatedInstanceFor(parent);
      if (isFunction(this.withDefault)) {
        return this.withDefault.call(this, instance, parent) || instance;
      }
      if (isArray(this.withDefault)) {
        instance.forceFill(this.withDefault);
      }
      return instance;
    }
  };
}
