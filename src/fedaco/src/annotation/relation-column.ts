/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Model } from '../fedaco/model';
import { ColumnAnnotation } from './column';
import { RelationType } from './enum-relation';

export interface RelationAnnotation extends ColumnAnnotation {
  name?: string;
  isRelation?: boolean;
  type?: RelationType;
  related?: typeof Model;
  foreignKey?: string;
  localKey?: string;
  _getRelation?: (m: Model, relation: string) => any;
}

export class FedacoRelationColumn {
  static isTypeMe(obj: any) {
    return obj instanceof FedacoRelationColumn;
  }
}
