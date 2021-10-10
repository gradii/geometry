import { Model } from '../../src/fedaco/model';
import { MorphMany } from '../../src/fedaco/relations/morph-many';
import { MorphOne } from '../../src/fedaco/relations/morph-one';
import { getBuilder } from './relation-testing-helper';

let builder, related;

function getOneRelation() {
  builder = getBuilder();
  // builder.shouldReceive('whereNotNull').once().with('table.morph_id');
  // builder.shouldReceive('where').once().with('table.morph_id', '=', 1);
  related = new Model();
  builder.shouldReceive('getModel').andReturn(related);
  const parent = new Model();
  jest.spyOn(parent, 'getAttribute').mockReturnValue(1);
  jest.spyOn(parent, 'getMorphClass').mockReturnValue(parent);
  // jest.spyOn(builder, 'where').mockReturnValue(parent);
  // parent.shouldReceive('getAttribute').with('id').andReturn(1);
  // parent.shouldReceive('getMorphClass').andReturn(get_class(parent));
  // builder.shouldReceive('where').once().with('table.morph_type', get_class(parent));
  return new MorphOne(builder, parent, 'table.morph_type', 'table.morph_id', 'id');
}

function getManyRelation() {
  builder = getBuilder();
  // builder.shouldReceive('whereNotNull').once()._with('table.morph_id');
  // builder.shouldReceive('where').once()._with('table.morph_id', '=', 1);
  related = new Model();
  builder.shouldReceive('getModel').andReturn(related);
  const parent = new Model();
  // parent.shouldReceive('getAttribute')._with('id').andReturn(1);
  jest.spyOn(parent, 'getAttribute').mockReturnValue(1);
  // parent.shouldReceive('getMorphClass').andReturn(get_class(parent));
  // builder.shouldReceive('where').once()._with('table.morph_type', get_class(parent));
  return new MorphMany(builder, parent, 'table.morph_type', 'table.morph_id', 'id');
}

function getNamespacedRelation(alias) {
  // import Relation.morphMap({});
  builder = getBuilder();
  // builder.shouldReceive('whereNotNull').once()._with('table.morph_id');
  // builder.shouldReceive('where').once()._with('table.morph_id', '=', 1);
  related = new Model();

  jest.spyOn(builder, 'getModel').mockReturnValue(related);
  // builder.shouldReceive('getModel').andReturn(related);
  const parent = new EloquentModelNamespacedStub();
  jest.spyOn(parent, 'getAttribute').mockReturnValue(1);
  jest.spyOn(parent, 'getMorphClass').mockReturnValue(alias);
  jest.spyOn(builder, 'where').mockReturnValue(alias);
  // parent.shouldReceive('getAttribute')._with('id').andReturn(1);
  // parent.shouldReceive('getMorphClass').andReturn(alias);
  // builder.shouldReceive('where').once()._with('table.morph_type', alias);
  return new MorphOne(builder, parent, 'table.morph_type', 'table.morph_id', 'id');
}

