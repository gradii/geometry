/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { FedacoBuilder } from '../fedaco/fedaco-builder';
import { Model } from '../fedaco/model';


export interface ScopeDecorator {

  (obj?: ScopeDefine): any;

  isTypeOf(obj: any): obj is ScopeDefine;

  metadataName: string;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: ScopeDefine): ScopeDefine;
}


export interface ScopeDefine {
  isScope?: boolean;
  query: (query: FedacoBuilder, ...args: any[]) => void;
}

const _additionalProcessing = (target: any, name: string, scopeDefine: ScopeDefine) => {
  const descriptor = Object.getOwnPropertyDescriptor(target, name);

  // columnDefine.isPrimary   = columnDefine.isPrimary || false;
  // columnDefine.columnName  = columnDefine.columnName || snakeCase(name);
  // columnDefine.serializeAs = columnDefine.serializeAs != null ?
  //   columnDefine.serializeAs : snakeCase(name);

  const hasGetter = !!(descriptor && descriptor.get);

  if (!hasGetter) {
    const propertyDescriptor: PropertyDescriptor = {
      enumerable  : false,
      configurable: true,
      get         : function () {
        return function (this: Model, ...args: any[]) {
          scopeDefine.query(this.newQuery(), ...args);
        };
      },
      set         : function () {
        throw new Error('the scope field is readonly');
      }
    };
    Object.defineProperty(target, name, propertyDescriptor);
  }
};


export const Scope: ScopeDecorator = makePropDecorator(
  'fedaco orm scope column',
  (p: ScopeDefine): ScopeDefine => ({isScope: true, ...p}), undefined,
  (target: any, name: string, columnDefine: ScopeDefine) => {
    _additionalProcessing(target, name, columnDefine);
  });
