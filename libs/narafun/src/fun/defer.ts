/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * Defers invoking the `func` until the current call stack has cleared. Any
 * additional arguments are provided to `func` when it's invoked.
 *
 * @category Function
 * @param {Function} func The function to defer.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * defer(text => console.log(text), 'deferred')
 * // => Logs 'deferred' after one millisecond.
 */
export function defer(func, ...args) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  return setTimeout(func, 1, ...args);
}


