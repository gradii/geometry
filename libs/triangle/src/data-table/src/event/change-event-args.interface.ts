import { SortDescriptor } from '@gradii/triangle/data-query';
import { GroupDescriptor } from '@gradii/triangle/data-query';
export interface PageChangeEvent {
  skip: number;

  take: number;
}

export interface DataStateChangeEvent {
  skip: number;

  take: number;

  sort?: SortDescriptor[];

  group?: GroupDescriptor[];
}
