import { Model } from '../../src/fedaco/model';
import { Pivot } from '../../src/fedaco/relations/pivot';


describe('test database eloquent pivot', () => {
  it('tear down', () => {
    m.close();
  });
  it('properties are set correctly', () => {
    var parent = m.mock(Model + '[getConnectionName]');
    parent.shouldReceive('getConnectionName').twice().andReturn('connection');
    parent.getConnection().getQueryGrammar().shouldReceive('getDateFormat').andReturn('Y-m-d H:i:s');
    parent.setDateFormat('Y-m-d H:i:s');
    var pivot = Pivot.fromAttributes(parent, {
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
    var parent = m.mock(Model + '[getConnectionName]');
    parent.shouldReceive('getConnectionName').once().andReturn('connection');
    var pivot = DatabaseEloquentPivotTestMutatorStub.fromAttributes(parent, {
      'foo': 'bar'
    }, 'table', true);
    expect(pivot.getMutatorCalled()).toBeTruthy();
  });
  it('from raw attributes does not double mutate', () => {
    var parent = m.mock(Model + '[getConnectionName]');
    parent.shouldReceive('getConnectionName').once().andReturn('connection');
    var pivot = DatabaseEloquentPivotTestJsonCastStub.fromRawAttributes(parent, {
      'foo': json_encode({
        'name': 'Taylor'
      })
    }, 'table', true);
    expect(pivot.foo).toEqual({
      'name': 'Taylor'
    });
  });
  it('from raw attributes does not mutate', () => {
    var parent = m.mock(Model + '[getConnectionName]');
    parent.shouldReceive('getConnectionName').once().andReturn('connection');
    var pivot = DatabaseEloquentPivotTestMutatorStub.fromRawAttributes(parent, {
      'foo': 'bar'
    }, 'table', true);
    expect(pivot.getMutatorCalled()).toFalse();
  });
  it('properties unchanged are not dirty', () => {
    var parent = m.mock(Model + '[getConnectionName]');
    parent.shouldReceive('getConnectionName').once().andReturn('connection');
    var pivot = Pivot.fromAttributes(parent, {
      'foo'  : 'bar',
      'shimy': 'shake'
    }, 'table', true);
    expect(pivot.getDirty()).toEqual([]);
  });
  it('properties changed are dirty', () => {
    var parent = m.mock(Model + '[getConnectionName]');
    parent.shouldReceive('getConnectionName').once().andReturn('connection');
    var pivot   = Pivot.fromAttributes(parent, {
      'foo'  : 'bar',
      'shimy': 'shake'
    }, 'table', true);
    pivot.shimy = 'changed';
    expect(pivot.getDirty()).toEqual({
      'shimy': 'changed'
    });
  });
  it('timestamp property is set if created at in attributes', () => {
    var parent = m.mock(Model + '[getConnectionName,getDates]');
    parent.shouldReceive('getConnectionName').andReturn('connection');
    parent.shouldReceive('getDates').andReturn([]);
    var pivot = DatabaseEloquentPivotTestDateStub.fromAttributes(parent, {
      'foo'       : 'bar',
      'created_at': 'foo'
    }, 'table');
    expect(pivot.timestamps).toBeTruthy();
    var pivot = DatabaseEloquentPivotTestDateStub.fromAttributes(parent, {
      'foo': 'bar'
    }, 'table');
    expect(pivot.timestamps).toFalse();
  });
  it('timestamp property is true when creating from raw attributes', () => {
    var parent = m.mock(Model + '[getConnectionName,getDates]');
    parent.shouldReceive('getConnectionName').andReturn('connection');
    var pivot = Pivot.fromRawAttributes(parent, {
      'foo'       : 'bar',
      'created_at': 'foo'
    }, 'table');
    expect(pivot.timestamps).toBeTruthy();
  });
  it('keys can be set properly', () => {
    var parent = m.mock(Model + '[getConnectionName]');
    parent.shouldReceive('getConnectionName').once().andReturn('connection');
    var pivot = Pivot.fromAttributes(parent, {
      'foo': 'bar'
    }, 'table');
    pivot.setPivotKeys('foreign', 'other');
    expect(pivot.getForeignKey()).toBe('foreign');
    expect(pivot.getOtherKey()).toBe('other');
  });
  it('delete method deletes model by keys', () => {
    var pivot = this.getMockBuilder(Pivot).setMethods(['newQueryWithoutRelationships']).getMock();
    pivot.setPivotKeys('foreign', 'other');
    pivot.foreign = 'foreign.value';
    pivot.other   = 'other.value';
    var query     = m.mock(stdClass);
    query.shouldReceive('where').once()._with({
      'foreign': 'foreign.value',
      'other'  : 'other.value'
    }).andReturn(query);
    query.shouldReceive('delete').once().andReturn(true);
    pivot.expects(this.once()).method('newQueryWithoutRelationships').willReturn(query);
    var rowsAffected = pivot.delete();
    expect(rowsAffected).toEqual(1);
  });
  it('pivot model table name is singular', () => {
    var pivot = new Pivot();
    expect(pivot.getTable()).toBe('pivot');
  });
  it('pivot model with parent returns parents timestamp columns', () => {
    var parent = m.mock(Model);
    parent.shouldReceive('getCreatedAtColumn').andReturn('parent_created_at');
    parent.shouldReceive('getUpdatedAtColumn').andReturn('parent_updated_at');
    var pivotWithParent         = new Pivot();
    pivotWithParent.pivotParent = parent;
    expect(pivotWithParent.getCreatedAtColumn()).toBe('parent_created_at');
    expect(pivotWithParent.getUpdatedAtColumn()).toBe('parent_updated_at');
  });
  it('pivot model without parent returns model timestamp columns', () => {
    var model              = new DummyModel();
    var pivotWithoutParent = new Pivot();
    expect(pivotWithoutParent.getCreatedAtColumn()).toEqual(model.getCreatedAtColumn());
    expect(pivotWithoutParent.getUpdatedAtColumn()).toEqual(model.getUpdatedAtColumn());
  });
  it('without relations', () => {
    var original         = new Pivot();
    original.pivotParent = 'foo';
    original.setRelation('bar', 'baz');
    expect(original.getRelation('bar')).toBe('baz');
    var pivot = original.withoutRelations();
    expect(pivot).toInstanceOf(Pivot);
    expect(original).toNotSame(pivot);
    expect(original.pivotParent).toBe('foo');
    expect(pivot.pivotParent).toNull();
    expect(original.relationLoaded('bar')).toBeTruthy();
    expect(pivot.relationLoaded('bar')).toFalse();
    var pivot = original.unsetRelations();
    expect(original).toEqual(pivot);
    expect(pivot.pivotParent).toNull();
    expect(pivot.relationLoaded('bar')).toFalse();
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
