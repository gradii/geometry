/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import type { FedacoDecorator } from '../annotation.interface';
import type { ColumnAnnotation} from '../column';
import { FedacoColumn } from '../column';


export interface PrimaryColumnAnnotation extends ColumnAnnotation {
  keyType: string;
}

export const PrimaryColumn: FedacoDecorator<PrimaryColumnAnnotation> = makePropDecorator(
  'Fedaco:PrimaryColumn',
  (p: PrimaryColumnAnnotation): PrimaryColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, key: string, decorator: any) => {
    _additionalProcessingGetterSetter(target, key, decorator);
  });
