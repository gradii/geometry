/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title layout-top
 */
@Component({
  selector: 'tri-demo-layout-top',
  template: `
    <tri-layout class="layout">
      <tri-header>
        <div class="logo"></div>
        <ul tri-menu [theme]="'dark'" [mode]="'horizontal'" style="line-height: 64px;">
          <li tri-menu-item>nav 1</li>
          <li tri-menu-item>nav 2</li>
          <li tri-menu-item>nav 3</li>
        </ul>
      </tri-header>
      <tri-content style="padding:0 50px;">
        <tri-breadcrumb style="margin:12px 0;">
          <tri-breadcrumb-item>Home</tri-breadcrumb-item>
          <tri-breadcrumb-item>List</tri-breadcrumb-item>
          <tri-breadcrumb-item>App</tri-breadcrumb-item>
        </tri-breadcrumb>
        <div style="background:#fff; padding: 24px; min-height: 280px;">Content</div>
      </tri-content>
      <tri-footer style="text-align: center;">Ant Design ©2017 Implement By Angular</tri-footer>
    </tri-layout>
  `,
  styles: [
    `:host ::ng-deep .logo {
      width: 120px;
      height: 31px;
      background: #333;
      border-radius: 6px;
      margin: 16px 24px 16px 0;
      float: left;
    }
    `
  ]
})
export class TriDemoLayoutTopComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
