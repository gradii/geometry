/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, HostBinding, TemplateRef } from '@angular/core';
import { DataTableComponent } from '../data-table.component';

@Component({
  selector: 'tri-data-table-toolbar',
  template: `
    <ng-template
      *ngIf="toolbarTemplateRef"
      [ngTemplateOutlet]="toolbarTemplateRef">
    </ng-template>
  `,
  host    : {
    '[class.tri-header]'            : 'true',
    '[class.tri-data-table-toolbar]': 'true'
  }
})
export class ToolbarComponent {
  constructor(private grid: DataTableComponent) {
  }

  @HostBinding('class')
  get classNames(): string {
    return 'tri-header tri-data-table-toolbar';
  }

  get toolbarTemplateRef(): TemplateRef<any> {
    return this.grid.toolbarTemplate ? this.grid.toolbarTemplate.templateRef : undefined;
  }
}
