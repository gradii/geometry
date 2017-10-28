import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectionEvent } from '@gradii/triangle/data-table';
import { isArray, isPresent } from '@gradii/triangle/util';
import { BaseInputOutputDataTable } from './base-input-output-data-table';

@Component({
  selector     : 'tri-checkbox-data-table',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <tri-data-table
      [autoGenerateColumns]="true"
      [selectedKeys]="selectedKeys || []"
      [selectedBy]="selectedBy"
      [selectable]="selectable"
      [rowSelected]="rowSelected"
      [data]="data"
      [height]="height"
      [rowHeight]="rowHeight"
      [detailRowHeight]="detailRowHeight"
      [scrollable]="'scrollable'"
      [filter]="filter"
      [filterable]="filterable"
      [sortable]="sortable"
      [pageable]="pageable"
      [groupable]="groupable"
      [sort]="sort"
      [group]="group"
      [rowClass]="rowClass"
      [fieldMap]="fieldMap"
      (filterChange)="filterChange.emit($event)"
      (groupChange)="groupChange.emit($event)"
      (sortChange)="sortChange.emit($event)"
      (selectionChange)="selectionChange.emit($event);onSelectionChange($event)"
      (selectedKeysChange)="selectedKeysChange.emit($event);onSelectedKeysChange($event)"
      (dataStateChange)="dataStateChange.emit($event)"
      (groupExpand)="groupExpand.emit($event)"
      (groupCollapse)="groupCollapse.emit($event)"
      (detailExpand)="detailExpand.emit($event)"
      (detailCollapse)="detailCollapse.emit($event)"
      (edit)="edit.emit($event)"
      (cancel)="cancel.emit($event)"
      (save)="save.emit($event)"
      (remove)="remove.emit($event)"
      (add)="add.emit($event)"
    >
      <tri-grid-checkbox-column [showSelectAll]="showSelectAll"></tri-grid-checkbox-column>
    </tri-data-table>
  `,
  providers: [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxDataTableComponent),
      multi      : true
    }
  ],
})
export class CheckboxDataTableComponent extends BaseInputOutputDataTable implements ControlValueAccessor {

  private selected;
  private selectedChangeFn;
  private selectedTouchFn;

  @Input() showSelectAll: boolean = false;

  onSelectionChange(event: SelectionEvent) {
    if (!isPresent(this.selectedBy)) {
      this.selectedChangeFn(event.selectedRows);
      this.selectedTouchFn();
    }
  }

  onSelectedKeysChange(event) {
    this.selectedChangeFn(event);
    this.selectedTouchFn();
  }

  writeValue(value: any): void {
    if (isPresent(this.selectedBy)) {
      if (isArray(value)) {
        this.selectedKeys = value;
      } else {
        this.selectedKeys = [value];
      }
    }
  }

  registerOnChange(fn: any): void {
    this.selectedChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.selectedTouchFn = fn;
  }
}