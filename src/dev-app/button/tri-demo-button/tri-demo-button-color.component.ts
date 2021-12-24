/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

@Component({
  selector: 'tri-demo-button-color',
  template: `
    <h5>primary</h5>

    <tri-radio-group [(ngModel)]="color">
      <label tri-radio-button [value]="'primary'"><span>Primary</span></label>
      <label tri-radio-button [value]="'secondary'"><span>Secondary</span></label>
      <label tri-radio-button [value]="'success'"><span>Success</span></label>
      <label tri-radio-button [value]="'info'"><span>Info</span></label>
      <label tri-radio-button [value]="'warning'"><span>Warning</span></label>
      <label tri-radio-button [value]="'error'"><span>Error</span></label>
    </tri-radio-group>
    <div>
      <button triButton [color]="color">{{color}} color</button>
    </div>
  `
})
export class TriDemoButtonColorComponent {
  color = 'primary';

  constructor() {

  }
}
