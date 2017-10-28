import { Component, ContentChild, Host, Input, Optional, SkipSelf, TemplateRef } from '@angular/core';
import { AutoGenerateColumnPositon, ColumnBase } from './column-base';
import { CellTemplateDirective } from '../directive/cell-template.directive';
import { EditTemplateDirective } from '../directive/edit-template.directive';
import { FilterCellTemplateDirective } from '../filtering/filter-cell-template.directive';
import { GroupFooterTemplateDirective } from '../grouping/group-footer-template.directive';
import { GroupHeaderTemplateDirective } from '../grouping/group-header-template.directive';
import { ColumnSortSettings } from '../helper/sort-settings';
import { isPresent } from '../utils';

export function isColumnComponent(column) {
  return isPresent(column.field);
}

@Component({
  providers: [
    {
      provide    : ColumnBase,
      useExisting: ColumnComponent // tslint:disable-line:no-forward-ref
    }
  ],
  selector : 'tri-data-table-column',
  template : ''
})
export class ColumnComponent extends ColumnBase {
  public autoGenerateColumnPosition = 'middle' as AutoGenerateColumnPositon;

  @Input() field: string;
  @Input() format: string;
  @Input() sortable: boolean | ColumnSortSettings;
  @Input() editor: 'text' | 'numeric' | 'date' | 'boolean';
  @Input() filter: 'text' | 'numeric' | 'boolean' | 'date';
  @Input() filterable: boolean;
  @Input() editable: boolean;
  @ContentChild(CellTemplateDirective) cellTemplate: CellTemplateDirective;
  @ContentChild(GroupHeaderTemplateDirective) groupHeaderTemplate: GroupHeaderTemplateDirective;
  @ContentChild(GroupFooterTemplateDirective) groupFooterTemplate: GroupFooterTemplateDirective;
  @ContentChild(EditTemplateDirective) editTemplate: EditTemplateDirective;
  @ContentChild(FilterCellTemplateDirective) filterCellTemplate: FilterCellTemplateDirective;

  constructor(@SkipSelf()
              @Host()
              @Optional()
                parent?: ColumnBase) {
    super(parent);
  }

  get templateRef(): TemplateRef<any> {
    return this.cellTemplate ? this.cellTemplate.templateRef : undefined;
  }

  get groupHeaderTemplateRef(): TemplateRef<any> {
    return this.groupHeaderTemplate ? this.groupHeaderTemplate.templateRef : undefined;
  }

  get groupFooterTemplateRef(): TemplateRef<any> {
    return this.groupFooterTemplate ? this.groupFooterTemplate.templateRef : undefined;
  }

  get editTemplateRef(): TemplateRef<any> {
    return this.editTemplate ? this.editTemplate.templateRef : undefined;
  }

  get filterCellTemplateRef(): TemplateRef<any> {
    return this.filterCellTemplate ? this.filterCellTemplate.templateRef : undefined;
  }

  get displayTitle(): string {
    return this.title === undefined ? this.field : this.title;
  }
}
