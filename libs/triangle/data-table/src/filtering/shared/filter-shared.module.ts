import { NgModule } from '@angular/core';
import { FilterInputDirective } from '../../filtering/filter-input.directive';

@NgModule({
  declarations: [
    FilterInputDirective
  ],
  exports     : [
    FilterInputDirective
  ]
})
export class FilterSharedModule {
}