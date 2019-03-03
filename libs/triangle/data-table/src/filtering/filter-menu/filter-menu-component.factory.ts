import { BooleanFilterMenuComponent } from './type-filter-menu/boolean-filter-menu.component';
import { DateFilterMenuComponent } from './type-filter-menu/date-filter-menu.component';
import { NumericFilterMenuComponent } from './type-filter-menu/numeric-filter-menu.component';
import { StringFilterMenuComponent } from './type-filter-menu/string-filter-menu.component';

export const filterMenuComponentFactory = function (type) {
  return {
    boolean: BooleanFilterMenuComponent,
    date   : DateFilterMenuComponent,
    numeric: NumericFilterMenuComponent,
    text   : StringFilterMenuComponent
  }[type];
};
