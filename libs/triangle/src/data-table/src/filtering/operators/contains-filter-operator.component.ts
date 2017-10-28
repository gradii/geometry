import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: ContainsFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-contains-operator',
  template: ''
})
export class ContainsFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('contains');
  }
}
