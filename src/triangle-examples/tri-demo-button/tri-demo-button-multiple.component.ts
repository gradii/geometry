/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title button-multiple
 */
@Component({
  selector: 'tri-demo-button-multiple',
  template: `
    <button tri-button [type]="'primary'">
      <span>primary</span>
    </button>
    <button tri-button [type]="'default'">
      <span>secondary</span>
    </button>
    <tri-dropdown>
      <button tri-button tri-dropdown><span>more</span> <i class="anticon anticon-down"></i></button>
      <ul tri-menu>
        <li tri-menu-item>
          <a>1st item</a>
        </li>
        <li tri-menu-item>
          <a>2nd item</a>
        </li>
        <li tri-menu-item>
          <a>3rd item</a>
        </li>
      </ul>
    </tri-dropdown>
`,
  styles: []
})
export class TriDemoButtonMultipleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
