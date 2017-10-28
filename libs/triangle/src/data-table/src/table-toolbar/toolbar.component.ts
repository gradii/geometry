import {Component, HostBinding, TemplateRef} from '@angular/core';
import {DataTableComponent} from '../data-table.component';

@Component({
  selector: 'tri-data-table-toolbar',
  template: `
    <ng-template
      *ngIf="toolbarTemplateRef"
      [ngTemplateOutlet]="toolbarTemplateRef">
    </ng-template>
  `,
  host    : {
    '[class.ant-header]'      : 'true',
    '[class.ant-grid-toolbar]': 'true'
  }
})
export class ToolbarComponent {
  constructor(private grid: DataTableComponent) {}

  @HostBinding('class')
  get classNames(): string {
    return 'ant-header ant-grid-toolbar';
  }

  get toolbarTemplateRef(): TemplateRef<any> {
    return this.grid.toolbarTemplate ? this.grid.toolbarTemplate.templateRef : undefined;
  }
}
