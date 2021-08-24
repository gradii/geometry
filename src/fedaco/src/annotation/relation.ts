import { makePropDecorator, TypeDecorator } from '@gradii/annotation';
import { ColumnDecorator } from './column';

export interface RelationDecorator {

  (obj?: RelationAnnotation): TypeDecorator;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: RelationAnnotation): RelationAnnotation;
}

export interface RelationAnnotation {
  name?: string;
}

// tslint:disable-next-line:variable-name
export const Relation: ColumnDecorator = makePropDecorator(
  'fedaco orm relation',
  (p: RelationAnnotation = {}) => ({...p}), undefined,
  (target: any, name: string, ...args) => {
  }
);
