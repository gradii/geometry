/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title radio-button-group-size
 */
@Component({
  selector: 'tri-demo-radio-button-group-size',
  template: `
    <div>
      <tri-radio-group [(ngModel)]="radioValue" [size]="'large'">
        <label tri-radio-button [value]="'A'">
          <span>Hangzhou</span>
        </label>
        <label tri-radio-button [value]="'B'">
          <span>Shanghai</span>
        </label>
        <label tri-radio-button [value]="'C'">
          <span>Beijing</span>
        </label>
        <label tri-radio-button [value]="'D'">
          <span>Chengdu</span>
        </label>
      </tri-radio-group>
    </div>
    <div style="margin-top:16px;">
      <tri-radio-group [(ngModel)]="radioValue">
        <label tri-radio-button [value]="'A'">
          <span>Hangzhou</span>
        </label>
        <label tri-radio-button [value]="'B'">
          <span>Shanghai</span>
        </label>
        <label tri-radio-button [value]="'C'">
          <span>Beijing</span>
        </label>
        <label tri-radio-button [value]="'D'">
          <span>Chengdu</span>
        </label>
      </tri-radio-group>
    </div>
    <div style="margin-top:16px;">
      <tri-radio-group [(ngModel)]="radioValue" [size]="'small'">
        <label tri-radio-button [value]="'A'">
          <span>Hangzhou</span>
        </label>
        <label tri-radio-button [value]="'B'">
          <span>Shanghai</span>
        </label>
        <label tri-radio-button [value]="'C'">
          <span>Beijing</span>
        </label>
        <label tri-radio-button [value]="'D'">
          <span>Chengdu</span>
        </label>
      </tri-radio-group>
    </div>
  `,
  styles: []
})
export class TriDemoRadioButtonGroupSizeComponent implements OnInit {
  radioValue = 'A';

  constructor() {}

  ngOnInit() {}
}
