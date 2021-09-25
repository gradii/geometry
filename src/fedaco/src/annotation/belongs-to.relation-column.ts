/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { isBlank } from '@gradii/check-type';
import { Model } from '../fedaco/model';
import { BelongsTo } from '../fedaco/relations/belongs-to';
import { snakeCase } from '../helper/str';
import { ForwardRefFn, resolveForwardRef } from '../query-builder/forward-ref';
import { _additionalProcessingGetter } from './additional-processing';
import { FedacoDecorator } from './annotation.interface';
import { RelationType } from './enum-relation';
import { FedacoRelationColumn, RelationColumnAnnotation } from './relation-column';

export interface BelongsToRelationAnnotation extends RelationColumnAnnotation {
  related?: typeof Model | ForwardRefFn;
  foreignKey?: string;
  ownerKey?: string;
  relation?: string;
}

export const BelongsToColumn: FedacoDecorator<BelongsToRelationAnnotation> = makePropDecorator(
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
  FedacoRelationColumn,
  (target: any, name: string, columnDefine) => {
    _additionalProcessingGetter(target, name, columnDefine);
  }
);
