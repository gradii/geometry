/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { isBlank } from '@gradii/check-type';
import { Model } from '../../fedaco/model';
import { BelongsToMany } from '../../fedaco/relations/belongs-to-many';
import { Relation } from '../../fedaco/relations/relation';
import { ForwardRefFn, resolveForwardRef } from '../../query-builder/forward-ref';
import { _additionalProcessingGetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { RelationType } from '../enum-relation';
import { FedacoRelationColumn, RelationColumnAnnotation } from '../relation-column';


export interface BelongsToManyRelationAnnotation<T extends Relation = BelongsToMany> extends RelationColumnAnnotation<T> {
  related: typeof Model | ForwardRefFn<typeof Model>;
  table?: string;
  foreignPivotKey?: string;
  relatedPivotKey?: string;
  parentKey?: string;
  relatedKey?: string;
  relation?: string;
}

export const BelongsToManyColumn: FedacoDecorator<BelongsToManyRelationAnnotation> = makePropDecorator(
  'Fedaco:BelongsToMany',
  (p: BelongsToManyRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.BelongsToMany,
    _getRelation: function (m: Model, relation: string) {
      if (!isBlank(p.relation)) {
        relation = p.relation;
      }
      const resolvedRelatedClazz = resolveForwardRef(p.related);
      const instance          = m._newRelatedInstance(resolvedRelatedClazz);
      const foreignPivotKey = p.foreignPivotKey || m.getForeignKey();
      const relatedPivotKey = p.relatedPivotKey || instance.getForeignKey();
      let table             = p.table;
      if (isBlank(table)) {
        table = m.joiningTable(resolvedRelatedClazz, instance);
      }
      const r = new BelongsToMany(
        instance.newQuery(), m, table, foreignPivotKey,
        relatedPivotKey, p.parentKey || m.getKeyName(),
        p.relatedKey || instance.getKeyName(),
        relation);

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

