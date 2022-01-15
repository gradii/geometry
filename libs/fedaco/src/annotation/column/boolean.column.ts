/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface BooleanColumnAnnotation extends ColumnAnnotation {

}

export const BooleanColumn: FedacoDecorator<BooleanColumnAnnotation> = makePropDecorator(
  'Fedaco:BooleanColumn',
  (p: BooleanColumnAnnotation = {}): BooleanColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, decorator: BooleanColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, decorator);
  });
