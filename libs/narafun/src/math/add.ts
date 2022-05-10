/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { createMathOperation } from './_internal/create-math-operation';

/**
 * Adds two numbers.
 *
 * @category Math
 * @param {number} augend The first number in an addition.
 * @param {number} addend The second number in an addition.
 * @returns {number} Returns the total.
 * @example
 *
 * add(6, 4)
 * // => 10
 */
export const add = createMathOperation((augend, addend) => augend + addend, 0);
