/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator, TypeDecorator } from '@gradii/annotation';
import { Model } from '../fedaco/model';
import { ColumnDecorator, ColumnDefine } from './column';

export interface RelationDecorator {

  (obj?: RelationAnnotation): TypeDecorator;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: RelationAnnotation): RelationAnnotation;
}

export interface RelationAnnotation {
  name?: string;
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


// ====
// @RelationColumn({
//  columnName: 'articles',
//  onQuery: ()=>{
//  }
// })
// @RelationUsingColumn({
//  columnName: 'articles',
//  callback: (model)=>{
//    return new EloquentResolverRelationStub(builder, $model);
//  }
// })
//
// tslint:disable-next-line:variable-name
export const RelationColumn: ColumnDecorator = makePropDecorator(
  'fedaco orm relation column',
  (p: ColumnDefine = {}): ColumnDefine => ({...p, isRelation: true}), undefined,
  (target: any, name: string, columnDefine: ColumnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  });

export const RelationUsingColumn: ColumnDecorator = makePropDecorator(
  'fedaco orm relation using column',
  (p: ColumnDefine = {}): ColumnDefine => ({...p, isRelation: true}), undefined,
  (target: any, name: string, columnDefine: ColumnDefine) => {

  });


// // tslint:disable-next-line:variable-name
// export const Relation: ColumnDecorator = makePropDecorator(
//   'fedaco orm relation',
//   (p: RelationAnnotation = {}) => ({...p}), undefined,
//   (target: any, name: string, columnDefine) => {
//     additionalProcessing(target, name, columnDefine);
//   }
// );

export const ManyToManyRelation: ColumnDecorator = makePropDecorator(
  'fedaco orm many to many relation',
  (p: RelationAnnotation = {}) => ({...p}), undefined,
  (target: any, name: string, columnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  }
);

export const OneToManyRelation: ColumnDecorator = makePropDecorator(
  'fedaco orm many to many relation',
  (p: RelationAnnotation = {}) => ({...p}), undefined,
  (target: any, name: string, columnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  }
);


