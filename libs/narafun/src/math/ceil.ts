/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { createRound } from '../_internal/create-round';

/**
 * Computes `number` rounded up to `precision`. (Round up: the smallest integer greater than or equal to a given number.)
 *
 * @category Math
 * @param {number} number The number to round up.
 * @param {number} [precision=0] The precision to round up to.
 * @returns {number} Returns the rounded up number.
 * @example
 *
 * ceil(4.006)
 * // => 5
 *
 * ceil(6.004, 2)
 * // => 6.01
 *
 * ceil(6040, -2)
 * // => 6100
 */
export const ceil = createRound('ceil');
