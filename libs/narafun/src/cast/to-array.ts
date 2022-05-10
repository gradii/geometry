/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { copyArray } from './_internal/copy-array';
import { getTag } from './_internal/get-tag';
import { isArrayLike } from './is-array-like';
import { isString } from './is-string';
import { iteratorToArray } from './_internal/iterator-to-array';
import { mapToArray } from './_internal/map-to-array';
import { setToArray } from './_internal/set-to-array';
import { stringToArray } from './_internal/string-to-array';
import { values } from './values';

/** `Object#toString` result references. */
const mapTag = '[object Map]';
const setTag = '[object Set]';

/** Built-in value references. */
const symIterator = Symbol.iterator;

/**
 * Converts `value` to an array.
 *
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * toArray({ 'a': 1, 'b': 2 })
 * // => [1, 2]
 *
 * toArray('abc')
 * // => ['a', 'b', 'c']
 *
 * toArray(1)
 * // => []
 *
 * toArray(null)
 * // => []
 */
export function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }
  if (symIterator && value[symIterator]) {
    return iteratorToArray(value[symIterator]());
  }
  const tag = getTag(value);
  const func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

  return func(value);
}


