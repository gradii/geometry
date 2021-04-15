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
  selector: 'tri-demo-select-basic',
  template: `
    <tri-select style="width: 120px;" [(ngModel)]="selectedOption" [allowClear]="true">
      <tri-option
        *ngFor="let option of options"
        [label]="option.label"
        [value]="option"
        [disabled]="option.disabled">
      </tri-option>
    </tri-select>
    <tri-select style="width: 120px;" [(ngModel)]="selectedOption" [disabled]="true">
      <tri-option
        *ngFor="let option of options"
        [label]="option.label"
        [value]="option"
        [disabled]="option.disabled">
      </tri-option>
    </tri-select>
  `,
  styles  : []
})
export class TriDemoSelectBasicComponent implements OnInit {
  options = [];
  selectedOption;

  constructor() {
  }

  ngOnInit() {
    /*模拟服务器异步加载*/
    setTimeout(_ => {
      this.options = [
        {value: 'jack', label: 'Jack'},
        {value: 'lucy', label: 'Lucy'},
        {value: 'disabled', label: 'Disabled', disabled: true}
      ];
      this.selectedOption = this.options[0];
    }, 100);
  }
}
