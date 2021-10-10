import { isArray } from '@gradii/check-type';
import { Model } from '../../src/fedaco/model';
import { HasMany } from '../../src/fedaco/relations/has-many';
import { getBuilder } from './relation-testing-helper';

let builder, related;

function getRelation(): HasMany {
  builder = getBuilder();
  // builder.shouldReceive('whereNotNull')._with('table.foreign_key');
  // builder.shouldReceive('where')._with('table.foreign_key', '=', 1);
  related = new Model();
  jest.spyOn(builder, 'getModel').mockReturnValue(related);
  const parent = new Model();
  jest.spyOn(parent, 'getAttribute').mockReturnValue(1);
  jest.spyOn(parent, 'getCreatedAtColumn').mockReturnValue('created_at');
  jest.spyOn(parent, 'getUpdatedAtColumn').mockReturnValue('updated_at');
  return new HasMany(builder, parent, 'table.foreign_key', 'id');
}

function expectNewModel(relation, attributes) {
  const model = new Model();
  // relation.getRelated().shouldReceive('newInstance').with(attributes).andReturn(model);
  // model.expects(this.once()).method('setAttribute').with('foreign_key', 1);
  jest.spyOn(relation.getRelated(), 'newInstance').mockReturnValue(model);
  return model;
}

function expectCreatedModel(relation, attributes) {
  const model = expectNewModel(relation, attributes);
  // model.expects(this.once()).method('save');
  return model;
}

