/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';
import { DateColumn } from './date.column';
import { DatetimeColumn } from './datetime.column';

export interface UpdatedAtColumnAnnotation extends ColumnAnnotation {

}

export const UpdatedAtColumn: FedacoDecorator<UpdatedAtColumnAnnotation> = makePropDecorator(
  'Fedaco:UpdatedAtColumn',
  (p: UpdatedAtColumnAnnotation = {}): UpdatedAtColumnAnnotation => ({...p}),
  DatetimeColumn,
  (target: any, name: string, decorator: UpdatedAtColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, decorator);
  });
