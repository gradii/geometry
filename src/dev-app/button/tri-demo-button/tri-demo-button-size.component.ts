/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';

/**
 * @title button-size
 */
@Component({
  selector: 'tri-demo-button-size',
  template: `
    <tri-radio-group [(ngModel)]="size">
      <label tri-radio-button [value]="'large'"><span>Large</span></label>
      <label tri-radio-button [value]="'default'"><span>Default</span></label>
      <label tri-radio-button [value]="'small'"><span>Small</span></label>
    </tri-radio-group>
    <br>
    <br>
    <button tri-button [type]="'primary'" [size]="size" [shape]="'circle'">
      <i class="anticon anticon-download"></i>
    </button>
    <button tri-button [type]="'primary'" [size]="size">
      <i class="anticon anticon-download"></i><span>Download</span>
    </button>
    <button tri-button [type]="'primary'" [size]="size">
      <span>Normal</span>
    </button>
    <br>
    <tri-button-group [size]="size">
      <button tri-button [type]="'primary'">
        <i class="anticon anticon-left"></i><span>Backward</span>
      </button>
      <button tri-button [type]="'primary'">
        <span>Forward</span><i class="anticon anticon-right"></i>
      </button>
    </tri-button-group>
  `,
  styles  : []
})
export class TriDemoButtonSizeComponent implements OnInit {
  size = <const>'default';

  constructor() {
  }

  ngOnInit() {
  }
}
