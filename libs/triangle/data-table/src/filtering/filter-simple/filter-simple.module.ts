import { NgModule } from '@angular/core';
import { FilterSharedModule } from '../shared/filter-shared.module';
import { BooleanFilterSimpleComponent } from './boolean-filter-simple.component';
import { DateFilterSimpleComponent } from './date-filter-simple.component';
import { FilterSimpleHostDirective } from './filter-simple-host.directive';
import { FilterSimpleIconComponent } from './filter-simple-icon.component';
import { FilterSimpleComponent } from './filter-simple.component';
import { StringFilterSimpleComponent } from './string-filter-simple.component';

@NgModule({
  declarations   : [
    FilterSimpleComponent,
    FilterSimpleIconComponent,
    FilterSimpleHostDirective,
    BooleanFilterSimpleComponent,
    DateFilterSimpleComponent,
    StringFilterSimpleComponent
  ],
  imports        : [FilterSharedModule],
  exports        : [
    FilterSimpleComponent,
    BooleanFilterSimpleComponent,
    DateFilterSimpleComponent,
    StringFilterSimpleComponent
  ],
  entryComponents: [BooleanFilterSimpleComponent, DateFilterSimpleComponent, StringFilterSimpleComponent]
})
export class FilterSimpleModule {
  constructor() {}
}
