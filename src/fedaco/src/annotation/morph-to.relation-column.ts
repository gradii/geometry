/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Model } from '../fedaco/model';
// import { makePropDecorator } from '@gradii/annotation';
// import { isBlank } from '@gradii/check-type';
// import { Model } from '../fedaco/model';
// import { snakeCase } from '../helper/str';
// import { ForwardRefFn, resolveForwardRef } from '../query-builder/forward-ref';
// import { _additionalProcessingGetter } from './additional-processing';
// import { FedacoDecorator } from './annotation.interface';
import { ColumnAnnotation } from './column';
import { RelationType } from './enum-relation';


export interface MorphToRelationAnnotation extends ColumnAnnotation {
  name?: string;
  isRelation?: boolean;
  type?: RelationType;

  // related?: typeof Model | ForwardRefFn;
  // foreignKey?: string;
  // ownerKey?: string;
  // relation?: string;

  // onQuery?: (q: MorphTo) => void;

  _getRelation?: (m: Model) => any;
}

//
// export const MorphToColumn: FedacoDecorator<MorphToRelationAnnotation> = makePropDecorator(
//   'Fedaco:MorphToColumn',
//   (p: MorphToRelationAnnotation) => ({
//     isRelation  : true,
//     type        : RelationType.MorphTo,
//     _getRelation: function (m: Model, relation: string) {
//       if (!isBlank(p.relation)) {
//         relation = p.relation;
//       }
//
//       let instance     = m._newRelatedInstance(resolveForwardRef(p.related));
//       const foreignKey = p.foreignKey || `${snakeCase(relation)}_${instance.getKeyName()}`;
//       const ownerKey   = p.ownerKey || instance.getKeyName();
//       const r          = new MorphTo(instance.newQuery(), m, foreignKey, ownerKey, relation);
//       if (p.onQuery) {
//         p.onQuery(r);
//       }
//       return r;
//     },
//     ...p
//   }),
//   undefined,
//   (target: any, name: string, columnDefine) => {
//     _additionalProcessingGetter(target, name, columnDefine);
//   }
// );
