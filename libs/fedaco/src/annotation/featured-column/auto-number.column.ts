/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation, FedacoColumn } from '../column';

export interface AutoNumberColumnAnnotation extends ColumnAnnotation {

}

export const AutoNumberColumn: FedacoDecorator<AutoNumberColumnAnnotation> = makePropDecorator(
  'Fedaco:AutoNumberColumn',
  (p: AutoNumberColumnAnnotation = {}): AutoNumberColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, columnDefine: AutoNumberColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, name, columnDefine);
  });
