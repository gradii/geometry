/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title dropdown-position
 */
@Component({
  selector: 'tri-demo-dropdown-position',
  template: `
    <div>
      <tri-dropdown [placement]="'bottomLeft'">
        <button tri-button tri-dropdown>bottomLeft</button>
        <ul tri-menu>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">2nd menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">3rd menu item length</a>
          </li>
        </ul>
      </tri-dropdown>
      <tri-dropdown [placement]="'bottomCenter'">
        <button tri-button tri-dropdown>bottomCenter</button>
        <ul tri-menu>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">2nd menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">3rd menu item length</a>
          </li>
        </ul>
      </tri-dropdown>
      <tri-dropdown [placement]="'bottomRight'">
        <button tri-button tri-dropdown>bottomRight</button>
        <ul tri-menu>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">2nd menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">3rd menu item length</a>
          </li>
        </ul>
      </tri-dropdown>
      <tri-dropdown [placement]="'topLeft'">
        <button tri-button tri-dropdown>topLeft</button>
        <ul tri-menu>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">2nd menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">3rd menu item length</a>
          </li>
        </ul>
      </tri-dropdown>
      <tri-dropdown [placement]="'topCenter'">
        <button tri-button tri-dropdown>topCenter</button>
        <ul tri-menu>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">2nd menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">3rd menu item length</a>
          </li>
        </ul>
      </tri-dropdown>
      <tri-dropdown [placement]="'topRight'">
        <button tri-button tri-dropdown>topRight</button>
        <ul tri-menu>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">2nd menu item length</a>
          </li>
          <li tri-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">3rd menu item length</a>
          </li>
        </ul>
      </tri-dropdown>
    </div>`,
  styles: []
})
export class TriDemoDropDownPositionComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
