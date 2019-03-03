import { Component, forwardRef, ContentChild, SkipSelf, Host, Optional, TemplateRef } from '@angular/core';
import { ColumnBase } from './column-base';
import { CellTemplateDirective } from './directive/cell-template.directive';

@Component({
  providers: [
    {
      provide: ColumnBase,
      useExisting: CommandColumnComponent
    }
  ],
  selector : 'tri-data-table-command-column',
  template: ''
})
export class CommandColumnComponent extends ColumnBase {
  parent: ColumnBase;
  @ContentChild(CellTemplateDirective) template: CellTemplateDirective;

  constructor(
    @SkipSelf()
    @Host()
    @Optional()
    parent?: ColumnBase
  ) {
    super(parent);
  }

  get templateRef(): TemplateRef<any> {
    return this.template ? this.template.templateRef : undefined;
  }
}
