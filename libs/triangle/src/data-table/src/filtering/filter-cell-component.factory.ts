import { StringFilterCellComponent } from './string-filter-cell.component';
import { NumericFilterCellComponent } from './numeric-filter-cell.component';
import { BooleanFilterCellComponent } from './boolean-filter-cell.component';
import { DateFilterCellComponent } from './date-filter-cell.component';

export const filterComponentFactory = function(type) {
  return {
    boolean: BooleanFilterCellComponent,
    date: DateFilterCellComponent,
    numeric: NumericFilterCellComponent,
    text: StringFilterCellComponent
  }[type];
};
