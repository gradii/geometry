/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _isRegExp(x) {
  return Object.prototype.toString.call(x) === '[object RegExp]';
}
