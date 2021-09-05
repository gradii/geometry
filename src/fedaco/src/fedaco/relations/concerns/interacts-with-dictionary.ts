/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isObject } from '@gradii/check-type';
// import { InvalidArgumentException } from 'Doctrine/Instantiator/Exception/InvalidArgumentException';
import { Constructor } from '../../../helper/constructor';
import { Relation } from '../relation';

export interface InteractsWithDictionary {
  _getDictionaryKey(attribute: any): string;
}

export type InteractsWithDictionaryCtor = Constructor<InteractsWithDictionary>;

export function mixinInteractsWithDictionary<T extends Constructor<any>>(base: T): InteractsWithDictionaryCtor & T {
  // @ts-ignore
  return class _Self extends base {
    /*Get a dictionary key attribute - casting it to a string if necessary.*/
    _getDictionaryKey(attribute: any) {
      if (isObject(attribute)) {
        if ('__toString' in attribute) {
          return (attribute as any).__toString();
        }
        throw new Error(`InvalidArgumentException(
          'Model attribute value is an object but does not have a __toString method.')`);
      }
      return attribute;
    }
  };
}
