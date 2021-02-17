/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title dropdown-button
 */
@Component({
  selector: 'tri-demo-dropdown-button',
  template: `
    <div style="height: 28px;">
      <tri-dropdown-button (click)="log($event)">
        DropDown
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
      </tri-dropdown-button>
      <tri-dropdown-button [disable]="true">
        DropDown
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
      </tri-dropdown-button>
      <tri-dropdown>
        <button tri-button tri-dropdown><span>Button</span> <i class="anticon anticon-down"></i></button>
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
      </tri-dropdown>
    </div>
  `,
  styles: [
    `
      tri-dropdown-button, tri-dropdown {
        float: left;
        margin: 2px;
      }

      tri-dropdown::after {
        content: '';
        clear: both;
      }
    `
  ]
})
export class TriDemoDropDownButtonComponent implements OnInit {
  log(e) {
    console.log('click dropdown button');
  }

  constructor() {}

  ngOnInit() {}
}
