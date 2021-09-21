/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { BelongsToManyColumn } from '../../src/annotation/belongs-to-many.relation';
import { BelongsToColumn } from '../../src/annotation/belongs-to.relation';
import { HasManyColumn } from '../../src/annotation/has-many.relation';
import { HasOneColumn } from '../../src/annotation/has-one.relation';
import { Model } from '../../src/fedaco/model';

export class FedacoBuilderTestModelFarRelatedStub extends Model {
}

export class FedacoBuilderTestModelSelfRelatedStub extends Model {
  protected table: any = 'self_related_stubs';

  @BelongsToColumn({
    related   : FedacoBuilderTestModelSelfRelatedStub,
    foreignKey: 'parent_id',
    ownerKey  : 'id',
    relation  : 'parent'
  })
  public parentFoo: any;

  @HasOneColumn({
    related   : FedacoBuilderTestModelSelfRelatedStub,
    foreignKey: 'parent_id',
    localKey  : 'id',
  })
  public childFoo: any;

  @HasManyColumn({
    related   : FedacoBuilderTestModelSelfRelatedStub,
    foreignKey: 'parent_id',
    localKey  : 'id',
  })
  public childFoos: any[];

  @BelongsToManyColumn({
    related        : FedacoBuilderTestModelSelfRelatedStub,
    table          : 'self_pivot',
    foreignPivotKey: 'child_id',
    relatedPivotKey: 'parent_id',
    parentKey      : 'parent_bars'
    // relatedKey
    // relation
  })
  public parentBars: any[];

  @BelongsToManyColumn({
    related        : FedacoBuilderTestModelSelfRelatedStub,
    table          : 'self_pivot',
    foreignPivotKey: 'parent_id',
    relatedPivotKey: 'child_id',
    parentKey      : 'child_bars'
    // relatedKey
    // relation
  })
  public childBars: any[];

  @HasManyColumn({
    related   : FedacoBuilderTestModelFarRelatedStub,
    foreignKey: 'foreign_key',
    localKey  : 'id',
  })
  public bazes: any[];
}
