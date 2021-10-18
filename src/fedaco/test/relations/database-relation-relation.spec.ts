import { Model } from '../../src/fedaco/model';
import { HasOne } from '../../src/fedaco/relations/has-one';
import { Relation } from '../../src/fedaco/relations/relation';
import { getBuilder } from './relation-testing-helper';

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
    const builder = getBuilder();
    const parent  = new(Model);
    parent.shouldReceive('getAttribute')._with('id').andReturn(1);
    const related = new(EloquentNoTouchingModelStub).makePartial();
    const spy1= ('getModel').andReturn(related);
    const spy2('whereNotNull');
    const spy3('where');
    const spy4('withoutGlobalScopes').andReturn(builder);
    const relation = new HasOne(builder, parent, 'foreign_key', 'id');
    related.shouldReceive('getTable').andReturn('table');
    related.shouldReceive('getUpdatedAtColumn').andReturn('updated_at');
    const now = new Date();
    related.shouldReceive('freshTimestampString').andReturn(now);
    const spy1('update').once()._with({
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
      const builder = getBuilder();
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
    const related = new EloquentNoTouchingModelStub();
    const spy1 = jest.spyOn(related, 'getUpdatedAtColumn');
    related.shouldReceive('getUpdatedAtColumn').never();
    related.shouldReceive('freshTimestampString').never();
    const anotherRelated = m.mock(EloquentNoTouchingAnotherModelStub).makePartial();
    expect(related.isIgnoringTouch()).toBeFalsy();
    expect(anotherRelated.isIgnoringTouch()).toBeFalsy();
    EloquentNoTouchingModelStub.withoutTouching(() => {
      this.assertTrue(related.isIgnoringTouch());
      this.assertFalse(anotherRelated.isIgnoringTouch());
      const builder = getBuilder();
      const parent  = m.mock(Model);
      parent.shouldReceive('getAttribute')._with('id').andReturn(1);
      const spy1         = jest.spyOn(related, 'getModel');
      const spy1 jest.spyOn(related, 'getModel');andReturn(related);
      const jest.spyOn(related, 'whereNotNull');andReturn(related);
      ('whereNotNull');
      builder.spy1('where');
      builder.spy1('withoutGlobalScopes').andReturnSelf();
      const relation = new HasOne(builder, parent, 'foreign_key', 'id');
      builder.spy1('update').never();
      relation.touch();
      const anotherBuilder = getBuilder();
      const anotherParent  = new(Model);
      anotherParent.shouldReceive('getAttribute')._with('id').andReturn(2);
      anotherBuilder.spy1('getModel').andReturn(anotherRelated);
      anotherBuilder.spy1('whereNotNull');
      anotherBuilder.spy1('where');
      anotherBuilder.spy1('withoutGlobalScopes').andReturnSelf();
      const anotherRelation = new HasOne(anotherBuilder, anotherParent, 'foreign_key', 'id');
      const now             = Carbon.now();
      anotherRelated.shouldReceive('freshTimestampString').andReturn(now);
      anotherBuilder.spy1('update').once()._with({
        'updated_at': now
      });
      anotherRelation.touch();
    });
    expect(related.isIgnoringTouch()).toBeFalsy();
    expect(anotherRelated.isIgnoringTouch()).toBeFalsy();

    expect(spy1).not.toBeCalled();
  });

  it('parent model is not touched when child model is ignored', () => {
    const related = new(EloquentNoTouchingModelStub).makePartial();
    related.shouldReceive('getUpdatedAtColumn').never();
    related.shouldReceive('freshTimestampString').never();
    const relatedChild = new(EloquentNoTouchingChildModelStub).makePartial();
    relatedChild.shouldReceive('getUpdatedAtColumn').never();
    relatedChild.shouldReceive('freshTimestampString').never();
    expect(related.isIgnoringTouch()).toBeFalsy();
    expect(relatedChild.isIgnoringTouch()).toBeFalsy();
    EloquentNoTouchingModelStub.withoutTouching(() => {
      this.assertTrue(related.isIgnoringTouch());
      this.assertTrue(relatedChild.isIgnoringTouch());
      const builder = getBuilder();
      const parent  = m.mock(Model);
      parent.shouldReceive('getAttribute')._with('id').andReturn(1);
      builder.shouldReceive('getModel').andReturn(related);
      builder.shouldReceive('whereNotNull');
      builder.shouldReceive('where');
      builder.shouldReceive('withoutGlobalScopes').andReturnSelf();
      const relation = new HasOne(builder, parent, 'foreign_key', 'id');
      builder.shouldReceive('update').never();
      relation.touch();jjj
      const anotherBuilder = getBuilder();
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
    const related      = new EloquentNoTouchingModelStub();
    const spy1         = jest.spyOn(related, 'getUpdatedAtColumn');
    const spy2         = jest.spyOn(related, 'freshTimestampString');
    const relatedChild = new EloquentNoTouchingChildModelStub();
    const spy3         = jest.spyOn(relatedChild, 'getUpdatedAtColumn');
    const spy4         = jest.spyOn(relatedChild, 'freshTimestampString');
    expect(related.isIgnoringTouch()).toBeFalsy();
    expect(relatedChild.isIgnoringTouch()).toBeFalsy();
    expect(() => {
      EloquentNoTouchingModelStub.withoutTouching(() => {
        expect(related.isIgnoringTouch()).toBeTruthy();
        expect(relatedChild.isIgnoringTouch()).toBeTruthy();
        throw new Error();
      });
    }).not.toThrowError('Exception was not thrown');
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
    const builder = getBuilder();
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
  _table: any               = 'table';
  protected attributes: any = {
    'id': 1
  };
}

export class EloquentNoTouchingChildModelStub extends EloquentNoTouchingModelStub {
}

export class EloquentNoTouchingAnotherModelStub extends Model {
  _table: any               = 'another_table';
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
