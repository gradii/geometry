/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * Creates an array of function property names from own enumerable properties
 * of `object`.
 *
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the function names.
 * @see functionsIn
 * @example
 *
 * export function Foo() {
 *   this.a = () => 'a'
 *   this.b = () => 'b'
 * }
 *
 * Foo.prototype.c = () => 'c'
 *
 * functions(new Foo)
 * // => ['a', 'b']
 */
function functions(object) {
  if (object == null) {
    return [];
  }
  return Object.keys(object).filter((key) => typeof object[key] === 'function');
}

unctions;
