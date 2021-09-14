import { reflector } from '@gradii/annotation';
import { isFunction } from '@gradii/check-type';
import { findLast } from 'ramda';
import {
  Column, ColumnDefine, DateCastableColumn, DateColumn, EncryptedCastableColumn
} from '../src/annotation/column';
import { HasManyColumn, RelationAnnotation } from '../src/annotation/relation';
import { Model } from '../src/fedaco/model';
import { HasMany } from '../src/fedaco/relations/has-many';
import { BasicModel, } from './model/basic.model';
import { ArticleModel, HasManyRelationModel, MemberModel } from './model/has-many-relation.model';
import { HasOneRelationModel } from './model/has-one-relation.model';
import { RelationModel } from './model/relation.model';


function _columnInfo(typeOfClazz, key: string) {
  const meta = reflector.propMetadata(typeOfClazz);
  return findLast(it => {
    return Column.isTypeOf(it) ||
      DateColumn.isTypeOf(it) ||
      DateCastableColumn.isTypeOf(it) ||
      EncryptedCastableColumn.isTypeOf(it) ||
      HasManyColumn.isTypeOf(it);
  }, meta[key]) as ColumnDefine;
}

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

  it('test basic model', () => {
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

  it('test relation annotation get should call getAttribute', () => {
    const relationModel = new RelationModel();

    const meta = reflector.propMetadata(RelationModel);

    const spy1 = jest.spyOn(relationModel, 'getAttribute').mockReturnValue('foo');
    const data = relationModel.columnFoo;

    expect(spy1).toBeCalled();
    expect(data).toBe('foo');
  });

  it('test relation annotation set relation should throw exception', () => {
    const relationModel = new RelationModel();

    expect(() => {
      relationModel.columnFoo = 'foo';
    }).toThrow('the relation field is readonly');
  });

  it('test annotation hasOne', () => {
    const relationModel = new HasOneRelationModel();

    const meta = reflector.propMetadata(HasOneRelationModel);
    expect(meta).toMatchSnapshot('has one');


  });

  it('test annotation hasMany', () => {
    const relationModel = new HasManyRelationModel();

    const meta = reflector.propMetadata(HasManyRelationModel);
    expect(meta).toMatchSnapshot('has many');

  });

  it('test annotation get hasMany relation', () => {
    const relationModel = new MemberModel();

    const meta = reflector.propMetadata(MemberModel);
    expect(meta).toMatchSnapshot('has many');


    const metaColumnInfo: RelationAnnotation = _columnInfo(MemberModel, 'articles');

    expect(metaColumnInfo).toMatchObject({
      isRelation: true,
      type      : 'HasMany'
    });

    expect(isFunction(metaColumnInfo._getRelation)).toBe(true);

    const hasMany = metaColumnInfo._getRelation(relationModel);

    expect(hasMany).toBeInstanceOf(HasMany);
  });

  it('test annotation get hasMany relation sql', async () => {
    const memberModel = new MemberModel();

    memberModel.id = 101;

    const metaColumnInfo: RelationAnnotation = _columnInfo(MemberModel, 'articles');

    // const spy1 = jest.spyOn(memberModel._connection, 'query');

    const hasMany = metaColumnInfo._getRelation(memberModel);

    expect(hasMany).toBeInstanceOf(HasMany);

    const results = await hasMany.getResults();

    expect(results[0] instanceof ArticleModel).toBe(true);
  });

});