/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title radio-group-disabled
 */
@Component({
  selector: 'tri-demo-radio-group-disabled',
  template: `
    <tri-radio-group [(ngModel)]="radioValue">
      <label tri-radio [value]="'A'">
        <span>A</span>
      </label>
      <label tri-radio [value]="'B'" [disabled]="isDisabled">
        <span>B</span>
      </label>
      <label tri-radio [value]="'C'" [disabled]="isDisabled">
        <span>C</span>
      </label>
      <label tri-radio [value]="'D'">
        <span>D</span>
      </label>
    </tri-radio-group>
    <div style="margin-top: 20px;">
      <button tri-button [type]="'primary'" (click)="toggleDisabled()">Toggle Disabled</button>
    </div>
  `,
  styles: []
})
export class TriDemoRadioGroupDisabledComponent implements OnInit {
  radioValue = 'A';
  isDisabled = true;
  toggleDisabled = () => {
    this.isDisabled = !this.isDisabled;
  };

  constructor() {}

  ngOnInit() {}
}
