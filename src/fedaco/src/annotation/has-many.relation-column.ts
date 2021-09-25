/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { Model } from '../fedaco/model';
import { HasMany } from '../fedaco/relations/has-many';
import { ForwardRefFn, resolveForwardRef } from '../query-builder/forward-ref';
import { _additionalProcessingGetter } from './additional-processing';
import { FedacoDecorator } from './annotation.interface';
import { ColumnAnnotation } from './column';
import { RelationType } from './enum-relation';
import { FedacoRelationColumn } from './relation-column';

export interface HasManyRelationAnnotation extends ColumnAnnotation {
  name?: string;
  isRelation?: boolean;
  type?: RelationType;

  related?: typeof Model | ForwardRefFn;
  foreignKey?: string;
  localKey?: string;

  onQuery?: (q: HasMany) => void;

  _getRelation?: (m: Model) => any;
}


export const HasManyColumn: FedacoDecorator<HasManyRelationAnnotation> = makePropDecorator(
  'Fedaco:HasManyColumn',
  (p: HasManyRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.HasMany,
    _getRelation: function (m: Model) {
      let instance   = m._newRelatedInstance(resolveForwardRef(p.related));
      let foreignKey = p.foreignKey || m.getForeignKey();
      let localKey   = p.localKey || m.getKeyName();
      return new HasMany(
        instance.newQuery(),
        m,
        `${instance.getTable()}.${foreignKey}`,
        localKey);
    },
    ...p
  }),
  FedacoRelationColumn,
  (target: any, name: string, columnDefine) => {
    _additionalProcessingGetter(target, name, columnDefine);
  }
);

