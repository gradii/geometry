/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator, TypeDecorator } from '@gradii/annotation';
import { Model } from '../fedaco/model';
import { HasOne } from '../fedaco/relations/has-one';
import { ForwardRefFn, resolveForwardRef } from '../query-builder/forward-ref';
import { ColumnDefine } from './column';
import { RelationType } from './enum-relation';


export interface RelationDecorator {

  (obj?: HasOneRelationAnnotation): TypeDecorator;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: HasOneRelationAnnotation): HasOneRelationAnnotation;
}

export interface HasOneRelationAnnotation extends ColumnDefine {
  name?: string;
  isRelation?: boolean;
  type?: RelationType;

  related?: typeof Model | ForwardRefFn;
  foreignKey?: string;
  localKey?: string;

  onQuery?: (q: HasOne) => void;

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

export interface HasOneColumnDecorator {

  (obj: HasOneRelationAnnotation): any;

  isTypeOf(obj: any): obj is HasOneRelationAnnotation;

  metadataName: string;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: HasOneRelationAnnotation): HasOneRelationAnnotation;
}

export const HasOneColumn: HasOneColumnDecorator = makePropDecorator(
  'Fedaco:HasOneColumn',
  (p: HasOneRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.HasOne,
    _getRelation: function (m: Model, relation: string) {
      let instance     = m._newRelatedInstance(resolveForwardRef(p.related));
      const foreignKey = p.foreignKey || m.getForeignKey();
      const localKey   = p.localKey || m.getKeyName();
      const r          = new HasOne(
        instance.newQuery(),
        m,
        `${instance.getTable()}.${foreignKey}`,
        localKey);

      if (p.onQuery) {
        p.onQuery(r);
      }
      return r;
    },
    ...p
  }),
  undefined,
  (target: any, name: string, columnDefine) => {
    _additionalProcessing(target, name, columnDefine);
  }
);

