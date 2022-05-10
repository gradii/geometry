/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { copyObject } from './copy-object';
import { getSymbolsIn } from './get-symbols-in';

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
export function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}


