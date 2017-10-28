import { AggregateDescriptor } from './aggregate.operators';
import { AggregateResult } from '../transducers';
export interface GroupDescriptor {
  field: string;
  dir?: 'asc' | 'desc';
  aggregates?: Array<AggregateDescriptor>;
}
export interface GroupResult {
  items: Object[];
  aggregates: AggregateResult;
  field: string;
  value: any;
}
