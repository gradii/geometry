import { Builder } from 'Illuminate/Database/Eloquent/Builder';
import { Model } from 'Illuminate/Database/Eloquent/Model';
import { MorphTo } from 'Illuminate/Database/Eloquent/Relations/MorphTo';

describe('test database eloquent morph to', () => {
  it('tear down', () => {
    m.close();
  });
  it('lookup dictionary is properly constructed', () => {
    var relation = this.getRelation();
    relation.addEagerConstraints([
      one = /*cast type object*/ {
        'morph_type' : 'morph_type_1',
        'foreign_key': 'foreign_key_1'
      }, two = /*cast type object*/ {
        'morph_type' : 'morph_type_1',
        'foreign_key': 'foreign_key_1'
      }, three = /*cast type object*/ {
        'morph_type' : 'morph_type_2',
        'foreign_key': 'foreign_key_2'
      }
    ]);
    var dictionary = relation.getDictionary();
    expect(dictionary).toEqual({
      'morph_type_1': {
        'foreign_key_1': [one, two]
      },
      'morph_type_2': {
        'foreign_key_2': [three]
      }
    });
  });
  it('morph to with default', () => {
    var relation = this.getRelation().withDefault();
    this.builder.shouldReceive('first').once().andReturnNull();
    var newModel = new EloquentMorphToModelStub();
    expect(relation.getResults()).toEqual(newModel);
  });
  it('morph to with dynamic default', () => {
    var relation = this.getRelation().withDefault(newModel => {
      newModel.username = 'taylor';
    });
    this.builder.shouldReceive('first').once().andReturnNull();
    var newModel      = new EloquentMorphToModelStub();
    newModel.username = 'taylor';
    var result        = relation.getResults();
    expect(result).toEqual(newModel);
    expect(result.username).toBe('taylor');
  });
  it('morph to with array default', () => {
    var relation = this.getRelation().withDefault({
      'username': 'taylor'
    });
    this.builder.shouldReceive('first').once().andReturnNull();
    var newModel      = new EloquentMorphToModelStub();
    newModel.username = 'taylor';
    var result        = relation.getResults();
    expect(result).toEqual(newModel);
    expect(result.username).toBe('taylor');
  });
  it('morph to with specified class default', () => {
    var parent           = new EloquentMorphToModelStub();
    parent.relation_type = EloquentMorphToRelatedStub;
    var relation         = parent.relation().withDefault();
    var newModel         = new EloquentMorphToRelatedStub();
    var result           = relation.getResults();
    expect(result).toEqual(newModel);
  });
  it('associate method sets foreign key and type on model', () => {
    var parent = m.mock(Model);
    parent.shouldReceive('getAttribute').once()._with('foreign_key').andReturn('foreign.value');
    var relation  = this.getRelationAssociate(parent);
    var associate = m.mock(Model);
    associate.shouldReceive('getKey').once().andReturn(1);
    associate.shouldReceive('getMorphClass').once().andReturn('Model');
    parent.shouldReceive('setAttribute').once()._with('foreign_key', 1);
    parent.shouldReceive('setAttribute').once()._with('morph_type', 'Model');
    parent.shouldReceive('setRelation').once()._with('relation', associate);
    relation.associate(associate);
  });
  it('associate method ignores null value', () => {
    var parent = m.mock(Model);
    parent.shouldReceive('getAttribute').once()._with('foreign_key').andReturn('foreign.value');
    var relation = this.getRelationAssociate(parent);
    parent.shouldReceive('setAttribute').once()._with('foreign_key', null);
    parent.shouldReceive('setAttribute').once()._with('morph_type', null);
    parent.shouldReceive('setRelation').once()._with('relation', null);
    relation.associate(null);
  });
  it('dissociate method deletes unsets key and type on model', () => {
    var parent = m.mock(Model);
    parent.shouldReceive('getAttribute').once()._with('foreign_key').andReturn('foreign.value');
    var relation = this.getRelation(parent);
    parent.shouldReceive('setAttribute').once()._with('foreign_key', null);
    parent.shouldReceive('setAttribute').once()._with('morph_type', null);
    parent.shouldReceive('setRelation').once()._with('relation', null);
    relation.dissociate();
  });
  it('get relation associate', () => {
    var builder = m.mock(Builder);
    builder.shouldReceive('where')._with('relation.id', '=', 'foreign.value');
    var related = m.mock(Model);
    related.shouldReceive('getKey').andReturn(1);
    related.shouldReceive('getTable').andReturn('relation');
    builder.shouldReceive('getModel').andReturn(related);
    return new MorphTo(builder, parent, 'foreign_key', 'id', 'morph_type', 'relation');
  });
  it('get relation', () => {
    this.builder = builder || m.mock(Builder);
    this.builder.shouldReceive('where')._with('relation.id', '=', 'foreign.value');
    this.related = m.mock(Model);
    this.related.shouldReceive('getKeyName').andReturn('id');
    this.related.shouldReceive('getTable').andReturn('relation');
    this.builder.shouldReceive('getModel').andReturn(this.related);
    var parent = parent || new EloquentMorphToModelStub();
    return m.mock(MorphTo + '[createModelByType]',
      [this.builder, parent, 'foreign_key', 'id', 'morph_type', 'relation']);
  });
});

export class EloquentMorphToModelStub extends Model {
  public foreign_key: any = 'foreign.value';
  public table: any       = 'eloquent_morph_to_model_stubs';

  public relation() {
    return this.morphTo();
  }
}

export class EloquentMorphToRelatedStub extends Model {
  public table: any = 'eloquent_morph_to_related_stubs';
}
