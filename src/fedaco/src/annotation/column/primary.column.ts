/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { ColumnAnnotation, FedacoColumn } from '../column';


export interface PrimaryColumnAnnotation extends ColumnAnnotation {
}

export const PrimaryColumnAnnotation = makePropDecorator(
  'Fedaco:PrimaryColumn',
  (p: PrimaryColumnAnnotation): PrimaryColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, key: string, columnDefine: PrimaryColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, key, columnDefine);
  });
