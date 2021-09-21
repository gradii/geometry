/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator, TypeDecorator } from '@gradii/annotation';
import { ForwardRefFn } from '@gradii/injection';
import { Model } from '../fedaco/model';
import { HasMany } from '../fedaco/relations/has-many';
import { resolveForwardRef } from '../query-builder/forward-ref';
import { ColumnDefine } from './column';
import { RelationType } from './enum-relation';


export interface RelationDecorator {

  (obj?: HasManyRelationAnnotation): TypeDecorator;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: HasManyRelationAnnotation): HasManyRelationAnnotation;
}

export interface HasManyRelationAnnotation extends ColumnDefine {
  name?: string;
  isRelation?: boolean;
  type?: RelationType;

  related?: typeof Model | ForwardRefFn;
  foreignKey?: string;
  localKey?: string;

  onQuery?: (q: HasMany) => void;

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

export interface HasManyColumnDecorator {

  (obj: HasManyRelationAnnotation): any;

  isTypeOf(obj: any): obj is HasManyRelationAnnotation;

  metadataName: string;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: HasManyRelationAnnotation): HasManyRelationAnnotation;
}

export const HasManyColumn: HasManyColumnDecorator = makePropDecorator(
  'Fedaco:HasManyColumn',
  (p: HasManyRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.HasMany,
    _getRelation: function (m: Model) {
      let instance   = m._newRelatedInstance(resolveForwardRef(p.related));
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

