/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { FedacoBuilder } from '../fedaco/fedaco-builder';
import { _additionalProcessingGetter } from './additional-processing';
import { FedacoDecorator } from './annotation.interface';
import { ColumnAnnotation } from './column';


export interface ScopeDefine extends ColumnAnnotation {
  isScope?: boolean;
  query: (query: FedacoBuilder, ...args: any[]) => void;
}

export const Scope: FedacoDecorator<ColumnAnnotation> = makePropDecorator(
  'fedaco orm scope column',
  (p: ScopeDefine): ScopeDefine => ({isScope: true, ...p}), undefined,
  (target: any, name: string, columnDefine: ScopeDefine) => {
    _additionalProcessingGetter(target, name, columnDefine);
  });
