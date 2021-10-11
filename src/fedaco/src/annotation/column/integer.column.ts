/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface IntegerColumnAnnotation extends ColumnAnnotation {
}

export const IntegerColumn: FedacoDecorator<IntegerColumnAnnotation> = makePropDecorator(
  'Fedaco:IntegerColumn',
  (p: IntegerColumnAnnotation = {}): IntegerColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, decorator: IntegerColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, decorator);
  });
