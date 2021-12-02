/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _isPlaceholder(a) {
  return a != null &&
         typeof a === 'object' &&
         a['@@functional/placeholder'] === true;
}
