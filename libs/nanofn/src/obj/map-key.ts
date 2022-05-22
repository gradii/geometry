/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * The opposite of `mapValue` this method creates an object with the
 * same values as `object` and keys generated by running each own enumerable
 * string keyed property of `object` thru `iteratee`. The iteratee is invoked
 * with three arguments: (value, key, object).
 *
 * @category Object
 * @param {Object} obj The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see mapValue
 * @example
 *
 * mapKey({ 'a': 1, 'b': 2 }, function(value, key) {
 *   return key + value
 * })
 * // => { 'a1': 1, 'b2': 2 }
 */
export function mapKey(
  obj: any,
  iteratee: (value: any, key: string, object: any) => any
): any {
  obj               = Object(obj);
  const result: any = {};

  Object.keys(obj).forEach((key) => {
    const value                       = obj[key];
    result[iteratee(value, key, obj)] = value;
  });
  return result;
}

