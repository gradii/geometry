/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * Invokes `func` after `wait` milliseconds. Any additional arguments are
 * provided to `func` when it's invoked.
 *
 * @category Function
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay invocation.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * delay(text => console.log(text), 1000, 'later')
 * // => Logs 'later' after one second.
 */
export function delay(func, wait, ...args) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  return setTimeout(func, +wait || 0, ...args);
}


