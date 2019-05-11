import { ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { CheckboxColumnComponent } from '../columns/checkbox-column.component';
import { HierarchyColumnComponent } from '../columns/hierarchy-column.component';
import { FooterTemplateDirective } from '../table-footer/footer-template.directive';
import { HeaderTemplateDirective } from '../table-header/header-template.directive';

export const isSpanColumn = column => column.isSpanColumn;

export function isCheckboxColumn(column) { return (column as CheckboxColumnComponent).isCheckboxColumn; }

export function isHierarchyColumn(column) { return (column as HierarchyColumnComponent).isHierarchyColumn; }

function isColumnContainer(column) { return column.isColumnGroup || isSpanColumn(column); }

export type AutoGenerateColumnPositon = 'start' | 'middle' | 'end';

export class ColumnBase {
  public matchesMedia: boolean = true;
  public orderIndex: number = 0;
  public autoGenerateColumnPosition: AutoGenerateColumnPositon;

  isColumnGroup: boolean;
  isSpanColumn: boolean;

  @Input() public resizable: boolean = true;
  @Input() public reorderable: boolean = true;
  @Input() public minResizableWidth: number = 10;
  @Input() public title: string;
  @Input() public locked: boolean;
  @Input() public hidden: boolean;
  @Input() public media: string;
  @Input() public style: {
    [key: string]: string;
  };
  @Input() headerStyle: {
    [key: string]: string;
  };
  @Input() footerStyle: {
    [key: string]: string;
  };
  @Input('class') cssClass: | string
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
  headerTemplates: QueryList<HeaderTemplateDirective> = new QueryList<HeaderTemplateDirective>();
  @ContentChildren(FooterTemplateDirective)
  footerTemplate: FooterTemplateDirective;

  constructor(public parent?: ColumnBase) {
    if (parent && !isColumnContainer(parent)) {
      throw new Error('Columns can be nested only inside ColumnGroupComponent');
    }
  }

  private _width;

  @Input()
  get width() {
    return this._width;
  }

  set width(value) {
    this._width = parseInt(value, 10);
  }

  private _minWidth;

  @Input()
  get minWidth() {
    return this._minWidth;
  }

  set minWidth(value) {
    this._minWidth = parseInt(value, 10);
  }

  private _maxWidth;

  @Input()
  get maxWidth() {
    return this._maxWidth;
  }

  set maxWidth(value) {
    this._maxWidth = parseInt(value, 10);
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

  public get isVisible(): boolean {
    return !this.hidden && this.matchesMedia;
  }

  rowspan(totalColumnLevels: number): number {
    return this.level < totalColumnLevels ? totalColumnLevels - this.level + 1 : 1;
  }
}
