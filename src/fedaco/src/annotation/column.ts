/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { FedacoAnnotation } from './annotation.interface';

export interface ColumnAnnotation extends FedacoAnnotation {
  isPrimary?: boolean;

  columnName?: string;
  // hasGetter?: boolean;
  // hasSetter?: boolean;
  serializeAs?: string;
  /**
   * Invoked before serializing process happens
   */
  serialize?: (value: any, attribute: string, model: any) => any;
  /**
   * Invoked before create or update happens
   */
  prepare?: (value: any, attribute: string, model: any) => any;
  /**
   * Invoked when row is fetched from the database
   */
  consume?: (value: any, attribute: string, model: any) => any;

  meta?: any;

  isDate?: boolean;



  isEncryptedCastable?: boolean;

  isRelation?: boolean;

  isRelationUsing?: boolean;
}


export class FedacoColumn {
  static isTypeOf(obj: any) {
    return obj instanceof FedacoColumn;
  }
}
