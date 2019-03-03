import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: StartsWithFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-startswith-operator',
  template: ''
})
export class StartsWithFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('startswith');
  }
}
