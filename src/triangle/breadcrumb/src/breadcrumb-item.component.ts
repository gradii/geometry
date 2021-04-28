/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Host } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';

@Component({
  selector: 'tri-breadcrumb-item',
  template: `
    <span class="tri-breadcrumb-link">
      <ng-content></ng-content>
    </span>
    <span class="tri-breadcrumb-separator">{{breadCrumbComponent?.separator}}</span>`
})
export class BreadcrumbItemComponent {
  constructor(@Host() public breadCrumbComponent: BreadcrumbComponent) {
  }
}
