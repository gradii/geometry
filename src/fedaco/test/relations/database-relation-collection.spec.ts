import { Builder } from 'Illuminate/Database/Eloquent/Builder';
import { Collection } from 'Illuminate/Database/Eloquent/Collection';
import { Model } from 'Illuminate/Database/Eloquent/Model';
import { Collection as BaseCollection } from 'Illuminate/Support/Collection';
import { LogicException } from 'LogicException';
import { Mockery as m } from 'Mockery';
import { stdClass } from 'stdClass';

describe('test database eloquent collection', () => {
  it('tear down', () => {
    m.close();
  });
  it('adding items to collection', () => {
    var c = new Collection(['foo']);
    c.add('bar').add('baz');
    expect(c.all()).toEqual(['foo', 'bar', 'baz']);
  });
  it('getting max items from collection', () => {
    var c = new Collection([/*cast type object*/ {
      'foo': 10
    }, /*cast type object*/ {
      'foo': 20
    }
    ]);
    expect(c.max('foo')).toEqual(20);
  });
  it('getting min items from collection', () => {
    var c = new Collection([/*cast type object*/ {
      'foo': 10
    }, /*cast type object*/ {
      'foo': 20
    }
    ]);
    expect(c.min('foo')).toEqual(10);
  });
  it('contains with multiple arguments', () => {
    var c = new Collection([
      {
        'id': 1
      }, {
        'id': 2
      }
    ]);
    expect(c.contains('id', 1)).toBeTruthy();
    expect(c.contains('id', '>=', 2)).toBeTruthy();
    expect(c.contains('id', '>', 2)).toBeFalsy();
  });
  it('contains indicates if model in array', () => {
    var mockModel = m.mock(Model);
    mockModel.shouldReceive('is')._with(mockModel).andReturn(true);
    mockModel.shouldReceive('is').andReturn(false);
    var mockModel2 = m.mock(Model);
    mockModel2.shouldReceive('is')._with(mockModel2).andReturn(true);
    mockModel2.shouldReceive('is').andReturn(false);
    var mockModel3 = m.mock(Model);
    mockModel3.shouldReceive('is')._with(mockModel3).andReturn(true);
    mockModel3.shouldReceive('is').andReturn(false);
    var c = new Collection([mockModel, mockModel2]);
    expect(c.contains(mockModel)).toBeTruthy();
    expect(c.contains(mockModel2)).toBeTruthy();
    expect(c.contains(mockModel3)).toFalse();
  });
  it('contains indicates if different model in array', () => {
    var mockModelFoo = m.namedMock('Foo', Model);
    mockModelFoo.shouldReceive('is')._with(mockModelFoo).andReturn(true);
    mockModelFoo.shouldReceive('is').andReturn(false);
    var mockModelBar = m.namedMock('Bar', Model);
    mockModelBar.shouldReceive('is')._with(mockModelBar).andReturn(true);
    mockModelBar.shouldReceive('is').andReturn(false);
    var c = new Collection([mockModelFoo]);
    expect(c.contains(mockModelFoo)).toBeTruthy();
    expect(c.contains(mockModelBar)).toFalse();
  });
  it('contains indicates if keyed model in array', () => {
    var mockModel = m.mock(Model);
    mockModel.shouldReceive('getKey').andReturn('1');
    var c          = new Collection([mockModel]);
    var mockModel2 = m.mock(Model);
    mockModel2.shouldReceive('getKey').andReturn('2');
    c.add(mockModel2);
    expect(c.contains(1)).toBeTruthy();
    expect(c.contains(2)).toBeTruthy();
    expect(c.contains(3)).toFalse();
  });
  it('contains key and value indicates if model in array', () => {
    var mockModel1 = m.mock(Model);
    mockModel1.shouldReceive('offsetExists')._with('name').andReturn(true);
    mockModel1.shouldReceive('offsetGet')._with('name').andReturn('Taylor');
    var mockModel2 = m.mock(Model);
    mockModel2.shouldReceive('offsetExists').andReturn(true);
    mockModel2.shouldReceive('offsetGet')._with('name').andReturn('Abigail');
    var c = new Collection([mockModel1, mockModel2]);
    expect(c.contains('name', 'Taylor')).toBeTruthy();
    expect(c.contains('name', 'Abigail')).toBeTruthy();
    expect(c.contains('name', 'Dayle')).toFalse();
  });
  it('contains closure indicates if model in array', () => {
    var mockModel1 = m.mock(Model);
    mockModel1.shouldReceive('getKey').andReturn(1);
    var mockModel2 = m.mock(Model);
    mockModel2.shouldReceive('getKey').andReturn(2);
    var c = new Collection([mockModel1, mockModel2]);
    expect(c.contains(model => {
      return model.getKey() < 2;
    })).toBeTruthy();
    expect(c.contains(model => {
      return model.getKey() > 2;
    })).toFalse();
  });
  it('find method finds model by id', () => {
    var mockModel = m.mock(Model);
    mockModel.shouldReceive('getKey').andReturn(1);
    var c = new Collection([mockModel]);
    expect(c.find(1)).toEqual(mockModel);
    expect(c.find(2, 'taylor')).toBe('taylor');
  });
  it('find method finds many models by id', () => {
    var model1 = new TestEloquentCollectionModel().forceFill({
      'id': 1
    });
    var model2 = new TestEloquentCollectionModel().forceFill({
      'id': 2
    });
    var model3 = new TestEloquentCollectionModel().forceFill({
      'id': 3
    });
    var c      = new Collection();
    expect(c.find([])).toInstanceOf(Collection);
    expect(c.find([1])).toCount(0);
    c.push(model1);
    expect(c.find([1])).toCount(1);
    expect(c.find([1]).first().id).toEqual(1);
    expect(c.find([2])).toCount(0);
    c.push(model2).push(model3);
    expect(c.find([2])).toCount(1);
    expect(c.find([2]).first().id).toEqual(2);
    expect(c.find([2, 3, 4])).toCount(2);
    expect(c.find(collect([2, 3, 4]))).toCount(2);
    expect(c.find(collect([2, 3, 4])).pluck('id').all()).toEqual([2, 3]);
    expect(c.find([2, 3, 4]).pluck('id').all()).toEqual([2, 3]);
  });
  it('load method eager loads given relationships', () => {
    var c        = this.getMockBuilder(Collection).setMethods(['first']).setConstructorArgs([['foo']]).getMock();
    var mockItem = m.mock(stdClass);
    c.expects(this.once()).method('first').willReturn(mockItem);
    mockItem.shouldReceive('newQueryWithoutRelationships').once().andReturn(mockItem);
    mockItem.shouldReceive('with')._with(['bar', 'baz']).andReturn(mockItem);
    mockItem.shouldReceive('eagerLoadRelations').once()._with(['foo']).andReturn(['results']);
    c.load('bar', 'baz');
    expect(c.all()).toEqual(['results']);
  });
  it('collection dictionary returns model keys', () => {
    var one = m.mock(Model);
    one.shouldReceive('getKey').andReturn(1);
    var two = m.mock(Model);
    two.shouldReceive('getKey').andReturn(2);
    var three = m.mock(Model);
    three.shouldReceive('getKey').andReturn(3);
    var c = new Collection([one, two, three]);
    expect(c.modelKeys()).toEqual([1, 2, 3]);
  });
  it('collection merges with given collection', () => {
    var one = m.mock(Model);
    one.shouldReceive('getKey').andReturn(1);
    var two = m.mock(Model);
    two.shouldReceive('getKey').andReturn(2);
    var three = m.mock(Model);
    three.shouldReceive('getKey').andReturn(3);
    var c1 = new Collection([one, two]);
    var c2 = new Collection([two, three]);
    expect(c1.merge(c2)).toEqual(new Collection([one, two, three]));
  });
  it('map', () => {
    var one       = m.mock(Model);
    var two       = m.mock(Model);
    var c         = new Collection([one, two]);
    var cAfterMap = c.map(item => {
      return item;
    });
    expect(cAfterMap.all()).toEqual(c.all());
    expect(cAfterMap).toInstanceOf(Collection);
  });
  it('mapping to non models returns a base collection', () => {
    var one = m.mock(Model);
    var two = m.mock(Model);
    var c   = new Collection([one, two]).map(item => {
      return 'not-a-model';
    });
    expect(get_class(c)).toEqual(BaseCollection);
  });
  it('collection diffs with given collection', () => {
    var one = m.mock(Model);
    one.shouldReceive('getKey').andReturn(1);
    var two = m.mock(Model);
    two.shouldReceive('getKey').andReturn(2);
    var three = m.mock(Model);
    three.shouldReceive('getKey').andReturn(3);
    var c1 = new Collection([one, two]);
    var c2 = new Collection([two, three]);
    expect(c1.diff(c2)).toEqual(new Collection([one]));
  });
  it('collection returns duplicate based only on keys', () => {
    var one             = new TestEloquentCollectionModel();
    var two             = new TestEloquentCollectionModel();
    var three           = new TestEloquentCollectionModel();
    var four            = new TestEloquentCollectionModel();
    one.id              = 1;
    one.someAttribute   = '1';
    two.id              = 1;
    two.someAttribute   = '2';
    three.id            = 1;
    three.someAttribute = '3';
    four.id             = 2;
    four.someAttribute  = '4';
    var duplicates      = Collection.make([one, two, three, four]).duplicates().all();
    expect(duplicates).toEqual({
      1: two,
      2: three
    });
    var duplicates = Collection.make([one, two, three, four]).duplicatesStrict().all();
    expect(duplicates).toEqual({
      1: two,
      2: three
    });
  });
  it('collection intersect with null', () => {
    var one = m.mock(Model);
    one.shouldReceive('getKey').andReturn(1);
    var two = m.mock(Model);
    two.shouldReceive('getKey').andReturn(2);
    var three = m.mock(Model);
    three.shouldReceive('getKey').andReturn(3);
    var c1 = new Collection([one, two, three]);
    expect(c1.intersect(null).all()).toEqual([]);
  });
  it('collection intersects with given collection', () => {
    var one = m.mock(Model);
    one.shouldReceive('getKey').andReturn(1);
    var two = m.mock(Model);
    two.shouldReceive('getKey').andReturn(2);
    var three = m.mock(Model);
    three.shouldReceive('getKey').andReturn(3);
    var c1 = new Collection([one, two]);
    var c2 = new Collection([two, three]);
    expect(c1.intersect(c2)).toEqual(new Collection([two]));
  });
  it('collection returns unique items', () => {
    var one = m.mock(Model);
    one.shouldReceive('getKey').andReturn(1);
    var two = m.mock(Model);
    two.shouldReceive('getKey').andReturn(2);
    var c = new Collection([one, two, two]);
    expect(c.unique()).toEqual(new Collection([one, two]));
  });
  it('collection returns unique strict based on keys only', () => {
    var one             = new TestEloquentCollectionModel();
    var two             = new TestEloquentCollectionModel();
    var three           = new TestEloquentCollectionModel();
    var four            = new TestEloquentCollectionModel();
    one.id              = 1;
    one.someAttribute   = '1';
    two.id              = 1;
    two.someAttribute   = '2';
    three.id            = 1;
    three.someAttribute = '3';
    four.id             = 2;
    four.someAttribute  = '4';
    var uniques         = Collection.make([one, two, three, four]).unique().all();
    expect(uniques).toEqual([three, four]);
    var uniques = Collection.make([one, two, three, four]).unique(null, true).all();
    expect(uniques).toEqual([three, four]);
  });
  it('only returns collection with given model keys', () => {
    var one = m.mock(Model);
    one.shouldReceive('getKey').andReturn(1);
    var two = m.mock(Model);
    two.shouldReceive('getKey').andReturn(2);
    var three = m.mock(Model);
    three.shouldReceive('getKey').andReturn(3);
    var c = new Collection([one, two, three]);
    expect(c.only(null)).toEqual(c);
    expect(c.only(1)).toEqual(new Collection([one]));
    expect(c.only([2, 3])).toEqual(new Collection([two, three]));
  });
  it('except returns collection without given model keys', () => {
    var one = m.mock(Model);
    one.shouldReceive('getKey').andReturn(1);
    var two = m.mock(Model);
    two.shouldReceive('getKey').andReturn('2');
    var three = m.mock(Model);
    three.shouldReceive('getKey').andReturn(3);
    var c = new Collection([one, two, three]);
    expect(c.except(2)).toEqual(new Collection([one, three]));
    expect(c.except([2, 3])).toEqual(new Collection([one]));
  });
  it('make hidden adds hidden on entire collection', () => {
    var c = new Collection([new TestEloquentCollectionModel()]);
    var c = c.makeHidden(['visible']);
    expect(c[0].getHidden()).toEqual(['hidden', 'visible']);
  });
  it('make visible removes hidden from entire collection', () => {
    var c = new Collection([new TestEloquentCollectionModel()]);
    var c = c.makeVisible(['hidden']);
    expect(c[0].getHidden()).toEqual([]);
  });
  it('appends adds test on entire collection', () => {
    var c = new Collection([new TestEloquentCollectionModel()]);
    var c = c.makeVisible('test');
    var c = c.append('test');
    expect(c[0].toArray()).toEqual({
      'test': 'test'
    });
  });
  it('non model related methods', () => {
    var a = new Collection([
      {
        'foo': 'bar'
      }, {
        'foo': 'baz'
      }
    ]);
    var b = new Collection(['a', 'b', 'c']);
    expect(get_class(a.pluck('foo'))).toEqual(BaseCollection);
    expect(get_class(a.keys())).toEqual(BaseCollection);
    expect(get_class(a.collapse())).toEqual(BaseCollection);
    expect(get_class(a.flatten())).toEqual(BaseCollection);
    expect(get_class(a.zip(['a', 'b'], ['c', 'd']))).toEqual(BaseCollection);
    expect(get_class(b.flip())).toEqual(BaseCollection);
  });
  it('make visible removes hidden and includes visible', () => {
    var c = new Collection([new TestEloquentCollectionModel()]);
    var c = c.makeVisible('hidden');
    expect(c[0].getHidden()).toEqual([]);
    expect(c[0].getVisible()).toEqual(['visible', 'hidden']);
  });
  it('queueable collection implementation', () => {
    var c = new Collection([new TestEloquentCollectionModel(), new TestEloquentCollectionModel()]);
    expect(c.getQueueableClass()).toEqual(TestEloquentCollectionModel);
  });
  it('queueable collection implementation throws exception on multiple model types', () => {
    this.expectException(LogicException);
    this.expectExceptionMessage('Queueing collections with multiple model types is not supported.');
    var c = new Collection([
      new TestEloquentCollectionModel(), /*cast type object*/ {
        'id': 'something'
      }
    ]);
    c.getQueueableClass();
  });
  it('queueable relationships returns only relations common to all models', () => {
    var c = new Collection([new ()(), new ()()]);
    expect(c.getQueueableRelations()).toEqual(['user']);
  });
  it('empty collection stay empty on fresh', () => {
    var c = new Collection();
    expect(c.fresh()).toEqual(c);
  });
  it('can convert collection of models to eloquent query builder', () => {
    var one = m.mock(Model);
    one.shouldReceive('getKey').andReturn(1);
    var two = m.mock(Model);
    two.shouldReceive('getKey').andReturn(2);
    var c          = new Collection([one, two]);
    var mocBuilder = m.mock(Builder);
    one.shouldReceive('newModelQuery').once().andReturn(mocBuilder);
    mocBuilder.shouldReceive('whereKey').once()._with(c.modelKeys()).andReturn(mocBuilder);
    expect(c.toQuery()).toInstanceOf(Builder);
  });
  it('converting empty collection to query throws exception', () => {
    this.expectException(LogicException);
    var c = new Collection();
    c.toQuery();
  });
});

export class TestEloquentCollectionModel extends Model {
  protected visible: any = ['visible'];
  protected hidden: any  = ['hidden'];

  public getTestAttribute() {
    return 'test';
  }
}
