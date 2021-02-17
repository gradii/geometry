/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title dropdown-trigger
 */
@Component({
  selector: 'tri-demo-dropdown-trigger',
  template: `
    <tri-dropdown>
      <a class="ant-dropdown-link" tri-dropdown>
        Hover me, Click menu item <i class="anticon anticon-down"></i>
      </a>
      <ul tri-menu>
        <li tri-menu-item (click)="log('1st menu item')">1st menu item</li>
        <li tri-menu-item (click)="log('2nd menu item')">2nd menu item</li>
        <li tri-menu-item (click)="log('3rd menu item')">3rd menu item</li>
      </ul>
    </tri-dropdown>`,
  styles: []
})
export class TriDemoDropDownTriggerComponent implements OnInit {
  log(data) {
    console.log(data);
  }

  constructor() {}

  ngOnInit() {}
}
