/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title dropdown-other
 */
@Component({
  selector: 'tri-demo-dropdown-other',
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
        <li tri-menu-divider></li>
        <li tri-menu-item [disable]="true">3rd menu item（disabled）</li>
      </ul>
    </tri-dropdown>`,
  styles: []
})
export class TriDemoDropDownOtherComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
