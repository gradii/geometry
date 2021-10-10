/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { Model } from '../../fedaco/model';
import { MorphToMany } from '../../fedaco/relations/morph-to-many';
import { plural } from '../../helper/pluralize';
import { ForwardRefFn, resolveForwardRef } from '../../query-builder/forward-ref';
import { _additionalProcessingGetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { RelationType } from '../enum-relation';
import { FedacoRelationColumn, RelationColumnAnnotation } from '../relation-column';


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
      p.foreignPivotKey = p.foreignPivotKey || m.getForeignKey();
      p.relatedPivotKey = p.relatedPivotKey || p.name + '_id';

      const caller   = relation;
      const instance = m._newRelatedInstance(resolveForwardRef(p.related));

      p.parentKey  = p.parentKey || m.getKeyName();
      p.relatedKey = p.relatedKey || instance.getKeyName();

      let table = p.table;
      if (!table) {
        const words             = p.name.split('_');
        words[words.length - 1] = plural(words[words.length - 1]);
        table                   = words.join('_');
      }
      const r = new MorphToMany(instance.newQuery(), m, p.name, p.table,
        p.foreignPivotKey, p.relatedPivotKey,
        p.parentKey, p.relatedKey,
        caller, true);

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

