/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { baseToNumber } from './base-to-number';
import { baseToString } from './base-to-string';

/**
 * Creates a function that performs a mathematical operation on two values.
 *
 * @private
 * @param {Function} operator The function to perform the operation.
 * @param {number} [defaultValue] The value used for `undefined` arguments.
 * @returns {Function} Returns the new mathematical operation function.
 */
export function createMathOperation(operator, defaultValue) {
  return (value, other) => {
    if (value === undefined && other === undefined) {
      return defaultValue;
    }
    if (value !== undefined && other === undefined) {
      return value;
    }
    if (other !== undefined && value === undefined) {
      return other;
    }
    if (typeof value === 'string' || typeof other === 'string') {
      value = baseToString(value);
      other = baseToString(other);
    } else {
      value = baseToNumber(value);
      other = baseToNumber(other);
    }
    return operator(value, other);
  };
}


