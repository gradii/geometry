/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { Model } from '../../fedaco/model';
import { HasManyThrough } from '../../fedaco/relations/has-many-through';
import { ForwardRefFn, resolveForwardRef } from '../../query-builder/forward-ref';
import { _additionalProcessingGetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { RelationType } from '../enum-relation';
import { RelationColumnAnnotation } from '../relation-column';

export interface HasManyThroughRelationAnnotation extends RelationColumnAnnotation {
  related: typeof Model | ForwardRefFn;
  through: typeof Model | ForwardRefFn;
  firstKey?: string;
  secondKey?: string;
  localKey?: string;
  secondLocalKey?: string;
}


export const HasManyThroughColumn: FedacoDecorator<HasManyThroughRelationAnnotation> = makePropDecorator(
  'Fedaco:HasManyThroughColumn',
  (p: HasManyThroughRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.HasManyThrough,
    _getRelation: function (m: Model, relation: string) {
      // @ts-ignore
      const through   = new resolveForwardRef(p.through)();
      const firstKey  = p.firstKey || m.getForeignKey();
      const secondKey = p.secondKey || through.getForeignKey();

      const r = new HasManyThrough(
        this.newRelatedInstance(p.related).newQuery(), m,
        through, firstKey, secondKey, p.localKey || m.getKeyName(),
        p.secondLocalKey || through.getKeyName());

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
