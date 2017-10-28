import { ColumnComponent } from '../columns/column.component';
import { CompositeFilterDescriptor } from '@gradii/triangle/data-query';
export interface FilterComponent {
  column: ColumnComponent;
  filter: CompositeFilterDescriptor;
}
