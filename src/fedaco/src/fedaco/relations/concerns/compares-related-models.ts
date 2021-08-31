/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank, isNumber } from '@gradii/check-type';
import { Constructor } from '../../../helper/constructor';
import { Model } from '../../model';

export function mixinComparesRelatedModels<T extends Constructor<{}>>(base: T) {
  // @ts-ignore
  return class ComparesRelatedModels extends base {

    /*Determine if the model is the related instance of the relationship.*/
    public is(this: Model & this, model: Model | null) {
      const match = !isBlank(model) && this.compareKeys(this.getParentKey(), this.getRelatedKeyFrom(
        model)) && this.related.getTable() === model.getTable() && this.related.getConnectionName() === model.getConnectionName();
      if (match && this instanceof SupportsPartialRelations && this.isOneOfMany()) {
        return this._query.whereKey(model.getKey()).exists();
      }
      return match;
    }

    /*Determine if the model is not the related instance of the relationship.*/
    public isNot(model: Model | null) {
      return !this.is(model);
    }

    /*Get the value of the parent model's key.*/
    public getParentKey() {
      throw new Error('not implemented');
    }

    /*Get the value of the model's related key.*/
    protected getRelatedKeyFrom(model: Model) {
      throw new Error('not implemented');
    }

    /*Compare the parent key with the related key.*/
    protected compareKeys(parentKey: any, relatedKey: any) {
      if (!parentKey.length || !relatedKey.length) {
        return false;
      }
      if (isNumber(parentKey) || isNumber(relatedKey)) {
        return /*cast type int*/ parentKey === /*cast type int*/ relatedKey;
      }
      return parentKey === relatedKey;
    }
  };
}
