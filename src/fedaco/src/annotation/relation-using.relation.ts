/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { FedacoDecorator } from './annotation.interface';
import { ColumnAnnotation } from './column';
import { RelationAnnotation } from './relation-column';

export const RelationUsingColumn: FedacoDecorator<RelationAnnotation> = makePropDecorator(
  'fedaco orm relation using column',
  (p: ColumnAnnotation = {}): ColumnAnnotation => ({...p, isRelation: true}), undefined,
  (target: any, name: string, columnDefine: ColumnAnnotation) => {

  });
