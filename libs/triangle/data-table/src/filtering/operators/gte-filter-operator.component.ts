import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: GreaterOrEqualToFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-gte-operator',
  template: ''
})
export class GreaterOrEqualToFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('gte');
  }
}
