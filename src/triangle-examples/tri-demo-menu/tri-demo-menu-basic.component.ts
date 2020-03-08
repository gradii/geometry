/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title menu-basic
 */
@Component({
  selector: 'tri-demo-menu-basic',
  template: `
    <ul tri-menu [mode]="'horizontal'">
      <li tri-menu-item><i class="anticon anticon-mail"></i> Navigation One</li>
      <li tri-menu-item [disable]="true"><i class="anticon anticon-appstore"></i> Navigation Two</li>
      <li tri-submenu>
        <span title><i class="anticon anticon-setting"></i> Navigation Three - Submenu</span>
        <ul>
          <li tri-menu-group>
            <span title>Item 1</span>
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group>
            <span title>Item 2</span>
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-menu-item><a href="https://ng.tri.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a></li>
    </ul>`,
  styles: []
})
export class TriDemoMenuBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
