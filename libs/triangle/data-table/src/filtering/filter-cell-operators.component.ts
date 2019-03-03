import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector : 'tri-data-table-filter-cell-operators',
  template: `
              <tri-dropdown
                *ngIf="showOperators"
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
                <ul tri-menu>
                  <li tri-menu-item *ngFor="let item of operators">{{item['text']}}</li>
                </ul>
              </tri-dropdown>
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
  }>;

  @Input() showButton: boolean;

  @Input() showOperators: boolean;

  @Input() value: string;

  @Output() valueChange: EventEmitter<string>;

  @Output() clear: EventEmitter<{}>;
  constructor() {
    this.operators = [];

    this.showOperators = true;

    this.valueChange = new EventEmitter();

    this.clear = new EventEmitter();
  }
  @HostBinding('class.tri-filtercell-operator')
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
