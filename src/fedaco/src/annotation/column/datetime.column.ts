/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface DatetimeColumnAnnotation extends ColumnAnnotation {

}

export const DatetimeColumn: FedacoDecorator<DatetimeColumnAnnotation> = makePropDecorator(
  'Fedaco:DateColumn',
  (p: DatetimeColumnAnnotation = {}): DatetimeColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, columnDefine: DatetimeColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, columnDefine);
  });
