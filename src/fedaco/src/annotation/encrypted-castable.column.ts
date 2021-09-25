/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from './additional-processing';
import { FedacoDecorator } from './annotation.interface';
import { ColumnAnnotation } from './column';

export const EncryptedCastableColumn: FedacoDecorator<ColumnAnnotation> = makePropDecorator(
  'Fedaco:EncryptedCastableColumn',
  (p: ColumnAnnotation = {}): ColumnAnnotation => ({...p, isEncryptedCastable: true}), undefined,
  (target: any, name: string, columnDefine: ColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, columnDefine);
  });
