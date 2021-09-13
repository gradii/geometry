/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isArray, isBlank } from '@gradii/check-type';

export function wrap(value: any[] | any) {
  return isArray(value) ? value : [value];
}
