import { EloquentModelNamespacedStub } from 'Foo/Bar/EloquentModelNamespacedStub';
import { Builder } from 'Illuminate/Database/Eloquent/Builder';
import { Model } from 'Illuminate/Database/Eloquent/Model';
import { MorphMany } from 'Illuminate/Database/Eloquent/Relations/MorphMany';
import { MorphOne } from 'Illuminate/Database/Eloquent/Relations/MorphOne';
import { Relation } from 'Illuminate/Database/Eloquent/Relations/Relation';
import { Mockery as m } from 'Mockery';

describe('test database eloquent morph', () => {
  it('tear down', () => {
    Relation.morphMap([], false);
    m.close();
  });
  it('morph one sets proper constraints', () => {
    this.getOneRelation();
  });
  it('morph one eager constraints are properly added', () => {
    var relation = this.getOneRelation();
    relation.getParent().shouldReceive('getKeyName').once().andReturn('id');
    relation.getParent().shouldReceive('getKeyType').once().andReturn('string');
    relation.getQuery().shouldReceive('whereIn').once()._with('table.morph_id', [1, 2]);
    relation.getQuery().shouldReceive('where').once()._with('table.morph_type', get_class(relation.getParent()));
    var model1 = new EloquentMorphResetModelStub();
    model1.id  = 1;
    var model2 = new EloquentMorphResetModelStub();
    model2.id  = 2;
    relation.addEagerConstraints([model1, model2]);
  });
  it('morph many sets proper constraints', () => {
    this.getManyRelation();
  });
  it('morph many eager constraints are properly added', () => {
    var relation = this.getManyRelation();
    relation.getParent().shouldReceive('getKeyName').once().andReturn('id');
    relation.getParent().shouldReceive('getKeyType').once().andReturn('int');
    relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('table.morph_id', [1, 2]);
    relation.getQuery().shouldReceive('where').once()._with('table.morph_type', get_class(relation.getParent()));
    var model1 = new EloquentMorphResetModelStub();
    model1.id  = 1;
    var model2 = new EloquentMorphResetModelStub();
    model2.id  = 2;
    relation.addEagerConstraints([model1, model2]);
  });
  it('make function on morph', () => {
    _SERVER['__eloquent.saved'] = false;
    var relation                = this.getOneRelation();
    var instance                = m.mock(Model);
    instance.shouldReceive('setAttribute').once()._with('morph_id', 1);
    instance.shouldReceive('setAttribute').once()._with('morph_type', get_class(relation.getParent()));
    instance.shouldReceive('save').never();
    relation.getRelated().shouldReceive('newInstance').once()._with({
      'name': 'taylor'
    }).andReturn(instance);
    expect(relation.make({
      'name': 'taylor'
    })).toEqual(instance);
  });
  it('create function on morph', () => {
    var relation = this.getOneRelation();
    var created  = m.mock(Model);
    created.shouldReceive('setAttribute').once()._with('morph_id', 1);
    created.shouldReceive('setAttribute').once()._with('morph_type', get_class(relation.getParent()));
    relation.getRelated().shouldReceive('newInstance').once()._with({
      'name': 'taylor'
    }).andReturn(created);
    created.shouldReceive('save').once().andReturn(true);
    expect(relation.create({
      'name': 'taylor'
    })).toEqual(created);
  });
  it('find or new method finds model', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('find').once()._with('foo', ['*']).andReturn(model = m.mock(Model));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('setAttribute').never();
    model.shouldReceive('save').never();
    expect(relation.findOrNew('foo')).toInstanceOf(Model);
  });
  it('find or new method returns new model with morph keys set', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('find').once()._with('foo', ['*']).andReturn(null);
    relation.getRelated().shouldReceive('newInstance').once()._with().andReturn(model = m.mock(Model));
    model.shouldReceive('setAttribute').once()._with('morph_id', 1);
    model.shouldReceive('setAttribute').once()._with('morph_type', get_class(relation.getParent()));
    model.shouldReceive('save').never();
    expect(relation.findOrNew('foo')).toInstanceOf(Model);
  });
  it('first or new method finds first model', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(Model));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('setAttribute').never();
    model.shouldReceive('save').never();
    expect(relation.firstOrNew(['foo'])).toInstanceOf(Model);
  });
  it('first or new method with value finds first model', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('where').once()._with({
      'foo': 'bar'
    }).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(Model));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('setAttribute').never();
    model.shouldReceive('save').never();
    expect(relation.firstOrNew({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toInstanceOf(Model);
  });
  it('first or new method returns new model with morph keys set', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    relation.getRelated().shouldReceive('newInstance').once()._with(['foo']).andReturn(model = m.mock(Model));
    model.shouldReceive('setAttribute').once()._with('morph_id', 1);
    model.shouldReceive('setAttribute').once()._with('morph_type', get_class(relation.getParent()));
    model.shouldReceive('save').never();
    expect(relation.firstOrNew(['foo'])).toInstanceOf(Model);
  });
  it('first or new method with values returns new model with morph keys set', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('where').once()._with({
      'foo': 'bar'
    }).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    relation.getRelated().shouldReceive('newInstance').once()._with({
      'foo': 'bar',
      'baz': 'qux'
    }).andReturn(model = m.mock(Model));
    model.shouldReceive('setAttribute').once()._with('morph_id', 1);
    model.shouldReceive('setAttribute').once()._with('morph_type', get_class(relation.getParent()));
    model.shouldReceive('save').never();
    expect(relation.firstOrNew({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toInstanceOf(Model);
  });
  it('first or create method finds first model', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(Model));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('setAttribute').never();
    model.shouldReceive('save').never();
    expect(relation.firstOrCreate(['foo'])).toInstanceOf(Model);
  });
  it('first or create method with values finds first model', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('where').once()._with({
      'foo': 'bar'
    }).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(Model));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('setAttribute').never();
    model.shouldReceive('save').never();
    expect(relation.firstOrCreate({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toInstanceOf(Model);
  });
  it('first or create method creates new morph model', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    relation.getRelated().shouldReceive('newInstance').once()._with(['foo']).andReturn(model = m.mock(Model));
    model.shouldReceive('setAttribute').once()._with('morph_id', 1);
    model.shouldReceive('setAttribute').once()._with('morph_type', get_class(relation.getParent()));
    model.shouldReceive('save').once().andReturn(true);
    expect(relation.firstOrCreate(['foo'])).toInstanceOf(Model);
  });
  it('first or create method with values creates new morph model', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('where').once()._with({
      'foo': 'bar'
    }).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    relation.getRelated().shouldReceive('newInstance').once()._with({
      'foo': 'bar',
      'baz': 'qux'
    }).andReturn(model = m.mock(Model));
    model.shouldReceive('setAttribute').once()._with('morph_id', 1);
    model.shouldReceive('setAttribute').once()._with('morph_type', get_class(relation.getParent()));
    model.shouldReceive('save').once().andReturn(true);
    expect(relation.firstOrCreate({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toInstanceOf(Model);
  });
  it('update or create method finds first model and updates', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(Model));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('setAttribute').never();
    model.shouldReceive('fill').once()._with(['bar']);
    model.shouldReceive('save').once();
    expect(relation.updateOrCreate(['foo'], ['bar'])).toInstanceOf(Model);
  });
  it('update or create method creates new morph model', () => {
    var relation = this.getOneRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    relation.getRelated().shouldReceive('newInstance').once()._with(['foo']).andReturn(model = m.mock(Model));
    model.shouldReceive('setAttribute').once()._with('morph_id', 1);
    model.shouldReceive('setAttribute').once()._with('morph_type', get_class(relation.getParent()));
    model.shouldReceive('save').once().andReturn(true);
    model.shouldReceive('fill').once()._with(['bar']);
    expect(relation.updateOrCreate(['foo'], ['bar'])).toInstanceOf(Model);
  });
  it('create function on namespaced morph', () => {
    var relation = this.getNamespacedRelation('namespace');
    var created  = m.mock(Model);
    created.shouldReceive('setAttribute').once()._with('morph_id', 1);
    created.shouldReceive('setAttribute').once()._with('morph_type', 'namespace');
    relation.getRelated().shouldReceive('newInstance').once()._with({
      'name': 'taylor'
    }).andReturn(created);
    created.shouldReceive('save').once().andReturn(true);
    expect(relation.create({
      'name': 'taylor'
    })).toEqual(created);
  });
  it('get one relation', () => {
    var builder = m.mock(Builder);
    builder.shouldReceive('whereNotNull').once()._with('table.morph_id');
    builder.shouldReceive('where').once()._with('table.morph_id', '=', 1);
    var related = m.mock(Model);
    builder.shouldReceive('getModel').andReturn(related);
    var parent = m.mock(Model);
    parent.shouldReceive('getAttribute')._with('id').andReturn(1);
    parent.shouldReceive('getMorphClass').andReturn(get_class(parent));
    builder.shouldReceive('where').once()._with('table.morph_type', get_class(parent));
    return new MorphOne(builder, parent, 'table.morph_type', 'table.morph_id', 'id');
  });
  it('get many relation', () => {
    var builder = m.mock(Builder);
    builder.shouldReceive('whereNotNull').once()._with('table.morph_id');
    builder.shouldReceive('where').once()._with('table.morph_id', '=', 1);
    var related = m.mock(Model);
    builder.shouldReceive('getModel').andReturn(related);
    var parent = m.mock(Model);
    parent.shouldReceive('getAttribute')._with('id').andReturn(1);
    parent.shouldReceive('getMorphClass').andReturn(get_class(parent));
    builder.shouldReceive('where').once()._with('table.morph_type', get_class(parent));
    return new MorphMany(builder, parent, 'table.morph_type', 'table.morph_id', 'id');
  });
  it('get namespaced relation', () => {
    import Relation =
  .
    morphMap;
    ({});
    var builder = m.mock(Builder);
    builder.shouldReceive('whereNotNull').once()._with('table.morph_id');
    builder.shouldReceive('where').once()._with('table.morph_id', '=', 1);
    var related = m.mock(Model);
    builder.shouldReceive('getModel').andReturn(related);
    var parent = m.mock(EloquentModelNamespacedStub);
    parent.shouldReceive('getAttribute')._with('id').andReturn(1);
    parent.shouldReceive('getMorphClass').andReturn(alias);
    builder.shouldReceive('where').once()._with('table.morph_type', alias);
    return new MorphOne(builder, parent, 'table.morph_type', 'table.morph_id', 'id');
  });
});

export class EloquentMorphResetModelStub extends Model {
}
