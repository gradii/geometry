/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tri-demo-datepicker-formatter',
  template: `
    <tri-datepicker [(ngModel)]="_date" [placeHolder]="'Select date'" [format]="'YYYY/MM/DD'"></tri-datepicker>
    <tri-datepicker [(ngModel)]="_month" [placeHolder]="'Select date'" [format]="'YYYY/MM'" [mode]="'month'"></tri-datepicker>
  `,
  styles: []
})
export class TriDemoDatePickerFormatterComponent implements OnInit {
  _date = new Date();
  _month = new Date();
  constructor() {}

  ngOnInit() {}
}
