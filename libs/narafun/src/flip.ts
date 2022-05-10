/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * Creates a function that invokes `func` with arguments reversed.
 *
 * @category Function
 * @param {Function} func The function to flip arguments for.
 * @returns {Function} Returns the new flipped function.
 * @see reverse
 * @example
 *
 * const flipped = flip((...args) => args)
 *
 * flipped('a', 'b', 'c', 'd')
 * // => ['d', 'c', 'b', 'a']
 */
export function flip(func) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  return function(...args) {
    return func.apply(this, args.reverse());
  };
}


