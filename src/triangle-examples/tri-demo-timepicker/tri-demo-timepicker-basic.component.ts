/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title timepicker-basic
 */
@Component({
  selector: 'tri-demo-timepicker-basic',
  template: `
    <tri-timepicker [(ngModel)]="_date"></tri-timepicker>`,
  styles: []
})
export class TriDemoTimePickerBasicComponent implements OnInit {
  _date = null;

  constructor() {}

  ngOnInit() {}
}
