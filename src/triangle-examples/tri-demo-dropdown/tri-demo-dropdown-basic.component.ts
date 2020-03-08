/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title dropdown-basic
 */
@Component({
  selector: 'tri-demo-dropdown-basic',
  template: `
    <tri-dropdown>
      <a class="ant-dropdown-link" tri-dropdown>
        Hover me <i class="anticon anticon-down"></i>
      </a>
      <ul tri-menu>
        <li tri-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        </li>
        <li tri-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">2nd menu item</a>
        </li>
        <li tri-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">3rd menu item</a>
        </li>
      </ul>
    </tri-dropdown>`,
  styles: []
})
export class TriDemoDropDownBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
