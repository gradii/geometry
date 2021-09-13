/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank, isNumber } from '@gradii/check-type';
import { Constructor } from '../../../helper/constructor';
import { Model } from '../../model';
import { HasOne } from '../has-one';
import { MorphOne } from '../morph-one';
import { Relation } from '../Relation';

export interface ComparesRelatedModels {
  is(this: Model & this, model: Model | null): Model;

  /*Determine if the model is not the related instance of the relationship.*/
  isNot(model: Model | null): Model;

  /*Get the value of the parent model's key.*/
  getParentKey(): string;

  /*Get the value of the model's related key.*/
  _getRelatedKeyFrom(model: Model): string;

  /*Compare the parent key with the related key.*/
  _compareKeys(parentKey: any, relatedKey: any): boolean;
}

type ComparesRelatedModelsCtor = Constructor<ComparesRelatedModels>;

export function mixinComparesRelatedModels<T extends Constructor<{}>>(base: T): ComparesRelatedModelsCtor & T {
  // @ts-ignore
  return class _Self extends base {

    /*Determine if the model is the related instance of the relationship.*/
    public is(this: Relation & this, model: Model | null) {
      const match = !isBlank(model) && this._compareKeys(this.getParentKey(),
        this._getRelatedKeyFrom(
          model)) && this._related.getTable() === model.getTable() && this._related.getConnectionName() === model.getConnectionName();
      // @ts-ignore
      if (match && (this as HasOne | MorphOne).supportsPartialRelations && this.isOneOfMany()) {
        return this._query.whereKey(model.getKey()).exists();
      }
      return match;
    }

    /*Determine if the model is not the related instance of the relationship.*/
    public isNot(this: Relation & this, model: Model | null) {
      return !this.is(model);
    }

    /*Get the value of the parent model's key.*/
    public getParentKey() {
      throw new Error('not implemented');
    }

    /*Get the value of the model's related key.*/
    _getRelatedKeyFrom(model: Model) {
      throw new Error('not implemented');
    }

    /*Compare the parent key with the related key.*/
    _compareKeys(parentKey: any, relatedKey: any) {
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
