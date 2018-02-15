import { CompositeFilterDescriptor } from '@gradii/triangle/data-query';
import { ColumnComponent } from '../columns/column.component';

export interface FilterComponent {
  column: ColumnComponent;
  filter: CompositeFilterDescriptor;
}
