/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from './additional-processing';
import { FedacoDecorator } from './annotation.interface';
import { ColumnAnnotation, FedacoColumn } from './column';

export const DateCastableColumn: FedacoDecorator<ColumnAnnotation> = makePropDecorator(
  'Fedaco:DateCastableColumn',
  (p: ColumnAnnotation = {}): ColumnAnnotation => ({...p, isDate: false, isDateCastable: true}),
  FedacoColumn,
  (target: any, name: string, columnDefine: ColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, columnDefine);
  });
