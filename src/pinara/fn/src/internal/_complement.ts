/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _complement(f) {
  return function() {
    return !f.apply(this, arguments);
  };
}
