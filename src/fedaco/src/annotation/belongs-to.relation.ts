/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator, TypeDecorator } from '@gradii/annotation';
import { isBlank } from '@gradii/check-type';
import { Model } from '../fedaco/model';
import { BelongsTo } from '../fedaco/relations/belongs-to';
import { snakeCase } from '../helper/str';
import { ForwardRefFn, resolveForwardRef } from '../query-builder/forward-ref';
import { ColumnDefine } from './column';
import { RelationType } from './enum-relation';


export interface RelationDecorator {

  (obj?: BelongsToRelationAnnotation): TypeDecorator;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: BelongsToRelationAnnotation): BelongsToRelationAnnotation;
}

export interface BelongsToRelationAnnotation extends ColumnDefine {
  name?: string;
  isRelation?: boolean;
  type?: RelationType;

  related?: typeof Model | ForwardRefFn;
  foreignKey?: string;
  ownerKey?: string;
  relation?: string;

  onQuery?: (q: BelongsTo) => void;

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

export interface BelongsToColumnDecorator {

  (obj: BelongsToRelationAnnotation): any;

  isTypeOf(obj: any): obj is BelongsToRelationAnnotation;

  metadataName: string;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: BelongsToRelationAnnotation): BelongsToRelationAnnotation;
}

export const BelongsToColumn: BelongsToColumnDecorator = makePropDecorator(
  'Fedaco:BelongsToColumn',
  (p: BelongsToRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.BelongsTo,
    _getRelation: function (m: Model, relation: string) {
      if (!isBlank(p.relation)) {
        relation = p.relation;
      }

      let instance     = m._newRelatedInstance(resolveForwardRef(p.related));
      const foreignKey = p.foreignKey || `${snakeCase(relation)}_${instance.getKeyName()}`;
      const ownerKey   = p.ownerKey || instance.getKeyName();
      const r          = new BelongsTo(instance.newQuery(), m, foreignKey, ownerKey, relation);
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
