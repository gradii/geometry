/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _promap(f, g, profunctor) {
  return function(x) {
    return g(profunctor(f(x)));
  };
}
