/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { Model } from '../../fedaco/model';
import { _additionalProcessingGetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { RelationType } from '../enum-relation';
import { FedacoRelationColumn, RelationColumnAnnotation } from '../relation-column';
import { ForwardRefFn } from '../../query-builder/forward-ref';


export interface MorphedByManyRelationAnnotation extends RelationColumnAnnotation {
  related: typeof Model | ForwardRefFn<typeof Model>;
  name: string;
  table?: string;
  foreignPivotKey?: string;
  relatedPivotKey?: string;
  parentKey?: string;
  relatedKey?: string;
}

export const MorphedByManyColumn: FedacoDecorator<MorphedByManyRelationAnnotation> = makePropDecorator(
  'Fedaco:MorphedByMany',
  (p: MorphedByManyRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.MorphedByMany,
    _getRelation: function (m: Model, relation: string) {
      const foreignPivotKey = p.foreignPivotKey || this.getForeignKey();
      const relatedPivotKey = p.relatedPivotKey || p.name + '_id';
      const r             = m.morphToMany(
        p.related, p.name, p.table,
        foreignPivotKey, relatedPivotKey,
        p.parentKey, p.relatedKey, true);

      if (p.onQuery) {
        p.onQuery(r);
      }
      return r;
    },
    ...p
  }),
  FedacoRelationColumn,
  (target: any, name: string, columnDefine) => {
    _additionalProcessingGetter(target, name, columnDefine);
  }
);

