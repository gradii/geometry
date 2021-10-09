import { Model } from '../../src/fedaco/model';
import { Pivot } from '../../src/fedaco/relations/pivot';


describe('test database eloquent pivot', () => {

  it('properties are set correctly', () => {
    const parent = new Model();
    jest.spyOn(parent, 'getConnectionName').mockReturnValue('connection');

    parent.getConnection().getQueryGrammar().shouldReceive('getDateFormat').andReturn(
      'Y-m-d H:i:s');
    parent.setDateFormat('Y-m-d H:i:s');
    const pivot = Pivot.fromAttributes(parent, {
      'foo'       : 'bar',
      'created_at': '2015-09-12'
    }, 'table', true);
    expect(pivot.getAttributes()).toEqual({
      'foo'       : 'bar',
      'created_at': '2015-09-12 00:00:00'
    });
    expect(pivot.getConnectionName()).toBe('connection');
    expect(pivot.getTable()).toBe('table');
    expect(pivot.exists).toBeTruthy();
  });
  it('mutators are called from constructor', () => {
    const parent = new Model();
    jest.spyOn(parent, 'getConnectionName').mockReturnValue('connection');
    const pivot = DatabaseEloquentPivotTestMutatorStub.fromAttributes(parent, {
      'foo': 'bar'
    }, 'table', true);
    expect(pivot.getMutatorCalled()).toBeTruthy();
  });
  it('from raw attributes does not double mutate', () => {
    const parent = new Model();
    jest.spyOn(parent, 'getConnectionName').mockReturnValue('connection');
    const pivot = DatabaseEloquentPivotTestJsonCastStub.fromRawAttributes(parent, {
      'foo': JSON.stringify({
        'name': 'Taylor'
      })
    }, 'table', true);
    expect(pivot.foo).toEqual({
      'name': 'Taylor'
    });
  });
  it('from raw attributes does not mutate', () => {
    const parent = new Model();
    jest.spyOn(parent, 'getConnectionName').mockReturnValue('connection');
    const pivot = DatabaseEloquentPivotTestMutatorStub.fromRawAttributes(parent, {
      'foo': 'bar'
    }, 'table', true);
    expect(pivot.getMutatorCalled()).toBeFalsy();
  });
  it('properties unchanged are not dirty', () => {
    const parent = new Model();
    jest.spyOn(parent, 'getConnectionName').mockReturnValue('connection');
    const pivot = Pivot.fromAttributes(parent, {
      'foo'  : 'bar',
      'shimy': 'shake'
    }, 'table', true);
    expect(pivot.getDirty()).toEqual([]);
  });
  it('properties changed are dirty', () => {
    const parent = new Model();
    jest.spyOn(parent, 'getConnectionName').mockReturnValue('connection');
    const pivot = Pivot.fromAttributes(parent, {
      'foo'  : 'bar',
      'shimy': 'shake'
    }, 'table', true);
    pivot.shimy = 'changed';
    expect(pivot.getDirty()).toEqual({
      'shimy': 'changed'
    });
  });
  it('timestamp property is set if created at in attributes', () => {
    const parent = new Model();
    jest.spyOn(parent, 'getConnectionName').mockReturnValue('connection');
    jest.spyOn(parent, 'getDates').mockReturnValue([]);
    let pivot = DatabaseEloquentPivotTestDateStub.fromAttributes(parent, {
      'foo'       : 'bar',
      'created_at': 'foo'
    }, 'table');
    expect(pivot.timestamps).toBeTruthy();
    pivot = DatabaseEloquentPivotTestDateStub.fromAttributes(parent, {
      'foo': 'bar'
    }, 'table');
    expect(pivot.timestamps).toBeFalsy();
  });
  it('timestamp property is true when creating from raw attributes', () => {
    const parent = new Model();
    jest.spyOn(parent, 'getConnectionName').mockReturnValue('connection');
    jest.spyOn(parent, 'getDates').mockReturnValue([]);

    const pivot = Pivot.fromRawAttributes(parent, {
      'foo'       : 'bar',
      'created_at': 'foo'
    }, 'table');
    expect(pivot.timestamps).toBeTruthy();
  });
  it('keys can be set properly', () => {
    const parent = new Model();
    jest.spyOn(parent, 'getConnectionName').mockReturnValue('connection');
    const pivot = Pivot.fromAttributes(parent, {
      'foo': 'bar'
    }, 'table');
    pivot.setPivotKeys('foreign', 'other');
    expect(pivot.getForeignKey()).toBe('foreign');
    expect(pivot.getOtherKey()).toBe('other');
  });
  it('delete method deletes model by keys', () => {
    const pivot = new Pivot();
    const spy1  = jest.spyOn(pivot, 'newQueryWithoutRelationships');
    pivot.setPivotKeys('foreign', 'other');
    pivot.foreign = 'foreign.value';
    pivot.other   = 'other.value';
    const query   = {
      where(arg: any): any {
        throw new Error('not implement');
      },
      delete(): boolean {
        throw new Error('not implement');
      }
    };
    jest.spyOn(query, 'where').mockImplementationOnce((arg: any): any => {
      expect(arg).toEqual({
        'foreign': 'foreign.value',
        'other'  : 'other.value'
      });
    }).mockReturnValue(query);
    jest.spyOn(query, 'delete').mockReturnValue(true);

    expect(spy1).toReturnWith(query);
    const rowsAffected = pivot.delete();
    expect(rowsAffected).toEqual(1);
  });
  it('pivot model table name is singular', () => {
    const pivot = new Pivot();
    expect(pivot.getTable()).toBe('pivot');
  });
  it('pivot model with parent returns parents timestamp columns', () => {
    const parent = new Model();
    jest.spyOn(parent, 'getCreatedAtColumn').mockReturnValue('parent_created_at');
    jest.spyOn(parent, 'getUpdatedAtColumn').mockReturnValue('parent_updated_at');
    const pivotWithParent       = new Pivot();
    pivotWithParent.pivotParent = parent;
    expect(pivotWithParent.getCreatedAtColumn()).toBe('parent_created_at');
    expect(pivotWithParent.getUpdatedAtColumn()).toBe('parent_updated_at');
  });
  it('pivot model without parent returns model timestamp columns', () => {
    const model              = new DummyModel();
    const pivotWithoutParent = new Pivot();
    expect(pivotWithoutParent.getCreatedAtColumn()).toEqual(model.getCreatedAtColumn());
    expect(pivotWithoutParent.getUpdatedAtColumn()).toEqual(model.getUpdatedAtColumn());
  });
  it('without relations', () => {
    const original       = new Pivot();
    // @ts-ignore
    original.pivotParent = class foo {
    };
    original.setRelation('bar', 'baz');
    expect(original.getRelation('bar')).toBe('baz');
    let pivot = original.withoutRelations();
    expect(pivot).toBeInstanceOf(Pivot);
    expect(original).not.toBe(pivot);
    // expect(original.pivotParent).toBe('foo');
    expect(pivot.pivotParent).toBeNull();
    expect(original.relationLoaded('bar')).toBeTruthy();
    expect(pivot.relationLoaded('bar')).toBeFalsy();
    pivot = original.unsetRelations();
    expect(original).toEqual(pivot);
    expect(pivot.pivotParent).toBeNull();
    expect(pivot.relationLoaded('bar')).toBeFalsy();
  });
});

export class DatabaseEloquentPivotTestDateStub extends Pivot {
  public getDates() {
    return [];
  }
}

export class DatabaseEloquentPivotTestMutatorStub extends Pivot {
  private mutatorCalled: any = false;

  public setFooAttribute(value) {
    this.mutatorCalled = true;
    return value;
  }

  public getMutatorCalled() {
    return this.mutatorCalled;
  }
}

export class DatabaseEloquentPivotTestJsonCastStub extends Pivot {
  protected casts: any = {
    'foo': 'json'
  };
}

export class DummyModel extends Model {
}
