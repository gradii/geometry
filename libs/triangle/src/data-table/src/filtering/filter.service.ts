import { Subject } from 'rxjs/Subject';
import { CompositeFilterDescriptor } from '@gradii/triangle/data-query';

export class FilterService {
  changes: Subject<CompositeFilterDescriptor>;
  constructor() {
    this.changes = new Subject();
  }

  filter(value: CompositeFilterDescriptor): void {
    this.changes.next(value);
  }
}
