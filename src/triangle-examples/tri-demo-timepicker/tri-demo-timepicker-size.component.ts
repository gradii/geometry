/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title timepicker-size
 */
@Component({
  selector: 'tri-demo-timepicker-size',
  template: `
    <tri-timepicker [(ngModel)]="_date" [size]="'large'"></tri-timepicker>
    <tri-timepicker [(ngModel)]="_date"></tri-timepicker>
    <tri-timepicker [(ngModel)]="_date" [size]="'small'"></tri-timepicker>`,
  styles: []
})
export class TriDemoTimePickerSizeComponent implements OnInit {
  _date = new Date();

  constructor() {}

  ngOnInit() {}
}
