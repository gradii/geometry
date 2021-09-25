/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetter } from './additional-processing';
import { FedacoDecorator } from './annotation.interface';
import { ColumnAnnotation } from './column';
import { RelationColumnAnnotation } from './relation-column';

export const RelationUsingColumn: FedacoDecorator<RelationColumnAnnotation> = makePropDecorator(
  'Fedaco:RelationUsingColumn',
  (p: ColumnAnnotation = {}): ColumnAnnotation => ({...p, isRelation: true}), undefined,
  (target: any, name: string, columnDefine: ColumnAnnotation) => {
    _additionalProcessingGetter(target, name, columnDefine);
  });
