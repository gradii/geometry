/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Model } from '../../src/fedaco/model';


export class FedacoBuilderTestModelParentStub extends Model {
  public foo() {
    return this.belongsTo(FedacoBuilderTestModelCloseRelatedStub);
  }

  public address() {
    return this.belongsTo(FedacoBuilderTestModelCloseRelatedStub, 'foo_id');
  }

  public activeFoo() {
    return this.belongsTo(FedacoBuilderTestModelCloseRelatedStub, 'foo_id').where('active', true);
  }

  public roles() {
    return this.belongsToMany(FedacoBuilderTestModelFarRelatedStub, 'user_role', 'self_id',
      'related_id');
  }
}

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
