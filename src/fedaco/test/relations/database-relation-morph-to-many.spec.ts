import { Model } from '../../src/fedaco/model';


describe('test database eloquent morph to many', () => {
  it('eager constraints are properly added', () => {
    var relation = this.getRelation();
    relation.getParent().shouldReceive('getKeyName').andReturn('id');
    relation.getParent().shouldReceive('getKeyType').once().andReturn('int');
    relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('taggables.taggable_id', [1, 2]);
    relation.getQuery().shouldReceive('where').once()._with('taggables.taggable_type', get_class(relation.getParent()));
    var model1 = new EloquentMorphToManyModelStub();
    model1.id  = 1;
    var model2 = new EloquentMorphToManyModelStub();
    model2.id  = 2;
    relation.addEagerConstraints([model1, model2]);
  });
  it('attach inserts pivot table record', () => {
    var relation = this.getMockBuilder(MorphToMany).setMethods(['touchIfTouching']).setConstructorArgs(
      this.getRelationArguments()).getMock();
    var query    = m.mock(stdClass);
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
    var relation = this.getMockBuilder(MorphToMany).setMethods(['touchIfTouching']).setConstructorArgs(
      this.getRelationArguments()).getMock();
    var query    = m.mock(stdClass);
    query.shouldReceive('from').once()._with('taggables').andReturn(query);
    query.shouldReceive('where').once()._with('taggable_id', 1).andReturn(query);
    query.shouldReceive('where').once()._with('taggable_type', get_class(relation.getParent())).andReturn(query);
    query.shouldReceive('whereIn').once()._with('tag_id', [1, 2, 3]);
    query.shouldReceive('delete').once().andReturn(true);
    relation.getQuery().shouldReceive('getQuery').andReturn(mockQueryBuilder = m.mock(stdClass));
    mockQueryBuilder.shouldReceive('newQuery').once().andReturn(query);
    relation.expects(this.once()).method('touchIfTouching');
    expect(relation.detach([1, 2, 3])).toBeTruthy();
  });
  it('detach method clears all pivot records when no i ds are given', () => {
    var relation = this.getMockBuilder(MorphToMany).setMethods(['touchIfTouching']).setConstructorArgs(
      this.getRelationArguments()).getMock();
    var query    = m.mock(stdClass);
    query.shouldReceive('from').once()._with('taggables').andReturn(query);
    query.shouldReceive('where').once()._with('taggable_id', 1).andReturn(query);
    query.shouldReceive('where').once()._with('taggable_type', get_class(relation.getParent())).andReturn(query);
    query.shouldReceive('whereIn').never();
    query.shouldReceive('delete').once().andReturn(true);
    relation.getQuery().shouldReceive('getQuery').andReturn(mockQueryBuilder = m.mock(stdClass));
    mockQueryBuilder.shouldReceive('newQuery').once().andReturn(query);
    relation.expects(this.once()).method('touchIfTouching');
    expect(relation.detach()).toBeTruthy();
  });
  it('get relation', () => {
    const [builder, parent] = this.getRelationArguments();
    return new MorphToMany(builder, parent, 'taggable', 'taggables', 'taggable_id', 'tag_id', 'id', 'id');
  });
  it('get relation arguments', () => {
    var parent = m.mock(Model);
    parent.shouldReceive('getMorphClass').andReturn(get_class(parent));
    parent.shouldReceive('getKey').andReturn(1);
    parent.shouldReceive('getCreatedAtColumn').andReturn('created_at');
    parent.shouldReceive('getUpdatedAtColumn').andReturn('updated_at');
    parent.shouldReceive('getMorphClass').andReturn(get_class(parent));
    parent.shouldReceive('getAttribute')._with('id').andReturn(1);
    var builder = m.mock(Builder);
    var related = m.mock(Model);
    builder.shouldReceive('getModel').andReturn(related);
    related.shouldReceive('getTable').andReturn('tags');
    related.shouldReceive('getKeyName').andReturn('id');
    related.shouldReceive('getMorphClass').andReturn(get_class(related));
    builder.shouldReceive('join').once()._with('taggables', 'tags.id', '=', 'taggables.tag_id');
    builder.shouldReceive('where').once()._with('taggables.taggable_id', '=', 1);
    builder.shouldReceive('where').once()._with('taggables.taggable_type', get_class(parent));
    return [builder, parent, 'taggable', 'taggables', 'taggable_id', 'tag_id', 'id', 'id', 'relation_name', false];
  });
});

export class EloquentMorphToManyModelStub extends Model {
  _guarded: any = [];
}
