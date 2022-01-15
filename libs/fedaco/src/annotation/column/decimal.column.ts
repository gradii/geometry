/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface DecimalColumnAnnotation extends ColumnAnnotation {

}

export const DecimalColumn: FedacoDecorator<DecimalColumnAnnotation> = makePropDecorator(
  'Fedaco:DecimalColumn',
  (p: DecimalColumnAnnotation = {}): DecimalColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, decorator: DecimalColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, decorator);
  });
