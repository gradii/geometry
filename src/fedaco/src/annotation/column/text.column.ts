/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { ColumnAnnotation, FedacoColumn } from '../column';


export interface TextColumnAnnotation extends ColumnAnnotation {

  isEncrypted?: boolean;
}

export const TextColumn = makePropDecorator(
  'Fedaco:TextColumn',
  (p: TextColumnAnnotation): TextColumnAnnotation => ({...p}),
  FedacoColumn,
  (target: any, key: string, columnDefine: TextColumnAnnotation) => {
    _additionalProcessingGetterSetter(target, key, columnDefine);
  });
