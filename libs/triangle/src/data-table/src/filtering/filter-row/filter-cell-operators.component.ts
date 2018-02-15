import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector           : 'tri-data-table-filter-cell-operators',
  preserveWhitespaces: false,
  template           : `
                         <tri-select
                           *ngIf="showOperators"
                           [ngModel]="value"
                           (ngModelChange)="onChange($event)"
                         >
                           <!--
                           [data]="operators"
                           class="ant-dropdown-operator"
                           (valueChange)="onChange($event)"
                           [value]="value"
                           [iconClass]="'ant-i-filter'"
                           [valuePrimitive]="true"
                           [textField]="'text'"
                           [popupSettings]="{ width: 'auto' }"
                           [valueField]="'value'"
                           -->
                           <tri-option *ngFor="let item of operators" [label]="item['label']" [value]="item['value']"></tri-option>
                         </tri-select>
                         <button *ngIf="showButton"
                                 type="button"
                                 class="ant-button ant-button-icon"
                                 title="Clear"
                                 (click)="clearClick()">
                           <span class="ant-icon ant-i-filter-clear"></span>
                         </button>
                       `
})
export class FilterCellOperatorsComponent {
  @Input()
  operators: Array<{
    text: string;
    value: string;
  }> = [];

  @Input() showButton: boolean;
  @Input() showOperators: boolean = true;
  @Input() value: string;

  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() clear: EventEmitter<{}> = new EventEmitter();

  constructor() {}

  @HostBinding('class.ant-filtercell-operator')
  get hostClasses() {
    return true;
  }

  onChange(dataItem: any): void {
    this.valueChange.emit(dataItem);
  }

  clearClick() {
    this.clear.emit();
  }
}
