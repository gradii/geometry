import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: EndsWithFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-endswith-operator',
  template: ''
})
export class EndsWithFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('endswith');
  }
}
