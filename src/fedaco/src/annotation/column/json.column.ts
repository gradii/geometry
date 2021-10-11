/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface JsonColumnAnnotation extends ColumnAnnotation {

  isEncrypted?: boolean;
}

export const JsonColumn: FedacoDecorator<JsonColumnAnnotation> = makePropDecorator(
  'Fedaco:JsonColumn',
  (p: JsonColumnAnnotation = {}): JsonColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, decorator: JsonColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, decorator);
  });
