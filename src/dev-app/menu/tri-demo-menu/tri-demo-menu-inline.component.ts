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
 * @title menu-inline
 */
@Component({
  selector: 'tri-demo-menu-inline',
  template: `
    <ul tri-menu [mode]="'inline'" style="width: 240px;">
      <li tri-submenu>
        <span title><i class="anticon anticon-mail"></i> Navigation One</span>
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
      <li tri-submenu>
        <span title><i class="anticon anticon-appstore"></i> Navigation Two</span>
        <ul>
          <li tri-menu-item>Option 5</li>
          <li tri-menu-item>Option 6</li>
          <li tri-submenu>
            <span title>Submenu</span>
            <ul>
              <li tri-menu-item>Option 7</li>
              <li tri-menu-item>Option 8</li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu>
        <span title><i class="anticon anticon-setting"></i> Navigation Three</span>
        <ul>
          <li tri-menu-item>Option 9</li>
          <li tri-menu-item>Option 10</li>
          <li tri-menu-item>Option 11</li>
        </ul>
      </li>
    </ul>
  `,
  styles  : []
})
export class TriDemoMenuInlineComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
