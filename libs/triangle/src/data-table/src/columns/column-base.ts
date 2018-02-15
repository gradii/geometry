import { ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { FooterTemplateDirective } from '../table-footer/footer-template.directive';
import { HeaderTemplateDirective } from '../table-header/header-template.directive';

export const isSpanColumn = column => column.isSpanColumn;
export const isCheckboxColumn = function (column) {
  return column.isCheckboxColumn;
};
const isColumnContainer = column => column.isColumnGroup || isSpanColumn(column);
export type AutoGenerateColumnPositon = 'start' | 'middle' | 'end';

export class ColumnBase {
  public autoGenerateColumnPosition: AutoGenerateColumnPositon;

  isColumnGroup: boolean;
  isSpanColumn: boolean;
  resizable: boolean;
  minResizableWidth: number;

  @Input() title: string;
  @Input() locked: boolean;
  @Input() hidden: boolean;
  @Input() media: string;
  @Input()
  style: {
    [key: string]: string;
  };
  @Input()
  headerStyle: {
    [key: string]: string;
  };
  @Input()
  footerStyle: {
    [key: string]: string;
  };
  @Input('class')
  cssClass: | string
    | string[]
    | Set<string>
    | {
    [key: string]: any;
  };
  @Input()
  headerClass: | string
    | string[]
    | Set<string>
    | {
    [key: string]: any;
  };
  @Input()
  footerClass: | string
    | string[]
    | Set<string>
    | {
    [key: string]: any;
  };
  @ContentChildren(HeaderTemplateDirective, {descendants: false})
  headerTemplates: QueryList<HeaderTemplateDirective>;
  @ContentChildren(FooterTemplateDirective) footerTemplate: FooterTemplateDirective;
  private _width;

  constructor(public parent?: ColumnBase) {
    this.headerTemplates = new QueryList<HeaderTemplateDirective>();
    if (parent && !isColumnContainer(parent)) {
      throw new Error('Columns can be nested only inside ColumnGroupComponent');
    }
  }

  @Input()
  get width() {
    return this._width;
  }

  set width(value) {
    this._width = parseInt(value, 10);
  }

  get level() {
    if (this.parent && isSpanColumn(this.parent)) {
      return this.parent.level;
    }
    return this.parent ? this.parent.level + 1 : 0;
  }

  get isLocked() {
    return this.parent ? this.parent.isLocked : this.locked;
  }

  get colspan() {
    return 1;
  }

  rowspan(totalColumnLevels: number): number {
    return this.level < totalColumnLevels ? totalColumnLevels - this.level + 1 : 1;
  }

  get headerTemplateRef(): TemplateRef<any> {
    const template = this.headerTemplates.first;
    return template ? template.templateRef : undefined;
  }

  get footerTemplateRef(): TemplateRef<any> {
    return this.footerTemplate ? this.footerTemplate.templateRef : undefined;
  }

  get displayTitle() {
    return this.title;
  }
}
