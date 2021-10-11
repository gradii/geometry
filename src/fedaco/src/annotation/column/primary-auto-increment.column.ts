/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { ColumnAnnotation, FedacoColumn } from '../column';


export interface PrimaryAutoIncrementColumnAnnotation extends ColumnAnnotation {
}

export const PrimaryAutoIncrementColumn = makePropDecorator(
  'Fedaco:PrimaryAutoIncrementColumn',
  (p: PrimaryAutoIncrementColumnAnnotation): PrimaryAutoIncrementColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, key: string, decorator: PrimaryAutoIncrementColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, key, decorator);
  });
