/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Model } from '../fedaco/model';
import { Relation } from '../fedaco/relations/relation';
import { ColumnAnnotation } from './column';
import { RelationType } from './enum-relation';

export interface RelationColumnAnnotation extends ColumnAnnotation {
  name?: string;
  isRelation?: boolean;
  relationType?: RelationType;

  onQuery?: (q: Relation) => void;
  _getRelation?: (m: Model, relation: string) => any;
}

export class FedacoRelationColumn {
  static isTypeMe(obj: any) {
    return obj instanceof FedacoRelationColumn;
  }
}
