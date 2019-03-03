import { Component, ContentChild, forwardRef, Host, Input, Optional, SkipSelf, TemplateRef } from '@angular/core';
import { ColumnBase } from '../columns/column-base';
import { CellTemplateDirective } from '../directive/cell-template.directive';
import { AutoGenerateColumnPositon } from './column-base';

@Component({
  providers: [
    {
      provide    : ColumnBase,
      useExisting: forwardRef(() => CheckboxColumnComponent) // tslint:disable-line:no-forward-ref
    }
  ],
  selector : 'tri-grid-checkbox-column',
  template : ''
})
export class CheckboxColumnComponent extends ColumnBase {
  public autoGenerateColumnPosition = 'start' as AutoGenerateColumnPositon;

  isCheckboxColumn = true;

  @Input() showSelectAll;

  @ContentChild(CellTemplateDirective) template;

  get templateRef(): TemplateRef<CellTemplateDirective> {
    return this.template ? this.template.templateRef : undefined;
  }

  public constructor(@SkipSelf()
                     @Host()
                     @Optional()
                       parent: ColumnBase) {
    super(parent);
  }
}
