import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: NotEqualFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-neq-operator',
  template: ''
})
export class NotEqualFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('neq');
  }
}
