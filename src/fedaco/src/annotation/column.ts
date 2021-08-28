/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { Model } from '../fedaco/model';

export interface ColumnDecorator {

  (obj?: ColumnDefine): any;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: ColumnDefine): ColumnDefine;
}

export interface ColumnDefine {
  isPrimary?: boolean;
  columnName?: string;
  // hasGetter?: boolean;
  // hasSetter?: boolean;
  serializeAs?: string;
  /**
   * Invoked before serializing process happens
   */
  serialize?: (value: any, attribute: string, model: any) => any;
  /**
   * Invoked before create or update happens
   */
  prepare?: (value: any, attribute: string, model: any) => any;
  /**
   * Invoked when row is fetched from the database
   */
  consume?: (value: any, attribute: string, model: any) => any;

  meta?: any;
}

// tslint:disable-next-line:variable-name
export const Column: ColumnDecorator = makePropDecorator(
  'fedaco orm column',
  (p: ColumnDefine = {}) => ({...p}), undefined,
  (target: any, name: string, columnDefine: ColumnDefine) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, name);

    // columnDefine.isPrimary   = columnDefine.isPrimary || false;
    // columnDefine.columnName  = columnDefine.columnName || snakeCase(name);
    // columnDefine.serializeAs = columnDefine.serializeAs != null ?
    //   columnDefine.serializeAs : snakeCase(name);

    const hasGetter = !!(descriptor && descriptor.get);
    const hasSetter = !!(descriptor && descriptor.set);

    if (!hasGetter || !hasSetter) {
      const propertyDescriptor: PropertyDescriptor = {
        enumerable  : false,
        configurable: true
      };
      if (!hasGetter) {
        propertyDescriptor.get = function () {
          return (this as Model).getAttribute(name);
        };
      }
      if (!hasSetter) {
        propertyDescriptor.set = function (value) {
          (this as Model).setAttribute(name, value);
        };
      }
      Object.defineProperty(target, name, propertyDescriptor);
    }
  });

