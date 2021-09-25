/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { Model } from '../../fedaco/model';
import { HasOne } from '../../fedaco/relations/has-one';
import { ForwardRefFn, resolveForwardRef } from '../../query-builder/forward-ref';
import { _additionalProcessingGetter } from '../additional-processing';
import { FedacoDecorator } from '../annotation.interface';
import { ColumnAnnotation } from '../column';
import { RelationType } from '../enum-relation';
import { FedacoRelationColumn } from '../relation-column';

export interface HasOneRelationAnnotation extends ColumnAnnotation {
  name?: string;
  isRelation?: boolean;
  type?: RelationType;

  related?: typeof Model | ForwardRefFn;
  foreignKey?: string;
  localKey?: string;

  onQuery?: (q: HasOne) => void;

  _getRelation?: (m: Model) => any;
}

export const HasOneColumn: FedacoDecorator<HasOneRelationAnnotation> = makePropDecorator(
  'Fedaco:HasOneColumn',
  (p: HasOneRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.HasOne,
    _getRelation: function (m: Model, relation: string) {
      let instance     = m._newRelatedInstance(resolveForwardRef(p.related));
      const foreignKey = p.foreignKey || m.getForeignKey();
      const localKey   = p.localKey || m.getKeyName();
      const r          = new HasOne(
        instance.newQuery(),
        m,
        `${instance.getTable()}.${foreignKey}`,
        localKey);

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

