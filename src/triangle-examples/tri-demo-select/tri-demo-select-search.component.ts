/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title select-search
 */
@Component({
  selector: 'tri-demo-select-search',
  template: `
    <tri-select
      style="width: 200px;"
      allowClear
      [placeHolder]="'Select a person'"
      [(ngModel)]="selectedOption"
      [showSearch]="true">
      <tri-option
        *ngFor="let option of searchOptions"
        [label]="option.label"
        [value]="option.value"
        [disabled]="option.disabled">
      </tri-option>
    </tri-select>
    <tri-select
      style="width: 200px;"
      allowClear
      [placeHolder]="'Select a person'"
      [(ngModel)]="selectedOption"
      [showSearch]="true">
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
export class TriDemoSelectSearchComponent implements OnInit {
  selectedOption;
  searchOptions;

  constructor() {}

  ngOnInit() {
    /*模拟服务器异步加载*/
    setTimeout(_ => {
      this.searchOptions = [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'tom', label: 'Tom' }
      ];
    }, 100);
  }
}
