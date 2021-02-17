import { CompositeFilterDescriptor } from '@gradii/triangle/data-query';
import { Subject } from 'rxjs/Subject';

export class FilterService {
  changes: Subject<CompositeFilterDescriptor>;

  constructor() {
    this.changes = new Subject();
  }

  filter(value: CompositeFilterDescriptor): void {
    this.changes.next(value);
  }
}
