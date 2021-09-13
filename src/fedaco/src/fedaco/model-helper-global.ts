/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { isArray } from '@gradii/check-type';
import { Model } from './model';
import { Pivot } from './relations/pivot';
import { fromAttributes, fromRawAttributes } from './relations/pivot-helper';



/*Create a new pivot model instance.*/
export function newPivot(parent: Model, attributes: any[], table: string, exists: boolean,
                         using: string | typeof Model | null = null): Pivot | any {
  return using ?
    fromRawAttributes(using as typeof Model, parent, attributes, table, exists) :
    fromAttributes(Pivot, parent, attributes, table, exists);
}
