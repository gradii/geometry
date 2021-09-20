/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BelongsToColumn } from '../../src/annotation/belongs-to.relation';
import { Model } from '../../src/fedaco/model';
import { BelongsTo } from '../../src/fedaco/relations/belongs-to';


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

  public roles() {
    return this.belongsToMany(FedacoBuilderTestModelFarRelatedStub, 'user_role', 'self_id',
      'related_id');
  }
}

