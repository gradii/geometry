/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isKey } from './is-key';
import { stringToPath } from './string-to-path';

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
export function castPath(value, object) {
  if (Array.isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(value);
}


