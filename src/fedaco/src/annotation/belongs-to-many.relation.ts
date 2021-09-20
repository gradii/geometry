/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator, TypeDecorator } from '@gradii/annotation';
import { isBlank } from '@gradii/check-type';
import { Model } from '../fedaco/model';
import { BelongsToMany } from '../fedaco/relations/belongs-to-many';
import { snakeCase } from '../helper/str';
import { ColumnDefine } from './column';
import { RelationType } from './enum-relation';


export interface RelationDecorator {

  (obj?: BelongsToManyRelationAnnotation): TypeDecorator;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: BelongsToManyRelationAnnotation): BelongsToManyRelationAnnotation;
}

export interface BelongsToManyRelationAnnotation extends ColumnDefine {
  name?: string;
  isRelation?: boolean;
  type?: RelationType;

  related: typeof Model;
  table?: string;
  foreignPivotKey?: string;
  relatedPivotKey?: string;
  parentKey?: string;
  relatedKey?: string;
  relation?: string;

  onQuery?: (q: BelongsToMany) => void;

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

export interface BelongsToManyColumnDecorator {

  (obj: BelongsToManyRelationAnnotation): any;

  isTypeOf(obj: any): obj is BelongsToManyRelationAnnotation;

  metadataName: string;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: BelongsToManyRelationAnnotation): BelongsToManyRelationAnnotation;
}

export const BelongsToManyColumn: BelongsToManyColumnDecorator = makePropDecorator(
  'fedaco orm belongs to many relations',
  (p: BelongsToManyRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.BelongsToMany,
    _getRelation: function (m: Model) {

      // if (isBlank(relation)) {
      //    relation = this.guessBelongsToManyRelation();
      // }
      let instance          = m._newRelatedInstance(p.related);
      const foreignPivotKey = p.foreignPivotKey || m.getForeignKey();
      const relatedPivotKey = p.relatedPivotKey || instance.getForeignKey();
      let table             = p.table;
      if (isBlank(table)) {
        table = m.joiningTable(p.related, instance);
      }
      const r = new BelongsToMany(
        instance.newQuery(), m, table, foreignPivotKey,
        relatedPivotKey, p.parentKey || m.getKeyName(),
        p.relatedKey || instance.getKeyName(),
        p.relation);

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

