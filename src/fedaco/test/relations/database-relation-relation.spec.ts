import { Model } from '../../src/fedaco/model';
import { HasOne } from '../../src/fedaco/relations/has-one';
import { Relation } from '../../src/fedaco/relations/relation';

describe('test database eloquent relation', () => {

  it('set relation fail', () => {
    const parent   = new EloquentRelationResetModelStub();
    const relation = new EloquentRelationResetModelStub();
    parent.setRelation('test', relation);
    parent.setRelation('foo', 'bar');
    expect(parent.toArray()).not.toHaveProperty('foo');
  });
  it('unset existing relation', () => {
    const parent   = new EloquentRelationResetModelStub();
    const relation = new EloquentRelationResetModelStub();
    parent.setRelation('foo', relation);
    parent.unsetRelation('foo');
    expect(parent.relationLoaded('foo')).toBeFalsy();
  });
  it('touch method updates related timestamps', () => {
    const builder = m.mock(Builder);
    const parent  = m.mock(Model);
    parent.shouldReceive('getAttribute')._with('id').andReturn(1);
    const related = m.mock(EloquentNoTouchingModelStub).makePartial();
    builder.shouldReceive('getModel').andReturn(related);
    builder.shouldReceive('whereNotNull');
    builder.shouldReceive('where');
    builder.shouldReceive('withoutGlobalScopes').andReturn(builder);
    const relation = new HasOne(builder, parent, 'foreign_key', 'id');
    related.shouldReceive('getTable').andReturn('table');
    related.shouldReceive('getUpdatedAtColumn').andReturn('updated_at');
    const now = Carbon.now();
    related.shouldReceive('freshTimestampString').andReturn(now);
    builder.shouldReceive('update').once()._with({
      'updated_at': now
    });
    relation.touch();
  });
  it('can disable parent touching for all models', () => {
    /**/
    const related = m.mock(EloquentNoTouchingModelStub).makePartial();
    related.shouldReceive('getUpdatedAtColumn').never();
    related.shouldReceive('freshTimestampString').never();
    expect(related.isIgnoringTouch()).toBeFalsy();
    Model.withoutTouching(() => {
      this.assertTrue(related.isIgnoringTouch());
      const builder = m.mock(Builder);
      const parent  = m.mock(Model);
      parent.shouldReceive('getAttribute')._with('id').andReturn(1);
      builder.shouldReceive('getModel').andReturn(related);
      builder.shouldReceive('whereNotNull');
      builder.shouldReceive('where');
      builder.shouldReceive('withoutGlobalScopes').andReturn(builder);
      const relation = new HasOne(builder, parent, 'foreign_key', 'id');
      builder.shouldReceive('update').never();
      relation.touch();
    });
    expect(related.isIgnoringTouch()).toBeFalsy();
  });
  it('can disable touching for specific model', () => {
    const related = m.mock(EloquentNoTouchingModelStub).makePartial();
    related.shouldReceive('getUpdatedAtColumn').never();
    related.shouldReceive('freshTimestampString').never();
    const anotherRelated = m.mock(EloquentNoTouchingAnotherModelStub).makePartial();
    expect(related.isIgnoringTouch()).toBeFalsy();
    expect(anotherRelated.isIgnoringTouch()).toBeFalsy();
    EloquentNoTouchingModelStub.withoutTouching(() => {
      this.assertTrue(related.isIgnoringTouch());
      this.assertFalse(anotherRelated.isIgnoringTouch());
      const builder = m.mock(Builder);
      const parent  = m.mock(Model);
      parent.shouldReceive('getAttribute')._with('id').andReturn(1);
      builder.shouldReceive('getModel').andReturn(related);
      builder.shouldReceive('whereNotNull');
      builder.shouldReceive('where');
      builder.shouldReceive('withoutGlobalScopes').andReturnSelf();
      const relation = new HasOne(builder, parent, 'foreign_key', 'id');
      builder.shouldReceive('update').never();
      relation.touch();
      const anotherBuilder = m.mock(Builder);
      const anotherParent  = m.mock(Model);
      anotherParent.shouldReceive('getAttribute')._with('id').andReturn(2);
      anotherBuilder.shouldReceive('getModel').andReturn(anotherRelated);
      anotherBuilder.shouldReceive('whereNotNull');
      anotherBuilder.shouldReceive('where');
      anotherBuilder.shouldReceive('withoutGlobalScopes').andReturnSelf();
      const anotherRelation = new HasOne(anotherBuilder, anotherParent, 'foreign_key', 'id');
      const now             = Carbon.now();
      anotherRelated.shouldReceive('freshTimestampString').andReturn(now);
      anotherBuilder.shouldReceive('update').once()._with({
        'updated_at': now
      });
      anotherRelation.touch();
    });
    expect(related.isIgnoringTouch()).toBeFalsy();
    expect(anotherRelated.isIgnoringTouch()).toBeFalsy();
  });
  it('parent model is not touched when child model is ignored', () => {
    const related = m.mock(EloquentNoTouchingModelStub).makePartial();
    related.shouldReceive('getUpdatedAtColumn').never();
    related.shouldReceive('freshTimestampString').never();
    const relatedChild = m.mock(EloquentNoTouchingChildModelStub).makePartial();
    relatedChild.shouldReceive('getUpdatedAtColumn').never();
    relatedChild.shouldReceive('freshTimestampString').never();
    expect(related.isIgnoringTouch()).toBeFalsy();
    expect(relatedChild.isIgnoringTouch()).toBeFalsy();
    EloquentNoTouchingModelStub.withoutTouching(() => {
      this.assertTrue(related.isIgnoringTouch());
      this.assertTrue(relatedChild.isIgnoringTouch());
      const builder = m.mock(Builder);
      const parent  = m.mock(Model);
      parent.shouldReceive('getAttribute')._with('id').andReturn(1);
      builder.shouldReceive('getModel').andReturn(related);
      builder.shouldReceive('whereNotNull');
      builder.shouldReceive('where');
      builder.shouldReceive('withoutGlobalScopes').andReturnSelf();
      const relation = new HasOne(builder, parent, 'foreign_key', 'id');
      builder.shouldReceive('update').never();
      relation.touch();
      const anotherBuilder = m.mock(Builder);
      const anotherParent  = m.mock(Model);
      anotherParent.shouldReceive('getAttribute')._with('id').andReturn(2);
      anotherBuilder.shouldReceive('getModel').andReturn(relatedChild);
      anotherBuilder.shouldReceive('whereNotNull');
      anotherBuilder.shouldReceive('where');
      anotherBuilder.shouldReceive('withoutGlobalScopes').andReturnSelf();
      const anotherRelation = new HasOne(anotherBuilder, anotherParent, 'foreign_key', 'id');
      anotherBuilder.shouldReceive('update').never();
      anotherRelation.touch();
    });
    expect(related.isIgnoringTouch()).toBeFalsy();
    expect(relatedChild.isIgnoringTouch()).toBeFalsy();
  });
  it('ignored models state is reset when there are exceptions', () => {
    const related = m.mock(EloquentNoTouchingModelStub).makePartial();
    related.shouldReceive('getUpdatedAtColumn').never();
    related.shouldReceive('freshTimestampString').never();
    const relatedChild = m.mock(EloquentNoTouchingChildModelStub).makePartial();
    relatedChild.shouldReceive('getUpdatedAtColumn').never();
    relatedChild.shouldReceive('freshTimestampString').never();
    expect(related.isIgnoringTouch()).toBeFalsy();
    expect(relatedChild.isIgnoringTouch()).toBeFalsy();
    try {
      EloquentNoTouchingModelStub.withoutTouching(() => {
        this.assertTrue(related.isIgnoringTouch());
        this.assertTrue(relatedChild.isIgnoringTouch());
        throw new Exception();
      });
      this.fail('Exception was not thrown');
    } catch (exception: Exception) {
    }
    expect(related.isIgnoringTouch()).toBeFalsy();
    expect(relatedChild.isIgnoringTouch()).toBeFalsy();
  });
  it('setting morph map with numeric array uses the table names', () => {
    Relation.morphMap([EloquentRelationResetModelStub]);
    expect(Relation.morphMap()).toEqual({
      'reset': EloquentRelationResetModelStub
    });
    Relation.morphMap([], false);
  });
  it('setting morph map with numeric keys', () => {
    Relation.morphMap({
      1: 'App\\User'
    });
    expect(Relation.morphMap()).toEqual({
      1: 'App\\User'
    });
    Relation.morphMap([], false);
  });
  it('without relations', () => {
    const original = new EloquentNoTouchingModelStub();
    original.setRelation('foo', 'baz');
    expect(original.getRelation('foo')).toBe('baz');
    let model = original.withoutRelations();
    expect(model).toInstanceOf(EloquentNoTouchingModelStub);
    expect(original.relationLoaded('foo')).toBeTruthy();
    expect(model.relationLoaded('foo')).toBeFalsy();
    const model = original.unsetRelations();
    expect(model).toInstanceOf(EloquentNoTouchingModelStub);
    expect(original.relationLoaded('foo')).toBeFalsy();
    expect(model.relationLoaded('foo')).toBeFalsy();
  });
  it('macroable', () => {
    Relation.macro('foo', () => {
      return 'foo';
    });
    const model    = new EloquentRelationResetModelStub();
    const relation = new EloquentRelationStub(model.newQuery(), model);
    const result   = relation.foo();
    expect(result).toBe('foo');
  });
  it('relation resolvers', () => {
    const model   = new EloquentRelationResetModelStub();
    const builder = m.mock(Builder);
    builder.shouldReceive('getModel').andReturn(model);
    EloquentRelationResetModelStub.resolveRelationUsing('customer', model => {
      return new EloquentResolverRelationStub(builder, model);
    });
    expect(model.customer()).toInstanceOf(EloquentResolverRelationStub);
    expect(model.customer).toEqual({
      'key': 'value'
    });
  });
});

export class EloquentRelationResetModelStub extends Model {
  _table: any = 'reset';

  public getQuery() {
    return this.newQuery().getQuery();
  }
}

export class EloquentRelationStub extends Relation {
  public addConstraints() {
  }

  public addEagerConstraints(models) {
  }

  public initRelation(models, relation) {
  }

  public match(models, results, relation) {
  }

  public getResults() {
  }
}

export class EloquentNoTouchingModelStub extends Model {
  _table: any      = 'table';
  protected attributes: any = {
    'id': 1
  };
}

export class EloquentNoTouchingChildModelStub extends EloquentNoTouchingModelStub {
}

export class EloquentNoTouchingAnotherModelStub extends Model {
  _table: any      = 'another_table';
  protected attributes: any = {
    'id': 2
  };
}

export class EloquentResolverRelationStub extends EloquentRelationStub {
  public getResults() {
    return {
      'key': 'value'
    };
  }
}
