/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { Model } from '../fedaco/model';

export interface ColumnDecorator {

  (obj?: ColumnDefine): any;

  isTypeOf(obj: any): obj is ColumnDefine;

  metadataName: string;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: ColumnDefine): ColumnDefine;
}

export interface ColumnDefine {
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

  isDateCastable?: boolean;

  isEncryptedCastable?: boolean;

  isRelation?: boolean;

  isRelationUsing?: boolean;
}

export interface HasOneColumnDefine extends ColumnDefine {
  isRelation: boolean;

  // relationsDefinition: Relation;
}

const _additionalProcessing = (target: any, name: string, columnDefine: ColumnDefine) => {
  const descriptor = Object.getOwnPropertyDescriptor(target, name);

  // columnDefine.isPrimary   = columnDefine.isPrimary || false;
  // columnDefine.columnName  = columnDefine.columnName || snakeCase(name);
  // columnDefine.serializeAs = columnDefine.serializeAs != null ?
  //   columnDefine.serializeAs : snakeCase(name);

  const hasGetter = !!(descriptor && descriptor.get);
  const hasSetter = !!(descriptor && descriptor.set);

  if (!hasGetter || !hasSetter) {
    const propertyDescriptor: PropertyDescriptor = {
      enumerable  : false,
      configurable: true
    };
    if (!hasGetter) {
      propertyDescriptor.get = function () {
        return (this as Model).getAttribute(name);
      };
    }
    if (!hasSetter) {
      propertyDescriptor.set = function (value) {
        (this as Model).setAttribute(name, value);
      };
    }
    Object.defineProperty(target, name, propertyDescriptor);
  }
};

// tslint:disable-next-line:variable-name
export const Column: ColumnDecorator = makePropDecorator(
  'fedaco orm column',
  (p: ColumnDefine = {}) => ({...p}), undefined,
  (target: any, name: string, columnDefine: ColumnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  });

// tslint:disable-next-line:variable-name
export const DateColumn: ColumnDecorator = makePropDecorator(
  'fedaco orm date column',
  (p: ColumnDefine = {}): ColumnDefine => ({...p, isDate: true}), undefined,
  (target: any, name: string, columnDefine: ColumnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  });

// tslint:disable-next-line:variable-name
export const DateCastableColumn: ColumnDecorator = makePropDecorator(
  'fedaco orm date castable column',
  (p: ColumnDefine = {}): ColumnDefine => ({...p, isDate: false, isDateCastable: true}), undefined,
  (target: any, name: string, columnDefine: ColumnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  });

// tslint:disable-next-line:variable-name
export const EncryptedCastableColumn: ColumnDecorator = makePropDecorator(
  'fedaco orm encrypted castable column',
  (p: ColumnDefine = {}): ColumnDefine => ({...p, isEncryptedCastable: true}), undefined,
  (target: any, name: string, columnDefine: ColumnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  });
