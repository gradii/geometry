/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { Model } from './model';
import { AsPivot } from './relations/concerns/as-pivot';
import { Pivot } from './relations/pivot';
import { fromAttributes, fromRawAttributes } from './relations/pivot-helper';
import { ForwardRefFn } from '../query-builder/forward-ref';


/*Create a new pivot model instance.*/
export function newPivot(parent: Model, attributes: any, table: string, exists: boolean,
                         using?: typeof AsPivot | ForwardRefFn<typeof AsPivot>): Pivot | any {
  return using ?
    fromRawAttributes(using as typeof AsPivot, parent, attributes, table, exists) :
  // @ts-ignore
    fromAttributes(require('./relations/pivot').Pivot, parent, attributes, table, exists);
}
