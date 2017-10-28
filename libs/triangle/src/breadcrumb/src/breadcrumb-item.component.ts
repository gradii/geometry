import { Component } from '@angular/core';
import { BreadCrumbComponent } from './breadcrumb.component';

@Component({
  selector: 'tri-breadcrumb-item',
  template: `
    <span class="ant-breadcrumb-link">
      <ng-content></ng-content>
    </span>
    <span class="ant-breadcrumb-separator">{{breadCrumbComponent?.separator}}</span>`
})
export class BreadCrumbItemComponent {
  constructor(public breadCrumbComponent: BreadCrumbComponent) {}
}
