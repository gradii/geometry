/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title layout-top-side
 */
@Component({
  selector: 'tri-demo-layout-top-side',
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
        <tri-layout style="padding:24px 0; background: #fff">
          <tri-sider [width]="200" style="background:#fff">
            <ul tri-menu [mode]="'inline'" style="height:100%">
              <li tri-submenu>
                <span title><i class="anticon anticon-user"></i>subnav 1</span>
                <ul>
                  <li tri-menu-item>option1</li>
                  <li tri-menu-item>option2</li>
                  <li tri-menu-item>option3</li>
                  <li tri-menu-item>option4</li>
                </ul>
              </li>
              <li tri-submenu>
                <span title><i class="anticon anticon-laptop"></i>subnav 2</span>
                <ul>
                  <li tri-menu-item>option5</li>
                  <li tri-menu-item>option6</li>
                  <li tri-menu-item>option7</li>
                  <li tri-menu-item>option8</li>
                </ul>
              </li>
              <li tri-submenu>
                <span title><i class="anticon anticon-notification"></i>subnav 3</span>
                <ul>
                  <li tri-menu-item>option9</li>
                  <li tri-menu-item>option10</li>
                  <li tri-menu-item>option11</li>
                  <li tri-menu-item>option12</li>
                </ul>
              </li>
            </ul>
          </tri-sider>
          <tri-content style="padding: 0 24px; min-height: 280px;">Content</tri-content>
        </tri-layout>
        <tri-footer style="text-align: center;">Ant Design ©2017 Implement By Angular</tri-footer>
      </tri-content>
    </tri-layout>
  `,
  styles: [
    `:host ::ng-deep .logo {
      width: 120px;
      height: 31px;
      background: #333;
      border-radius: 6px;
      margin: 16px 28px 16px 0;
      float: left;
    }`
  ]
})
export class TriDemoLayoutTopSideComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
