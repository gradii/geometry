import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: IsNotEmptyFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-isempty-operator',
  template: ''
})
export class IsNotEmptyFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('isnotempty');
  }
}
