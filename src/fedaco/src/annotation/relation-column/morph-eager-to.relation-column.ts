/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { Model } from '../../fedaco/model';
import { MorphTo } from '../../fedaco/relations/morph-to';
import { _additionalProcessingGetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { RelationType } from '../enum-relation';
import { FedacoRelationColumn, RelationColumnAnnotation } from '../relation-column';

/*Define a polymorphic, inverse one-to-one or many relationship.*/
export function morphEagerTo(m: Model, name: string, type: string, id: string, ownerKey: string) {
  return new MorphTo(m.newQuery().setEagerLoads([]), m, id, ownerKey, type, name);
}

/*Define a polymorphic, inverse one-to-one or many relationship.*/
export function morphInstanceTo(m: Model, target: typeof Model, name: string, type: string, id: string, ownerKey: string) {
  const instance = m.newRelatedInstance(target);
  return new MorphTo(instance.newQuery(), m, id, ownerKey ?? instance.getKeyName(), type, name);
}

export interface MorphToRelationAnnotation extends RelationColumnAnnotation {
  name: string;
  /**
   * the type of class to use morph to
   */
  morphTypeMap: Record<string, typeof Model>;
  type?: string;
  id?: string;
  ownerKey?: string;
}


export const MorphEagerToColumn: FedacoDecorator<MorphToRelationAnnotation> = makePropDecorator(
  'Fedaco:MorphToColumn',
  (p: MorphToRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.MorphTo,
    _getRelation: function (m: Model, relation: string) {
      const name = p.name || relation;
      const r = new MorphTo(this.newQuery().setEagerLoads([]), m, p.id, p.ownerKey, p.type, name);

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