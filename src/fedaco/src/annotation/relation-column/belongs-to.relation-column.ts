/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { isBlank } from '@gradii/check-type';
import { Model } from '../../fedaco/model';
import { BelongsTo } from '../../fedaco/relations/belongs-to';
import { snakeCase } from '../../helper/str';
import { ForwardRefFn, resolveForwardRef } from '../../query-builder/forward-ref';
import { _additionalProcessingGetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { RelationType } from '../enum-relation';
import { FedacoRelationColumn, RelationColumnAnnotation } from '../relation-column';

export interface BelongsToRelationAnnotation extends RelationColumnAnnotation {
  related: typeof Model | ForwardRefFn;
  foreignKey?: string;
  ownerKey?: string;
  relation?: string;
}

/**
 * todo if foreign key is not defined in model. should mark foreign key as attribute can be accessed
 */
export const BelongsToColumn: FedacoDecorator<BelongsToRelationAnnotation> = makePropDecorator(
  'Fedaco:BelongsToColumn',
  (p: BelongsToRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.BelongsTo,
    _getRelation: function (m: Model, relation: string) {
      if (isBlank(p.relation)) {
        p.relation = relation;
      }

      const instance = m._newRelatedInstance(resolveForwardRef(p.related));
      p.foreignKey   = p.foreignKey || `${snakeCase(p.relation)}_${instance.getKeyName()}`;
      p.ownerKey     = p.ownerKey || instance.getKeyName();
      const r        = new BelongsTo(instance.newQuery(), m, p.foreignKey, p.ownerKey, p.relation);
      if (p.onQuery) {
        p.onQuery(r);
      }
      return r;
    },
    ...p
  }),
  FedacoRelationColumn,
  (target: any, name: string, columnAnnotation) => {
    _additionalProcessingGetter(target, name, columnAnnotation);
  }
);