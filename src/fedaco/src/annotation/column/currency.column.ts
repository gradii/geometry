/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface CurrencyColumnAnnotation extends ColumnAnnotation {

}

export const CurrencyColumn: FedacoDecorator<CurrencyColumnAnnotation> = makePropDecorator(
  'Fedaco:CurrencyColumn',
  (p: CurrencyColumnAnnotation = {}): CurrencyColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, decorator: CurrencyColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, decorator);
  });
