/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface ArrayColumnAnnotation extends ColumnAnnotation {

}

export const ArrayColumn: FedacoDecorator<ArrayColumnAnnotation> = makePropDecorator(
  'Fedaco:ArrayColumn',
  (p: ArrayColumnAnnotation = {}): ArrayColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, columnDefine: ArrayColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, columnDefine);
  });
