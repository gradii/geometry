/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title datepicker-basic
 */
@Component({
  selector: 'tri-demo-datepicker-basic',
  template: `
    <tri-datepicker [(ngModel)]="_date" [placeHolder]="'Select date'"></tri-datepicker>`,
  styles: []
})
export class TriDemoDatePickerBasicComponent implements OnInit {
  _date = null;

  constructor() {}

  ngOnInit() {}
}
