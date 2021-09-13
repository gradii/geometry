/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isArray, isBlank, isNumber } from '@gradii/check-type';
import { assocPath } from 'ramda';
import { value } from './fn';

/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export function get(target: any[] | any, key: string | number, defaultValue?: any) {
  if (isBlank(key)) {
    return target;
  }
  if (isArray(target)) {
    if (isNumber(key)) {
      return target[Math.floor(key)];
    } else if (/^\d+$/g.exec(key)) {
      return target[parseInt(key)];
    }
  }
  key = `${key}`;
  if (key in target) {
    return target[key];
  }
  if (key.includes('.') === false) {
    return target[key] ?? value(defaultValue);
  }
  for (let segment of key.split('.')) {
    if (segment in target) {
      target = target[segment];
    } else {
      return value(defaultValue);
    }
  }
  return target;
}

//
// export function has(array: any, keys: string | any[]) {
//   var keys = /*cast type array*/ keys;
//   if (!array || keys === []) {
//     return false;
//   }
//   for (let key of keys) {
//     var subKeyArray = array;
//     if (Arr.exists(array, key)) {
//       continue;
//     }
//     for (let segment of key.split(".")) {
//       if (Arr.accessible(subKeyArray) && Arr.exists(subKeyArray, segment)) {
//         var subKeyArray = subKeyArray[segment];
//       }
//       else {
//         return false;
//       }
//     }
//   }
//   return true;
// }


export function set(target: any, key: string, data: any) {
  return assocPath(key.split('.'), data, target);
}
