/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _pipe(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
}
