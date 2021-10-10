import { FedacoBuilder } from '../../src/fedaco/fedaco-builder';
import { Model } from '../../src/fedaco/model';
import { MorphToMany } from '../../src/fedaco/relations/morph-to-many';
import { getBuilder } from './relation-testing-helper';

function getRelationArguments() {
  const parent = new Model();
  jest.spyOn(parent, 'getMorphClass').mockReturnValue(parent.constructor);
  jest.spyOn(parent, 'getKey').mockReturnValue(1);
  jest.spyOn(parent, 'getCreatedAtColumn').mockReturnValue('created_at');
  jest.spyOn(parent, 'getUpdatedAtColumn').mockReturnValue('updated_at');
  jest.spyOn(parent, 'getAttribute').mockReturnValue(1);

  const builder = getBuilder();
  const related = new Model();

  jest.spyOn(builder, 'getModel').mockReturnValue(related);
  jest.spyOn(related, 'getTable').mockReturnValue('tags');
  jest.spyOn(related, 'getKeyName').mockReturnValue('id');
  jest.spyOn(related, 'getMorphClass').mockReturnValue(related.constructor);

  return [
    builder, parent, 'taggable', 'taggables', 'taggable_id', 'tag_id', 'id', 'id', 'relation_name',
    false
  ];
}

function getRelation() {
  const [builder, parent] = getRelationArguments();
  return new MorphToMany(builder as FedacoBuilder, parent as Model, 'taggable', 'taggables', 'taggable_id', 'tag_id', 'id',
    'id');
}

describe('test database eloquent morph to many', () => {
  it('eager constraints are properly added', () => {
    const relation = getRelation();
    relation.getParent().shouldReceive('getKeyName').andReturn('id');
    relation.getParent().shouldReceive('getKeyType').once().andReturn('int');
    relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('taggables.taggable_id',
      [1, 2]);
    relation.getQuery().shouldReceive('where').once()._with('taggables.taggable_type',
      get_class(relation.getParent()));
    const model1 = new EloquentMorphToManyModelStub();
    model1.id  = 1;
    const model2 = new EloquentMorphToManyModelStub();
    model2.id  = 2;
    relation.addEagerConstraints([model1, model2]);
  });
  it('attach inserts pivot table record', () => {
    const args   = getRelationArguments();
    const relation = new MorphToMany(
      args[0] as FedacoBuilder, args[1] as Model, args[2],
      args[3], args[4], args[5],
      args[6], args[7], args[8],
    );
    const query    = {};
    query.shouldReceive('from').once()._with('taggables').andReturn(query);
    query.shouldReceive('insert').once()._with([
      {
        'taggable_id'  : 1,
        'taggable_type': get_class(relation.getParent()),
        'tag_id'       : 2,
        'foo'          : 'bar'
      }
    ]).andReturn(true);
    relation.getQuery().shouldReceive('getQuery').andReturn(mockQueryBuilder = m.mock(stdClass));
    mockQueryBuilder.shouldReceive('newQuery').once().andReturn(query);
    relation.expects(this.once()).method('touchIfTouching');
    relation.attach(2, {
      'foo': 'bar'
    });
  });
  it('detach removes pivot table record', () => {
    const relation = this.getMockBuilder(MorphToMany).setMethods(
      ['touchIfTouching']).setConstructorArgs(
      this.getRelationArguments()).getMock();
    const query    = m.mock(stdClass);
    query.shouldReceive('from').once()._with('taggables').andReturn(query);
    query.shouldReceive('where').once()._with('taggable_id', 1).andReturn(query);
    query.shouldReceive('where').once()._with('taggable_type',
      get_class(relation.getParent())).andReturn(query);
    query.shouldReceive('whereIn').once()._with('tag_id', [1, 2, 3]);
    query.shouldReceive('delete').once().andReturn(true);
    relation.getQuery().shouldReceive('getQuery').andReturn(mockQueryBuilder = m.mock(stdClass));
    mockQueryBuilder.shouldReceive('newQuery').once().andReturn(query);
    relation.expects(this.once()).method('touchIfTouching');
    expect(relation.detach([1, 2, 3])).toBeTruthy();
  });
  it('detach method clears all pivot records when no i ds are given', () => {
    const relation = this.getMockBuilder(MorphToMany).setMethods(
      ['touchIfTouching']).setConstructorArgs(
      this.getRelationArguments()).getMock();
    const query    = m.mock(stdClass);
    query.shouldReceive('from').once()._with('taggables').andReturn(query);
    query.shouldReceive('where').once()._with('taggable_id', 1).andReturn(query);
    query.shouldReceive('where').once()._with('taggable_type',
      get_class(relation.getParent())).andReturn(query);
    query.shouldReceive('whereIn').never();
    query.shouldReceive('delete').once().andReturn(true);
    relation.getQuery().shouldReceive('getQuery').andReturn(mockQueryBuilder = m.mock(stdClass));
    mockQueryBuilder.shouldReceive('newQuery').once().andReturn(query);
    relation.expects(this.once()).method('touchIfTouching');
    expect(relation.detach()).toBeTruthy();
  });


});

export class EloquentMorphToManyModelStub extends Model {
  _guarded: any = [];
}
