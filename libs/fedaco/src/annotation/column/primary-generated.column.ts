/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import type { ColumnAnnotation} from '../column';
import { FedacoColumn } from '../column';


export type PrimaryGeneratedColumnAnnotation = ColumnAnnotation

export const PrimaryGeneratedColumn = makePropDecorator(
  'Fedaco:PrimaryGeneratedColumn',
  (p: PrimaryGeneratedColumnAnnotation): PrimaryGeneratedColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, key: string, decorator: PrimaryGeneratedColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, key, decorator);
  });
