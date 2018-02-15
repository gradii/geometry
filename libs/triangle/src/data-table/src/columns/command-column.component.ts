import { Component, ContentChild, Host, Optional, SkipSelf, TemplateRef } from '@angular/core';
import { CellTemplateDirective } from '../directive/cell-template.directive';
import { AutoGenerateColumnPositon, ColumnBase } from './column-base';

@Component({
  providers: [
    {
      provide    : ColumnBase,
      useExisting: CommandColumnComponent
    }
  ],
  selector : 'tri-data-table-command-column',
  template : ''
})
export class CommandColumnComponent extends ColumnBase {
  public autoGenerateColumnPosition = 'end' as AutoGenerateColumnPositon;

  parent: ColumnBase;
  @ContentChild(CellTemplateDirective) template: CellTemplateDirective;

  constructor(@SkipSelf()
              @Host()
              @Optional()
                parent?: ColumnBase) {
    super(parent);
  }

  get templateRef(): TemplateRef<any> {
    return this.template ? this.template.templateRef : undefined;
  }
}
