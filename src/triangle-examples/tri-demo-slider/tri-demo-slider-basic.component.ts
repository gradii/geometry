/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title slider-basic
 */
@Component({
  selector: 'tri-demo-slider-basic',
  template: `
    <tri-slider [defaultValue]="30" [disabled]="disabled"></tri-slider>
    <tri-slider range [defaultValue]="[20, 50]" [disabled]="disabled"></tri-slider>
    Disabled: <tri-switch size="small" [(ngModel)]="disabled"></tri-switch>
  `
})
export class TriDemoSliderBasicComponent {
  disabled = false;
}
