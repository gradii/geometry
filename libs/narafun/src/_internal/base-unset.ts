/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { castPath } from './cast-path';
import { last } from '../last';
import { parent } from './parent';
import { toKey } from './to-key';

/**
 * The base implementation of `unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
export function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}


