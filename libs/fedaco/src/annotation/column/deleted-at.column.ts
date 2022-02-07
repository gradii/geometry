/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation } from '../column';
import { DatetimeColumn } from './datetime.column';

export interface DeletedAtColumnAnnotation extends ColumnAnnotation {

}

export const DeletedAtColumn: FedacoDecorator<DeletedAtColumnAnnotation> = makePropDecorator(
  'Fedaco:DeletedAtColumn',
  (p: DeletedAtColumnAnnotation = {
    hidden: true
  }): DeletedAtColumnAnnotation => ({...p}),
  DatetimeColumn,
  (target: any, name: string, decorator: DeletedAtColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, decorator);
  });
