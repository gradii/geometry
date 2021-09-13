import { reflector } from '@gradii/annotation';
import { findLast } from 'ramda';
import { Column } from '../src/annotation/column';
import { Model } from '../src/fedaco/model';
import { BasicModel, } from './model/basic.model';
import { RelationModel } from './model/relation.model';

describe('model annotation', () => {
  it('instance model', () => {
    const m = new BasicModel();

    expect(m).toBeInstanceOf(Model);
  });

  it('test basic', () => {
    const basic = new BasicModel();

    const metadata = reflector.propMetadata(BasicModel);

    expect(metadata['name'].length).toBe(1);
    expect(metadata['name'][0].columnName).toBe('name');
  });

  it('test basic model 1', () => {
    const basic = new BasicModel();
    basic.name  = 'hello';

    const meta = reflector.propMetadata(BasicModel);
    const a    = findLast(it => Column.isTypeOf(it), meta['name']);
  });

  it('test relation annoation', () => {
    const relationModel = new RelationModel();

    const meta = reflector.propMetadata(RelationModel);

    expect(meta).toMatchSnapshot('meta');
  });

  it('test relation annotation should call getAttribute', () => {

    const relationModel = new RelationModel();

    const meta = reflector.propMetadata(RelationModel);

    const spy1 = jest.spyOn(relationModel, 'getAttribute').mockReturnValue('foo');
    const data = relationModel.columnFoo;

    expect(spy1).toBeCalled();
    expect(data).toBe('foo');

  });


});
