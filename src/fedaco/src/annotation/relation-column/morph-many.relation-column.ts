/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { Model } from '../../fedaco/model';
import { MorphMany } from '../../fedaco/relations/morph-many';
import { _additionalProcessingGetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { RelationType } from '../enum-relation';
import { RelationColumnAnnotation } from '../relation-column';


export interface MorphManyRelationAnnotation extends RelationColumnAnnotation {
  related: string;
  name: string;
  type: string;
  id?: string;
  localKey?: string;
}

export const MorphManyColumn: FedacoDecorator<MorphManyRelationAnnotation> = makePropDecorator(
  'Fedaco:MorphMany',
  (p: MorphManyRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.MorphMany,
    _getRelation: function (m: Model, relation: string) {
      let instance = this.newRelatedInstance(p.related);

      const [type, id] = m.getMorphs(p.name, p.type, p.id);
      let table        = instance.getTable();
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
  undefined,
  (target: any, name: string, columnDefine) => {
    _additionalProcessingGetter(target, name, columnDefine);
  }
);

