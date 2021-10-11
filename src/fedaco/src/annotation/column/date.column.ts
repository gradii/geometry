/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface DateColumnAnnotation extends ColumnAnnotation {

}

export const DateColumn: FedacoDecorator<DateColumnAnnotation> = makePropDecorator(
  'Fedaco:DateColumn',
  (p: DateColumnAnnotation = {}): DateColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, columnDefine: DateColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, columnDefine);
  });
