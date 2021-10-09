import { isArray } from '@gradii/check-type';
import { Model } from '../../src/fedaco/model';

describe('test database eloquent has many', () => {

  it('make method does not save new model', () => {
    const relation = this.getRelation();
    const instance = this.expectNewModel(relation, {
      'name': 'taylor'
    });
    instance.expects(this.never()).method('save');
    expect(relation.make({
      'name': 'taylor'
    })).toEqual(instance);
  });
  it('make many creates a related model for each record', () => {
    const records  = {
      'taylor': {
        'name': 'taylor'
      },
      'colin' : {
        'name': 'colin'
      }
    };
    const relation = this.getRelation();
    relation.getRelated().shouldReceive('newCollection').once().andReturn(new Collection());
    const taylor = this.expectNewModel(relation, {
      'name': 'taylor'
    });
    taylor.expects(this.never()).method('save');
    const colin = this.expectNewModel(relation, {
      'name': 'colin'
    });
    colin.expects(this.never()).method('save');
    const instances = relation.makeMany(records);
    expect(instances).toInstanceOf(Collection);
    expect(instances[0]).toEqual(taylor);
    expect(instances[1]).toEqual(colin);
  });
  it('create method properly creates new model', () => {
    const relation = this.getRelation();
    const created  = this.expectCreatedModel(relation, {
      'name': 'taylor'
    });
    expect(relation.create({
      'name': 'taylor'
    })).toEqual(created);
  });
  it('find or new method finds model', () => {
    const relation = this.getRelation();
    relation.getQuery().shouldReceive('find').once()._with('foo', ['*']).andReturn(model = m.mock(stdClass));
    model.shouldReceive('setAttribute').never();
    expect(relation.findOrNew('foo')).toInstanceOf(stdClass);
  });
  it('find or new method returns new model with foreign key set', () => {
    const relation = this.getRelation();
    relation.getQuery().shouldReceive('find').once()._with('foo', ['*']).andReturn(null);
    relation.getRelated().shouldReceive('newInstance').once()._with().andReturn(model = m.mock(Model));
    model.shouldReceive('setAttribute').once()._with('foreign_key', 1);
    expect(relation.findOrNew('foo')).toInstanceOf(Model);
  });
  it('first or new method finds first model', () => {
    const relation = this.getRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(stdClass));
    model.shouldReceive('setAttribute').never();
    expect(relation.firstOrNew(['foo'])).toInstanceOf(stdClass);
  });
  it('first or new method with values finds first model', () => {
    const relation = this.getRelation();
    relation.getQuery().shouldReceive('where').once()._with({
      'foo': 'bar'
    }).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(stdClass));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('setAttribute').never();
    expect(relation.firstOrNew({
      'foo': 'bar'
    }, {
      'baz': 'qux'
    })).toInstanceOf(stdClass);
  });
  it('first or new method returns new model with foreign key set', () => {
    const relation = this.getRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    const model = this.expectNewModel(relation, ['foo']);
    expect(relation.firstOrNew(['foo'])).toEqual(model);
  });
  it('first or new method with values creates new model with foreign key set', () => {
    const relation = this.getRelation();
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
    const relation = this.getRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(stdClass));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('setAttribute').never();
    model.shouldReceive('save').never();
    expect(relation.firstOrCreate(['foo'])).toInstanceOf(stdClass);
  });
  it('first or create method with values finds first model', () => {
    const relation = this.getRelation();
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
    const relation = this.getRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    const model = this.expectCreatedModel(relation, ['foo']);
    expect(relation.firstOrCreate(['foo'])).toEqual(model);
  });
  it('first or create method with values creates new model with foreign key set', () => {
    const relation = this.getRelation();
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
    const relation = this.getRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(model = m.mock(stdClass));
    relation.getRelated().shouldReceive('newInstance').never();
    model.shouldReceive('fill').once()._with(['bar']);
    model.shouldReceive('save').once();
    expect(relation.updateOrCreate(['foo'], ['bar'])).toInstanceOf(stdClass);
  });
  it('update or create method creates new model with foreign key set', () => {
    const relation = this.getRelation();
    relation.getQuery().shouldReceive('where').once()._with(['foo']).andReturn(relation.getQuery());
    relation.getQuery().shouldReceive('first').once()._with().andReturn(null);
    relation.getRelated().shouldReceive('newInstance').once()._with(['foo']).andReturn(model = m.mock(Model));
    model.shouldReceive('save').once().andReturn(true);
    model.shouldReceive('fill').once()._with(['bar']);
    model.shouldReceive('setAttribute').once()._with('foreign_key', 1);
    expect(relation.updateOrCreate(['foo'], ['bar'])).toInstanceOf(Model);
  });
  it('relation is properly initialized', () => {
    const relation = this.getRelation();
    const model    = m.mock(Model);
    relation.getRelated().shouldReceive('newCollection').andReturnUsing((array = []) => {
      return new Collection(array);
    });
    model.shouldReceive('setRelation').once()._with('foo', m.type(Collection));
    const models = relation.initRelation([model], 'foo');
    expect(models).toEqual([model]);
  });
  it('eager constraints are properly added', () => {
    const relation = this.getRelation();
    relation.getParent().shouldReceive('getKeyName').once().andReturn('id');
    relation.getParent().shouldReceive('getKeyType').once().andReturn('int');
    relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('table.foreign_key', [1, 2]);
    const model1 = new EloquentHasManyModelStub();
    model1.id  = 1;
    const model2 = new EloquentHasManyModelStub();
    model2.id  = 2;
    relation.addEagerConstraints([model1, model2]);
  });
  it('eager constraints are properly added with string key', () => {
    const relation = this.getRelation();
    relation.getParent().shouldReceive('getKeyName').once().andReturn('id');
    relation.getParent().shouldReceive('getKeyType').once().andReturn('string');
    relation.getQuery().shouldReceive('whereIn').once()._with('table.foreign_key', [1, 2]);
    const model1 = new EloquentHasManyModelStub();
    model1.id  = 1;
    const model2 = new EloquentHasManyModelStub();
    model2.id  = 2;
    relation.addEagerConstraints([model1, model2]);
  });
  it('models are properly matched to parents', () => {
    const relation        = this.getRelation();
    const result1         = new EloquentHasManyModelStub();
    result1.foreign_key = 1;
    const result2         = new EloquentHasManyModelStub();
    result2.foreign_key = 2;
    const result3         = new EloquentHasManyModelStub();
    result3.foreign_key = 2;
    const model1          = new EloquentHasManyModelStub();
    model1.id           = 1;
    const model2          = new EloquentHasManyModelStub();
    model2.id           = 2;
    const model3          = new EloquentHasManyModelStub();
    model3.id           = 3;
    relation.getRelated().shouldReceive('newCollection').andReturnUsing(array => {
      return new Collection(array);
    });
    const models = relation.match([model1, model2, model3], new Collection([result1, result2, result3]), 'foo');
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
    const relation = this.getRelation();
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
  it('get relation', () => {
    const builder = m.mock(Builder);
    builder.shouldReceive('whereNotNull')._with('table.foreign_key');
    builder.shouldReceive('where')._with('table.foreign_key', '=', 1);
    const related = m.mock(Model);
    builder.shouldReceive('getModel').andReturn(related);
    const parent = m.mock(Model);
    parent.shouldReceive('getAttribute')._with('id').andReturn(1);
    parent.shouldReceive('getCreatedAtColumn').andReturn('created_at');
    parent.shouldReceive('getUpdatedAtColumn').andReturn('updated_at');
    return new HasMany(builder, parent, 'table.foreign_key', 'id');
  });
  it('expect new model', () => {
    const model = this.getMockBuilder(Model).setMethods(['setAttribute', 'save']).getMock();
    relation.getRelated().shouldReceive('newInstance')._with(attributes).andReturn(model);
    model.expects(this.once()).method('setAttribute')._with('foreign_key', 1);
    return model;
  });
  it('expect created model', () => {
    const model = this.expectNewModel(relation, attributes);
    model.expects(this.once()).method('save');
    return model;
  });
});

export class EloquentHasManyModelStub extends Model {
  public foreign_key: any = 'foreign.value';
}
