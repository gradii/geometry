/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { Model } from '../../fedaco/model';
import { plural } from '../../helper/pluralize';
import { _additionalProcessingGetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { RelationType } from '../enum-relation';
import { FedacoRelationColumn, RelationColumnAnnotation } from '../relation-column';

export interface MorphToManyRelationAnnotation extends RelationColumnAnnotation {
  related: string;
  name: string;
  table?: string;
  foreignPivotKey?: string;
  relatedPivotKey?: string;
  parentKey?: string;
  relatedKey?: string;
  inverse?: boolean;
}

export const MorphToManyColumn: FedacoDecorator<MorphToManyRelationAnnotation> = makePropDecorator(
  'Fedaco:MorphToManyColumn',
  (p: MorphToManyRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.MorphToMany,
    _getRelation: function (m: Model, relation: string) {

      let caller          = relation;
      let instance        = m.newRelatedInstance(p.related);
      let foreignPivotKey = p.foreignPivotKey || p.name + '_id';
      let relatedPivotKey = p.relatedPivotKey || instance.getForeignKey();
      let table = p.table;
      if (!table) {
        let words    = p.name.split('_');
        let lastWord = words.pop();
        table    = words.join('') + plural(lastWord);
      }
      const r = m.newMorphToMany(instance.newQuery(), this, p.name, table, foreignPivotKey,
        relatedPivotKey, p.parentKey || this.getKeyName(), p.relatedKey || instance.getKeyName(),
        caller, p.inverse);

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
