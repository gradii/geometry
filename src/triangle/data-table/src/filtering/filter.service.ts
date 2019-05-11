import { CompositeFilterDescriptor } from '@gradii/triangle/data-query';
import { Subject } from 'rxjs';

export class FilterService {
  changes: Subject<CompositeFilterDescriptor>;

  // parent: FilterService;

  constructor() {
    this.changes = new Subject();
  }

  filter(value: CompositeFilterDescriptor): void {
    this.changes.next(value);
  }
}
