/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface CreatedAtColumnAnnotation extends ColumnAnnotation {

}

export const CreatedAtColumn: FedacoDecorator<CreatedAtColumnAnnotation> = makePropDecorator(
  'Fedaco:DatetimeColumn',
  (p: CreatedAtColumnAnnotation = {}): CreatedAtColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, columnDefine: CreatedAtColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, columnDefine);
  });
