/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title slider-mark
 */
@Component({
  selector: 'tri-demo-slider-mark',
  template: `
    <div>
      <h4>included=true</h4>
      <tri-slider [marks]="marks" [defaultValue]="37"></tri-slider>
      <tri-slider [marks]="marks" [included]="true" range [defaultValue]="[26, 37]"></tri-slider>
      <h4>included=false</h4>
      <tri-slider [marks]="marks" [included]="false" [defaultValue]="37"></tri-slider>
      <h4>marks & step</h4>
      <tri-slider [marks]="marks" [step]="10" [defaultValue]="37"></tri-slider>
      <h4>step=null || dots=true</h4>
      <tri-slider [marks]="marks" [step]="null" [defaultValue]="37"></tri-slider>
      <tri-slider [marks]="marks" [dots]="true" [defaultValue]="37"></tri-slider>
    </div>
  `,
  styles: [
    `
    h4 {
      margin: 0 0 16px;
    }

    .tri-slider-with-marks {
      margin-bottom: 44px;
    }
  `
  ]
})
export class TriDemoSliderMarkComponent {
  marks = {
    0: '0°C',
    26: '26°C',
    37: '37°C',
    100: {
      style: {
        color: '#f50'
      },
      label: '<strong>100°C</strong>'
    }
  };
}
