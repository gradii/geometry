/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { baseGet } from './base-get';
import { slice } from '../slice';

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
export function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, slice(path, 0, -1));
}


