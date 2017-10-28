import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: IsEmptyFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-isempty-operator',
  template: ''
})
export class IsEmptyFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('isempty');
  }
}
