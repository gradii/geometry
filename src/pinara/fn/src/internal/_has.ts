/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
