/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makePropDecorator } from '@gradii/annotation';
import { isBlank } from '@gradii/check-type';
import { Model } from '../fedaco/model';
import { MorphTo } from '../fedaco/relations/morph-to';
import { snakeCase } from '../helper/str';
import { _additionalProcessingGetter } from './additional-processing';
import { FedacoDecorator } from './annotation.interface';
import { RelationType } from './enum-relation';
import { RelationColumnAnnotation } from './relation-column';

/*Define a polymorphic, inverse one-to-one or many relationship.*/
export function morphEagerTo(m: Model, name: string, type: string, id: string, ownerKey: string) {
  return new MorphTo(m.newQuery().setEagerLoads([]), m, id, ownerKey, type, name);
}

/*Define a polymorphic, inverse one-to-one or many relationship.*/
export function morphInstanceTo(m: Model, target: typeof Model, name: string, type: string,
                                id: string, ownerKey: string) {
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

export const MorphToColumn: FedacoDecorator<MorphToRelationAnnotation> = makePropDecorator(
  'Fedaco:MorphToColumn',
  (p: MorphToRelationAnnotation) => ({
    isRelation  : true,
    type        : RelationType.MorphTo,
    _getRelation: function (m: Model, relation: string) {
      // If no name is provided, we will use the backtrace to get the function name
      // since that is most likely the name of the polymorphic interface. We can
      // use that to get both the class and foreign key that will be utilized.
      const name       = p.name || relation;
      const [type, id] = this.getMorphs(snakeCase(name), p.type, p.id);

      // If the type value is null it is probably safe to assume we're eager loading
      // the relationship. In this case we'll just pass in a dummy query where we
      // need to remove any eager loads that may already be defined on a model.
      const clazz = p.morphTypeMap[m._getAttributeFromArray(type)];
      const r     = isBlank(clazz) ?
        morphEagerTo(m, name, type, id, p.ownerKey) :
        morphInstanceTo(m, clazz, name, type, id, p.ownerKey);

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