describe('test database eloquent morph', () => {

  it('morph one eager constraints are properly added', () => {
    const relation = getOneRelation();

    jest.spyOn(relation.getParent(), 'getKeyName').mockReturnValue('id');
    jest.spyOn(relation.getParent(), 'getKeyType').mockReturnValue('string');
    jest.spyOn(relation.getQuery(), 'whereIn');
    jest.spyOn(relation.getQuery(), 'where');
    // relation.getParent().shouldReceive('getKeyName').once().andReturn('id');
    // relation.getParent().shouldReceive('getKeyType').once().andReturn('string');
    // relation.getQuery().shouldReceive('whereIn').once()._with('table.morph_id', [1, 2]);
    // relation.getQuery().shouldReceive('where').once()._with('table.morph_type',
    //   get_class(relation.getParent()));
    const model1 = new EloquentMorphResetModelStub();
    model1.id    = 1;
    const model2 = new EloquentMorphResetModelStub();
    model2.id    = 2;
    relation.addEagerConstraints([model1, model2]);
  });
  it('morph many eager constraints are properly added', () => {
    const relation = getManyRelation();

    jest.spyOn(relation.getParent(), 'getKeyName').mockReturnValue('id');
    jest.spyOn(relation.getParent(), 'getKeyType').mockReturnValue('int');
    jest.spyOn(relation.getParent(), 'whereIntegerInRaw');
    jest.spyOn(relation.getParent(), 'where');
    // relation.getParent().shouldReceive('getKeyName').once().andReturn('id');
    // relation.getParent().shouldReceive('getKeyType').once().andReturn('int');
    // relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('table.morph_id', [1, 2]);
    // relation.getQuery().shouldReceive('where').once()._with('table.morph_type',
    //   get_class(relation.getParent()));
    const model1 = new EloquentMorphResetModelStub();
    model1.id    = 1;
    const model2 = new EloquentMorphResetModelStub();
    model2.id    = 2;
    relation.addEagerConstraints([model1, model2]);
  });
  it('make function on morph', () => {
    // _SERVER['__eloquent.saved'] = false;
    const relation = getOneRelation();
    const instance = new Model();
    jest.spyOn(instance, 'setAttribute');
    // instance.shouldReceive('setAttribute').once()._with('morph_id', 1);
    // instance.shouldReceive('setAttribute').once()._with('morph_type',
    //   get_class(relation.getParent()));
    // instance.shouldReceive('save').never();
    jest.spyOn(relation.getRelated(), 'newInstance').mockReturnValue(instance);
    // relation.getRelated().shouldReceive('newInstance').once()._with({
    //   'name': 'taylor'
    // }).andReturn(instance);
    expect(relation.make({
      'name': 'taylor'
    })).toEqual(instance);
  });

  it('create function on morph', () => {
    const relation = getOneRelation();
    const created  = new Model();
    created.shouldReceive('setAttribute').once()._with('morph_id', 1);
    created.shouldReceive('setAttribute').once()._with('morph_type',
      get_class(relation.getParent()));
    relation.getRelated().shouldReceive('newInstance').once()._with({
      'name': 'taylor'
    }).andReturn(created);
    created.shouldReceive('save').once().andReturn(true);
    expect(relation.create({
      'name': 'taylor'
    })).toEqual(created);
  });

  it('find or new method finds model', () => {
    const relation = getOneRelation();
    const model    = new Model();
    jest.spyOn(relation.getQuery(), 'find').mockReturnValue(model);
    // relation.getQuery().shouldReceive('find').once()._with('foo', ['*']).andReturn(
    //   model = m.mock(Model));
    // relation.getRelated().shouldReceive('newInstance').never();
    jest.spyOn(relation.getRelated(), 'newInstance');
    model.shouldReceive('setAttribute').never();
    model.shouldReceive('save').never();
    expect(relation.findOrNew('foo')).toBeInstanceOf(Model);
  });

  it('find or new method returns new model with morph keys set', () => {
    const relation = getOneRelation();
    const model    = new Model();
    jest.spyOn(relation.getQuery(), 'find').mockReturnValue(null);
    // relation.getQuery().shouldReceive('find').once()._with('foo', ['*']).andReturn(
    //   model = m.mock(Model));
    // relation.getRelated().shouldReceive('newInstance').never();
    jest.spyOn(relation.getRelated(), 'newInstance').mockReturnValue(model);
    jest.spyOn(model, 'setAttribute');
    jest.spyOn(model, 'save');


    // const relation = getOneRelation();
    // relation.getQuery().shouldReceive('find').once()._with('foo', ['*']).andReturn(null);
    // relation.getRelated().shouldReceive('newInstance').once()._with().andReturn(
    //   model = m.mock(Model));
    // model.shouldReceive('setAttribute').once()._with('morph_id', 1);
    // model.shouldReceive('setAttribute').once()._with('morph_type', get_class(relation.getParent()));
    // model.shouldReceive('save').never();
    expect(relation.findOrNew('foo')).toBeInstanceOf(Model);
  });

  it('first or new method finds first model', () => {
    const relation = getOneRelation();
    const model    = new Model();

    const spy1 = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2 = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(Promise.resolve(model));
    const spy3 = jest.spyOn(relation.getRelated(), 'newInstance');

    const spy4 = jest.spyOn(model, 'setAttribute');
    const spy5 = jest.spyOn(model, 'save');

    // relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    // relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(Model));
    // relation.getRelated().shouldReceive('newInstance').never();
    // model.shouldReceive('setAttribute').never();
    // model.shouldReceive('save').never();

    expect(relation.firstOrNew(['foo'])).toBeInstanceOf(Model);

    expect(spy1).toBeCalledWith(['foo']);
    expect(spy2).toBeCalledWith();
    expect(spy3).not.toBeCalled();
    expect(spy4).not.toBeCalled();
    expect(spy5).not.toBeCalled();
  });

  it('first or new method with value finds first model', async () => {
    const relation = getOneRelation();
    const model    = new Model();

    const spy1 = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2 = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(Promise.resolve(model));
    const spy3 = jest.spyOn(relation.getRelated(), 'newInstance');

    const spy4 = jest.spyOn(model, 'setAttribute');
    const spy5 = jest.spyOn(model, 'save');

    // const relation = getOneRelation();
    // relation.getQuery().shouldReceive('where').once()._with({
    //   'foo': 'bar'
    // }).andReturn(relation.getQuery());
    // relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(Model));
    // relation.getRelated().shouldReceive('newInstance').never();
    // model.shouldReceive('setAttribute').never();
    // model.shouldReceive('save').never();

    expect(await relation.firstOrNew({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toBeInstanceOf(Model);

    expect(spy1).toBeCalledWith({'foo': 'bar'});
    expect(spy2).toBeCalledWith();
    expect(spy3).not.toBeCalled();
    expect(spy4).not.toBeCalled();
    expect(spy5).not.toBeCalled();
  });

  it('first or new method returns new model with morph keys set', async () => {
    const relation = getOneRelation();
    const model    = new Model();

    const spy1 = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2 = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(Promise.resolve(model));
    const spy3 = jest.spyOn(relation.getRelated(), 'newInstance');

    const spy4 = jest.spyOn(model, 'setAttribute');
    const spy5 = jest.spyOn(model, 'save');

    // const relation = getOneRelation();
    // relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    // relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    // relation.getRelated().shouldReceive('newInstance').once()._with(['foo']).andReturn(
    //   model = m.mock(Model));
    // model.shouldReceive('setAttribute').once()._with('morph_id', 1);
    // model.shouldReceive('setAttribute').once()._with('morph_type', get_class(relation.getParent()));
    // model.shouldReceive('save').never();

    expect(await relation.firstOrNew(['foo'])).toBeInstanceOf(Model);

    expect(spy1).toBeCalledWith(['foo']);
    expect(spy2).toBeCalledWith();
    expect(spy3).toBeCalledWith(['foo']);
    expect(spy4).toBeCalledWith('morph_id', 1);
    expect(spy5).toBeCalledWith('morph_type', relation.getParent().constructor);

  });
  it('first or new method with values returns new model with morph keys set', async () => {
    const relation = getOneRelation();
    const model    = new Model();

    const spy1 = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2 = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(Promise.resolve(model));
    const spy3 = jest.spyOn(relation.getRelated(), 'newInstance');

    const spy4 = jest.spyOn(model, 'setAttribute');
    const spy5 = jest.spyOn(model, 'save');

    expect(await relation.firstOrNew({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toBeInstanceOf(Model);

    expect(spy1).toBeCalledWith({'foo': 'bar'});
    expect(spy2).toBeCalledWith();
    expect(spy3).toBeCalledWith({
      'foo': 'bar',
      'baz': 'qux'
    });
    expect(spy4).toBeCalledWith('morph_id', 1);
    expect(spy4).toBeCalledWith('morph_type', relation.getParent().constructor);
    expect(spy5).not.toBeCalled();

  });
  it('first or create method finds first model', async () => {
    const relation = getOneRelation();
    const model    = new Model();

    const spy1 = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2 = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(Promise.resolve(model));
    const spy3 = jest.spyOn(relation.getRelated(), 'newInstance');

    const spy4 = jest.spyOn(model, 'setAttribute');
    const spy5 = jest.spyOn(model, 'save');

    expect(await relation.firstOrCreate(['foo'])).toBeInstanceOf(Model);

    expect(spy1).toBeCalledWith(['foo']);
    expect(spy2).toBeCalledWith();
    expect(spy3).not.toBeCalled();
    expect(spy4).not.toBeCalled();
    expect(spy5).not.toBeCalled();

  });
  it('first or create method with values finds first model', async () => {
    const relation = getOneRelation();
    const model    = new Model();

    const spy1 = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2 = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(Promise.resolve(model));
    const spy3 = jest.spyOn(relation.getRelated(), 'newInstance');

    const spy4 = jest.spyOn(model, 'setAttribute');
    const spy5 = jest.spyOn(model, 'save');

    expect(await relation.firstOrCreate({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toBeInstanceOf(Model);

    expect(spy1).toBeCalledWith({
      'foo': 'bar'
    });
    expect(spy2).toBeCalledWith();
    expect(spy3).not.toBeCalled();
    expect(spy4).not.toBeCalled();
    expect(spy5).not.toBeCalled();
  });
  it('first or create method creates new morph model', async () => {
    const relation = getOneRelation();
    const model    = new Model();

    const spy1 = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2 = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(Promise.resolve(null));
    const spy3 = jest.spyOn(relation.getRelated(), 'newInstance').mockReturnValue(model);

    const spy4 = jest.spyOn(model, 'setAttribute');
    const spy5 = jest.spyOn(model, 'save').mockReturnValue(true);

    expect(await relation.firstOrCreate(['foo'])).toBeInstanceOf(Model);

    expect(spy1).toBeCalledWith(['foo']);
    expect(spy2).toBeCalledWith();
    expect(spy3).toBeCalledWith(['foo']);
    expect(spy4).toBeCalledWith('morph_id', 1);
    expect(spy4).toBeCalledWith('morph_type', relation.getParent().constructor);
    expect(spy5).toBeCalled();
  });

  it('first or create method with values creates new morph model', async () => {
    const relation = getOneRelation();
    const model    = new Model();
    const spy1     = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2     = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(null);
    const spy3     = jest.spyOn(relation.getRelated(), 'newInstance').mockReturnValue(model);

    const spy4 = jest.spyOn(model, 'setAttribute');
    const spy5 = jest.spyOn(model, 'save').mockReturnValue(Promise.resolve(true));

    expect(await relation.firstOrCreate({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toBeInstanceOf(Model);

    expect(spy1).toBeCalledWith({'foo': 'bar'});
    expect(spy2).toBeCalledWith();
    expect(spy3).toBeCalledWith({
      'foo': 'bar',
      'baz': 'qux'
    });
    expect(spy4).toBeCalledWith('morph_id', 1);
    expect(spy4).toBeCalledWith('morph_type', relation.getParent().constructor);
    expect(spy5).toBeCalled();
  });

  it('update or create method finds first model and updates', () => {
    const relation = getOneRelation();

    const model = new Model();
    const spy1  = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2  = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(Promise.resolve(model));
    const spy3  = jest.spyOn(relation.getRelated(), 'newInstance');

    const spy4 = jest.spyOn(model, 'setAttribute');
    const spy5 = jest.spyOn(model, 'fill');
    const spy6 = jest.spyOn(model, 'save');

    expect(relation.updateOrCreate(['foo'], ['bar'])).toBeInstanceOf(Model);

    expect(spy1).toBeCalledWith(['foo']);
    expect(spy2).toBeCalledWith();
    expect(spy3).not.toBeCalled();
    expect(spy4).not.toBeCalled();
    expect(spy5).toBeCalledWith(['bar']);
    expect(spy6).toBeCalled();
  });

  it('update or create method creates new morph model', () => {
    const relation = getOneRelation();

    const model = new Model();
    const spy1  = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2  = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(null);
    const spy3  = jest.spyOn(relation.getRelated(), 'newInstance').mockReturnValue(model);

    const spy4 = jest.spyOn(model, 'setAttribute');
    const spy5 = jest.spyOn(model, 'save').mockReturnValue(true);
    const spy6 = jest.spyOn(model, 'fill');

    expect(relation.updateOrCreate(['foo'], ['bar'])).toBeInstanceOf(Model);

    expect(spy1).toBeCalledWith(['foo']);
    expect(spy2).toBeCalledWith();
    expect(spy3).toBeCalledWith(['foo']);
    expect(spy4).toBeCalledWith('morph_id', 1);
    expect(spy4).toBeCalledWith('morph_type', relation.getParent().constructor);
    expect(spy5).toBeCalled();
    expect(spy6).toBeCalledWith(['bar']);
  });

  it('create function on namespaced morph', async () => {
    const relation = getNamespacedRelation('namespace');
    const created  = new Model();

    const spy1 = jest.spyOn(created, 'setAttribute');
    const spy2 = jest.spyOn(relation.getRelated(), 'newInstance').mockReturnValue(created);
    const spy3 = jest.spyOn(relation.getRelated(), 'save').mockReturnValue(true);

    expect(await relation.create({
      'name': 'taylor'
    })).toEqual(created);

    expect(spy1).toBeCalledWith('morph_id', 1);
    expect(spy1).toBeCalledWith('morph_type', 'namespace');
    expect(spy2).toBeCalledWith({
      'name': 'taylor'
    });
    expect(spy3).toBeCalled();
  });

});

export class EloquentMorphResetModelStub extends Model {
}

class EloquentModelNamespacedStub extends Model {

}