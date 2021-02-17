/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title slider-tip-formatter
 */
@Component({
  selector: 'tri-demo-slider-tip-formatter',
  template: `
    <tri-slider [tipFormatter]="formatter"></tri-slider>
    <tri-slider [tipFormatter]="null"></tri-slider>
  `
})
export class TriDemoSliderTipFormatterComponent {
  formatter(value) {
    return `${value}%`;
  }
}
