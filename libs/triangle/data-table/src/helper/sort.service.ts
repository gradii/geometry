import { Subject } from 'rxjs';
import { SortDescriptor } from '@gradii/triangle/data-query';

/**
 * @hidden
 */
export class SortService {

    public changes: Subject<SortDescriptor[]> = new Subject<SortDescriptor[]>();

    public sort(value: SortDescriptor[]): void {
        this.changes.next(value);
    }
}
