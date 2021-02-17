/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title datepicker-size
 */
@Component({
  selector: 'tri-demo-datepicker-size',
  template: `
    <tri-datepicker [(ngModel)]="_date" [size]="'large'" [placeHolder]="'Select date'"></tri-datepicker>
    <tri-datepicker [(ngModel)]="_date" [placeHolder]="'Select date'"></tri-datepicker>
    <tri-datepicker [(ngModel)]="_date" [size]="'small'" [placeHolder]="'Select date'"></tri-datepicker>`,
  styles: []
})
export class TriDemoDatePickerSizeComponent implements OnInit {
  _date = null;

  constructor() {}

  ngOnInit() {}
}
