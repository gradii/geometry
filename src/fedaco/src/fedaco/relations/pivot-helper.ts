/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Model } from '../model';

export function fromAttributes(clazz: typeof Model, parent: Model, attributes: any[], table: string,
                               exists = false) {
  const instance        = new clazz();
  instance.timestamps = instance.hasTimestampAttributes(attributes);
  instance.setConnection(parent.getConnectionName()).setTable(table).forceFill(
    attributes).syncOriginal();
  instance.pivotParent = parent;
  instance.exists      = exists;
  return instance;
}

export function fromRawAttributes(clazz: typeof Model, parent: Model, attributes: any[], table: string,
                                  exists = false) {
  const instance        = fromAttributes(clazz, parent, [], table, exists);
  instance.timestamps = instance.hasTimestampAttributes(attributes);
  instance.setRawAttributes(attributes, exists);
  return instance;
}
