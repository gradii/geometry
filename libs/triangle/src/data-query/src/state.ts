import { SortDescriptor } from './sort-descriptor';
import { CompositeFilterDescriptor } from './filtering/filter-descriptor.interface';
import { GroupDescriptor } from './grouping/group-descriptor.interface';
export interface State {
  skip?: number;
  take?: number;
  sort?: Array<SortDescriptor>;
  filter?: CompositeFilterDescriptor;
  group?: Array<GroupDescriptor>;
}
