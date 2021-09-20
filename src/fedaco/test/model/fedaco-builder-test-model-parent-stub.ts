/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BelongsToManyColumn } from '../../src/annotation/belongs-to-many.relation';
import { BelongsToColumn } from '../../src/annotation/belongs-to.relation';
import { FedacoBuilder } from '../../src/fedaco/fedaco-builder';
import { Model } from '../../src/fedaco/model';
import { BelongsTo } from '../../src/fedaco/relations/belongs-to';
import { BelongsToMany } from '../../src/fedaco/relations/belongs-to-many';


export class FedacoBuilderTestModelCloseRelatedStub extends Model {
  public bar() {
    return this.hasMany(FedacoBuilderTestModelFarRelatedStub);
  }

  public baz() {
    return this.hasMany(FedacoBuilderTestModelFarRelatedStub);
  }
}

export class FedacoBuilderTestModelFarRelatedStub extends Model {
}


export class FedacoBuilderTestModelParentStub extends Model {

  @BelongsToColumn({
    related: FedacoBuilderTestModelCloseRelatedStub,
  })
  readonly foo: any;

  @BelongsToColumn({
    related   : FedacoBuilderTestModelCloseRelatedStub,
    foreignKey: 'foo_id'
  })
  public address: any;

  @BelongsToColumn({
    related   : FedacoBuilderTestModelCloseRelatedStub,
    foreignKey: 'foo_id',
    onQuery   : (r: BelongsTo) => {
      r.where('active', true);
    }
  })
  public activeFoo: any;


  @BelongsToManyColumn({
    related        : FedacoBuilderTestModelCloseRelatedStub,
    table          : 'user_role',
    foreignPivotKey: 'self_id',
    relatedPivotKey: 'related_id'
  })

  public roles: any;
}

