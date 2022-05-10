/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { copyObject } from './copy-object';
import { getSymbols } from './get-symbols';

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
export function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}


