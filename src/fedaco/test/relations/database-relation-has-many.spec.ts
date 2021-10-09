import { isArray } from '@gradii/check-type';
import { Model } from '../../src/fedaco/model';
import { HasMany } from '../../src/fedaco/relations/has-many';
import { getBuilder } from './relation-testing-helper';

function getRelation(): HasMany {
  const builder = getBuilder();
  // builder.shouldReceive('whereNotNull')._with('table.foreign_key');
  // builder.shouldReceive('where')._with('table.foreign_key', '=', 1);
  const related = new Model();
  jest.spyOn(builder, 'getModel').mockReturnValue(related);
  const parent = new Model();
  jest.spyOn(parent, 'getAttribute').mockReturnValue(1);
  jest.spyOn(parent, 'getCreatedAtColumn').mockReturnValue('created_at');
  jest.spyOn(parent, 'getUpdatedAtColumn').mockReturnValue('updated_at');
  return new HasMany(builder, parent, 'table.foreign_key', 'id');
}

// function expectNewModel() {
//   const model = this.getMockBuilder(Model).setMethods(['setAttribute', 'save']).getMock();
//   relation.getRelated().shouldReceive('newInstance').with(attributes).andReturn(model);
//   model.expects(this.once()).method('setAttribute').with('foreign_key', 1);
//   return model;
// }
//
// function expectCreatedModel() {
//   const model = expectNewModel(relation, attributes);
//   model.expects(this.once()).method('save');
//   return model;
// }

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

  it('first or new method with values finds first model', async() => {
    const relation = getRelation();

    class dummy {
      setAttribute() {
      }
    }

    const model = new dummy();
    const spy1  = jest.spyOn(relation.getQuery(), 'where').mockReturnValue(relation.getQuery());
    // @ts-ignore
    const spy2  = jest.spyOn(relation.getQuery(), 'first').mockReturnValue(model);
    const spy22  = jest.spyOn(relation.getRelated(), 'newInstance')
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
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    const model = this.expectNewModel(relation, ['foo']);
    expect(relation.firstOrNew(['foo'])).toEqual(model);
  });
  it('first or new method with values creates new model with foreign key set', () => {
    const relation = getRelation();
    relation.getQuery().shouldReceive('where').once()._with({
      'foo': 'bar'
    }).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    const model = this.expectNewModel(relation, {
      'foo': 'bar',
      'baz': 'qux'
    });
    expect(relation.firstOrNew({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toEqual(model);
  });
  it('first or create method finds first model', () => {
    const relation = getRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(stdClass));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('setAttribute').never();
    model.shouldReceive('save').never();
    expect(relation.firstOrCreate(['foo'])).toInstanceOf(stdClass);
  });
  it('first or create method with values finds first model', () => {
    const relation = getRelation();
    relation.getQuery().shouldReceive('where').once()._with({
      'foo': 'bar'
    }).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(stdClass));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('setAttribute').never();
    model.shouldReceive('save').never();
    expect(relation.firstOrCreate({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toInstanceOf(stdClass);
  });
  it('first or create method creates new model with foreign key set', () => {
    const relation = getRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    const model = this.expectCreatedModel(relation, ['foo']);
    expect(relation.firstOrCreate(['foo'])).toEqual(model);
  });
  it('first or create method with values creates new model with foreign key set', () => {
    const relation = getRelation();
    relation.getQuery().shouldReceive('where').once()._with({
      'foo': 'bar'
    }).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    const model = this.expectCreatedModel(relation, {
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
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(stdClass));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('fill').once()._with(['bar']);
    model.shouldReceive('save').once();
    expect(relation.updateOrCreate(['foo'], ['bar'])).toInstanceOf(stdClass);
  });
  it('update or create method creates new model with foreign key set', () => {
    const relation = getRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    relation.getRelated().shouldReceive('newInstance').once()._with(['foo']).andReturn(
      model = m.mock(Model));
    model.shouldReceive('save').once().andReturn(true);
    model.shouldReceive('fill').once()._with(['bar']);
    model.shouldReceive('setAttribute').once()._with('foreign_key', 1);
    expect(relation.updateOrCreate(['foo'], ['bar'])).toInstanceOf(Model);
  });
  it('relation is properly initialized', () => {
    const relation = getRelation();
    const model    = m.mock(Model);
    relation.getRelated().shouldReceive('newCollection').andReturnUsing((array = []) => {
      return new Collection(array);
    });
    model.shouldReceive('setRelation').once()._with('foo', m.type(Collection));
    const models = relation.initRelation([model], 'foo');
    expect(models).toEqual([model]);
  });
  it('eager constraints are properly added', () => {
    const relation = getRelation();
    relation.getParent().shouldReceive('getKeyName').once().andReturn('id');
    relation.getParent().shouldReceive('getKeyType').once().andReturn('int');
    relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('table.foreign_key',
      [1, 2]);
    const model1 = new EloquentHasManyModelStub();
    model1.id    = 1;
    const model2 = new EloquentHasManyModelStub();
    model2.id    = 2;
    relation.addEagerConstraints([model1, model2]);
  });
  it('eager constraints are properly added with string key', () => {
    const relation = getRelation();
    relation.getParent().shouldReceive('getKeyName').once().andReturn('id');
    relation.getParent().shouldReceive('getKeyType').once().andReturn('string');
    relation.getQuery().shouldReceive('whereIn').once()._with('table.foreign_key', [1, 2]);
    const model1 = new EloquentHasManyModelStub();
    model1.id    = 1;
    const model2 = new EloquentHasManyModelStub();
    model2.id    = 2;
    relation.addEagerConstraints([model1, model2]);
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
      return new Collection(array);
    });
    const models = relation.match([model1, model2, model3],
      new Collection([result1, result2, result3]), 'foo');
    expect(models[0].foo[0].foreign_key).toEqual(1);
    expect(models[0].foo).toCount(1);
    expect(models[1].foo[0].foreign_key).toEqual(2);
    expect(models[1].foo[1].foreign_key).toEqual(2);
    expect(models[1].foo).toCount(2);
    expect(models[2].foo).toNull();
  });
  it('create many creates a related model for each record', () => {
    const records  = {
      'taylor': {
        'name': 'taylor'
      },
      'colin' : {
        'name': 'colin'
      }
    };
    const relation = getRelation();
    relation.getRelated().shouldReceive('newCollection').once().andReturn(new Collection());
    const taylor    = this.expectCreatedModel(relation, {
      'name': 'taylor'
    });
    const colin     = this.expectCreatedModel(relation, {
      'name': 'colin'
    });
    const instances = relation.createMany(records);
    expect(isArray(instances)).toBeTruthy();
    expect(instances[0]).toEqual(taylor);
    expect(instances[1]).toEqual(colin);
  });
});

export class EloquentHasManyModelStub extends Model {
  public foreign_key: any = 'foreign.value';
}
