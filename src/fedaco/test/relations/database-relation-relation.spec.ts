import { Exception } from 'Exception';
import { Builder } from 'Illuminate/Database/Eloquent/Builder';
import { Collection } from 'Illuminate/Database/Eloquent/Collection';
import { Model } from 'Illuminate/Database/Eloquent/Model';
import { HasOne } from 'Illuminate/Database/Eloquent/Relations/HasOne';
import { Relation } from 'Illuminate/Database/Eloquent/Relations/Relation';
import { Carbon } from 'Illuminate/Support/Carbon';
import { Mockery as m } from 'Mockery';
import { TestCase } from 'PHPUnit/Framework/TestCase';

describe('test database eloquent relation', () => {
  it('tear down', () => {
    m.close();
  });
  it('set relation fail', () => {
    var parent   = new EloquentRelationResetModelStub();
    var relation = new EloquentRelationResetModelStub();
    parent.setRelation('test', relation);
    parent.setRelation('foo', 'bar');
    expect(parent.toArray()).toArrayNotHasKey('foo');
  });
  it('unset existing relation', () => {
    var parent   = new EloquentRelationResetModelStub();
    var relation = new EloquentRelationResetModelStub();
    parent.setRelation('foo', relation);
    parent.unsetRelation('foo');
    expect(parent.relationLoaded('foo')).toFalse();
  });
  it('touch method updates related timestamps', () => {
    var builder = m.mock(Builder);
    var parent  = m.mock(Model);
    parent.shouldReceive('getAttribute')._with('id').andReturn(1);
    var related = m.mock(EloquentNoTouchingModelStub).makePartial();
    builder.shouldReceive('getModel').andReturn(related);
    builder.shouldReceive('whereNotNull');
    builder.shouldReceive('where');
    builder.shouldReceive('withoutGlobalScopes').andReturn(builder);
    var relation = new HasOne(builder, parent, 'foreign_key', 'id');
    related.shouldReceive('getTable').andReturn('table');
    related.shouldReceive('getUpdatedAtColumn').andReturn('updated_at');
    var now = Carbon.now();
    related.shouldReceive('freshTimestampString').andReturn(now);
    builder.shouldReceive('update').once()._with({
      'updated_at': now
    });
    relation.touch();
  });
  it('can disable parent touching for all models', () => {
    /**/
    var related = m.mock(EloquentNoTouchingModelStub).makePartial();
    related.shouldReceive('getUpdatedAtColumn').never();
    related.shouldReceive('freshTimestampString').never();
    expect(related.isIgnoringTouch()).toFalse();
    Model.withoutTouching(() => {
      this.assertTrue(related.isIgnoringTouch());
      var builder = m.mock(Builder);
      var parent  = m.mock(Model);
      parent.shouldReceive('getAttribute')._with('id').andReturn(1);
      builder.shouldReceive('getModel').andReturn(related);
      builder.shouldReceive('whereNotNull');
      builder.shouldReceive('where');
      builder.shouldReceive('withoutGlobalScopes').andReturn(builder);
      var relation = new HasOne(builder, parent, 'foreign_key', 'id');
      builder.shouldReceive('update').never();
      relation.touch();
    });
    expect(related.isIgnoringTouch()).toFalse();
  });
  it('can disable touching for specific model', () => {
    var related = m.mock(EloquentNoTouchingModelStub).makePartial();
    related.shouldReceive('getUpdatedAtColumn').never();
    related.shouldReceive('freshTimestampString').never();
    var anotherRelated = m.mock(EloquentNoTouchingAnotherModelStub).makePartial();
    expect(related.isIgnoringTouch()).toFalse();
    expect(anotherRelated.isIgnoringTouch()).toFalse();
    EloquentNoTouchingModelStub.withoutTouching(() => {
      this.assertTrue(related.isIgnoringTouch());
      this.assertFalse(anotherRelated.isIgnoringTouch());
      var builder = m.mock(Builder);
      var parent  = m.mock(Model);
      parent.shouldReceive('getAttribute')._with('id').andReturn(1);
      builder.shouldReceive('getModel').andReturn(related);
      builder.shouldReceive('whereNotNull');
      builder.shouldReceive('where');
      builder.shouldReceive('withoutGlobalScopes').andReturnSelf();
      var relation = new HasOne(builder, parent, 'foreign_key', 'id');
      builder.shouldReceive('update').never();
      relation.touch();
      var anotherBuilder = m.mock(Builder);
      var anotherParent  = m.mock(Model);
      anotherParent.shouldReceive('getAttribute')._with('id').andReturn(2);
      anotherBuilder.shouldReceive('getModel').andReturn(anotherRelated);
      anotherBuilder.shouldReceive('whereNotNull');
      anotherBuilder.shouldReceive('where');
      anotherBuilder.shouldReceive('withoutGlobalScopes').andReturnSelf();
      var anotherRelation = new HasOne(anotherBuilder, anotherParent, 'foreign_key', 'id');
      var now             = Carbon.now();
      anotherRelated.shouldReceive('freshTimestampString').andReturn(now);
      anotherBuilder.shouldReceive('update').once()._with({
        'updated_at': now
      });
      anotherRelation.touch();
    });
    expect(related.isIgnoringTouch()).toFalse();
    expect(anotherRelated.isIgnoringTouch()).toFalse();
  });
  it('parent model is not touched when child model is ignored', () => {
    var related = m.mock(EloquentNoTouchingModelStub).makePartial();
    related.shouldReceive('getUpdatedAtColumn').never();
    related.shouldReceive('freshTimestampString').never();
    var relatedChild = m.mock(EloquentNoTouchingChildModelStub).makePartial();
    relatedChild.shouldReceive('getUpdatedAtColumn').never();
    relatedChild.shouldReceive('freshTimestampString').never();
    expect(related.isIgnoringTouch()).toFalse();
    expect(relatedChild.isIgnoringTouch()).toFalse();
    EloquentNoTouchingModelStub.withoutTouching(() => {
      this.assertTrue(related.isIgnoringTouch());
      this.assertTrue(relatedChild.isIgnoringTouch());
      var builder = m.mock(Builder);
      var parent  = m.mock(Model);
      parent.shouldReceive('getAttribute')._with('id').andReturn(1);
      builder.shouldReceive('getModel').andReturn(related);
      builder.shouldReceive('whereNotNull');
      builder.shouldReceive('where');
      builder.shouldReceive('withoutGlobalScopes').andReturnSelf();
      var relation = new HasOne(builder, parent, 'foreign_key', 'id');
      builder.shouldReceive('update').never();
      relation.touch();
      var anotherBuilder = m.mock(Builder);
      var anotherParent  = m.mock(Model);
      anotherParent.shouldReceive('getAttribute')._with('id').andReturn(2);
      anotherBuilder.shouldReceive('getModel').andReturn(relatedChild);
      anotherBuilder.shouldReceive('whereNotNull');
      anotherBuilder.shouldReceive('where');
      anotherBuilder.shouldReceive('withoutGlobalScopes').andReturnSelf();
      var anotherRelation = new HasOne(anotherBuilder, anotherParent, 'foreign_key', 'id');
      anotherBuilder.shouldReceive('update').never();
      anotherRelation.touch();
    });
    expect(related.isIgnoringTouch()).toFalse();
    expect(relatedChild.isIgnoringTouch()).toFalse();
  });
  it('ignored models state is reset when there are exceptions', () => {
    var related = m.mock(EloquentNoTouchingModelStub).makePartial();
    related.shouldReceive('getUpdatedAtColumn').never();
    related.shouldReceive('freshTimestampString').never();
    var relatedChild = m.mock(EloquentNoTouchingChildModelStub).makePartial();
    relatedChild.shouldReceive('getUpdatedAtColumn').never();
    relatedChild.shouldReceive('freshTimestampString').never();
    expect(related.isIgnoringTouch()).toFalse();
    expect(relatedChild.isIgnoringTouch()).toFalse();
    try {
      EloquentNoTouchingModelStub.withoutTouching(() => {
        this.assertTrue(related.isIgnoringTouch());
        this.assertTrue(relatedChild.isIgnoringTouch());
        throw new Exception();
      });
      this.fail('Exception was not thrown');
    } catch (exception: Exception) {
    }
    expect(related.isIgnoringTouch()).toFalse();
    expect(relatedChild.isIgnoringTouch()).toFalse();
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
    var original = new EloquentNoTouchingModelStub();
    original.setRelation('foo', 'baz');
    expect(original.getRelation('foo')).toBe('baz');
    var model = original.withoutRelations();
    expect(model).toInstanceOf(EloquentNoTouchingModelStub);
    expect(original.relationLoaded('foo')).toBeTruthy();
    expect(model.relationLoaded('foo')).toFalse();
    var model = original.unsetRelations();
    expect(model).toInstanceOf(EloquentNoTouchingModelStub);
    expect(original.relationLoaded('foo')).toFalse();
    expect(model.relationLoaded('foo')).toFalse();
  });
  it('macroable', () => {
    Relation.macro('foo', () => {
      return 'foo';
    });
    var model    = new EloquentRelationResetModelStub();
    var relation = new EloquentRelationStub(model.newQuery(), model);
    var result   = relation.foo();
    expect(result).toBe('foo');
  });
  it('relation resolvers', () => {
    var model   = new EloquentRelationResetModelStub();
    var builder = m.mock(Builder);
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
