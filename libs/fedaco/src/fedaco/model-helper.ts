/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { isArray } from '@gradii/check-type';

export function loadAggregate(models: any[], relations: any, column: string,
                              func?: ((...args: any[]) => any) | string) {
  if (!isArray(models)) {
    models = [models];
  }
}
