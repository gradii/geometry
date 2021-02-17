/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title radio-button-group
 */
@Component({
  selector: 'tri-demo-radio-button-group',
  template: `
    <div>
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
      <tri-radio-group [(ngModel)]="radioValue">
        <label tri-radio-button [value]="'A'">
          <span>Hangzhou</span>
        </label>
        <label tri-radio-button [value]="'B'" [disabled]="true">
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
        <label tri-radio-button [value]="'A'" [disabled]="true">
          <span>Hangzhou</span>
        </label>
        <label tri-radio-button [value]="'B'" [disabled]="true">
          <span>Shanghai</span>
        </label>
        <label tri-radio-button [value]="'C'" [disabled]="true">
          <span>Beijing</span>
        </label>
        <label tri-radio-button [value]="'D'" [disabled]="true">
          <span>Chengdu</span>
        </label>
      </tri-radio-group>
    </div>
  `,
  styles: []
})
export class TriDemoRadioButtonGroupComponent implements OnInit {
  radioValue = 'A';

  constructor() {}

  ngOnInit() {}
}
