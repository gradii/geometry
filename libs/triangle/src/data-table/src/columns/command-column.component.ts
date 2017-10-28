import { Component, forwardRef, ContentChild, SkipSelf, Host, Optional, TemplateRef } from '@angular/core';
import { ColumnBase } from './column-base';
import { CellTemplateDirective } from '../directive/cell-template.directive';
import { AutoGenerateColumnPositon } from '@gradii/triangle/data-table/src/columns/column-base';

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
  public autoGenerateColumnPosition = 'end' as AutoGenerateColumnPositon;
  
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
