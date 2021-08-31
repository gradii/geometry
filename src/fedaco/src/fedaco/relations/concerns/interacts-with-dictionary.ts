/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isObject } from '@gradii/check-type';
// import { InvalidArgumentException } from 'Doctrine/Instantiator/Exception/InvalidArgumentException';
import { Constructor } from '../../../helper/constructor';


export function mixinInteractsWithDictionary<T extends Constructor<{}>>(base: T) {
  // @ts-ignore
  return class InteractsWithDictionary extends base {
    /*Get a dictionary key attribute - casting it to a string if necessary.*/
    getDictionaryKey(attribute: any) {
      if (isObject(attribute)) {
        if (method_exists(attribute, '__toString')) {
          return attribute.__toString();
        }
        throw new Error(`InvalidArgumentException(
          'Model attribute value is an object but does not have a __toString method.')`);
      }
      return attribute;
    }
  };
}
