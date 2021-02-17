/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title slider-vertical
 */
@Component({
  selector: 'tri-demo-slider-vertical',
  template: `
    <div [ngStyle]="{ height: '300px' }">
      <div [ngStyle]="style">
        <tri-slider vertical [defaultValue]="30"></tri-slider>
      </div>
      <div [ngStyle]="style">
        <tri-slider vertical range [step]="10" [defaultValue]="[20, 50]"></tri-slider>
      </div>
      <div [ngStyle]="style">
        <tri-slider vertical range [marks]="marks" [defaultValue]="[26, 37]"></tri-slider>
      </div>
    </div>
  `
})
export class TriDemoSliderVerticalComponent {
  style = {
    float: 'left',
    height: '300px',
    marginLeft: '70px'
  };

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
