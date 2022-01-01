/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';

/**
 * @title select-tag
 */
@Component({
  selector: 'tri-demo-combobox-tag',
  template: `
    <tri-combobox
      style="width: 400px;"
      [mode]="'tags'"
      [placeHolder]="'请选择人员'"
      [(ngModel)]="selectedMultipleOption"
      [notFoundContent]="'无法找到'"
      [showSearch]="true">
      <tri-combobox-option
        *ngFor="let option of searchOptions"
        [label]="option.label"
        [value]="option">
      </tri-combobox-option>
    </tri-combobox>
  `,
  styles  : []
})
export class TriDemoComboboxTagComponent implements OnInit {
  searchOptions          = [{value: 'jack', label: '杰克'}, {value: 'lucy', label: '露西'}, {
    value: 'tom',
    label: '汤姆'
  }];
  selectedMultipleOption = [this.searchOptions[0]];

  constructor() {
  }

  ngOnInit() {
    setTimeout(_ => {
      this.selectedMultipleOption = [];
    }, 2000);
  }
}
