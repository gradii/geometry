/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title timepicker-without-seconds
 */
@Component({
  selector: 'tri-demo-timepicker-without-seconds',
  template: `
    <tri-timepicker [(ngModel)]="_date" [format]="'HH:mm'"></tri-timepicker>`,
  styles: []
})
export class TriDemoTimePickerWithoutSecondsComponent implements OnInit {
  _date = new Date();

  constructor() {}

  ngOnInit() {}
}
