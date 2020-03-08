/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title radio-group
 */
@Component({
  selector: 'tri-demo-radio-group',
  template: `
    <tri-radio-group [(ngModel)]="radioValue">
      <label tri-radio [value]="'A'">
        <span>A</span>
      </label>
      <label tri-radio [value]="'B'">
        <span>B</span>
      </label>
      <label tri-radio [value]="'C'">
        <span>C</span>
      </label>
      <label tri-radio [value]="'D'">
        <span>D</span>
      </label>
    </tri-radio-group>`,
  styles: []
})
export class TriDemoRadioGroupComponent implements OnInit {
  radioValue = 'A';

  constructor() {}

  ngOnInit() {}
}
