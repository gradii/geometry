/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation } from '../column';
import { DateColumn } from './date.column';

export interface CreatedAtColumnAnnotation extends ColumnAnnotation {

}

export const CreatedAtColumn: FedacoDecorator<CreatedAtColumnAnnotation> = makePropDecorator(
  'Fedaco:CreatedAtColumn',
  (p: CreatedAtColumnAnnotation = {}): CreatedAtColumnAnnotation => ({...p}),
  DateColumn,
  (target: any, name: string, decorator: CreatedAtColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, decorator);
  });
