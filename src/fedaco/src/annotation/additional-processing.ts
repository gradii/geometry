/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { has } from '@gradii/check-type';
import { Model } from '../fedaco/model';
import { ColumnAnnotation } from './column';

export const _additionalProcessingGetter = (target: any, name: string, define: any) => {
  const descriptor = Object.getOwnPropertyDescriptor(target, name);

  const hasGetter = !!(descriptor && descriptor.get);

  const field = define.field || name;

  if (!hasGetter) {
    const propertyDescriptor: PropertyDescriptor = {
      enumerable  : false,
      configurable: true,
      get         : function () {
        return (this as Model).getAttribute(field);
      },
      set         : function () {
        throw new Error('the relation field is readonly');
      }
    };
    Object.defineProperty(target, name, propertyDescriptor);
  }
};

export const _additionalProcessingGetterSetter = (target: any, name: string, define: any) => {
  const descriptor = Object.getOwnPropertyDescriptor(target, name);

  const hasGetter = !!(descriptor && descriptor.get);
  const hasSetter = !!(descriptor && descriptor.set);

  const field = define.field || name;

  if (!hasGetter || !hasSetter) {
    const propertyDescriptor: PropertyDescriptor = {
      enumerable  : false,
      configurable: true
    };
    if (!hasGetter) {
      propertyDescriptor.get = function () {
        return (this as Model).getAttribute(field);
      };
    }
    if (!hasSetter) {
      propertyDescriptor.set = function (value) {
        (this as Model).setAttribute(field, value);
      };
    }
    Object.defineProperty(target, name, propertyDescriptor);
  }
};