describe('test database eloquent has many', () => {
  it('find or new method finds model', async () => {
    const relation = getRelation();

    class dummy {
      setAttribute() {
      }
    }

    const model = new dummy();
    // @ts-ignore
    const spy1  = jest.spyOn(relation.getQuery(), 'find').mockReturnValue(model);
    const spy2  = jest.spyOn(model, 'setAttribute');
    expect(await relation.findOrNew('foo')).toBeInstanceOf(dummy);

    expect(spy1).toBeCalledWith('foo', ['*']);
    expect(spy2).not.toBeCalled();
  });

  it('find or new method returns new model with foreign key set', async () => {
    const relation = getRelation();

    class dummy {
      setAttribute() {
      }
    }

    const model = new dummy();
    const spy1  = jest.spyOn(relation.getQuery(), 'find').mockReturnValue(null);
    // @ts-ignore
    const spy2  = jest.spyOn(relation.getRelated(), 'newInstance').mockReturnValue(model);
    const spy3  = jest.spyOn(model, 'setAttribute');
    expect(await relation.findOrNew('foo')).toBeInstanceOf(Model);

    expect(spy1).toBeCalledWith('foo', ['*']);
    expect(spy3).toBeCalledWith('foreign_key', 1);
  });

  it('first or new method finds first model', async () => {
    const relation = getRelation();

    class dummy {
      setAttribute() {
      }
    }

    const model = new dummy();
    const spy1  = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    // @ts-ignore
    const spy2  = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(model);
    const spy3  = jest.spyOn(model, 'setAttribute');
    expect(await relation.firstOrNew(['foo'])).toBeInstanceOf(dummy);

    expect(spy1).toBeCalledWith('foo');
    expect(spy3).not.toBeCalled();
  });

  it('first or new method with values finds first model', async () => {
    const relation = getRelation();

    class dummy {
      setAttribute() {
      }
    }

    const model = new dummy();
    const spy1  = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    // @ts-ignore
    const spy2  = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(model);
    const spy22 = jest.spyOn(relation.getRelated(), 'newInstance');
    const spy3  = jest.spyOn(model, 'setAttribute');
    expect(await relation.firstOrNew({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toBeInstanceOf(dummy);

    expect(spy1).toBeCalledWith({
      'foo': 'bar'
    });
    expect(spy3).not.toBeCalled();
    expect(spy22).not.toBeCalled();
  });

  it('first or new method returns new model with foreign key set', () => {
    const relation = getRelation();
    const spy1     = jest.spyOn(relation, 'where').mockReturnValue(relation.getQuery());
    jest.spyOn(relation, 'first').mockReturnValue(null);
    const model = expectNewModel(relation, ['foo']);
    expect(relation.firstOrNew(['foo'])).toEqual(model);

    expect(spy1).toBeCalledWith('foo');
  });

  it('first or new method with values creates new model with foreign key set', () => {
    const relation = getRelation();
    const spy1     = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2     = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(null);
    const model    = expectNewModel(relation, {
      'foo': 'bar',
      'baz': 'qux'
    });
    expect(relation.firstOrNew({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toEqual(model);

    expect(spy1).toBeCalledWith({
      'foo': 'bar'
    });
    expect(spy2).toBeCalledWith();
  });

  it('first or create method finds first model', () => {
    const relation = getRelation();
    const spy1     = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());

    class dummy {
      setAttribute() {
      }

      save() {
      }
    }

    const model = new dummy();
    // @ts-ignore
    const spy2  = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(Promise.resolve(m));
    relation.getRelated().shouldReceive('newInstance').never();
    const spy3 = jest.spyOn(model, 'setAttribute');
    const spy4 = jest.spyOn(model, 'save');
    expect(relation.firstOrCreate(['foo'])).toBeInstanceOf(dummy);
    expect(spy1).toBeCalledWith(['foo']);

    expect(spy3).not.toBeCalled();
    expect(spy4).not.toBeCalled();
  });

  it('first or create method with values finds first model', () => {
    const relation = getRelation();
    const spy1     = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());

    const model = new Model();
    jest.spyOn(relation.getQuery(), 'first').mockReturnValue(Promise.resolve(model));
    const spy2 = jest.spyOn(relation.getRelated(), 'newInstance');
    relation.getRelated().shouldReceive('newInstance').never();

    const spy3 = jest.spyOn(model, 'setAttribute');
    const spy4 = jest.spyOn(model, 'save');
    expect(relation.firstOrCreate({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toBeInstanceOf(Model);
    expect(spy1).toBeCalledWith({
      'foo': 'bar'
    });
    expect(spy2).not.toBeCalled();
    expect(spy3).not.toBeCalled();
    expect(spy4).not.toBeCalled();
  });

  it('first or create method creates new model with foreign key set', () => {
    const relation = getRelation();
    jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    jest.spyOn(relation.getQuery(), 'first').mockReturnValue(null);
    // relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    // relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    const model = expectCreatedModel(relation, ['foo']);
    expect(relation.firstOrCreate(['foo'])).toEqual(model);
  });

  it('first or create method with values creates new model with foreign key set', () => {
    const relation = getRelation();
    // relation.getQuery().shouldReceive('where').once()._with({
    //   'foo': 'bar'
    // }).andReturn(relation.getQuery());
    const spy1 = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2 = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(null);

    // relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    const model = expectCreatedModel(relation, {
      'foo': 'bar',
      'baz': 'qux'
    });
    expect(relation.firstOrCreate({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toEqual(model);
  });

  it('update or create method finds first model and updates', () => {
    const relation = getRelation();

    const model = new Model();
    const spy1 = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2 = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(Promise.resolve(model));

    // relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    // relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(stdClass));
    relation.getRelated().shouldReceive('newInstance').never();
    jest.spyOn(model, 'fill');
    jest.spyOn(model, 'save');
    // model.shouldReceive('fill').once()._with(['bar']);
    // model.shouldReceive('save').once();
    expect(relation.updateOrCreate(['foo'], ['bar'])).toBeInstanceOf(Model);
  });

  it('update or create method creates new model with foreign key set', () => {
    const relation = getRelation();

    const model = new Model();
    const spy1 = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    const spy2 = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(null);
    const spy3 = jest.spyOn(relation.getRelated(), 'newInstance').mockReturnValue(model);

    // relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    // relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(stdClass));
    relation.getRelated().shouldReceive('newInstance').never();
    const spy4 = jest.spyOn(model, 'save').mockReturnValue(true);
    const spy5 = jest.spyOn(model, 'fill');
    const spy6 = jest.spyOn(model, 'setAttribute');
    // model.shouldReceive('fill').once()._with(['bar']);
    // model.shouldReceive('save').once();
    expect(relation.updateOrCreate(['foo'], ['bar'])).toBeInstanceOf(Model);

    expect(spy5).toBeCalledWith(['bar']);
    expect(spy6).toBeCalledWith('foreign_key', 1);
  });

  it('relation is properly initialized', () => {
    const relation = getRelation();
    const model    = new Model();
    const spy1 = jest.spyOn(model, 'setRelation');
    const models = relation.initRelation([model], 'foo');
    expect(models).toEqual([model]);
    expect(spy1).toBeCalledWith([model]);
  });

  it('eager constraints are properly added', () => {
    const relation = getRelation();

    const spy1 = jest.spyOn(relation.getParent(), 'getKeyName').mockReturnValue('id');
    const spy2 = jest.spyOn(relation.getParent(), 'getKeyType').mockReturnValue('int');
    const spy3 = jest.spyOn(relation.getQuery(), 'whereIntegerInRaw');

    // relation.getParent().shouldReceive('getKeyName').once().andReturn('id');
    // relation.getParent().shouldReceive('getKeyType').once().andReturn('int');
    // relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('table.foreign_key',
    //   [1, 2]);
    const model1 = new EloquentHasManyModelStub();
    model1.id    = 1;
    const model2 = new EloquentHasManyModelStub();
    model2.id    = 2;
    relation.addEagerConstraints([model1, model2]);
    expect(spy3).toBeCalledWith('table.foreign_key', [1, 2]);
  });

  it('eager constraints are properly added with string key', () => {
    const relation = getRelation();

    const spy1 = jest.spyOn(relation.getParent(), 'getKeyName').mockReturnValue('id');
    const spy2 = jest.spyOn(relation.getParent(), 'getKeyType').mockReturnValue('string');
    const spy3 = jest.spyOn(relation.getQuery(), 'whereIn');

    const model1 = new EloquentHasManyModelStub();
    model1.id    = 1;
    const model2 = new EloquentHasManyModelStub();
    model2.id    = 2;
    relation.addEagerConstraints([model1, model2]);

    expect(spy1).toBeCalled();
    expect(spy2).toBeCalled();
    expect(spy3).toBeCalledWith('table.foreign_key', [1, 2]);

  });

  it('models are properly matched to parents', () => {
    const relation      = getRelation();
    const result1       = new EloquentHasManyModelStub();
    result1.foreign_key = 1;
    const result2       = new EloquentHasManyModelStub();
    result2.foreign_key = 2;
    const result3       = new EloquentHasManyModelStub();
    result3.foreign_key = 2;
    const model1        = new EloquentHasManyModelStub();
    model1.id           = 1;
    const model2        = new EloquentHasManyModelStub();
    model2.id           = 2;
    const model3        = new EloquentHasManyModelStub();
    model3.id           = 3;
    relation.getRelated().shouldReceive('newCollection').andReturnUsing(array => {
      return array;
    });
    const models = relation.match([model1, model2, model3],
      [result1, result2, result3], 'foo');
    expect(models[0].foo[0].foreign_key).toEqual(1);
    expect(models[0].foo).toHaveLength(1);
    expect(models[1].foo[0].foreign_key).toEqual(2);
    expect(models[1].foo[1].foreign_key).toEqual(2);
    expect(models[1].foo).toHaveLength(2);
    expect(models[2].foo).toBeNull();
  });

  it('create many creates a related model for each record', () => {
    const records   = {
      'taylor': {
        'name': 'taylor'
      },
      'colin' : {
        'name': 'colin'
      }
    };
    const relation  = getRelation();
    const spy1      = jest.spyOn(relation.getRelated(), 'newCollection').mockReturnValue([]);
    const taylor    = expectCreatedModel(relation, {
      'name': 'taylor'
    });
    const colin     = expectCreatedModel(relation, {
      'name': 'colin'
    });
    const instances = relation.createMany(records);
    expect(isArray(instances)).toBeTruthy();
    expect(instances[0]).toEqual(taylor);
    expect(instances[1]).toEqual(colin);

    expect(spy1).toBeCalled();
  });
});

export class EloquentHasManyModelStub extends Model {
  public foreign_key: any = 'foreign.value';
}
