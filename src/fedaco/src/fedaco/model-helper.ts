/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { isArray } from '@gradii/check-type';

export function loadAggregate(models, relations, column, func) {
  if (!isArray(models)) {
    models = [models];
  }
}
