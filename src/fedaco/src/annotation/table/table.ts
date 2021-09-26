/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { _additionalProcessingGetterSetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { FedacoColumn } from '../column';

export interface TableAnnotation {
  /**
   * the database table name
   */
  tableName?: string;

  /**
   * Indicates if the model should be timestamped.
   */
  timestamped?: boolean;

  /**
   * specify the created_at column when timestamped.
   * default is created_at
   */
  created_at?: string;

  /**
   * specify the updated_at column when timestamped.
   * default is updated_at
   */
  updated_at?: string;

  /**
   * specify the deleted_at column when use soft delete.
   * default is deleted_at
   */
  deleted_at?: string;
}

export const Table: FedacoDecorator<TableAnnotation> = makePropDecorator(
  'Fedaco:Table',
  (p?: TableAnnotation): TableAnnotation => ({...p}),
  FedacoColumn,
  (target: any, name: string, args: any[]) => {
    _additionalProcessingGetterSetter(target, name, args);
  });
