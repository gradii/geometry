import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: LessOrEqualToFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-lte-operator',
  template: ''
})
export class LessOrEqualToFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('lte');
  }
}
