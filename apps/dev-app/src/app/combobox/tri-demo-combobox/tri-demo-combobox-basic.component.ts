/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title select-basic
 */
@Component({
  selector: 'tri-demo-combobox-basic',
  template: `
    <tri-combobox style="width: 120px;" [(ngModel)]="selectedOption" [allowClear]="true">
      <tri-combobox-option
        *ngFor="let option of options"
        [label]="option.label"
        [value]="option"
        [disabled]="option.disabled">
        {{option.label}}
      </tri-combobox-option>
    </tri-combobox>
    <tri-combobox style="width: 120px;" [(ngModel)]="selectedOption" [disabled]="true">
      <tri-combobox-option
        *ngFor="let option of options"
        [label]="option.label"
        [value]="option"
        [disabled]="option.disabled">
      </tri-combobox-option>
    </tri-combobox>
  `,
  styles  : []
})
export class TriDemoComboboxBasicComponent implements OnInit {
  options: any[] = [];
  selectedOption: any[];

  constructor() {
  }

  ngOnInit() {
    /*模拟服务器异步加载*/
    setTimeout(_ => {
      this.options        = [
        {value: 'jack', label: 'Jack'},
        {value: 'lucy', label: 'Lucy'},
        {value: 'disabled', label: 'Disabled', disabled: true}
      ];
      this.selectedOption = this.options[0];
    }, 100);
  }
}
