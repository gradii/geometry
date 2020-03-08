/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title select-multiple
 */
@Component({
  selector: 'tri-demo-select-multiple',
  template: `
    <tri-select style="width: 400px;"
      [mode]="'multiple'"
      [placeHolder]="'请选择人员'"
      [(ngModel)]="selectedMultipleOption"
      [notFoundContent]="'无法找到'">
      <tri-option
        *ngFor="let option of searchOptions"
        [label]="option.label"
        [value]="option.value"
        [disabled]="option.disabled">
      </tri-option>
    </tri-select>
  `,
  styles: []
})
export class TriDemoSelectMultipleComponent implements OnInit {
  searchOptions;
  selectedMultipleOption;

  constructor() {}

  ngOnInit() {
    /*模拟服务器异步加载*/
    this.selectedMultipleOption = ['tom', 'jack'];
    setTimeout(_ => {
      this.searchOptions = [
        { value: 'jack', label: '杰克' },
        { value: 'lucy', label: '露西' },
        { value: 'tom', label: '汤姆' }
      ];
    }, 300);
    setTimeout(_ => {
      this.selectedMultipleOption = ['tom'];
    }, 1000);
  }
}
