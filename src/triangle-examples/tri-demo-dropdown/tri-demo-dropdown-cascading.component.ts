/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title dropdown-cascading
 */
@Component({
  selector: 'tri-demo-dropdown-cascading',
  template: `
    <tri-dropdown>
      <a class="ant-dropdown-link" tri-dropdown>
        Cascading menu <i class="anticon anticon-down"></i>
      </a>
      <ul tri-menu>
        <li tri-menu-item>1st menu item</li>
        <li tri-menu-item>2nd menu item</li>
        <li tri-submenu>
          <span title>sub menu</span>
          <ul>
            <li tri-menu-item>3rd menu item</li>
            <li tri-menu-item>4th menu item</li>
          </ul>
        </li>
      </ul>
    </tri-dropdown>`,
  styles: []
})
export class TriDemoDropDownCascadingComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
