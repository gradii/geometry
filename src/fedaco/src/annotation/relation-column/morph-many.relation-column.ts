/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { Model } from '../../fedaco/model';
import { MorphMany } from '../../fedaco/relations/morph-many';
import { ForwardRefFn, resolveForwardRef } from '../../query-builder/forward-ref';
import { _additionalProcessingGetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { RelationType } from '../enum-relation';
import { FedacoRelationColumn, RelationColumnAnnotation } from '../relation-column';


export interface MorphManyRelationAnnotation extends RelationColumnAnnotation {
  related: typeof Model | ForwardRefFn<typeof Model>;
  morphName: string;
  type?: string;
  id?: string;
  localKey?: string;
}

export const MorphManyColumn: FedacoDecorator<MorphManyRelationAnnotation> = makePropDecorator(
  'Fedaco:MorphMany',
  (p: MorphManyRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.MorphMany,
    _getRelation: function (m: Model, relation: string) {
      const instance = m._newRelatedInstance(resolveForwardRef(p.related));

      const [type, id] = m._getMorphs(p.morphName, p.type, p.id);
      const table      = instance.getTable();
      const localKey   = p.localKey || m.getKeyName();
      const r          = new MorphMany(instance.newQuery(), m, `${table}.${type}`,
        `${table}.${id}`, localKey);

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

