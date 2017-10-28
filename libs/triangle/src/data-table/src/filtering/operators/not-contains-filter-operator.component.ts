import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: DoesNotContainFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-not-contains-operator',
  template: ''
})
export class DoesNotContainFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('doesnotcontain');
  }
}
