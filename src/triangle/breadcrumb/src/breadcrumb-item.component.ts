/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectionStrategy,
  Component,
  Host
} from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbItemInterface } from './breadcrumbItemInterface';

@Component({
  selector       : 'tri-breadcrumb-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <span class="tri-breadcrumb-link">
      <ng-content></ng-content>
    </span>
    <span *ngIf="!isLast"
          class="tri-breadcrumb-separator">{{breadCrumbComponent.separator}}</span>`
})
export class BreadcrumbItemComponent implements BreadcrumbItemInterface {
  get isLast() {
    return this.breadCrumbComponent.breadCrumbItems.last === this;
  }

  constructor(@Host() public breadCrumbComponent: BreadcrumbComponent) {
  }
}
