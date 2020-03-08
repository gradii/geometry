/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title dropdown-click
 */
@Component({
  selector: 'tri-demo-dropdown-click',
  template: `
    <tri-dropdown [trigger]="'click'">
      <a href class="ant-dropdown-link" tri-dropdown>
        Click me <i class="anticon anticon-down"></i>
      </a>
      <ul tri-menu>
        <li tri-menu-item>1st menu item</li>
        <li tri-menu-item>2nd menu item</li>
        <li tri-menu-item>3rd menu item</li>
      </ul>
    </tri-dropdown>`,
  styles: []
})
export class TriDemoDropDownClickComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
