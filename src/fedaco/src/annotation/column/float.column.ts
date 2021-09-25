/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface FloatColumnAnnotation extends ColumnAnnotation {

}

export const FloatColumn: FedacoDecorator<FloatColumnAnnotation> = makePropDecorator(
  'Fedaco:FloatColumn',
  (p: FloatColumnAnnotation = {}): FloatColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, columnDefine: FloatColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, columnDefine);
  });
