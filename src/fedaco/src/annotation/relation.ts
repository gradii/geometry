/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator, TypeDecorator } from '@gradii/annotation';
import { Model } from '../fedaco/model';
import { ColumnDecorator, ColumnDefine } from './column';
import { RelationType } from './enum-relation';

export interface RelationDecorator {

  (obj?: RelationAnnotation): TypeDecorator;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: RelationAnnotation): RelationAnnotation;
}

export interface RelationAnnotation extends ColumnDefine {
  name?: string;
  isRelation?: boolean;
  type?: RelationType;
  related?: typeof Model;
  foreignKey?: string;
  localKey?: string;
  _getRelation?: (m: Model, relation: string) => any;
}

const _additionalProcessing = (target: any, name: string, columnDefine: ColumnDefine) => {
  const descriptor = Object.getOwnPropertyDescriptor(target, name);

  // columnDefine.isPrimary   = columnDefine.isPrimary || false;
  // columnDefine.columnName  = columnDefine.columnName || snakeCase(name);
  // columnDefine.serializeAs = columnDefine.serializeAs != null ?
  //   columnDefine.serializeAs : snakeCase(name);

  const hasGetter = !!(descriptor && descriptor.get);

  if (!hasGetter) {
    const propertyDescriptor: PropertyDescriptor = {
      enumerable  : false,
      configurable: true,
      get         : function () {
        return (this as Model).getAttribute(name);
      },
      set         : function () {
        throw new Error('the relation field is readonly');
      }
    };
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
//
// export const ManyToManyColumn: ColumnDecorator = makePropDecorator(
//   'fedaco orm many to many relation',
//   (p: RelationAnnotation) => ({isRelation: true, ...p}), undefined,
//   (target: any, name: string, columnDefine) => {
//     _additionalProcessing(target, name, columnDefine);
//   }
// );
//
// export const OneToManyColumn: ColumnDecorator = makePropDecorator(
//   'fedaco orm many to many relation',
//   (p: RelationAnnotation) => ({isRelation: true, ...p}), undefined,
//   (target: any, name: string, columnDefine) => {
//     _additionalProcessing(target, name, columnDefine);
//   }
// );
