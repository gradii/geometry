import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: IsNullFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-isnull-operator',
  template: ''
})
export class IsNullFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('isnull');
  }
}
