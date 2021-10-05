import { FedacoBuilder } from '../../src/fedaco/fedaco-builder';
import { Model } from '../../src/fedaco/model';
import { BelongsTo } from '../../src/fedaco/relations/belongs-to';
import { QueryBuilder } from '../../src/query-builder/query-builder';

let builder, related;

function getBuilder() {
  return builder;
}

function getRelation() {
  builder = new FedacoBuilder(
    new QueryBuilder()
  );
  this.builder.shouldReceive('where')._with('relation.id', '=', 'foreign.value');
  related = Model;
  related.shouldReceive('getKeyType').andReturn(keyType);
  related.shouldReceive('getKeyName').andReturn('id');
  related.shouldReceive('getTable').andReturn('relation');
  this.builder.shouldReceive('getModel').andReturn(this.related);
  const parent = parent || new EloquentBelongsToModelStub();
  return new BelongsTo(builder, parent, 'foreign_key', 'id', 'relation');
}

describe('test database eloquent belongs to', () => {

  it('belongs to with default', () => {
    var relation = getRelation().withDefault();
    this.builder.shouldReceive('first').once().andReturnNull();
    var newModel = new EloquentBelongsToModelStub();
    this.related.shouldReceive('newInstance').once().andReturn(newModel);
    expect(relation.getResults()).toEqual(newModel);
  });
  it('belongs to with dynamic default', () => {
    var relation = getRelation().withDefault(newModel => {
      newModel.username = 'taylor';
    });
    this.builder.shouldReceive('first').once().andReturnNull();
    var newModel = new EloquentBelongsToModelStub();
    this.related.shouldReceive('newInstance').once().andReturn(newModel);
    expect(relation.getResults()).toEqual(newModel);
    expect(newModel.username).toBe('taylor');
  });
  it('belongs to with array default', () => {
    var relation = getRelation().withDefault({
      'username': 'taylor'
    });
    this.builder.shouldReceive('first').once().andReturnNull();
    var newModel = new EloquentBelongsToModelStub();
    this.related.shouldReceive('newInstance').once().andReturn(newModel);
    expect(relation.getResults()).toEqual(newModel);
    expect(newModel.username).toBe('taylor');
  });
  it('eager constraints are properly added', () => {
    var relation = getRelation();
    relation.getRelated().shouldReceive('getKeyName').andReturn('id');
    relation.getRelated().shouldReceive('getKeyType').andReturn('int');
    relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('relation.id',
      ['foreign.value', 'foreign.value.two']);
    var models = [
      new EloquentBelongsToModelStub(), new EloquentBelongsToModelStub(),
      new AnotherEloquentBelongsToModelStub()
    ];
    relation.addEagerConstraints(models);
  });
  it('ids in eager constraints can be zero', () => {
    var relation = getRelation();
    relation.getRelated().shouldReceive('getKeyName').andReturn('id');
    relation.getRelated().shouldReceive('getKeyType').andReturn('int');
    relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('relation.id',
      ['foreign.value', 0]);
    var models = [new EloquentBelongsToModelStub(), new EloquentBelongsToModelStubWithZeroId()];
    relation.addEagerConstraints(models);
  });
  it('relation is properly initialized', () => {
    var relation = getRelation();
    var model    = m.mock(Model);
    model.shouldReceive('setRelation').once()._with('foo', null);
    var models = relation.initRelation([model], 'foo');
    expect(models).toEqual([model]);
  });
  it('models are properly matched to parents', () => {
    var relation = getRelation();
    var result1  = m.mock(stdClass);
    result1.shouldReceive('getAttribute')._with('id').andReturn(1);
    var result2 = m.mock(stdClass);
    result2.shouldReceive('getAttribute')._with('id').andReturn(2);
    var model1         = new EloquentBelongsToModelStub();
    model1.foreign_key = 1;
    var model2         = new EloquentBelongsToModelStub();
    model2.foreign_key = 2;
    var models         = relation.match(
      [model1, model2],
      new Collection([result1, result2]),
      'foo');
    expect(models[0].foo.getAttribute('id')).toEqual(1);
    expect(models[1].foo.getAttribute('id')).toEqual(2);
  });
  it('associate method sets foreign key on model', () => {
    var parent = m.mock(Model);
    parent.shouldReceive('getAttribute').once()._with('foreign_key').andReturn('foreign.value');
    var relation  = this.getRelation(parent);
    var associate = m.mock(Model);
    associate.shouldReceive('getAttribute').once()._with('id').andReturn(1);
    parent.shouldReceive('setAttribute').once()._with('foreign_key', 1);
    parent.shouldReceive('setRelation').once()._with('relation', associate);
    relation.associate(associate);
  });
  it('dissociate method unsets foreign key on model', () => {
    var parent = m.mock(Model);
    parent.shouldReceive('getAttribute').once()._with('foreign_key').andReturn('foreign.value');
    var relation = this.getRelation(parent);
    parent.shouldReceive('setAttribute').once()._with('foreign_key', null);
    parent.shouldReceive('setRelation').once()._with('relation', null);
    relation.dissociate();
  });
  it('associate method sets foreign key on model by id', () => {
    var parent = m.mock(Model);
    parent.shouldReceive('getAttribute').once()._with('foreign_key').andReturn('foreign.value');
    var relation = this.getRelation(parent);
    parent.shouldReceive('setAttribute').once()._with('foreign_key', 1);
    parent.shouldReceive('isDirty').never();
    parent.shouldReceive('unsetRelation').once()._with(relation.getRelationName());
    relation.associate(1);
  });
  it('default eager constraints when incrementing', () => {
    var relation = getRelation();
    relation.getRelated().shouldReceive('getKeyName').andReturn('id');
    relation.getRelated().shouldReceive('getKeyType').andReturn('int');
    relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('relation.id',
      m.mustBe([]));
    var models = [new MissingEloquentBelongsToModelStub(), new MissingEloquentBelongsToModelStub()];
    relation.addEagerConstraints(models);
  });
  it('default eager constraints when incrementing and non int key type', () => {
    var relation = this.getRelation(null, 'string');
    relation.getQuery().shouldReceive('whereIn').once()._with('relation.id', m.mustBe([]));
    var models = [new MissingEloquentBelongsToModelStub(), new MissingEloquentBelongsToModelStub()];
    relation.addEagerConstraints(models);
  });
  it('default eager constraints when not incrementing', () => {
    var relation = getRelation();
    relation.getRelated().shouldReceive('getKeyName').andReturn('id');
    relation.getRelated().shouldReceive('getKeyType').andReturn('int');
    relation.getQuery().shouldReceive('whereIntegerInRaw').once()._with('relation.id',
      m.mustBe([]));
    var models = [new MissingEloquentBelongsToModelStub(), new MissingEloquentBelongsToModelStub()];
    relation.addEagerConstraints(models);
  });

});

export class EloquentBelongsToModelStub extends Model {
  public foreign_key: any = 'foreign.value';
}

export class AnotherEloquentBelongsToModelStub extends Model {
  public foreign_key: any = 'foreign.value.two';
}

export class EloquentBelongsToModelStubWithZeroId extends Model {
  public foreign_key: any = 0;
}

export class MissingEloquentBelongsToModelStub extends Model {
  public foreign_key: any;
}
