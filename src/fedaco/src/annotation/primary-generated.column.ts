/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from './additional-processing';
import { FedacoColumn } from './column';

export const PrimaryGeneratedColumn = makePropDecorator('Fedaco:PrimaryGeneratedColumn',
  (...args) => ({...args}), FedacoColumn, (target: any, key: string, columnDefine) => {
    _additionalProcessingGetterSetter(target, key, columnDefine);
  });
