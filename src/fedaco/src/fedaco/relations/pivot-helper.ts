/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Model } from '../model';
import { AsPivot } from './concerns/as-pivot';
import { ForwardRefFn, resolveForwardRef } from '../../query-builder/forward-ref';

export function fromAttributes(clazz: typeof AsPivot | ForwardRefFn<typeof AsPivot>, parent: Model, attributes: any, table: string,
                               exists = false) {
  // @ts-ignore
  const instance = new resolveForwardRef(clazz)();
  instance.timestamps = instance.hasTimestampAttributes(attributes);
  instance.setConnection(parent.getConnectionName()).setTable(table).forceFill(
    attributes).syncOriginal();
  instance.pivotParent = parent;
  instance._exists = exists;
  return instance;
}

export function fromRawAttributes(clazz: typeof AsPivot | ForwardRefFn<typeof AsPivot>, parent: Model, attributes: any, table: string,
                                  exists = false) {
  const instance = fromAttributes(clazz, parent, [], table, exists);
  instance._timestamps = instance.hasTimestampAttributes(attributes);
  instance.setRawAttributes(attributes, exists);
  return instance;
}
