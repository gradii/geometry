/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BelongsToManyColumn } from '../../src/annotation/belongs-to-many.relation-column';
import { BelongsToColumn } from '../../src/annotation/belongs-to.relation-column';
import { HasManyColumn } from '../../src/annotation/has-many.relation-column';
import { Model } from '../../src/fedaco/model';
import { BelongsTo } from '../../src/fedaco/relations/belongs-to';
import { forwardRef } from '../../src/query-builder/forward-ref';

export class FedacoBuilderTestModelCloseRelatedStub extends Model {

  @HasManyColumn({
      related: forwardRef(() => FedacoBuilderTestModelFarRelatedStub)
    }
  )
  public bar: any[];

  @HasManyColumn({
      related: forwardRef(() => FedacoBuilderTestModelFarRelatedStub)
    }
  )
  public baz: any[];
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

