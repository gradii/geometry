/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export const Column: FedacoDecorator<ColumnAnnotation> = makePropDecorator(
  'Fedaco:Column',
  (p: ColumnAnnotation = {}): ColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, columnDefine: ColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, columnDefine);
  });
