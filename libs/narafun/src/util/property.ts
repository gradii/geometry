/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { baseProperty } from '../_internal/base-property';
import { basePropertyDeep } from '../_internal/base-property-deep';
import { isKey } from '../_internal/is-key';
import { toKey } from '../_internal/to-key';

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * const objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ]
 *
 * map(objects, property('a.b'))
 * // => [2, 1]
 *
 * map(sortBy(objects, property(['a', 'b'])), 'a.b')
 * // => [1, 2]
 */
export function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}


