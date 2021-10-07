/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface BinaryColumnAnnotation extends ColumnAnnotation {
  length?: number;
  isEncrypted?: boolean;
}

export const BinaryColumn: FedacoDecorator<BinaryColumnAnnotation> = makePropDecorator(
  'Fedaco:BinaryColumn',
  (p: BinaryColumnAnnotation = {}): BinaryColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, columnDefine: BinaryColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, columnDefine);
  });