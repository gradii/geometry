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
    <tri-select style="width: 120px;" [(ngModel)]="selectedOption">
      <tri-tab-group>
        <tri-tab label="basic">
          <tri-option
            *ngFor="let option of options"
            [value]="option"
            [disabled]="option.disabled">
            {{option.label}}
          </tri-option>
        </tri-tab>
        <tri-tab label="advance"></tri-tab>
      </tri-tab-group>
    </tri-select>
    <tri-select style="width: 120px;" [(ngModel)]="selectedOption" disabled>
      <tri-option
        *ngFor="let option of options"
        [value]="option"
        [disabled]="option.disabled">
        {{option.label}}
      </tri-option>
    </tri-select>
  `,
  styles  : []
})
export class TriDemoSelectCustomOptionComponent implements OnInit {
  options: any[] = [];
  selectedOption: any[];

  constructor() {
  }

  ngOnInit() {
    /*模拟服务器异步加载*/
    setTimeout(() => {
      this.options        = [
        {value: 'jack', label: 'Jack'},
        {value: 'lucy', label: 'Lucy'},
        {value: 'disabled', label: 'Disabled', disabled: true}
      ];
      this.selectedOption = this.options[0];
    }, 100);
  }
}
