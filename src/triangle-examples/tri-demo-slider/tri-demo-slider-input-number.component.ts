/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title slider-input-number
 */
@Component({
  selector: 'tri-demo-slider-input-number',
  template: `

    <tri-row>
      <tri-col span="12">
        <tri-slider [min]="1" [max]="20" [(ngModel)]="value1"></tri-slider>
      </tri-col>
      <div tri-col span="4">
        <tri-input-number [min]="1" [max]="20" [ngStyle]="{ 'marginLeft': '16px' }" [(ngModel)]="value1"></tri-input-number>
      </div>
    </tri-row>

    <tri-row>
      <tri-col span="12">
        <tri-slider [min]="0" [max]="1" [step]="0.01" [(ngModel)]="value2"></tri-slider>
      </tri-col>
      <tri-col span="4">
        <tri-input-number [min]="0" [max]="1" [ngStyle]="{ marginLeft: '16px' }" [step]="0.01" [(ngModel)]="value2"></tri-input-number>
      </tri-col>
    </tri-row>

  `
})
export class TriDemoSliderInputNumberComponent {
  value1 = 1;
  value2 = 0;
}
