/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { ColumnAnnotation, FedacoColumn } from '../column';


export interface PrimaryGeneratedColumnAnnotation extends ColumnAnnotation {
}

export const PrimaryGeneratedColumn = makePropDecorator(
  'Fedaco:PrimaryGeneratedColumn',
  (p: PrimaryGeneratedColumnAnnotation): PrimaryGeneratedColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, key: string, columnDefine: PrimaryGeneratedColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, key, columnDefine);
  });
