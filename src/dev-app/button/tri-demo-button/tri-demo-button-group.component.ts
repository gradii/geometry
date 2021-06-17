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
 * @title button-group
 */
@Component({
  selector: 'tri-demo-button-group',
  template: `
    <h4>Basic</h4>
    <tri-button-group>
      <button tri-button>Cancel</button>
      <button tri-button [type]="'primary'">OK</button>
    </tri-button-group>
    <tri-button-group>
      <button tri-button [type]="'default'" disabled>
        <span>L</span>
      </button>
      <button tri-button [type]="'default'" disabled>
        <span>M</span>
      </button>
      <button tri-button [type]="'default'" disabled>
        <span>R</span>
      </button>
    </tri-button-group>
    <tri-button-group>
      <button tri-button [type]="'primary'" disabled>
        <span>L</span>
      </button>
      <button tri-button [type]="'default'" disabled>
        <span>M</span>
      </button>
      <button tri-button [type]="'default'">
        <span>M</span>
      </button>
      <button tri-button [type]="'dashed'" disabled>
        <span>R</span>
      </button>
    </tri-button-group>
    <h4>With Icon</h4>
    <tri-button-group>
      <button tri-button [type]="'primary'">
        <i class=" anticon anticon-left"></i>
        <span>Go back</span>
      </button>
      <button tri-button [type]="'primary'">
        <span>Go forward</span>
        <i class=" anticon anticon-right"></i>
      </button>
    </tri-button-group>
    <tri-button-group>
      <button tri-button [type]="'primary'">
        <tri-icon svgIcon="outline:cloud"></tri-icon>
      </button>
      <button tri-button [type]="'primary'">
        <tri-icon svgIcon="outline:cloud-download"></tri-icon>
      </button>
    </tri-button-group>
    <h4>Size</h4>
    <tri-button-group [size]="'large'">
      <button tri-button>Large</button>
      <button tri-button>Large</button>
    </tri-button-group>
    <tri-button-group>
      <button tri-button>Default</button>
      <button tri-button>Default</button>
    </tri-button-group>
    <tri-button-group [size]="'small'">
      <button tri-button>Small</button>
      <button tri-button>Small</button>
    </tri-button-group>`,
  styles  : []
})
export class TriDemoButtonGroupComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
