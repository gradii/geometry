import { MorphToColumn } from '../../src/annotation/relation-column/morph-to.relation-column';
import { Model } from '../../src/fedaco/model';
import { MorphTo } from '../../src/fedaco/relations/morph-to';
import { getBuilder } from './relation-testing-helper';

let builder;

function getRelation(parent?) {
  builder       = getBuilder();
  const related = new Model();
  jest.spyOn(related, 'getKeyName').mockReturnValue('id');
  jest.spyOn(related, 'getTable').mockReturnValue('relation');
  jest.spyOn(builder, 'getModel').mockReturnValue(related);
  parent = parent || new EloquentMorphToModelStub();
  return new MorphTo(builder, parent, 'foreign_key', 'id', 'morph_type', 'relation');
}

function getRelationAssociate(parent) {
  builder = getBuilder();

  const related = new Model();
  jest.spyOn(related, 'getKey').mockReturnValue(1);
  jest.spyOn(related, 'getTable').mockReturnValue('relation');
  jest.spyOn(builder, 'getModel').mockReturnValue(related);

  return new MorphTo(builder, parent, 'foreign_key', 'id', 'morph_type', 'relation');
}

describe('test database eloquent morph to', () => {

  it('lookup dictionary is properly constructed', () => {
    const relation = getRelation();
    const one      = {
      'morph_type' : 'morph_type_1',
      'foreign_key': 'foreign_key_1'
    };
    const two      = {
      'morph_type' : 'morph_type_1',
      'foreign_key': 'foreign_key_1'
    };
    const three    = {
      'morph_type' : 'morph_type_2',
      'foreign_key': 'foreign_key_2'
    };
    relation.addEagerConstraints([
      one,
      two,
      three
    ]);
    const dictionary = relation.getDictionary();
    expect(dictionary).toEqual({
      'morph_type_1': {
        'foreign_key_1': [one, two]
      },
      'morph_type_2': {
        'foreign_key_2': [three]
      }
    });
  });
  it('morph to with default', async () => {
    const relation = getRelation().withDefault();
    const spy1     = jest.spyOn(builder, 'first').mockReturnValue(null);
    const newModel = new EloquentMorphToModelStub();
    expect(await relation.getResults()).toEqual(newModel);
    expect(spy1).toBeCalled();
  });
  it('morph to with dynamic default', async () => {
    const relation    = getRelation().withDefault(newModel => {
      newModel.username = 'taylor';
    });
    const spy1        = jest.spyOn(builder, 'first').mockReturnValue(null);
    const newModel    = new EloquentMorphToModelStub();
    newModel.username = 'taylor';
    const result      = await relation.getResults();
    expect(result).toEqual(newModel);
    expect(result.username).toBe('taylor');
    expect(spy1).toBeCalled();
  });
  it('morph to with array default', async () => {
    const relation    = getRelation().withDefault({
      'username': 'taylor'
    });
    const spy1        = jest.spyOn(builder, 'first').mockReturnValue(null);
    const newModel    = new EloquentMorphToModelStub();
    newModel.username = 'taylor';
    const result      = await relation.getResults();
    expect(result).toEqual(newModel);
    expect(result.username).toBe('taylor');
    expect(spy1).toBeCalled();
  });
  it('morph to with specified class default', async () => {
    const parent         = new EloquentMorphToModelStub();
    parent.relation_type = EloquentMorphToRelatedStub;
    const relation       = parent.relation().withDefault();
    const newModel       = new EloquentMorphToRelatedStub();
    const result         = await relation.getResults();
    expect(result).toEqual(newModel);
  });
  it('associate method sets foreign key and type on model', async () => {
    const parent    = new Model();
    const spy1      = jest.spyOn(parent, 'getAttribute').mockReturnValue('foreign.value');
    const relation  = getRelationAssociate(parent);
    const associate = new Model();
    jest.spyOn(associate, 'getKey').mockReturnValue(1);
    jest.spyOn(associate, 'getMorphClass').mockReturnValue('Model');
    const spy2 = jest.spyOn(parent, 'setAttribute');

    await relation.associate(associate);

    expect(spy1).toBeCalledWith('foreign_key');
    expect(spy2).toBeCalledWith([
      ['foreign_key', 1],
      ['morph_type', 'Model'],
      ['relation', associate]
    ]);
  });
  it('associate method ignores null value', async () => {
    const parent   = new Model();
    const spy1     = jest.spyOn(parent, 'getAttribute').mockReturnValue('foreign.value');
    const relation = getRelationAssociate(parent);
    const spy2     = jest.spyOn(parent, 'setAttribute');
    await relation.associate(null);
    expect(spy2).toBeCalledWith([
      ['foreign_key', null],
      ['morph_type', null],
      ['relation', null]
    ]);
  });
  it('dissociate method deletes unsets key and type on model', async () => {
    const parent   = new Model();
    const spy1     = jest.spyOn(parent, 'getAttribute').mockReturnValue('foreign.value');
    const relation = getRelation(parent);
    const spy2     = jest.spyOn(parent, 'setAttribute');
    await relation.dissociate();
    expect(spy2).toBeCalledWith([
      ['foreign_key', null],
      ['morph_type', null],
      ['relation', null]
    ]);
  });
});

export class EloquentMorphToModelStub extends Model {
  public foreign_key: any = 'foreign.value';
  _table: any             = 'eloquent_morph_to_model_stubs';

  @MorphToColumn({
    morphTypeMap: {}
  })
  public relation;
}

export class EloquentMorphToRelatedStub extends Model {
  _table: any = 'eloquent_morph_to_related_stubs';
}
