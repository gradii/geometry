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
 * @title menu-expand
 */
@Component({
  selector: 'tri-demo-menu-expand',
  template: `
    <ul tri-menu [mode]="'inline'" style="width: 240px;">
      <li tri-submenu [(open)]="isOpenOne" (openChange)="openChange('one')">
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
      <li tri-submenu [(open)]="isOpenTwo" (openChange)="openChange('two')">
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
      <li tri-submenu [(open)]="isOpenThree" (openChange)="openChange('three')">
        <span title><i class="anticon anticon-setting"></i> Navigation Three</span>
        <ul>
          <li tri-menu-item>Option 9</li>
          <li tri-menu-item>Option 10</li>
          <li tri-menu-item>Option 11</li>
        </ul>
      </li>
    </ul>`,
  styles  : []
})
export class TriDemoMenuExpandComponent implements OnInit {
  isOpenOne   = true;
  isOpenTwo   = false;
  isOpenThree = false;

  openChange(value) {
    if (value === 'one') {
      this.isOpenTwo   = false;
      this.isOpenThree = false;
    } else if (value === 'two') {
      this.isOpenOne   = false;
      this.isOpenThree = false;
    } else if (value === 'three') {
      this.isOpenOne = false;
      this.isOpenTwo = false;
    }
  }

  constructor() {
  }

  ngOnInit() {
  }
}
