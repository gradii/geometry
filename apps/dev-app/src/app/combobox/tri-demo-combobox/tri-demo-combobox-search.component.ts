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
 * @title select-search
 */
@Component({
  selector: 'tri-demo-combobox-search',
  template: `
    <tri-combobox
      style="width: 200px;"
      [allowClear]="true"
      [placeHolder]="'Select a person'"
      [(ngModel)]="selectedOption"
      [showSearch]="true">
      <tri-combobox-option
        *ngFor="let option of searchOptions"
        [label]="option.label"
        [value]="option.value"
        [disabled]="option.disabled">
      </tri-combobox-option>
    </tri-combobox>
    <tri-combobox
      style="width: 200px;"
      [allowClear]="true"
      [placeHolder]="'Select a person'"
      [(ngModel)]="selectedOption"
      [showSearch]="true">
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
export class TriDemoComboboxSearchComponent implements OnInit {
  selectedOption;
  searchOptions;

  constructor() {
  }

  ngOnInit() {
    /*模拟服务器异步加载*/
    setTimeout(_ => {
      this.searchOptions = [
        {value: 'jack', label: 'Jack'},
        {value: 'lucy', label: 'Lucy'},
        {value: 'tom', label: 'Tom'}
      ];
    }, 100);
  }
}
