/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface ObjectColumnAnnotation extends ColumnAnnotation {

  isEncrypted?: boolean;
}

export const ObjectColumn: FedacoDecorator<ObjectColumnAnnotation> = makePropDecorator(
  'Fedaco:ObjectColumn',
  (p: ObjectColumnAnnotation = {}): ObjectColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, columnDefine: ObjectColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, columnDefine);
  });