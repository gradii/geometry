/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator, TypeDecorator } from '@gradii/annotation';
import { Model } from '../fedaco/model';
import { HasMany } from '../fedaco/relations/has-many';
import { ColumnDecorator, ColumnDefine } from './column';

export const enum RelationType {
  HasOne  = 'HasOne',
  HasMany = 'HasMany',
}


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
  _getRelation?: (m: Model) => any;
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

export const ManyToManyColumn: ColumnDecorator = makePropDecorator(
  'fedaco orm many to many relation',
  (p: RelationAnnotation) => ({isRelation: true, ...p}), undefined,
  (target: any, name: string, columnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  }
);

export const OneToManyColumn: ColumnDecorator = makePropDecorator(
  'fedaco orm many to many relation',
  (p: RelationAnnotation) => ({isRelation: true, ...p}), undefined,
  (target: any, name: string, columnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  }
);

export interface HasOneColumnDecorator {

  (obj?: RelationAnnotation): any;

  isTypeOf(obj: any): obj is RelationAnnotation;

  metadataName: string;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: RelationAnnotation): RelationAnnotation;
}

export const HasOneColumn: HasOneColumnDecorator = makePropDecorator(
  'fedaco orm has one relation',
  (p: RelationAnnotation) => ({
    isRelation: true,
    type      : RelationType.HasOne,
    ...p
  }),
  undefined,
  (target: any, name: string, columnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  }
);



export interface HasManyColumnDecorator {

  (obj: RelationAnnotation): any;

  isTypeOf(obj: any): obj is RelationAnnotation;

  metadataName: string;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: RelationAnnotation): RelationAnnotation;
}
export const HasManyColumn: HasManyColumnDecorator = makePropDecorator(
  'fedaco orm has one relation',
  (p: RelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.HasMany,
    _getRelation: function (m: Model) {
      let instance   = m._newRelatedInstance(p.related);
      let foreignKey = p.foreignKey || m.getForeignKey();
      let localKey   = p.localKey || m.getKeyName();
      return new HasMany(
        instance.newQuery(),
        m,
        `${instance.getTable()}.${foreignKey}`,
        localKey);
    },
    ...p
  }),
  undefined,
  (target: any, name: string, columnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  }
);

