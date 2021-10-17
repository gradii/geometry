import { FedacoBuilder } from '../../src/fedaco/fedaco-builder';
import { Model } from '../../src/fedaco/model';
import { HasOne } from '../../src/fedaco/relations/has-one';
import { getBuilder } from './relation-testing-helper';

let builder: FedacoBuilder, related;

function getRelation() {
  builder = getBuilder();
  // this.builder.shouldReceive('whereNotNull')._with('table.foreign_key');
  // this.builder.shouldReceive('where')._with('table.foreign_key', '=', 1);
  related = new Model();
  jest.spyOn(builder, 'getModel').mockReturnValue(related);
  const parent = new Model();
  jest.spyOn(parent, 'getAttribute').mockReturnValueOnce(1);
  jest.spyOn(parent, 'getAttribute').mockReturnValue('taylor');
  jest.spyOn(parent, 'getCreatedAtColumn').mockReturnValue('created_at');
  jest.spyOn(parent, 'getUpdatedAtColumn').mockReturnValue('updated_at');
  jest.spyOn(parent, 'newQueryWithoutScopes').mockReturnValue(builder);

  return new HasOne(builder, parent, 'table.foreign_key', 'id');
}

describe('test database eloquent has one', () => {

  it('has one with default', () => {
    const relation = getRelation().withDefault();
    builder.shouldReceive('first').once().andReturnNull();
    const newModel = new EloquentHasOneModelStub();
    related.shouldReceive('newInstance').once().andReturn(newModel);
    expect(relation.getResults()).toEqual(newModel);
    expect(newModel.getAttribute('foreign_key')).toEqual(1);
  });
  it('has one with dynamic default', () => {
    const relation = getRelation().withDefault(newModel => {
      newModel.username = 'taylor';
    });
    builder.shouldReceive('first').once().andReturnNull();
    const newModel = new EloquentHasOneModelStub();
    related.shouldReceive('newInstance').once().andReturn(newModel);
    expect(relation.getResults()).toEqual(newModel);
    expect(newModel.username).toBe('taylor');
    expect(newModel.getAttribute('foreign_key')).toEqual(1);
  });
  it('has one with dynamic default use parent model', () => {
    const relation = getRelation().withDefault((newModel, parentModel) => {
      newModel.username = parentModel.username;
    });
    jest.spyOn(builder, 'first').mockReturnValue(null);
    // this.builder.shouldReceive('first').once().andReturnNull();
    const newModel = new EloquentHasOneModelStub();
    // this.related.shouldReceive('newInstance').once().andReturn(newModel);
    jest.spyOn(related, 'newInstance').mockReturnValue(newModel);
    expect(relation.getResults()).toEqual(newModel);
    expect(newModel.username).toBe('taylor');
    expect(newModel.getAttribute('foreign_key')).toEqual(1);
  });
  it('has one with array default', () => {
    const attributes = {
      'username': 'taylor'
    };
    const relation   = getRelation().withDefault(attributes);
    // builder.shouldReceive('first').once().andReturnNull();
    jest.spyOn(builder, 'first').mockReturnValue(null);
    const newModel = new EloquentHasOneModelStub();
    // this.related.shouldReceive('newInstance').once().andReturn(newModel);
    jest.spyOn(related, 'newInstance').mockReturnValue(newModel);
    expect(relation.getResults()).toEqual(newModel);
    expect(newModel.username).toBe('taylor');
    expect(newModel.getAttribute('foreign_key')).toEqual(1);
  });
  it('make method does not save new model', () => {
    const relation = getRelation();
    const instance = new Model();
    jest.spyOn(instance.getRelated(), 'newInstance').mockReturnValue(instance);
    // relation.getRelated().shouldReceive('newInstance')._with({
    //   'name': 'taylor'
    // }).andReturn(instance);
    // instance.expects(this.once()).method('setAttribute')._with('foreign_key', 1);
    // instance.expects(this.never()).method('save');
    expect(relation.make({
      'name': 'taylor'
    })).toEqual(instance);
  });

  it('save method sets foreign key on model', async () => {
    const relation  = getRelation();
    const mockModel = new Model();
    // mockModel.expects(this.once()).method('save').willReturn(true);
    jest.spyOn(mockModel, 'save').mockReturnValue(Promise.resolve(true));
    // @ts-ignore
    const result: Model = await relation.save(mockModel);
    const attributes    = result.getAttributes();
    expect(attributes['foreign_key']).toEqual(1);
  });

  it('create method properly creates new model', () => {
    const relation = getRelation();
    const created  = new Model();
    jest.spyOn(created, 'save').mockReturnValue(Promise.resolve(true));
    // created.expects(this.once()).method('save').willReturn(true);
    // relation.getRelated().shouldReceive('newInstance').once()._with({
    //   'name': 'taylor'
    // }).andReturn(created);
    jest.spyOn(relation.getRelated(), 'newInstance').mockReturnValue(created);
    // created.expects(this.once()).method('setAttribute')._with('foreign_key', 1);
    expect(relation.create({
      'name': 'taylor'
    })).toEqual(created);
  });

  it('relation is properly initialized', () => {
    const relation = getRelation();
    const model    = new Model();
    model.shouldReceive('setRelation').once()._with('foo', null);
    const models = relation.initRelation([model], 'foo');
    expect(models).toEqual([model]);
  });

  it('eager constraints are properly added', () => {
    const relation = getRelation();
    jest.spyOn(relation.getParent(), 'getKeyName').mockReturnValue('id');
    jest.spyOn(relation.getParent(), 'getKeyType').mockReturnValue('int');
    jest.spyOn(relation.getQuery(), 'whereIntegerInRaw');

    // relation.getParent().shouldReceive('getKeyName').once().andReturn('id');
    // relation.getParent().shouldReceive('getKeyType').once().andReturn('int');
    // relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('table.foreign_key', [1, 2]);

    const model1 = new EloquentHasOneModelStub();
    model1.id    = 1;
    const model2 = new EloquentHasOneModelStub();
    model2.id    = 2;
    relation.addEagerConstraints([model1, model2]);
  });

  it('models are properly matched to parents', () => {
    const relation      = getRelation();
    const result1       = new EloquentHasOneModelStub();
    result1.foreign_key = 1;
    const result2       = new EloquentHasOneModelStub();
    result2.foreign_key = 2;
    const model1        = new EloquentHasOneModelStub();
    model1.id           = 1;
    const model2        = new EloquentHasOneModelStub();
    model2.id           = 2;
    const model3        = new EloquentHasOneModelStub();
    model3.id           = 3;
    const models        = relation.match([model1, model2, model3], [result1, result2], 'foo');
    expect(models[0].foo.foreign_key).toEqual(1);
    expect(models[1].foo.foreign_key).toEqual(2);
    expect(models[2].foo).toBeNull();
  });
  // it('relation count query can be built', () => {
  //   const relation     = getRelation();
  //   const builder      = getBuilder();
  //   const baseQuery    = m.mock(BaseBuilder);
  //   baseQuery.from   = 'one';
  //   const parentQuery  = m.mock(BaseBuilder);
  //   parentQuery.from = 'two';
  //   jest.spyOn(builder, 'getQuery').mockReturnValueOnce(baseQuery);
  //   jest.spyOn(builder, 'getQuery').mockReturnValueOnce(parentQuery);
  //   // builder.shouldReceive('getQuery').once().andReturn(baseQuery);
  //   // builder.shouldReceive('getQuery').once().andReturn(parentQuery);
  //   // builder.shouldReceive('select').once()._with(m.type(Expression)).andReturnSelf();
  //   relation.getParent().shouldReceive('qualifyColumn').andReturn('table.id');
  //   builder.shouldReceive('whereColumn').once()._with('table.id', '=', 'table.foreign_key').andReturn(baseQuery);
  //   baseQuery.shouldReceive('setBindings').once()._with([], 'select');
  //   relation.getRelationExistenceCountQuery(builder, builder);
  // });
});

export class EloquentHasOneModelStub extends Model {
  public foreign_key: any = 'foreign.value';
}
