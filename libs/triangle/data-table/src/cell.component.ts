import { Component, Input, Inject, Optional } from '@angular/core';
import { EditService } from './service/edit.service';
import { CommandColumnComponent } from './command-column.component';
import { ColumnComponent, isColumnComponent } from './column.component';
import { isPresent, isNullOrEmptyString, extractFormat } from './utils';
import { CELL_CONTEXT, CellContext } from './cell-context';
import { ColumnBase } from './column-base';

@Component({
  selector: '[triGridCell], [tri-grid-cell]',
  template: `
    <ng-container [ngSwitch]="isEdited">
      <ng-content *ngSwitchCase="false"></ng-content>
      <ng-container *ngSwitchCase="true">
        <ng-template
          *ngIf="column.editTemplateRef"
          [ngTemplateOutlet]="column.editTemplateRef"
          [ngTemplateOutletContext]="templateContext">
        </ng-template>
        <ng-container [ngSwitch]="column.editor" *ngIf="!column.editTemplate">
          <tri-input-number
            *ngSwitchCase="'numeric'"
            [formControl]="formGroup.get(column.field)"
          ></tri-input-number>
          <!--[format]="format"-->
          <tri-datepicker
            *ngSwitchCase="'date'"
            [formControl]="formGroup.get(column.field)"
          ></tri-datepicker>
          <!--[format]="format"-->
          <input
            *ngSwitchCase="'boolean'"
            type="checkbox"
            [formControl]="formGroup.get(column.field)"
          />
          <input
            *ngSwitchDefault
            type="text"
            class="ant-textbox"
            [formControl]="formGroup.get(column.field)"
          />
        </ng-container>
      </ng-container>
    </ng-container>
  `
})
export class CellComponent {
  private editService: EditService;
  private cellContext: CellContext;
  @Input() public column: ColumnBase;
  @Input() public isNew: boolean;
  @Input() public dataItem: any;
  private _rowIndex;
  private _templateContext;

  constructor(
    editService: EditService,
    @Optional()
    @Inject(CELL_CONTEXT)
    cellContext: CellContext
  ) {
    this.editService = editService;
    this.cellContext = cellContext;
    this.isNew = false;
    this._templateContext = {};
  }

  @Input()
  get rowIndex() {
    return this._rowIndex;
  }

  set rowIndex(index) {
    this._rowIndex = index;
    if (this.cellContext) {
      this.cellContext.rowIndex = index;
    }
  }

  get isEdited() {
    if (!this.isColumnEditable) {
      return false;
    }
    const editContext = this.editService.context(this.rowIndex);
    return this.isFieldEditable(editContext, this.column);
  }

  get formGroup() {
    return this.editService.context(this.rowIndex).group;
  }

  get templateContext() {
    this._templateContext.$implicit = this.formGroup;
    this._templateContext.isNew = this.isNew;
    this._templateContext.column = this.column;
    this._templateContext.dataItem = this.dataItem;
    this._templateContext.formGroup = this.formGroup;
    this._templateContext.rowIndex = this.rowIndex;
    return this._templateContext;
  }

  get format() {
    if (isColumnComponent(this.column) && !isNullOrEmptyString((<ColumnComponent>this.column).format)) {
      return extractFormat((<ColumnComponent>this.column).format);
    }
    return undefined;
  }

  get isColumnEditable() {
    if (!this.column || this.isCommand(this.column)) {
      return false;
    }
    return (<ColumnComponent>this.column).editable !== false;
  }

  isCommand(column) {
    return column instanceof CommandColumnComponent;
  }

  isFieldEditable(editContext, column) {
    if (!isPresent(editContext)) {
      return false;
    }
    if (isPresent(column.editTemplate)) {
      return true;
    }
    return isPresent(editContext.group) && isPresent(editContext.group.get(column.field));
  }
}
