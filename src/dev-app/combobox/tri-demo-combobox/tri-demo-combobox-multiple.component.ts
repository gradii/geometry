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
 * @title select-multiple
 */
@Component({
  selector: 'tri-demo-combobox-multiple',
  template: `
    <tri-combobox style="width: 400px;"
      [mode]="'multiple'"
      [placeHolder]="'请选择人员'"
      [(ngModel)]="selectedMultipleOption"
      [notFoundContent]="'无法找到'">
      <tri-combobox-option
        *ngFor="let option of searchOptions"
        [label]="option.label"
        [value]="option.value"
        [disabled]="option.disabled">
      </tri-combobox-option>
    </tri-combobox>
  `,
  styles  : []
})
export class TriDemoComboboxMultipleComponent implements OnInit {
  searchOptions;
  selectedMultipleOption;

  constructor() {
  }

  ngOnInit() {
    /*模拟服务器异步加载*/
    this.selectedMultipleOption = ['tom', 'jack'];
    setTimeout(_ => {
      this.searchOptions = [
        {value: 'jack', label: '杰克'},
        {value: 'lucy', label: '露西'},
        {value: 'tom', label: '汤姆'}
      ];
    }, 300);
    setTimeout(_ => {
      this.selectedMultipleOption = ['tom'];
    }, 1000);
  }
}
